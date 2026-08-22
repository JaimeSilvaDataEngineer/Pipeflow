import Link from "next/link";

import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "#features", label: "Funcionalidades" },
  { href: "#pricing", label: "Preços" },
];

function Navbar() {
  return (
    <header className="border-border/60 bg-background/80 sticky top-0 z-50 border-b backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-foreground text-lg font-semibold tracking-tight">
          PipeFlow
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Button variant="ghost" className="hidden sm:inline-flex" render={<Link href="/login" />}>
            Entrar
          </Button>
          <Button size="sm" render={<Link href="/signup" />}>
            Começar grátis
          </Button>
        </div>
      </div>
    </header>
  );
}

export { Navbar };
