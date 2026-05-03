export function Hero() {
  return (
    <section className="mx-auto w-full max-w-3xl px-6 pt-32 pb-24 sm:pt-40 sm:pb-32">
      <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-3 py-1 text-xs font-mono text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        Alaska-grown, San Francisco-based
      </div>
      <h1 className="text-4xl font-medium tracking-tight sm:text-6xl">
        Dawson Lind.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
        Customer-facing software engineer, four years deep in shipping
        technical solutions end-to-end — discovery, prototype, production,
        adoption. Currently obsessed with how AI is changing the way founders
        go from idea to live product.
      </p>
    </section>
  );
}
