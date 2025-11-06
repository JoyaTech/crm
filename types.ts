
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  source: 'Inbound' | 'Outbound' | 'Referral';
  status: 'New' | 'Active' | 'Inactive';
  ownerId: string;
  tags: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export enum DealStage {
  Prospecting = 'Prospecting',
  Qualification = 'Qualification',
  NeedsAnalysis = 'Needs Analysis',
  Proposal = 'Proposal',
  Negotiation = 'Negotiation',
  ClosedWon = 'Closed - Won',
  ClosedLost = 'Closed - Lost',
  OnHold = 'On Hold'
}

export const DealStageOrder: DealStage[] = [
  DealStage.Prospecting,
  DealStage.Qualification,
  DealStage.NeedsAnalysis,
  DealStage.Proposal,
  DealStage.Negotiation,
  DealStage.ClosedWon,
  DealStage.ClosedLost,
  DealStage.OnHold,
];

export interface Deal {
  id: string;
  name: string;
  company: string;
  amount: number;
  currency: string;
  stage: DealStage;
  probability: number;
  expectedCloseDate: string;
  ownerId: string;
  contactIds: string[];
  priority: 'Low' | 'Medium' | 'High';
  healthScore?: number;
  createdAt: string;
  updatedAt: string;
}

export enum TaskStatus {
  ToDo = 'To Do',
  InProgress = 'In Progress',
  Done = 'Done',
  Archived = 'Archived',
}

export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;
  relatedType: 'Deal' | 'Contact';
  relatedId: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type View = 'pipeline' | 'deals' | 'tasks' | 'contacts' | 'reports' | 'inbox' | 'settings';
