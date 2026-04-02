export interface ServiceResult<T> {
  data: T;
  error?: string;
  source?: string;
}

export interface User {
  id: string;
  name: string;
  email?: string | null;
  active?: boolean | null;
  raw: Record<string, unknown>;
}

export interface Project {
  id: string;
  name: string;
  status?: string | null;
  description?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  budgetValue?: number | null;
  budgetLabel?: string | null;
  managerName?: string | null;
  raw: Record<string, unknown>;
}

export interface Participant {
  id: string;
  projectId?: string | null;
  projectName?: string | null;
  userId?: string | null;
  userName?: string | null;
  role?: string | null;
  active?: boolean | null;
  raw: Record<string, unknown>;
}

export interface Activity {
  id: string;
  title: string;
  projectId?: string | null;
  projectName?: string | null;
  participantId?: string | null;
  participantName?: string | null;
  status?: string | null;
  priority?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  dueDate?: string | null;
  raw: Record<string, unknown>;
}

export interface Resource {
  id: string;
  name: string;
  projectId?: string | null;
  projectName?: string | null;
  type?: string | null;
  description?: string | null;
  quantity?: number | null;
  availabilityStatus?: string | null;
  raw: Record<string, unknown>;
}

export interface Cost {
  id: string;
  projectId?: string | null;
  projectName?: string | null;
  activityId?: string | null;
  activityName?: string | null;
  resourceId?: string | null;
  resourceName?: string | null;
  amount?: number | null;
  amountLabel?: string | null;
  type?: string | null;
  description?: string | null;
  incurredAt?: string | null;
  raw: Record<string, unknown>;
}

export interface Risk {
  id: string;
  title: string;
  projectId?: string | null;
  projectName?: string | null;
  impact?: string | null;
  probability?: string | null;
  responsePlan?: string | null;
  status?: string | null;
  raw: Record<string, unknown>;
}

export interface DashboardMetrics {
  totalProjects: number;
  totalParticipants: number;
  totalActivities: number;
  totalCosts: number;
  totalRisks: number;
  totalResources: number;
  totalCostAmount: number;
  activeProjects: number;
  delayedProjects: number;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  projects: Project[];
  participants: Participant[];
  activities: Activity[];
  resources: Resource[];
  costs: Cost[];
  risks: Risk[];
  errors: string[];
}
