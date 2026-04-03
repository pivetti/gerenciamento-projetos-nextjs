import Link from "next/link";
import type { ReactNode } from "react";

interface AuthSplitLayoutProps {
  eyebrow: string;
  title: string;
  description: string;
  formTitle: string;
  formDescription: string;
  footerText: string;
  footerLinkHref: string;
  footerLinkLabel: string;
  children: ReactNode;
}

export function AuthSplitLayout({
  eyebrow,
  title,
  description,
  formTitle,
  formDescription,
  footerText,
  footerLinkHref,
  footerLinkLabel,
  children,
}: AuthSplitLayoutProps) {
  return (
    <main className="min-h-screen bg-[#f6f3fb] text-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.2),transparent_30%),radial-gradient(circle_at_80%_70%,rgba(91,33,182,0.35),transparent_34%),linear-gradient(160deg,#2f0d57_0%,#2b1155_48%,#1a1238_100%)] px-8 py-10 text-white lg:flex lg:flex-col lg:justify-between xl:px-14 xl:py-12">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/16 ring-1 ring-white/18 backdrop-blur">
              <span className="text-sm font-semibold tracking-[0.2em]">PH</span>
            </div>
            <div>
              <p className="text-xl font-semibold tracking-tight">ProjectHub</p>
              <p className="text-sm text-white/60">Enterprise Suite</p>
            </div>
          </div>

          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.38em] text-violet-200/80">{eyebrow}</p>
            <h1 className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight text-balance">{title}</h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-white/70">{description}</p>
          </div>

          <p className="text-sm text-white/40">(c) 2026 ProjectHub Enterprise Suite. Todos os direitos reservados.</p>

          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.04)_45%,transparent_100%)]" />
          <div className="pointer-events-none absolute -bottom-32 -left-14 h-72 w-72 rounded-full bg-fuchsia-500/18 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        </section>

        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-[28rem]">
            <div className="mb-10 lg:hidden">
              <div className="inline-flex items-center gap-3 rounded-full border border-violet-200 bg-white px-4 py-2 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-600 text-sm font-semibold text-white">
                  PH
                </div>
                <div>
                  <p className="text-base font-semibold tracking-tight">ProjectHub</p>
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">{eyebrow}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/70 bg-white/80 p-7 shadow-[0_28px_70px_rgba(74,16,135,0.10)] backdrop-blur sm:p-9">
              <div className="mb-8">
                <h2 className="text-4xl font-semibold tracking-tight text-slate-950">{formTitle}</h2>
                <p className="mt-3 text-base leading-7 text-slate-500">{formDescription}</p>
              </div>

              {children}

              <p className="mt-8 text-center text-sm text-slate-500">
                {footerText}{" "}
                <Link href={footerLinkHref} className="font-semibold text-violet-700 transition hover:text-violet-900">
                  {footerLinkLabel}
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
