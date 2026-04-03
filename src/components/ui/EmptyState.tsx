interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-[24px] border border-dashed border-violet-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(243,232,255,0.72))] px-6 py-10 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
      <h4 className="text-base font-semibold text-slate-900">{title}</h4>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}
