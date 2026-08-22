import Link from "next/link";

import { Button } from "@/components/ui/button";

function CtaSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="bg-primary flex flex-col items-center gap-5 rounded-2xl px-4 py-16 text-center sm:px-6">
        <h2 className="text-primary-foreground text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          Pronto pra organizar o seu funil de vendas?
        </h2>
        <p className="text-primary-foreground/80 max-w-md text-lg">
          Crie sua conta grátis em menos de um minuto. Sem cartão de crédito.
        </p>
        <Button
          size="lg"
          variant="secondary"
          className="px-6"
          render={<Link href="/signup" />}
        >
          Começar grátis
        </Button>
      </div>
    </section>
  );
}

export { CtaSection };
