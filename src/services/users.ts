import { fetchCollection } from "@/lib/api";
import { normalizeUser } from "@/lib/normalize";
import type { ServiceResult, User } from "@/types/domain";

const USER_ENDPOINTS = ["/usuarios", "/api/usuarios", "/users", "/api/users"];

export async function listUsers(): Promise<ServiceResult<User[]>> {
  try {
    const response = await fetchCollection(USER_ENDPOINTS);
    return {
      data: response.items.map(normalizeUser).filter((item): item is User => Boolean(item)),
      source: response.source,
    };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error.message : "Nao foi possivel carregar os usuarios.",
    };
  }
}
