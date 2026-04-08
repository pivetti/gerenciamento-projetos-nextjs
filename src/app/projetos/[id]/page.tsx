import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { MetricCard } from "@/components/ui/MetricCard";
import { SectionCard } from "@/components/ui/SectionCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { listActivities } from "@/services/activities";
import { listCosts } from "@/services/costs";
import { listParticipants } from "@/services/participants";
import { getProjectById } from "@/services/projects";
import { listResources } from "@/services/resources";
import { listRisks } from "@/services/risks";
import { listUsers } from "@/services/users";
import { formatCurrencyBRL, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

function belongsToProject(candidateId?: string | null, candidateName?: string | null, projectId?: string, projectName?: string) {
  if (projectId && candidateId && candidateId === projectId) {
    return true;
  }

  if (projectName && candidateName && candidateName === projectName) {
    return true;
  }

  return false;
}

export default async function ProjetoDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [projectResult, participantsResult, activitiesResult, resourcesResult, costsResult, risksResult, usersResult] =
    await Promise.all([
      getProjectById(id),
      listParticipants(),
      listActivities(),
      listResources(),
      listCosts(),
      listRisks(),
      listUsers(),
    ]);

  const project = projectResult.data;

  if (!project) {
    notFound();
  }

  const participants = participantsResult.data.filter((item) =>
    belongsToProject(item.projectId, item.projectName, project.id, project.name),
  );
  const activities = activitiesResult.data.filter((item) =>
    belongsToProject(item.projectId, item.projectName, project.id, project.name),
  );
  const resources = resourcesResult.data.filter((item) =>
    belongsToProject(item.projectId, item.projectName, project.id, project.name),
  );
  const costs = costsResult.data.filter((item) => belongsToProject(item.projectId, item.projectName, project.id, project.name));
  const risks = risksResult.data.filter((item) => belongsToProject(item.projectId, item.projectName, project.id, project.name));
  const userMap = new Map(usersResult.data.map((user) => [user.id, user.name]));

  const errors = [
    projectResult.error,
    participantsResult.error,
    activitiesResult.error,
    resourcesResult.error,
    costsResult.error,
    risksResult.error,
    usersResult.error,
  ].filter((item): item is string => Boolean(item));

  return (
    <AppShell
      title={project.name}
      description="Pagina central do dominio, reunindo os relacionamentos do projeto com participantes, atividades, recursos, custos e riscos."
      actions={
        <Link
          href="/projetos"
          className="app-button-secondary rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-white/90"
        >
          Voltar para projetos
        </Link>
      }
    >
      <div className="space-y-6">
        {errors.length ? <ErrorAlert message={errors.join(" ")} /> : null}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Participantes" value={String(participants.length)} />
          <MetricCard label="Atividades" value={String(activities.length)} />
          <MetricCard label="Recursos" value={String(resources.length)} />
          <MetricCard label="Custos" value={String(costs.length)} hint={formatCurrencyBRL(costs.reduce((sum, cost) => sum + (cost.amount || 0), 0))} />
        </section>

        <SectionCard title="Visao geral do projeto" description="Dados principais retornados pela API para o projeto selecionado.">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="app-card-muted rounded-[24px] p-5">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-xl font-semibold text-slate-950">{project.name}</h3>
                <StatusBadge value={project.status} />
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600">{project.description || "Sem descricao informada pela API."}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="app-card-muted rounded-[24px] p-5">
                <p className="text-sm text-slate-500">Inicio</p>
                <p className="mt-2 text-base font-semibold text-slate-950">{formatDate(project.startDate)}</p>
              </div>
              <div className="app-card-muted rounded-[24px] p-5">
                <p className="text-sm text-slate-500">Fim</p>
                <p className="mt-2 text-base font-semibold text-slate-950">{formatDate(project.endDate)}</p>
              </div>
              <div className="app-card-muted rounded-[24px] p-5">
                <p className="text-sm text-slate-500">Orcamento</p>
                <p className="mt-2 text-base font-semibold text-slate-950">
                  {formatCurrencyBRL(project.budgetValue, project.budgetLabel)}
                </p>
              </div>
            </div>
          </div>
        </SectionCard>

        <div className="grid gap-6 xl:grid-cols-2">
          <SectionCard title="Participantes" description="Vinculos de usuarios com o projeto selecionado.">
            {participants.length ? (
              <div className="space-y-3">
                {participants.map((participant) => (
                  <div key={participant.id} className="app-card-muted rounded-[24px] p-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="font-medium text-slate-950">
                        {participant.userName ||
                          (participant.userId ? userMap.get(participant.userId) : undefined) ||
                          userMap.get(participant.id) ||
                          participant.userId ||
                          participant.id ||
                          "Usuario nao informado"}
                      </p>
                      <StatusBadge value={participant.active === null ? undefined : participant.active ? "Ativo" : "Inativo"} />
                    </div>
                    <p className="mt-2 text-sm text-slate-500">Papel: {participant.role || "-"}</p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="Sem participantes" description="Nenhum participante vinculado a este projeto foi encontrado." />
            )}
          </SectionCard>

          <SectionCard title="Riscos" description="Riscos associados ao projeto.">
            {risks.length ? (
              <div className="space-y-3">
                {risks.map((risk) => (
                  <div key={risk.id} className="app-card-muted rounded-[24px] p-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="font-medium text-slate-950">{risk.title}</p>
                      <StatusBadge value={risk.impact || risk.status} />
                    </div>
                    <p className="mt-2 text-sm text-slate-500">Probabilidade: {risk.probability || "-"}</p>
                    <p className="mt-1 text-sm text-slate-600">Resposta: {risk.responsePlan || "-"}</p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="Sem riscos" description="Nenhum risco relacionado a este projeto foi encontrado." />
            )}
          </SectionCard>
        </div>

        <SectionCard title="Atividades" description="Execucao do projeto por atividade e responsavel.">
          {activities.length ? (
            <div className="app-table overflow-x-auto rounded-[24px]">
              <table className="min-w-full text-left text-sm">
                <thead className="text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Atividade</th>
                    <th className="px-4 py-3 font-medium">Responsavel</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Prioridade</th>
                    <th className="px-4 py-3 font-medium">Prazo</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity) => (
                    <tr key={activity.id}>
                      <td className="px-4 py-4 font-medium text-slate-900">{activity.title}</td>
                      <td className="px-4 py-4 text-slate-600">{activity.participantName || activity.participantId || "-"}</td>
                      <td className="px-4 py-4"><StatusBadge value={activity.status} /></td>
                      <td className="px-4 py-4"><StatusBadge value={activity.priority} /></td>
                      <td className="px-4 py-4 text-slate-600">{formatDate(activity.dueDate || activity.endDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState title="Sem atividades" description="Nenhuma atividade vinculada ao projeto foi encontrada." />
          )}
        </SectionCard>

        <div className="grid gap-6 xl:grid-cols-2">
          <SectionCard title="Recursos" description="Recursos associados ao projeto.">
            {resources.length ? (
              <div className="space-y-3">
                {resources.map((resource) => (
                  <div key={resource.id} className="app-card-muted rounded-[24px] p-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="font-medium text-slate-950">{resource.name}</p>
                      <StatusBadge value={resource.type || resource.availabilityStatus} />
                    </div>
                    <p className="mt-2 text-sm text-slate-500">{resource.description || "Sem descricao cadastrada."}</p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="Sem recursos" description="Nenhum recurso vinculado ao projeto foi encontrado." />
            )}
          </SectionCard>

          <SectionCard title="Custos" description="Custos do projeto, com relacoes opcionais para atividade e recurso.">
            {costs.length ? (
              <div className="space-y-3">
                {costs.map((cost) => (
                  <div key={cost.id} className="app-card-muted rounded-[24px] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="font-medium text-slate-950">{cost.description || cost.type || "Custo registrado"}</p>
                      <p className="text-sm font-semibold text-slate-950">
                        {formatCurrencyBRL(cost.amount, cost.amountLabel)}
                      </p>
                    </div>
                    <p className="mt-2 text-sm text-slate-500">Atividade: {cost.activityName || cost.activityId || "-"}</p>
                    <p className="mt-1 text-sm text-slate-600">Recurso: {cost.resourceName || cost.resourceId || "-"}</p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="Sem custos" description="Nenhum custo vinculado ao projeto foi encontrado." />
            )}
          </SectionCard>
        </div>
      </div>
    </AppShell>
  );
}
