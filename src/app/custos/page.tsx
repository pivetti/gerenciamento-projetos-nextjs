import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { SectionCard } from "@/components/ui/SectionCard";
import { formatCurrencyBRL, formatDate } from "@/lib/utils";
import { listActivities } from "@/services/activities";
import { listCosts } from "@/services/costs";
import { listProjects } from "@/services/projects";
import { listResources } from "@/services/resources";

export const dynamic = "force-dynamic";

export default async function CustosPage() {
  const [costsResult, projectsResult, activitiesResult, resourcesResult] = await Promise.all([
    listCosts(),
    listProjects(),
    listActivities(),
    listResources(),
  ]);

  const projectMap = new Map(projectsResult.data.map((project) => [project.id, project.name]));
  const activityMap = new Map(activitiesResult.data.map((activity) => [activity.id, activity.title]));
  const resourceMap = new Map(resourcesResult.data.map((resource) => [resource.id, resource.name]));
  const errors = [costsResult.error, projectsResult.error, activitiesResult.error, resourcesResult.error].filter(
    (item): item is string => Boolean(item),
  );

  return (
    <AppShell
      title="Custos"
      description="Custos por projeto, com referencias opcionais a atividade e recurso."
    >
      <div className="space-y-6">
        {errors.length ? <ErrorAlert message={errors.join(" ")} /> : null}

        <SectionCard title="Lista de custos" description="Valores consumidos diretamente da API persistida.">
          {costsResult.data.length ? (
            <div className="app-table overflow-x-auto rounded-[24px]">
              <table className="min-w-full text-left text-sm">
                <thead className="text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Descricao</th>
                    <th className="px-4 py-3 font-medium">Projeto</th>
                    <th className="px-4 py-3 font-medium">Atividade</th>
                    <th className="px-4 py-3 font-medium">Recurso</th>
                    <th className="px-4 py-3 font-medium">Valor</th>
                    <th className="px-4 py-3 font-medium">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {costsResult.data.map((cost) => (
                    <tr key={cost.id}>
                      <td className="px-4 py-4 font-medium text-slate-900">{cost.description || cost.type || "Custo"}</td>
                      <td className="px-4 py-4 text-slate-600">
                        {cost.projectName || (cost.projectId ? projectMap.get(cost.projectId) : undefined) || cost.projectId || "-"}
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        {cost.activityName || (cost.activityId ? activityMap.get(cost.activityId) : undefined) || cost.activityId || "-"}
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        {cost.resourceName || (cost.resourceId ? resourceMap.get(cost.resourceId) : undefined) || cost.resourceId || "-"}
                      </td>
                      <td className="px-4 py-4 text-slate-600">{formatCurrencyBRL(cost.amount, cost.amountLabel)}</td>
                      <td className="px-4 py-4 text-slate-600">{formatDate(cost.incurredAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState title="Nenhum custo encontrado" description="Crie custos na API e recarregue a pagina para visualiza-los." />
          )}
        </SectionCard>
      </div>
    </AppShell>
  );
}
