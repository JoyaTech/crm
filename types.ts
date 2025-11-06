export interface User {
  id: string;
  name: string;
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
  OnHold = 'On Hold',
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
  expectedCloseDate: string;
  contactIds: string[];
  ownerId: string;
  priority: 'Low' | 'Medium' | 'High';
  healthScore?: number;
  probability: number; // 0-100
  createdAt: string;
  updatedAt: string;
}

export enum TaskStatus {
  ToDo = 'To Do',
  InProgress = 'In Progress',
  Done = 'Done',
}

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  status: TaskStatus;
  priority: 'Low' | 'Medium' | 'High';
  assigneeId: string;
  relatedType: 'Deal' | 'Contact';
  relatedId: string;
  createdAt: string;
  updatedAt: string;
}

// New types for Inbox feature
export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  service_interest: string;
  language: 'he' | 'en';
  status: 'new' | 'in_progress' | 'done';
}

export interface GoogleAction {
  calendar_event: 'yes' | 'no';
  sheet_log: 'yes' | 'no';
  create_doc_summary: 'yes' | 'no';
  share_drive_folder: 'yes' | 'no';
  notes: string;
}

export interface AnalysisResult {
  name: string;
  potential_score: 'high' | 'medium' | 'low';
  suggested_status: 'in_progress' | 'done';
  suggested_category: string;
  auto_reply: string;
  human_required: boolean;
  google_action: GoogleAction;
}
