export function formatDate(value?: string | null) {
  if (!value) {
    return "-";
  }

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    return value;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("pt-BR").format(parsed);
}

export function parseNumericValue(value: unknown) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const sanitized = value
    .replace(/[^\d,.-]/g, "")
    .replace(/\.(?=\d{3}(?:\D|$))/g, "")
    .replace(",", ".");

  const parsed = Number(sanitized);
  return Number.isFinite(parsed) ? parsed : null;
}

export function formatCurrencyBRL(value?: number | null, fallback?: string | null) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  return fallback || "-";
}

export function truncateText(value?: string | null, max = 120) {
  if (!value) {
    return "-";
  }

  if (value.length <= max) {
    return value;
  }

  return `${value.slice(0, max - 1)}...`;
}

export function compactNumber(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}
