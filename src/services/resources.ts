import { fetchCollection } from "@/lib/api";
import { normalizeResource } from "@/lib/normalize";
import type { Resource, ServiceResult } from "@/types/domain";

const RESOURCE_ENDPOINTS = ["/recursos", "/api/recursos", "/resources", "/api/resources"];

export async function listResources(): Promise<ServiceResult<Resource[]>> {
  try {
    const response = await fetchCollection(RESOURCE_ENDPOINTS);
    return {
      data: response.items.map(normalizeResource).filter((item): item is Resource => Boolean(item)),
      source: response.source,
    };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error.message : "Nao foi possivel carregar os recursos.",
    };
  }
}
