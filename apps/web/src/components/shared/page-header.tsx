import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export const PageHeader = ({
  title,
  description,
  eyebrow,
  action,
  className,
}: {
  title: string;
  description: string;
  eyebrow?: string;
  action?: ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "flex flex-col gap-4 border-b border-border pb-4 md:flex-row md:items-end md:justify-between",
      className,
    )}
  >
    <div className="space-y-2">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {eyebrow}
        </p>
      ) : null}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
    {action ? <div className="shrink-0">{action}</div> : null}
  </div>
);
