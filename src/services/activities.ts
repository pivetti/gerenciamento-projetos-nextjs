import { fetchCollection } from "@/lib/api";
import { normalizeActivity } from "@/lib/normalize";
import type { Activity, ServiceResult } from "@/types/domain";

const ACTIVITY_ENDPOINTS = ["/atividades", "/api/atividades", "/activities", "/api/activities"];

export async function listActivities(): Promise<ServiceResult<Activity[]>> {
  try {
    const response = await fetchCollection(ACTIVITY_ENDPOINTS);
    return {
      data: response.items.map(normalizeActivity).filter((item): item is Activity => Boolean(item)),
      source: response.source,
    };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error.message : "Nao foi possivel carregar as atividades.",
    };
  }
}
