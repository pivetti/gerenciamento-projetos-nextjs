import { NextResponse } from "next/server";
import { ApiRequestError, requestJson } from "@/lib/api";

const REGISTER_ENDPOINTS = ["/usuarios", "/api/usuarios", "/users", "/api/users"];

export async function POST(request: Request) {
  const body = await request.json();
  const errors: string[] = [];

  for (const path of REGISTER_ENDPOINTS) {
    try {
      const payload = await requestJson(path, {
        method: "POST",
        body: JSON.stringify(body),
      });

      return NextResponse.json({ ok: true, source: path, data: payload });
    } catch (error) {
      if (error instanceof ApiRequestError && error.status === 404) {
        errors.push(error.message);
        continue;
      }

      const message = error instanceof Error ? error.message : "Nao foi possivel criar a conta.";
      return NextResponse.json({ message }, { status: 400 });
    }
  }

  return NextResponse.json(
    {
      message:
        errors[0] || "Nao encontrei um endpoint de cadastro compativel na API. Verifique se o backend expoe POST /usuarios.",
    },
    { status: 404 },
  );
}
