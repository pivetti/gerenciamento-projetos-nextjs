import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { SectionCard } from "@/components/ui/SectionCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { listProjects } from "@/services/projects";
import { listResources } from "@/services/resources";

export const dynamic = "force-dynamic";

export default async function RecursosPage() {
  const [resourcesResult, projectsResult] = await Promise.all([listResources(), listProjects()]);
  const projectMap = new Map(projectsResult.data.map((project) => [project.id, project.name]));
  const errors = [resourcesResult.error, projectsResult.error].filter((item): item is string => Boolean(item));

  return (
    <AppShell
      title="Recursos"
      description="Recursos vinculados aos projetos, conforme o contrato retornado pela API Spring."
    >
      <div className="space-y-6">
        {errors.length ? <ErrorAlert message={errors.join(" ")} /> : null}

        <SectionCard title="Lista de recursos" description="Itens de recurso por projeto, tipo e descricao.">
          {resourcesResult.data.length ? (
            <div className="grid gap-4 xl:grid-cols-2">
              {resourcesResult.data.map((resource) => (
                <article key={resource.id} className="app-card-muted rounded-[24px] p-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-semibold text-slate-950">{resource.name}</h3>
                    <StatusBadge value={resource.type || resource.availabilityStatus} />
                  </div>
                  <p className="mt-3 text-sm text-slate-500">
                    Projeto: {resource.projectName || (resource.projectId ? projectMap.get(resource.projectId) : undefined) || resource.projectId || "-"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{resource.description || "Sem descricao informada."}</p>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState title="Nenhum recurso encontrado" description="Quando a API retornar recursos, eles aparecerao aqui." />
          )}
        </SectionCard>
      </div>
    </AppShell>
  );
}
