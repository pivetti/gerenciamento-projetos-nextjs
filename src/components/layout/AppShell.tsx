import type { ReactNode } from "react";
import { MobileTopbar } from "./MobileTopbar";
import { LogoutButton } from "./LogoutButton";
import { SidebarNav } from "./SidebarNav";

interface AppShellProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function AppShell({ title, description, actions, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[var(--app-gradient)] text-slate-900">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-16 top-20 h-64 w-64 rounded-full bg-fuchsia-400/20 blur-3xl" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-violet-500/18 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-indigo-400/12 blur-3xl" />
      </div>

      <MobileTopbar />

      <div className="grid min-h-screen w-full lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="relative z-20 hidden overflow-hidden border-b border-[#ffffff1f] bg-[#220f49] p-6 text-white lg:sticky lg:top-0 lg:block lg:h-screen lg:border-r lg:border-b-0">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))]" />

          <div className="relative z-10 mb-8">
            <div>
              <p className="text-[0.68rem] font-medium uppercase tracking-[0.38em] text-violet-200/70">Workspace</p>
              <p className="mt-2 text-[1.45rem] font-semibold tracking-[-0.05em] text-white">ProjectHub</p>
            </div>
            <div className="mt-4 h-px w-16 bg-white/18" />
            <h1 className="mt-5 text-2xl font-semibold tracking-tight text-white">Gerenciamento de Projetos</h1>
            <p className="mt-3 text-sm leading-6 text-[#ebe5ff]">
              Frontend em Next.js conectado a uma API Spring Boot para acompanhar projetos, equipe, custos e riscos.
            </p>
          </div>

          <div className="relative z-10">
            <SidebarNav />
            <LogoutButton className="mt-6" />
          </div>
        </aside>

        <main className="relative min-w-0 p-4 pt-3 sm:p-5 sm:pt-4 lg:p-8">
          <header className="app-panel rounded-[24px] p-4 sm:rounded-[28px] sm:p-5 lg:rounded-[32px] lg:p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-violet-700 sm:text-sm">Painel operacional</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{title}</h2>
                {description ? <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{description}</p> : null}
              </div>
              {actions ? <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">{actions}</div> : null}
            </div>
          </header>

          <div className="mt-4 sm:mt-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
