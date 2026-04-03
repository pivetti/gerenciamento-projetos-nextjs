import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { SectionCard } from "@/components/ui/SectionCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { listProjects } from "@/services/projects";
import { listRisks } from "@/services/risks";

export const dynamic = "force-dynamic";

export default async function RiscosPage() {
  const [risksResult, projectsResult] = await Promise.all([listRisks(), listProjects()]);
  const projectMap = new Map(projectsResult.data.map((project) => [project.id, project.name]));
  const errors = [risksResult.error, projectsResult.error].filter((item): item is string => Boolean(item));

  return (
    <AppShell
      title="Riscos"
      description="Riscos por projeto com impacto, probabilidade e plano de resposta."
    >
      <div className="space-y-6">
        {errors.length ? <ErrorAlert message={errors.join(" ")} /> : null}

        <SectionCard title="Lista de riscos" description="Itens retornados pela API para acompanhamento gerencial.">
          {risksResult.data.length ? (
            <div className="grid gap-4 xl:grid-cols-2">
              {risksResult.data.map((risk) => (
                <article key={risk.id} className="app-card-muted rounded-[24px] p-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-semibold text-slate-950">{risk.title}</h3>
                    <StatusBadge value={risk.impact || risk.status} />
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <p>Projeto: {risk.projectName || (risk.projectId ? projectMap.get(risk.projectId) : undefined) || risk.projectId || "-"}</p>
                    <p>Probabilidade: {risk.probability || "-"}</p>
                    <p>Resposta: {risk.responsePlan || "-"}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState title="Nenhum risco encontrado" description="Cadastre riscos na API para acompanhar a exposicao dos projetos." />
          )}
        </SectionCard>
      </div>
    </AppShell>
  );
}
