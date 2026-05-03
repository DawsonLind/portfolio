export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-3xl px-6 py-12 border-t border-border">
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
        <p>
          This site improves itself{" "}
          <span className="text-primary">→</span>{" "}
          <span className="text-foreground/80">tap the button bottom-right.</span>
        </p>
        <p>© {new Date().getFullYear()} Dawson Lind</p>
      </div>
    </footer>
  );
}
