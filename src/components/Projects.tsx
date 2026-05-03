type Project = {
  title: string;
  description: string;
  outcome?: string;
  link?: { href: string; label: string };
  meta?: string;
};

const projects: Project[] = [
  {
    title: "Company-wide AI Chatbot",
    description:
      "Led a 3-engineer team to ship a RAG chatbot on Azure OpenAI with role-based document permissions, serving ~2,500 employees across 30+ subsidiaries.",
    outcome: "Shipped in under 1 month.",
    meta: "Internal",
  },
  {
    title: "Internal PII Management System",
    description:
      "Convinced a resistant HR head and C-suite to replace a third-party tool, then built it from scratch. MVP in 2 weeks, production in 5.",
    outcome:
      "Saved $80K+/year. Cut processing time from 1 week to under 10 minutes per request.",
    meta: "Internal",
  },
  {
    title: "Enterprise Integration Dashboard",
    description:
      "Mapped 50+ internal platforms with dynamic state tracking, giving the C-suite a live view of the full tech budget for the first time.",
    outcome: "Drove hundreds of thousands of dollars in cost savings.",
    meta: "Internal",
  },
  {
    title: "Youth Education Charity Platform",
    description:
      "Volunteer-built site for a charity golf tournament: payment portal, real-time fundraising dashboard, automated cold outreach to local sponsors.",
    outcome:
      "Year 1: $60K → $130K. Year 2: $225K, funding a new scholarship program.",
    meta: "Volunteer",
  },
  {
    title: "AI Co-Work for Family & Friends",
    description:
      "Personal Claude workflows for my dad's construction business (materials + finance reporting), my grandfather's lecture & book practice, and a friend's real estate workflow.",
    outcome:
      "My 70+ year old grandpa now runs his own AI-powered morning briefings.",
    meta: "Personal",
  },
];

export function Projects() {
  return (
    <section
      id="projects"
      className="mx-auto w-full max-w-3xl px-6 py-24 border-t border-border"
    >
      <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
        Selected work
      </h2>
      <ol className="mt-10 divide-y divide-border">
        {projects.map((p, i) => (
          <li key={p.title} className="grid grid-cols-[3rem_1fr] gap-6 py-8">
            <span className="font-mono text-sm text-muted-foreground pt-1">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-lg font-medium tracking-tight sm:text-xl">
                  {p.title}
                </h3>
                {p.meta && (
                  <span className="font-mono text-xs text-muted-foreground">
                    {p.meta}
                  </span>
                )}
              </div>
              <p className="mt-2 text-base leading-relaxed text-foreground/85">
                {p.description}
              </p>
              {p.outcome && (
                <p className="mt-3 text-sm text-primary">{p.outcome}</p>
              )}
              {p.link && (
                <a
                  href={p.link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-sm font-mono text-primary underline-offset-4 hover:underline"
                >
                  {p.link.label} →
                </a>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
