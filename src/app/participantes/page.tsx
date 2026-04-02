import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { SectionCard } from "@/components/ui/SectionCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { listParticipants } from "@/services/participants";
import { listProjects } from "@/services/projects";
import { listUsers } from "@/services/users";

export const dynamic = "force-dynamic";

export default async function ParticipantesPage() {
  const [participantsResult, usersResult, projectsResult] = await Promise.all([
    listParticipants(),
    listUsers(),
    listProjects(),
  ]);

  const userMap = new Map(usersResult.data.map((user) => [user.id, user.name]));
  const projectMap = new Map(projectsResult.data.map((project) => [project.id, project.name]));
  const errors = [participantsResult.error, usersResult.error, projectsResult.error].filter(
    (item): item is string => Boolean(item),
  );

  return (
    <AppShell
      title="Participantes"
      description="Relacao entre usuarios e projetos. Esta tela combina participantes, usuarios e projetos consultados na API."
    >
      <div className="space-y-6">
        {errors.length ? <ErrorAlert message={errors.join(" ")} /> : null}

        <SectionCard title="Lista de participantes" description="Usuario relacionado, projeto e papel dentro do contexto do projeto.">
          {participantsResult.data.length ? (
            <div className="overflow-x-auto rounded-[24px] border border-slate-200">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Usuario</th>
                    <th className="px-4 py-3 font-medium">Projeto</th>
                    <th className="px-4 py-3 font-medium">Papel</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {participantsResult.data.map((participant) => (
                    <tr key={participant.id} className="border-t border-slate-200">
                      <td className="px-4 py-4 font-medium text-slate-900">
                        {participant.userName || (participant.userId ? userMap.get(participant.userId) : undefined) || participant.userId || "-"}
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        {participant.projectName ||
                          (participant.projectId ? projectMap.get(participant.projectId) : undefined) ||
                          participant.projectId ||
                          "-"}
                      </td>
                      <td className="px-4 py-4 text-slate-600">{participant.role || "-"}</td>
                      <td className="px-4 py-4">
                        <StatusBadge
                          value={
                            participant.active === null ? undefined : participant.active ? "Ativo" : "Inativo"
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="Nenhum participante encontrado"
              description="Cadastre participantes na API e recarregue a pagina para visualizar os vinculos."
            />
          )}
        </SectionCard>
      </div>
    </AppShell>
  );
}
