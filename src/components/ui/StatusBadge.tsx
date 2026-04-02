interface StatusBadgeProps {
  value?: string | null;
}

function getBadgeClasses(value?: string | null) {
  const normalized = (value || "").toLowerCase();

  if (!normalized) {
    return "bg-slate-100 text-slate-700";
  }

  if (
    normalized.includes("ativo") ||
    normalized.includes("andamento") ||
    normalized.includes("conclu") ||
    normalized.includes("baixo") ||
    normalized.includes("dispon")
  ) {
    return "bg-emerald-100 text-emerald-700";
  }

  if (
    normalized.includes("aten") ||
    normalized.includes("médio") ||
    normalized.includes("medio") ||
    normalized.includes("planej")
  ) {
    return "bg-amber-100 text-amber-700";
  }

  if (
    normalized.includes("alto") ||
    normalized.includes("atras") ||
    normalized.includes("inativo") ||
    normalized.includes("risco") ||
    normalized.includes("cancel")
  ) {
    return "bg-rose-100 text-rose-700";
  }

  return "bg-cyan-100 text-cyan-700";
}

export function StatusBadge({ value }: StatusBadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getBadgeClasses(value)}`}>
      {value || "Nao informado"}
    </span>
  );
}
