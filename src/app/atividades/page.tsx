import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { SectionCard } from "@/components/ui/SectionCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate } from "@/lib/utils";
import { listActivities } from "@/services/activities";
import { listParticipants } from "@/services/participants";
import { listProjects } from "@/services/projects";

export const dynamic = "force-dynamic";

export default async function AtividadesPage() {
  const [activitiesResult, participantsResult, projectsResult] = await Promise.all([
    listActivities(),
    listParticipants(),
    listProjects(),
  ]);

  const participantMap = new Map(
    participantsResult.data.map((participant) => [
      participant.id,
      participant.userName || participant.userId || "Participante nao identificado",
    ]),
  );
  const projectMap = new Map(projectsResult.data.map((project) => [project.id, project.name]));
  const errors = [activitiesResult.error, participantsResult.error, projectsResult.error].filter(
    (item): item is string => Boolean(item),
  );

  return (
    <AppShell
      title="Atividades"
      description="Acompanhamento operacional das atividades por projeto, responsavel, status e prioridade."
    >
      <div className="space-y-6">
        {errors.length ? <ErrorAlert message={errors.join(" ")} /> : null}

        <SectionCard title="Lista de atividades" description="Itens consultados em tempo real da API Spring.">
          {activitiesResult.data.length ? (
            <div className="overflow-x-auto rounded-[24px] border border-slate-200">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Titulo</th>
                    <th className="px-4 py-3 font-medium">Projeto</th>
                    <th className="px-4 py-3 font-medium">Responsavel</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Prioridade</th>
                    <th className="px-4 py-3 font-medium">Datas</th>
                  </tr>
                </thead>
                <tbody>
                  {activitiesResult.data.map((activity) => (
                    <tr key={activity.id} className="border-t border-slate-200">
                      <td className="px-4 py-4 font-medium text-slate-900">{activity.title}</td>
                      <td className="px-4 py-4 text-slate-600">
                        {activity.projectName ||
                          (activity.projectId ? projectMap.get(activity.projectId) : undefined) ||
                          activity.projectId ||
                          "-"}
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        {activity.participantName ||
                          (activity.participantId ? participantMap.get(activity.participantId) : undefined) ||
                          activity.participantId ||
                          "-"}
                      </td>
                      <td className="px-4 py-4"><StatusBadge value={activity.status} /></td>
                      <td className="px-4 py-4"><StatusBadge value={activity.priority} /></td>
                      <td className="px-4 py-4 text-slate-600">
                        {formatDate(activity.startDate)} / {formatDate(activity.dueDate || activity.endDate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="Nenhuma atividade encontrada"
              description="Crie atividades na API e recarregue a pagina para ver a execucao refletida aqui."
            />
          )}
        </SectionCard>
      </div>
    </AppShell>
  );
}
