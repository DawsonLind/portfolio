const skills = [
  "Next.js",
  "TypeScript",
  "React",
  "Node.js",
  "C# / .NET",
  "Azure",
  "AI / RAG integration",
  "Solution architecture",
  "Stakeholder management",
];

export function About() {
  return (
    <section
      id="about"
      className="mx-auto w-full max-w-3xl px-6 py-24 border-t border-border"
    >
      <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
        About
      </h2>
      <div className="mt-8 space-y-5 text-base leading-relaxed text-foreground/90 sm:text-lg">
        <p>
          I work where engineering meets the customer. The fun part of the job
          is being in the room when a problem is still fuzzy, and leaving with
          something running in production a few weeks later.
        </p>
        <p>
          I&apos;ve led teams shipping enterprise AI products to thousands of
          users, replaced six-figure SaaS contracts with focused internal
          tools, and kept showing up to volunteer projects long after the
          official deadline. The thread through all of it: get to a working
          thing fast, and stay close to the people using it.
        </p>
      </div>
      <ul className="mt-10 flex flex-wrap gap-2">
        {skills.map((s) => (
          <li
            key={s}
            className="rounded-full border border-border bg-card/40 px-3 py-1 text-xs font-mono text-muted-foreground"
          >
            {s}
          </li>
        ))}
      </ul>
    </section>
  );
}
