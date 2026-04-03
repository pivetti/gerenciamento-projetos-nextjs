import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { EmptyState } from "@/components/ui/EmptyState";
import { MetricCard } from "@/components/ui/MetricCard";
import { SectionCard } from "@/components/ui/SectionCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getDashboardData } from "@/services/dashboard";
import { compactNumber, formatCurrencyBRL, formatDate, truncateText } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const dashboard = await getDashboardData();

  return (
    <AppShell
      title="Dashboard"
      description="Resumo executivo dos dados persistidos na API. Atualize registros pelo Postman e recarregue a pagina para refletir as mudancas."
      actions={
        <>
          <Link
            href="/projetos"
            className="app-button-secondary rounded-2xl px-4 py-3 text-center text-sm font-medium text-slate-700 transition hover:bg-white/90 sm:text-left"
          >
            Ver projetos
          </Link>
          <Link
            href="/riscos"
            className="app-button-primary rounded-2xl px-4 py-3 text-center text-sm font-medium !text-white transition hover:brightness-105 sm:text-left"
          >
            Ver riscos
          </Link>
        </>
      }
    >
      <div className="space-y-6">
        {dashboard.errors.length ? <ErrorAlert message={dashboard.errors.join(" ")} /> : null}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Projetos" value={String(dashboard.metrics.totalProjects)} hint={`${dashboard.metrics.activeProjects} ativos`} />
          <MetricCard
            label="Participantes"
            value={String(dashboard.metrics.totalParticipants)}
            hint={`${dashboard.metrics.totalActivities} atividades vinculadas`}
          />
          <MetricCard
            label="Custos"
            value={String(dashboard.metrics.totalCosts)}
            hint={formatCurrencyBRL(dashboard.metrics.totalCostAmount)}
          />
          <MetricCard
            label="Riscos"
            value={String(dashboard.metrics.totalRisks)}
            hint={`${dashboard.metrics.delayedProjects} projetos em atencao`}
          />
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <MetricCard label="Atividades" value={String(dashboard.metrics.totalActivities)} hint="Total consultado na API" />
          <MetricCard label="Recursos" value={String(dashboard.metrics.totalResources)} hint="Recursos vinculados aos projetos" />
          <MetricCard
            label="Volume financeiro"
            value={formatCurrencyBRL(dashboard.metrics.totalCostAmount)}
            hint={`${compactNumber(dashboard.metrics.totalCostAmount)} em valores acumulados`}
          />
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <SectionCard
            title="Projetos recentes"
            description="Projetos retornados pela API com acesso rapido ao detalhe."
            actions={
              <Link
                href="/projetos"
                className="app-button-secondary rounded-2xl px-3 py-2 text-sm font-medium text-slate-700"
              >
                Abrir listagem
              </Link>
            }
          >
            {dashboard.projects.length ? (
              <div className="space-y-4">
                {dashboard.projects.slice(0, 5).map((project) => (
                  <article key={project.id} className="app-card-muted rounded-[22px] p-4 sm:rounded-[24px] sm:p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <h4 className="text-lg font-semibold text-slate-950">{project.name}</h4>
                          <StatusBadge value={project.status} />
                        </div>
                        <p className="text-sm leading-6 text-slate-500">{truncateText(project.description, 180)}</p>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
                          <span>Inicio: {formatDate(project.startDate)}</span>
                          <span>Fim: {formatDate(project.endDate)}</span>
                          <span>Orcamento: {formatCurrencyBRL(project.budgetValue, project.budgetLabel)}</span>
                        </div>
                      </div>

                      <Link
                        href={`/projetos/${project.id}`}
                        className="app-button-primary rounded-2xl px-4 py-3 text-center text-sm font-medium !text-white transition hover:brightness-105"
                      >
                        Ver detalhe
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState
                title="Nenhum projeto encontrado"
                description="Cadastre projetos na API Spring para visualizar o painel executivo."
              />
            )}
          </SectionCard>

          <div className="space-y-6">
            <SectionCard title="Riscos em destaque" description="Primeiros riscos retornados pela API.">
              {dashboard.risks.length ? (
                <div className="space-y-3">
                  {dashboard.risks.slice(0, 4).map((risk) => (
                    <div key={risk.id} className="app-card-muted rounded-[24px] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium text-slate-900">{risk.title}</p>
                        <StatusBadge value={risk.impact || risk.status} />
                      </div>
                      <p className="mt-2 text-sm text-slate-500">Projeto: {risk.projectName || risk.projectId || "-"}</p>
                      <p className="mt-1 text-sm text-slate-600">Probabilidade: {risk.probability || "-"}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState title="Sem riscos cadastrados" description="Quando a API retornar riscos, eles aparecerao aqui." />
              )}
            </SectionCard>

            <SectionCard title="Atividades recentes" description="Visao rapida das primeiras atividades carregadas.">
              {dashboard.activities.length ? (
                <div className="space-y-3">
                  {dashboard.activities.slice(0, 4).map((activity) => (
                    <div key={activity.id} className="app-card-muted rounded-[24px] p-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="font-medium text-slate-900">{activity.title}</p>
                        <StatusBadge value={activity.status || activity.priority} />
                      </div>
                      <p className="mt-2 text-sm text-slate-500">Projeto: {activity.projectName || activity.projectId || "-"}</p>
                      <p className="mt-1 text-sm text-slate-600">Responsavel: {activity.participantName || "-"}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="Sem atividades registradas"
                  description="Crie atividades na API e recarregue a pagina para acompanha-las aqui."
                />
              )}
            </SectionCard>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
