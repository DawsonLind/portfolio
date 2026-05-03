const links = [
  { label: "Email", href: "mailto:dawson.lind@gmail.com", value: "dawson.lind@gmail.com" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/dawson-lind/", value: "in/dawson-lind" },
  { label: "GitHub", href: "https://github.com/DawsonLind", value: "DawsonLind" },
];

export function Contact() {
  return (
    <section
      id="contact"
      className="mx-auto w-full max-w-3xl px-6 py-24 border-t border-border"
    >
      <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
        Get in touch
      </h2>
      <p className="mt-8 text-lg text-foreground/90 sm:text-xl">
        If you&apos;re building something at the intersection of AI and
        customer-facing engineering — or you just want to talk through an
        idea — I&apos;d love to hear from you.
      </p>
      <ul className="mt-10 divide-y divide-border border-y border-border">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="group flex items-center justify-between py-4 transition hover:text-primary"
            >
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground group-hover:text-primary/80">
                {l.label}
              </span>
              <span className="text-base">
                {l.value}{" "}
                <span className="text-muted-foreground transition group-hover:text-primary group-hover:translate-x-0.5 inline-block">
                  →
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
