import { fetchCollection } from "@/lib/api";
import { normalizeRisk } from "@/lib/normalize";
import type { Risk, ServiceResult } from "@/types/domain";

const RISK_ENDPOINTS = ["/riscos", "/api/riscos", "/risks", "/api/risks"];

export async function listRisks(): Promise<ServiceResult<Risk[]>> {
  try {
    const response = await fetchCollection(RISK_ENDPOINTS);
    return {
      data: response.items.map(normalizeRisk).filter((item): item is Risk => Boolean(item)),
      source: response.source,
    };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error.message : "Nao foi possivel carregar os riscos.",
    };
  }
}
