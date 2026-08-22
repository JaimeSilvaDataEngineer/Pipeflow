import {
  BarChart3Icon,
  ClockIcon,
  LayersIcon,
  ShieldCheckIcon,
  SquareKanbanIcon,
  UsersIcon,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FEATURES = [
  {
    icon: SquareKanbanIcon,
    title: "Pipeline Kanban visual",
    description: "Arraste negócios entre etapas e veja o valor total de cada coluna em tempo real.",
  },
  {
    icon: UsersIcon,
    title: "Gestão de leads e contatos",
    description: "Organize, filtre e acompanhe cada contato do primeiro contato até o fechamento.",
  },
  {
    icon: ClockIcon,
    title: "Timeline de atividades",
    description: "Ligações, e-mails, reuniões e notas de cada lead em um só lugar.",
  },
  {
    icon: BarChart3Icon,
    title: "Dashboard de métricas",
    description: "Funil de vendas e indicadores-chave sempre à vista, sem planilhas.",
  },
  {
    icon: LayersIcon,
    title: "Múltiplos workspaces",
    description: "Um workspace por empresa ou cliente — ideal para times e consultores.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Permissões por papel",
    description: "Admin e Membro com acesso controlado, incluindo billing e configurações.",
  },
];

function FeaturesSection() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="mx-auto mb-12 max-w-xl text-center">
        <h2 className="text-foreground text-3xl font-bold tracking-tight">
          Tudo que o seu time de vendas precisa
        </h2>
        <p className="text-muted-foreground mt-3 text-lg">
          Sem automações de marketing, sem inchaço — só o essencial para vender mais.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <Card
            key={feature.title}
            className="transition-shadow duration-200 hover:shadow-md"
          >
            <CardHeader>
              <div className="bg-primary/10 mb-2 flex size-9 items-center justify-center rounded-lg">
                <feature.icon className="text-primary size-5" />
              </div>
              <CardTitle className="text-base">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export { FeaturesSection };
