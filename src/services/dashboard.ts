import type { DashboardData } from "@/types/domain";
import { listActivities } from "./activities";
import { listCosts } from "./costs";
import { listParticipants } from "./participants";
import { listProjects } from "./projects";
import { listResources } from "./resources";
import { listRisks } from "./risks";

export async function getDashboardData(): Promise<DashboardData> {
  const [projectsResult, participantsResult, activitiesResult, resourcesResult, costsResult, risksResult] =
    await Promise.all([
      listProjects(),
      listParticipants(),
      listActivities(),
      listResources(),
      listCosts(),
      listRisks(),
    ]);

  const totalCostAmount = costsResult.data.reduce((sum, item) => sum + (item.amount || 0), 0);
  const activeProjects = projectsResult.data.filter((project) => {
    const value = (project.status || "").toLowerCase();
    return value.includes("andamento") || value.includes("ativo") || value.includes("exec");
  }).length;
  const delayedProjects = projectsResult.data.filter((project) => {
    const value = (project.status || "").toLowerCase();
    return value.includes("aten") || value.includes("atras") || value.includes("risco");
  }).length;

  return {
    metrics: {
      totalProjects: projectsResult.data.length,
      totalParticipants: participantsResult.data.length,
      totalActivities: activitiesResult.data.length,
      totalCosts: costsResult.data.length,
      totalRisks: risksResult.data.length,
      totalResources: resourcesResult.data.length,
      totalCostAmount,
      activeProjects,
      delayedProjects,
    },
    projects: projectsResult.data,
    participants: participantsResult.data,
    activities: activitiesResult.data,
    resources: resourcesResult.data,
    costs: costsResult.data,
    risks: risksResult.data,
    errors: [
      projectsResult.error,
      participantsResult.error,
      activitiesResult.error,
      resourcesResult.error,
      costsResult.error,
      risksResult.error,
    ].filter((item): item is string => Boolean(item)),
  };
}
