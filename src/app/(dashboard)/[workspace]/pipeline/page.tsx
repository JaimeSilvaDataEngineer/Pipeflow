import { SquareKanban } from "lucide-react";

import { PlaceholderPage } from "@/components/dashboard/placeholder-page";

export default function PipelinePage() {
  return (
    <PlaceholderPage
      icon={SquareKanban}
      title="Pipeline"
      description="O quadro Kanban com drag-and-drop chega na M3."
    />
  );
}
