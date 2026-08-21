import Link from "next/link";

import { Button } from "@/components/ui/button";

function Hero() {
  return (
    <section className="mx-auto flex max-w-3xl animate-in flex-col items-center gap-6 px-6 pt-20 pb-16 text-center duration-700 fade-in slide-in-from-bottom-4 sm:pt-28 sm:pb-24">
      <span className="border-border bg-muted text-muted-foreground inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium">
        Feito para times de vendas pequenos e médios
      </span>

      <h1 className="text-foreground text-4xl font-bold tracking-tight text-balance sm:text-5xl">
        Feche mais negócios sem a complexidade de um CRM enterprise
      </h1>

      <p className="text-muted-foreground max-w-xl text-lg text-balance">
        O PipeFlow é o CRM de vendas simples e direto ao ponto: pipeline Kanban, leads
        organizados e métricas claras — com um plano gratuito de verdade.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button size="lg" className="px-6" render={<Link href="/signup" />}>
          Começar grátis
        </Button>
        <Button size="lg" variant="outline" className="px-6" render={<a href="#features" />}>
          Ver funcionalidades
        </Button>
      </div>
    </section>
  );
}

export { Hero };
