interface MetricCardProps {
  label: string;
  value: string;
  hint?: string;
}

export function MetricCard({ label, value, hint }: MetricCardProps) {
  return (
    <div className="app-card rounded-[22px] p-4 sm:rounded-[24px] sm:p-5 lg:rounded-[28px]">
      <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-violet-700 sm:text-sm">{label}</p>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{hint || "Atualizado diretamente a partir da API."}</p>
    </div>
  );
}
