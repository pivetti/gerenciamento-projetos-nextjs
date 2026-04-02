import { fetchCollection } from "@/lib/api";
import { normalizeCost } from "@/lib/normalize";
import type { Cost, ServiceResult } from "@/types/domain";

const COST_ENDPOINTS = ["/custos", "/api/custos", "/costs", "/api/costs"];

export async function listCosts(): Promise<ServiceResult<Cost[]>> {
  try {
    const response = await fetchCollection(COST_ENDPOINTS);
    return {
      data: response.items.map(normalizeCost).filter((item): item is Cost => Boolean(item)),
      source: response.source,
    };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error.message : "Nao foi possivel carregar os custos.",
    };
  }
}
