const STATS = [
  { value: "+47%", label: "em taxa de conversão" },
  { value: "3.2x", label: "mais leads qualificados" },
  { value: "-62%", label: "no ciclo de vendas" },
  { value: "1200+", label: "times usando o PipeFlow" },
];

function StatsSection() {
  return (
    <section className="border-border/60 border-y">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-12 sm:gap-8 sm:px-6 md:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-1 text-center">
            <p className="text-3xl font-bold tracking-tight text-blue-600 sm:text-4xl">
              {stat.value}
            </p>
            <p className="text-muted-foreground text-sm">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export { StatsSection };
