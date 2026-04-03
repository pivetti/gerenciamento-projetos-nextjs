import { extractCollection, normalizeItemPayload } from "./normalize";

export class ApiRequestError extends Error {
  status?: number;
  payload?: unknown;

  constructor(message: string, status?: number, payload?: unknown) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.payload = payload;
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

function buildErrorMessage(path: string, payload: unknown, status: number, action = "consultar") {
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    const message = record.message || record.error || record.detail;

    if (typeof message === "string") {
      return `${status} ao ${action} ${path}: ${message}`;
    }
  }

  if (typeof payload === "string" && payload.trim()) {
    return `${status} ao ${action} ${path}: ${payload}`;
  }

  return `${status} ao ${action} ${path}.`;
}

export async function requestJson(path: string, init: RequestInit = {}) {
  const baseUrl = getBaseUrl();

  if (!baseUrl) {
    throw new ApiRequestError(
      "A variavel NEXT_PUBLIC_API_URL nao esta configurada. Defina a URL base da API Spring antes de abrir as paginas.",
    );
  }

  const headers = new Headers(init.headers);

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    cache: "no-store",
    headers,
  });

  const payload = await parseResponseBody(response);

  if (!response.ok) {
    const action = init.method && init.method !== "GET" ? "enviar para" : "consultar";
    throw new ApiRequestError(buildErrorMessage(path, payload, response.status, action), response.status, payload);
  }

  return payload;
}

export async function fetchCollection(paths: string[]) {
  const errors: string[] = [];

  for (const path of paths) {
    try {
      const payload = await requestJson(path);
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
      const payload = await requestJson(path);
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
