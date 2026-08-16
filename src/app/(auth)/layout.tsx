export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 py-16">
      <span className="text-foreground text-lg font-semibold">PipeFlow</span>
      {children}
    </div>
  );
}
