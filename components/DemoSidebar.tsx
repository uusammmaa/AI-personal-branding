import { DemoNavLinks } from "@/components/DemoNavLinks";

export function DemoSidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border/50 bg-card/25 backdrop-blur-sm md:flex lg:w-64">
      <div className="border-b border-border/50 p-4">
        <p className="font-display text-xs uppercase tracking-[0.28em] text-primary">
          Live demos
        </p>
        <p className="font-display mt-1.5 text-2xl tracking-wide text-foreground">
          AI Chat
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Coach + document Q&A pipelines
        </p>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <DemoNavLinks />
      </div>
    </aside>
  );
}
