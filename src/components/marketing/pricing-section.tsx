import Link from "next/link";
import { CheckIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatCurrency";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Grátis",
    priceCents: 0,
    description: "Para começar a organizar suas vendas.",
    features: ["Até 2 colaboradores", "Até 50 leads", "Pipeline Kanban", "Dashboard de métricas"],
    cta: "Começar grátis",
    highlighted: false,
  },
  {
    name: "Pro",
    priceCents: 4900,
    description: "Para times que querem crescer sem limites.",
    features: [
      "Colaboradores ilimitados",
      "Leads ilimitados",
      "Tudo do plano Grátis",
      "Timeline de atividades",
      "Múltiplos workspaces",
      "Suporte prioritário",
    ],
    cta: "Assinar Pro",
    highlighted: true,
  },
];

function PricingSection() {
  return (
    <section id="pricing" className="border-border/60 border-t">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto mb-12 max-w-xl text-center">
          <h2 className="text-foreground text-3xl font-bold tracking-tight">
            Planos simples, sem pegadinha
          </h2>
          <p className="text-muted-foreground mt-3 text-lg">
            Comece grátis. Faça upgrade só quando o time crescer.
          </p>
        </div>

        <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
          {PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                "flex flex-col",
                plan.highlighted && "border-primary shadow-md ring-1 ring-primary",
              )}
            >
              <CardHeader>
                <CardTitle className="text-base">{plan.name}</CardTitle>
                <p className="text-foreground text-3xl font-bold tracking-tight">
                  {plan.priceCents === 0 ? (
                    "Grátis"
                  ) : (
                    <>
                      {formatCurrency(plan.priceCents)}
                      <span className="text-muted-foreground text-base font-normal">/mês</span>
                    </>
                  )}
                </p>
                <p className="text-muted-foreground text-sm">{plan.description}</p>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="flex flex-col gap-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <CheckIcon className="text-primary size-4 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                  render={<Link href="/signup" />}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export { PricingSection };
