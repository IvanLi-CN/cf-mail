import { Card } from "@/components/ui/card";

export const StatGrid = ({
  stats,
}: {
  stats: Array<{ label: string; value: string; hint: string }>;
}) => (
  <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-4">
    {stats.map((stat) => (
      <Card key={stat.label} className="space-y-2 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {stat.label}
        </p>
        <div className="space-y-1">
          <p className="font-mono text-3xl font-semibold text-foreground">
            {stat.value}
          </p>
          <p className="text-sm text-muted-foreground">{stat.hint}</p>
        </div>
      </Card>
    ))}
  </div>
);
