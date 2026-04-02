import { fetchCollection } from "@/lib/api";
import { normalizeParticipant } from "@/lib/normalize";
import type { Participant, ServiceResult } from "@/types/domain";

const PARTICIPANT_ENDPOINTS = ["/participantes", "/api/participantes", "/participants", "/api/participants"];

export async function listParticipants(): Promise<ServiceResult<Participant[]>> {
  try {
    const response = await fetchCollection(PARTICIPANT_ENDPOINTS);
    return {
      data: response.items.map(normalizeParticipant).filter((item): item is Participant => Boolean(item)),
      source: response.source,
    };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error.message : "Nao foi possivel carregar os participantes.",
    };
  }
}
