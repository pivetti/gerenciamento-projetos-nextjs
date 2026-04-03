import type { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function SectionCard({ title, description, actions, children }: SectionCardProps) {
  return (
    <section className="app-panel rounded-[22px] p-4 sm:rounded-[24px] sm:p-5 lg:rounded-[28px] lg:p-6">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-slate-950">{title}</h3>
          {description ? <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p> : null}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}
