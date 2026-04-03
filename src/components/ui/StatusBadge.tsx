interface StatusBadgeProps {
  value?: string | null;
}

function getBadgeClasses(value?: string | null) {
  const normalized = (value || "").toLowerCase();

  if (!normalized) {
    return "border border-slate-200 bg-white/75 text-slate-700";
  }

  if (
    normalized.includes("ativo") ||
    normalized.includes("andamento") ||
    normalized.includes("conclu") ||
    normalized.includes("baixo") ||
    normalized.includes("dispon")
  ) {
    return "border border-emerald-200 bg-emerald-50/90 text-emerald-700";
  }

  if (
    normalized.includes("aten") ||
    normalized.includes("médio") ||
    normalized.includes("medio") ||
    normalized.includes("planej")
  ) {
    return "border border-amber-200 bg-amber-50/90 text-amber-700";
  }

  if (
    normalized.includes("alto") ||
    normalized.includes("atras") ||
    normalized.includes("inativo") ||
    normalized.includes("risco") ||
    normalized.includes("cancel")
  ) {
    return "border border-rose-200 bg-rose-50/90 text-rose-700";
  }

  return "border border-cyan-200 bg-cyan-50/90 text-cyan-700";
}

export function StatusBadge({ value }: StatusBadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur ${getBadgeClasses(value)}`}>
      {value || "Nao informado"}
    </span>
  );
}
