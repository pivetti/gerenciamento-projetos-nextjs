import { fetchCollection, fetchItem } from "@/lib/api";
import { normalizeProject } from "@/lib/normalize";
import type { Project, ServiceResult } from "@/types/domain";

const PROJECT_ENDPOINTS = ["/projetos", "/api/projetos", "/projects", "/api/projects"];

export async function listProjects(): Promise<ServiceResult<Project[]>> {
  try {
    const response = await fetchCollection(PROJECT_ENDPOINTS);
    return {
      data: response.items.map(normalizeProject).filter((item): item is Project => Boolean(item)),
      source: response.source,
    };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error.message : "Nao foi possivel carregar os projetos.",
    };
  }
}

export async function getProjectById(id: string): Promise<ServiceResult<Project | null>> {
  const detailPaths = PROJECT_ENDPOINTS.map((endpoint) => `${endpoint}/${id}`);

  try {
    const response = await fetchItem(detailPaths);
    return {
      data: normalizeProject(response.item),
      source: response.source,
    };
  } catch {
    const listResult = await listProjects();
    return {
      data: listResult.data.find((project) => project.id === id) || null,
      error: listResult.error,
      source: listResult.source,
    };
  }
}
