import type { LucideIcon } from "lucide-react";

function PlaceholderPage({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="border-border flex min-h-[60vh] flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-12 text-center">
      <Icon className="text-muted-foreground size-8" />
      <h1 className="text-foreground text-lg font-semibold">{title}</h1>
      <p className="text-muted-foreground max-w-sm text-sm">{description}</p>
    </div>
  );
}

export { PlaceholderPage };
