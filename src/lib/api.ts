import { extractCollection, normalizeItemPayload } from "./normalize";

class ApiRequestError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
  }
}

function getBaseUrl() {
  const value = process.env.NEXT_PUBLIC_API_URL?.trim();
  return value ? value.replace(/\/$/, "") : "";
}

async function parseResponseBody(response: Response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function buildErrorMessage(path: string, payload: unknown, status: number) {
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    const message = record.message || record.error || record.detail;

    if (typeof message === "string") {
      return `${status} ao consultar ${path}: ${message}`;
    }
  }

  if (typeof payload === "string" && payload.trim()) {
    return `${status} ao consultar ${path}: ${payload}`;
  }

  return `${status} ao consultar ${path}.`;
}

async function request(path: string) {
  const baseUrl = getBaseUrl();

  if (!baseUrl) {
    throw new ApiRequestError(
      "A variavel NEXT_PUBLIC_API_URL nao esta configurada. Defina a URL base da API Spring antes de abrir as paginas.",
    );
  }

  const response = await fetch(`${baseUrl}${path}`, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  const payload = await parseResponseBody(response);

  if (!response.ok) {
    throw new ApiRequestError(buildErrorMessage(path, payload, response.status), response.status);
  }

  return payload;
}

export async function fetchCollection(paths: string[]) {
  const errors: string[] = [];

  for (const path of paths) {
    try {
      const payload = await request(path);
      return { items: extractCollection(payload), source: path };
    } catch (error) {
      if (error instanceof ApiRequestError && error.status === 404) {
        errors.push(error.message);
        continue;
      }

      errors.push(error instanceof Error ? error.message : "Falha inesperada ao consultar a API.");
    }
  }

  throw new Error(errors.join(" "));
}

export async function fetchItem(paths: string[]) {
  const errors: string[] = [];

  for (const path of paths) {
    try {
      const payload = await request(path);
      return { item: normalizeItemPayload(payload), source: path };
    } catch (error) {
      if (error instanceof ApiRequestError && error.status === 404) {
        errors.push(error.message);
        continue;
      }

      errors.push(error instanceof Error ? error.message : "Falha inesperada ao consultar a API.");
    }
  }

  throw new Error(errors.join(" "));
}
