"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useState } from "react";
import { loginUser } from "@/services/auth";

function formatErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Nao foi possivel entrar agora. Tente novamente.";
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [lembrar, setLembrar] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const accountCreated = searchParams.get("created") === "1";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await loginUser({ email, senha });

      router.push("/dashboard");
      router.refresh();
    } catch (submitError) {
      setError(formatErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {accountCreated ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700">
          Conta criada com sucesso. Entre com seu e-mail e senha para continuar.
        </div>
      ) : null}

      <label className="block">
        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.26em] text-slate-400">E-mail</span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
          required
        />
      </label>

      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="block text-xs font-semibold uppercase tracking-[0.26em] text-slate-400">Senha</span>
          <Link href="/cadastro" className="text-sm font-medium text-violet-600 transition hover:text-violet-800">
            Precisa de acesso?
          </Link>
        </div>

        <input
          type="password"
          name="senha"
          autoComplete="current-password"
          placeholder="Digite sua senha"
          value={senha}
          onChange={(event) => setSenha(event.target.value)}
          className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
          required
        />
      </div>

      <label className="flex items-center gap-3 text-sm text-slate-500">
        <input
          type="checkbox"
          checked={lembrar}
          onChange={(event) => setLembrar(event.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
        />
        Lembrar de mim
      </label>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700">{error}</div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex h-14 w-full items-center justify-center rounded-2xl bg-[linear-gradient(90deg,#7c3aed_0%,#a855f7_100%)] px-5 text-base font-semibold text-white shadow-[0_18px_35px_rgba(124,58,237,0.28)] transition hover:translate-y-[-1px] hover:shadow-[0_20px_40px_rgba(124,58,237,0.35)] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Entrando..." : "Entrar ->"}
      </button>
    </form>
  );
}
