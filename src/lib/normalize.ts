import type { Activity, Cost, Participant, Project, Resource, Risk, User } from "@/types/domain";
import { parseNumericValue } from "./utils";

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as UnknownRecord;
}

function getPathValue(source: UnknownRecord | null, path: string) {
  if (!source) {
    return undefined;
  }

  const segments = path.split(".");
  let current: unknown = source;

  for (const segment of segments) {
    const record = asRecord(current);
    if (!record || !(segment in record)) {
      return undefined;
    }

    current = record[segment];
  }

  return current;
}

function firstDefined(source: UnknownRecord | null, paths: string[]) {
  for (const path of paths) {
    const value = getPathValue(source, path);
    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return undefined;
}

function stringValue(source: UnknownRecord | null, paths: string[]) {
  const value = firstDefined(source, paths);

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return undefined;
}

function booleanValue(source: UnknownRecord | null, paths: string[]) {
  const value = firstDefined(source, paths);

  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    if (value.toLowerCase() === "true") {
      return true;
    }

    if (value.toLowerCase() === "false") {
      return false;
    }
  }

  return undefined;
}

function numberValue(source: UnknownRecord | null, paths: string[]) {
  const value = firstDefined(source, paths);
  return parseNumericValue(value);
}

export function extractId(value: unknown): string | undefined {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  const record = asRecord(value);
  if (!record) {
    return undefined;
  }

  const candidate = firstDefined(record, ["id", "codigo", "uuid"]);
  if (typeof candidate === "string" || typeof candidate === "number") {
    return String(candidate);
  }

  return undefined;
}

function relationId(source: UnknownRecord | null, paths: string[]) {
  const direct = firstDefined(source, paths);
  return extractId(direct);
}

function relationName(source: UnknownRecord | null, paths: string[]) {
  return stringValue(source, paths);
}

export function normalizeItemPayload(payload: unknown) {
  const record = asRecord(payload);

  if (!record) {
    return null;
  }

  const nested = firstDefined(record, ["data", "item", "result", "payload"]);
  const nestedRecord = asRecord(nested);

  return nestedRecord || record;
}

export function extractCollection(payload: unknown): unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  const record = asRecord(payload);
  if (!record) {
    return [];
  }

  const directArray = firstDefined(record, ["content", "data", "items", "results"]);
  if (Array.isArray(directArray)) {
    return directArray;
  }

  const embedded = asRecord(record._embedded);
  if (embedded) {
    const embeddedArray = Object.values(embedded).find(Array.isArray);
    if (Array.isArray(embeddedArray)) {
      return embeddedArray;
    }
  }

  const firstArray = Object.values(record).find(Array.isArray);
  return Array.isArray(firstArray) ? firstArray : [];
}

export function normalizeUser(payload: unknown): User | null {
  const raw = normalizeItemPayload(payload);
  if (!raw) {
    return null;
  }

  return {
    id: extractId(raw) || stringValue(raw, ["usuarioId", "userId", "email", "nome"]) || "sem-id",
    name: stringValue(raw, ["nome", "name", "usuario", "username"]) || "Usuario sem nome",
    email: stringValue(raw, ["email", "mail"]) || null,
    active: booleanValue(raw, ["ativo", "active", "enabled"]) ?? null,
    raw,
  };
}

export function normalizeProject(payload: unknown): Project | null {
  const raw = normalizeItemPayload(payload);
  if (!raw) {
    return null;
  }

  const budgetValue = numberValue(raw, [
    "orcamento",
    "budget",
    "valorOrcamento",
    "orcamentoPrevisto",
    "custoPrevisto",
    "budgetValue",
  ]);

  const managerName =
    stringValue(raw, [
      "gerente.nome",
      "gestor.nome",
      "responsavel.nome",
      "gerenteProjeto.nome",
      "gerenteProjeto.name",
      "manager.name",
      "managerName",
      "nomeGestor",
      "nomeGerente",
      "gerenteEmail",
      "gestorEmail",
    ]) ||
    relationId(raw, ["gerenteProjetoId", "gerenteId", "gestorId", "responsavelId", "managerId"]) ||
    null;

  return {
    id: extractId(raw) || stringValue(raw, ["projetoId", "codigo"]) || "sem-id",
    name: stringValue(raw, ["nome", "name", "titulo", "title"]) || "Projeto sem nome",
    status: stringValue(raw, ["status", "situacao", "state"]) || null,
    description: stringValue(raw, ["descricao", "description", "resumo", "summary"]) || null,
    startDate: stringValue(raw, ["dataInicio", "startDate", "inicio", "inicioPrevisto"]) || null,
    endDate: stringValue(raw, ["dataFim", "endDate", "termino", "fimPrevisto"]) || null,
    budgetValue,
    budgetLabel: stringValue(raw, ["orcamento", "budgetLabel", "valorOrcamento", "orcamentoPrevisto"]) || null,
    managerName,
    raw,
  };
}

