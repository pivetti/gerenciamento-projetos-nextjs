"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useMemo, useState } from "react";
import { registerUser } from "@/services/auth";

const PROFILE_OPTIONS = [
  { value: "GERENTE_PROJETO", label: "Gerente de projeto" },
  { value: "ADMIN", label: "Administrador" },
  { value: "ANALISTA", label: "Analista" },
];

function onlyDigits(value: string) {
  return value.replace(/\D/g, "").slice(0, 11);
}

function formatPhone(value: string) {
  const digits = onlyDigits(value);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function formatErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Nao foi possivel criar a conta agora. Tente novamente.";
}

export function RegisterForm() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [perfil, setPerfil] = useState("GERENTE_PROJETO");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const normalizedPhone = useMemo(() => onlyDigits(telefone), [telefone]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (senha !== confirmacao) {
      setError("As senhas nao coincidem.");
      return;
    }

    if (normalizedPhone.length < 10) {
      setError("Informe um telefone valido com DDD.");
      return;
    }

    setIsSubmitting(true);

    try {
      await registerUser({
        nome,
        email,
        senha,
        telefone: normalizedPhone,
        perfil,
      });

      setSuccess("Conta criada com sucesso. Voce ja pode entrar no sistema.");
      router.push("/login?created=1");
      router.refresh();
    } catch (submitError) {
      setError(formatErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <label className="block">
        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.26em] text-slate-400">Nome completo</span>
        <input
          type="text"
          name="nome"
          autoComplete="name"
          placeholder="Seu nome"
          value={nome}
          onChange={(event) => setNome(event.target.value)}
          className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
          required
        />
      </label>

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

      <label className="block">
        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.26em] text-slate-400">Telefone</span>
        <input
          type="tel"
          name="telefone"
          autoComplete="tel"
          placeholder="(11) 99999-9999"
          value={telefone}
          onChange={(event) => setTelefone(formatPhone(event.target.value))}
          className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
          required
        />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.26em] text-slate-400">Senha</span>
          <input
            type="password"
            name="senha"
            autoComplete="new-password"
            placeholder="Crie uma senha"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
            className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
            required
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.26em] text-slate-400">Confirmar</span>
          <input
            type="password"
            name="confirmacao"
            autoComplete="new-password"
            placeholder="Repita a senha"
            value={confirmacao}
            onChange={(event) => setConfirmacao(event.target.value)}
            className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
            required
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.26em] text-slate-400">Perfil</span>
        <select
          name="perfil"
          value={perfil}
          onChange={(event) => setPerfil(event.target.value)}
          className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 text-base text-slate-900 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
        >
          {PROFILE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700">{error}</div>
      ) : null}

      {success ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700">
          {success}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex h-14 w-full items-center justify-center rounded-2xl bg-[linear-gradient(90deg,#7c3aed_0%,#a855f7_100%)] px-5 text-base font-semibold text-white shadow-[0_18px_35px_rgba(124,58,237,0.28)] transition hover:translate-y-[-1px] hover:shadow-[0_20px_40px_rgba(124,58,237,0.35)] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Criando conta..." : "Criar conta ->"}
      </button>
    </form>
  );
}
