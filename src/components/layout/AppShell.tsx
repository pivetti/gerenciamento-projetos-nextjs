import type { ReactNode } from "react";
import { SidebarNav } from "./SidebarNav";

interface AppShellProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function AppShell({ title, description, actions, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.12),_transparent_35%),linear-gradient(180deg,#f7fafc_0%,#edf2f7_100%)] text-slate-900">
      <div className="mx-auto grid min-h-screen w-full max-w-[1600px] lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-slate-200 bg-white/90 p-6 backdrop-blur lg:sticky lg:top-0 lg:h-screen lg:border-r lg:border-b-0">
          <div className="mb-8">
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-600">ProjectHub</div>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">Gerenciamento de Projetos</h1>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Frontend em Next.js conectado a uma API Spring Boot para acompanhar projetos, equipe, custos e riscos.
            </p>
          </div>

          <SidebarNav />
        </aside>

        <main className="p-5 lg:p-8">
          <header className="rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-sm font-medium text-violet-600">Painel operacional</p>
                <h2 className="mt-1 text-3xl font-semibold tracking-tight">{title}</h2>
                {description ? <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">{description}</p> : null}
              </div>
              {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
            </div>
          </header>

          <div className="mt-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