export function normalizeParticipant(payload: unknown): Participant | null {
  const raw = normalizeItemPayload(payload);
  if (!raw) {
    return null;
  }

  return {
    id: extractId(raw) || stringValue(raw, ["participanteId", "codigo"]) || "sem-id",
    projectId: relationId(raw, ["projetoId", "projectId", "projeto", "project"]) || null,
    projectName: relationName(raw, ["projeto.nome", "project.name", "nomeProjeto", "projectName", "projetoNome"]) || null,
    userId: relationId(raw, ["usuarioId", "userId", "usuario", "user"]) || null,
    userName:
      relationName(raw, ["usuario.nome", "user.name", "nomeUsuario", "userName", "responsavel.nome", "usuarioNome"]) ||
      null,
    role: stringValue(raw, ["papelAcesso", "funcaoNoProjeto", "papel", "funcao", "role", "cargo"]) || null,
    active: booleanValue(raw, ["ativo", "active", "statusAtivo"]) ?? null,
    raw,
  };
}

export function normalizeActivity(payload: unknown): Activity | null {
  const raw = normalizeItemPayload(payload);
  if (!raw) {
    return null;
  }

  return {
    id: extractId(raw) || stringValue(raw, ["atividadeId", "codigo"]) || "sem-id",
    title: stringValue(raw, ["titulo", "nome", "title", "name"]) || "Atividade sem titulo",
    projectId: relationId(raw, ["projetoId", "projectId", "projeto", "project"]) || null,
    projectName: relationName(raw, ["projeto.nome", "project.name", "nomeProjeto", "projectName", "projetoNome"]) || null,
    participantId:
      relationId(raw, ["participanteId", "responsavelId", "participantId", "responsavel", "participant"]) || null,
    participantName:
      relationName(raw, [
        "responsavel.nome",
        "responsavelNome",
        "participante.usuario.nome",
        "participant.user.name",
        "participantName",
        "nomeResponsavel",
      ]) || null,
    status: stringValue(raw, ["status", "situacao", "state"]) || null,
    priority: stringValue(raw, ["prioridade", "priority"]) || null,
    startDate: stringValue(raw, ["dataInicio", "startDate"]) || null,
    endDate: stringValue(raw, ["dataFim", "endDate"]) || null,
    dueDate: stringValue(raw, ["prazo", "dueDate", "dataLimite"]) || null,
    raw,
  };
}

export function normalizeResource(payload: unknown): Resource | null {
  const raw = normalizeItemPayload(payload);
  if (!raw) {
    return null;
  }

  return {
    id: extractId(raw) || stringValue(raw, ["recursoId", "codigo"]) || "sem-id",
    name: stringValue(raw, ["nome", "name", "titulo", "title"]) || "Recurso sem nome",
    projectId: relationId(raw, ["projetoId", "projectId", "projeto", "project"]) || null,
    projectName: relationName(raw, ["projeto.nome", "project.name", "nomeProjeto", "projectName"]) || null,
    type: stringValue(raw, ["tipo", "type", "categoria", "category"]) || null,
    description: stringValue(raw, ["descricao", "description"]) || null,
    quantity: numberValue(raw, ["quantidade", "quantity"]) || null,
    availabilityStatus: stringValue(raw, ["disponibilidade", "availabilityStatus", "status"]) || null,
    raw,
  };
}

export function normalizeCost(payload: unknown): Cost | null {
  const raw = normalizeItemPayload(payload);
  if (!raw) {
    return null;
  }

  const amount = numberValue(raw, ["valorReal", "valorPrevisto", "valor", "amount", "custo", "price"]);

  return {
    id: extractId(raw) || stringValue(raw, ["custoId", "codigo"]) || "sem-id",
    projectId: relationId(raw, ["projetoId", "projectId", "projeto", "project"]) || null,
    projectName: relationName(raw, ["projeto.nome", "project.name", "nomeProjeto", "projectName", "projetoNome"]) || null,
    activityId: relationId(raw, ["atividadeId", "activityId", "atividade", "activity"]) || null,
    activityName:
      relationName(raw, ["atividade.nome", "atividade.titulo", "activity.name", "activity.title", "atividadeTitulo"]) ||
      null,
    resourceId: relationId(raw, ["recursoId", "resourceId", "recurso", "resource"]) || null,
    resourceName: relationName(raw, ["recurso.nome", "resource.name", "nomeRecurso", "resourceName", "recursoNome"]) || null,
    amount,
    amountLabel: stringValue(raw, ["valorReal", "valorPrevisto", "valor", "amountLabel", "custo"]) || null,
    type: stringValue(raw, ["tipo", "type", "categoria"]) || null,
    description: stringValue(raw, ["descricao", "description", "observacao"]) || null,
    incurredAt: stringValue(raw, ["data", "incurredAt", "dataLancamento"]) || null,
    raw,
  };
}

export function normalizeRisk(payload: unknown): Risk | null {
  const raw = normalizeItemPayload(payload);
  if (!raw) {
    return null;
  }

  return {
    id: extractId(raw) || stringValue(raw, ["riscoId", "codigo"]) || "sem-id",
    title: stringValue(raw, ["titulo", "nome", "title", "name"]) || "Risco sem titulo",
    projectId: relationId(raw, ["projetoId", "projectId", "projeto", "project"]) || null,
    projectName: relationName(raw, ["projeto.nome", "project.name", "nomeProjeto", "projectName", "projetoNome"]) || null,
    impact: stringValue(raw, ["impacto", "impact"]) || null,
    probability: stringValue(raw, ["probabilidade", "probability"]) || null,
    responsePlan:
      stringValue(raw, ["planoMitigacao", "estrategiaResposta", "planoResposta", "mitigacao", "responsePlan", "response"]) ||
      null,
    status: stringValue(raw, ["status", "situacao", "state"]) || null,
    raw,
  };
}
