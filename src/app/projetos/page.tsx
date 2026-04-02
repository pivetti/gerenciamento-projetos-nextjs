import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { SectionCard } from "@/components/ui/SectionCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { listProjects } from "@/services/projects";
import { formatCurrencyBRL, formatDate, truncateText } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProjetosPage() {
  const result = await listProjects();

  return (
    <AppShell
      title="Projetos"
      description="Listagem funcional de projetos consumida da API Spring. Novos registros cadastrados pela API aparecem aqui ao recarregar."
    >
      <div className="space-y-6">
        {result.error ? <ErrorAlert message={result.error} /> : null}

        <SectionCard title="Todos os projetos" description="Nome, status, descricao e principais datas do projeto.">
          {result.data.length ? (
            <div className="grid gap-4 xl:grid-cols-2">
              {result.data.map((project) => (
                <article key={project.id} className="rounded-[24px] border border-slate-200 p-5">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-semibold text-slate-950">{project.name}</h3>
                      <StatusBadge value={project.status} />
                    </div>

                    <p className="text-sm leading-6 text-slate-500">{truncateText(project.description, 220)}</p>

                    <div className="grid gap-3 text-sm text-slate-500 sm:grid-cols-2">
                      <div>Inicio: {formatDate(project.startDate)}</div>
                      <div>Fim: {formatDate(project.endDate)}</div>
                      <div>Orcamento: {formatCurrencyBRL(project.budgetValue, project.budgetLabel)}</div>
                      <div>Gestor: {project.managerName || "-"}</div>
                    </div>

                    <div className="pt-2">
                      <Link
                        href={`/projetos/${project.id}`}
                        className="inline-flex rounded-2xl bg-violet-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-violet-700"
                      >
                        Ver detalhes
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Nenhum projeto disponivel"
              description="Crie um projeto na API Spring e recarregue a pagina para visualiza-lo aqui."
            />
          )}
        </SectionCard>
      </div>
    </AppShell>
  );
}
