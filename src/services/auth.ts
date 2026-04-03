"use client";

export interface LoginInput {
  email: string;
  senha: string;
}

export interface RegisterInput {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  perfil: string;
}

async function parseError(response: Response) {
  try {
    const payload = (await response.json()) as { message?: string };
    if (payload.message) {
      return payload.message;
    }
  } catch {
    // Ignora falhas de parsing e usa a mensagem padrao abaixo.
  }

  return "Nao foi possivel concluir a solicitacao.";
}

export async function registerUser(input: RegisterInput) {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
}

export async function loginUser(input: LoginInput) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
}
