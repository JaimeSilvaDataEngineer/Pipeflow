import Link from "next/link";

const FOOTER_LINKS = [
  { href: "#features", label: "Funcionalidades" },
  { href: "#pricing", label: "Preços" },
  { href: "/login", label: "Entrar" },
];

function Footer() {
  return (
    <footer className="border-border/60 border-t">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-10 sm:flex-row sm:justify-between sm:px-6">
        <Link href="/" className="text-foreground text-base font-semibold tracking-tight">
          PipeFlow
        </Link>

        <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} PipeFlow. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}

export { Footer };
