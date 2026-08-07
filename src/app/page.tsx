import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatCurrency";
import { PIPELINE_STAGES } from "@/lib/constants/pipeline";

export default function Home() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center gap-8 px-6 py-16">
      <div className="max-w-lg space-y-4 text-center">
        <h1 className="text-foreground text-4xl font-bold tracking-tight">PipeFlow CRM</h1>
        <p className="text-muted-foreground">
          Setup concluído. Pipeline Kanban, leads e métricas — em breve.
        </p>
        <p className="text-muted-foreground text-sm">
          Exemplo: {formatCurrency(4990)} · {PIPELINE_STAGES.length} etapas do pipeline
        </p>
      </div>
      <Button>Começar</Button>
    </div>
  );
}
