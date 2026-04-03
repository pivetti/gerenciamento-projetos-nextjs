import { NextResponse } from "next/server";
import { ApiRequestError, requestJson } from "@/lib/api";
import { AUTH_COOKIE_MAX_AGE, AUTH_COOKIE_NAME } from "@/lib/auth";

interface LoginInput {
  email?: string;
  senha?: string;
}

const LOGIN_CANDIDATES = [
  { path: "/usuarios/login", body: (input: Required<LoginInput>) => ({ email: input.email, senha: input.senha }) },
  {
    path: "/usuarios/autenticar",
    body: (input: Required<LoginInput>) => ({ email: input.email, senha: input.senha }),
  },
  { path: "/auth/login", body: (input: Required<LoginInput>) => ({ email: input.email, senha: input.senha }) },
  { path: "/api/auth/login", body: (input: Required<LoginInput>) => ({ email: input.email, senha: input.senha }) },
  { path: "/login", body: (input: Required<LoginInput>) => ({ email: input.email, senha: input.senha }) },
  { path: "/api/login", body: (input: Required<LoginInput>) => ({ email: input.email, senha: input.senha }) },
  { path: "/usuarios/login", body: (input: Required<LoginInput>) => ({ email: input.email, password: input.senha }) },
  {
    path: "/usuarios/autenticar",
    body: (input: Required<LoginInput>) => ({ email: input.email, password: input.senha }),
  },
];

const USER_ENDPOINTS = ["/usuarios", "/api/usuarios", "/users", "/api/users"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getEmail(user: Record<string, unknown>) {
  const email = user.email;
  return typeof email === "string" ? email.toLowerCase() : "";
}

function buildAuthenticatedResponse(payload: unknown, source: string, mode: "backend" | "fallback-email-only", message?: string) {
  const response = NextResponse.json({
    ok: true,
    source,
    mode,
    ...(message ? { message } : {}),
    data: payload,
  });

  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: Buffer.from(JSON.stringify({ source, mode, loggedAt: new Date().toISOString() })).toString("base64"),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: AUTH_COOKIE_MAX_AGE,
  });

  return response;
}

export async function POST(request: Request) {
  const body = (await request.json()) as LoginInput;
  const email = body.email?.trim().toLowerCase();
  const senha = body.senha?.trim();

  if (!email || !senha) {
    return NextResponse.json({ message: "Informe e-mail e senha." }, { status: 400 });
  }

  const normalizedInput = { email, senha };
  const candidateErrors: string[] = [];

  for (const candidate of LOGIN_CANDIDATES) {
    try {
      const payload = await requestJson(candidate.path, {
        method: "POST",
        body: JSON.stringify(candidate.body(normalizedInput)),
      });

      return buildAuthenticatedResponse(payload, candidate.path, "backend");
    } catch (error) {
      if (error instanceof ApiRequestError && (error.status === 404 || error.status === 405)) {
        candidateErrors.push(error.message);
        continue;
      }

      const message = error instanceof Error ? error.message : "Nao foi possivel autenticar agora.";
      return NextResponse.json({ message }, { status: 401 });
    }
  }

  for (const path of USER_ENDPOINTS) {
    try {
      const payload = await requestJson(path);
      const users = Array.isArray(payload) ? payload : [];
      const matchedUser = users.find((item) => isRecord(item) && getEmail(item) === email);

      if (matchedUser && isRecord(matchedUser)) {
        return buildAuthenticatedResponse(
          matchedUser,
          path,
          "fallback-email-only",
          "Login liberado por e-mail porque a API atual nao expoe um endpoint de autenticacao com senha. Este fallback e temporario.",
        );
      }
    } catch {
      // Se a listagem falhar em um caminho, tenta o proximo.
    }
  }

  return NextResponse.json(
    {
      message:
        "Nao foi possivel autenticar. A API nao expoe um endpoint de login compativel, e nenhum usuario com esse e-mail foi encontrado.",
      details: candidateErrors,
    },
    { status: 401 },
  );
}
