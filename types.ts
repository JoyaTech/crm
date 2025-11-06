export type User = {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Rep' | 'Viewer';
  team: string;
};

export type Contact = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  website?: string;
  title: string;
  source: 'Inbound' | 'Outbound' | 'Referral' | 'Ad' | 'Other';
  status: 'New' | 'Active' | 'Inactive';
  ownerId: string;
  tags: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
  lastActivityAt?: string;
};

export enum DealStage {
  NewLead = 'ליד חדש',
  Qualified = 'בחינה',
  Discovery = 'גילוי',
  ProposalSent = 'הצעה נשלחה',
  Negotiation = 'משא ומתן',
  ClosedWon = 'נסגר בהצלחה',
  ClosedLost = 'נסגר בהפסד',
  OnHold = 'בהקפאה',
}

export const DealStageOrder = [
  DealStage.NewLead,
  DealStage.Qualified,
  DealStage.Discovery,
  DealStage.ProposalSent,
  DealStage.Negotiation,
  DealStage.ClosedWon,
  DealStage.ClosedLost,
  DealStage.OnHold,
];


export type Deal = {
  id: string;
  name: string;
  company: string;
  contactIds: string[];
  amount: number;
  currency: 'ILS' | 'USD' | 'EUR';
  probability: number;
  expectedCloseDate: string;
  stage: DealStage;
  pipeline: string;
  source: 'Inbound' | 'Outbound' | 'Referral' | 'Ad' | 'Other';
  ownerId: string;
  lastActivityAt: string;
  nextAction: string;
  priority: 'Low' | 'Medium' | 'High';
  attachments: { name: string; url: string }[];
  createdAt: string;
  updatedAt: string;
  healthScore?: number;
};

export enum TaskStatus {
  Open = 'פתוח',
  InProgress = 'בתהליך',
  Waiting = 'ממתין',
  Done = 'הושלם',
}

export type Task = {
  id: string;
  title: string;
  description: string;
  relatedType: 'Deal' | 'Contact';
  relatedId: string;
  assigneeId: string;
  dueDate: string;
  status: TaskStatus;
  priority: 'Low' | 'Medium' | 'High';
  createdAt: string;
  updatedAt: string;
};

export type Activity = {
  id: string;
  relatedType: 'Deal' | 'Contact';
  relatedId: string;
  type: 'call' | 'email' | 'meeting' | 'note';
  summary: string;
  body: string;
  direction: 'inbound' | 'outbound';
  timestamp: string;
  ownerId: string;
};

export type View = 'Contacts' | 'Deals' | 'Tasks' | 'Pipeline' | 'Reports' | 'Settings';