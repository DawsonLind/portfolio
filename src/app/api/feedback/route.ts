import { gateway } from "@ai-sdk/gateway";
import { generateObject } from "ai";
import { Octokit } from "@octokit/rest";
import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";
export const maxDuration = 60;

const ALLOWED_PATHS = [
  "src/app/page.tsx",
  "src/app/layout.tsx",
  "src/app/globals.css",
  "src/components/Hero.tsx",
  "src/components/About.tsx",
  "src/components/Projects.tsx",
  "src/components/Contact.tsx",
  "src/components/Footer.tsx",
] as const;

const RequestSchema = z.object({
  feedback: z.string().min(10).max(2000),
  pageUrl: z.string().url().optional().or(z.literal("")),
});

const AiOutputSchema = z.object({
  summary: z.string().describe("One-sentence summary of the change for the user."),
  prTitle: z.string().describe("Short, imperative PR title."),
  prDescription: z
    .string()
    .describe("Markdown PR description: what changed and why."),
  files: z
    .array(
      z.object({
        path: z.string(),
        newContent: z.string(),
      })
    )
    .min(1)
    .max(5),
});

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
}

function err(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(req: Request) {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const token = process.env.GITHUB_TOKEN;
  const baseBranch = process.env.GITHUB_BASE_BRANCH || "main";

  if (!owner || !repo || !token) {
    return err("Server is missing GitHub configuration.", 500);
  }
  if (!process.env.AI_GATEWAY_API_KEY) {
    return err("Server is missing AI Gateway configuration.", 500);
  }

  const json = await req.json().catch(() => null);
  const parsed = RequestSchema.safeParse(json);
  if (!parsed.success) {
    return err("Please share at least a sentence about your suggestion.", 400);
  }
  const { feedback, pageUrl } = parsed.data;

  const octokit = new Octokit({ auth: token });

  // 1. Fetch current source files
  let files: { path: string; content: string }[];
  try {
    files = await Promise.all(
      ALLOWED_PATHS.map(async (path) => {
        const res = await octokit.repos.getContent({
          owner,
          repo,
          path,
          ref: baseBranch,
        });
        const data = res.data;
        if (Array.isArray(data) || data.type !== "file" || !("content" in data)) {
          throw new Error(`Unexpected content for ${path}`);
        }
        const content = Buffer.from(data.content, "base64").toString("utf8");
        return { path, content };
      })
    );
  } catch (e) {
    const status =
      typeof e === "object" && e && "status" in e ? (e as { status: number }).status : 0;
    if (status === 401 || status === 403) {
      return err("GitHub auth failed. Check the server token.", 502);
    }
    return err("Couldn't read the repository source. Try again shortly.", 502);
  }

  // 2. Ask the AI for the smallest possible edits
  const sourceBlock = files
    .map(
      (f) =>
        `=== FILE: ${f.path} ===\n${f.content}\n=== END FILE: ${f.path} ===`
    )
    .join("\n\n");

  let ai: z.infer<typeof AiOutputSchema>;
  try {
    const modelId = process.env.AI_MODEL || "anthropic/claude-sonnet-4.5";
    const { object } = await generateObject({
      model: gateway(modelId),
      schema: AiOutputSchema,
      system:
        "You are a self-improvement agent for a personal portfolio site. Given user feedback and the current source files, propose the smallest possible edits to satisfy the feedback. Preserve all working code. Do not add or remove dependencies. Do not change file structure. Return full new file contents for any file you change. Only return files that actually change. Paths must be exactly one of the provided file paths.",
      prompt: `User feedback:\n"""\n${feedback}\n"""\n\nAllowed paths (return only these):\n${ALLOWED_PATHS.join("\n")}\n\nCurrent source files:\n\n${sourceBlock}`,
    });
    ai = object;
  } catch {
    return err(
      "The AI couldn't produce a valid change for that suggestion. Try rephrasing it.",
      502
    );
  }

  // 3. Validate paths
  const allowed = new Set<string>(ALLOWED_PATHS);
  const invalid = ai.files.filter((f) => !allowed.has(f.path));
  if (invalid.length > 0) {
    return err(
      "The AI tried to edit files it isn't allowed to touch. Please try again.",
      400
    );
  }

  // 4. Branch off main
  const slug = slugify(feedback);
  const branch = `feedback/${slug || "suggestion"}-${Date.now()}`;

  try {
    const baseRef = await octokit.git.getRef({
      owner,
      repo,
      ref: `heads/${baseBranch}`,
    });
    await octokit.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${branch}`,
      sha: baseRef.data.object.sha,
    });
  } catch {
    return err("Couldn't create the feedback branch on GitHub.", 502);
  }

  // 5. Commit each file change
  try {
    for (const change of ai.files) {
      const existing = await octokit.repos.getContent({
        owner,
        repo,
        path: change.path,
        ref: branch,
      });
      const sha =
        !Array.isArray(existing.data) && existing.data.type === "file"
          ? existing.data.sha
          : undefined;

      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: change.path,
        message: `feedback: update ${change.path}`,
        content: Buffer.from(change.newContent, "utf8").toString("base64"),
        branch,
        sha,
      });
    }
  } catch {
    return err("Couldn't write the proposed changes to the branch.", 502);
  }

  // 6. Open PR
  let prUrl: string;
  try {
    const pr = await octokit.pulls.create({
      owner,
      repo,
      title: ai.prTitle.slice(0, 72),
      head: branch,
      base: baseBranch,
      body: `${ai.prDescription}\n\n---\nSubmitted via FeedbackLoop on ${pageUrl || "(unknown page)"}\nOriginal feedback: "${feedback}"`,
    });
    prUrl = pr.data.html_url;
  } catch {
    return err("Couldn't open the pull request. Branch was created.", 502);
  }

  return NextResponse.json({ prUrl, summary: ai.summary });
}
