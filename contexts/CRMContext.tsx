
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Contact, Deal, Task, DealStage, TaskStatus, Inquiry } from '../types';
import { INQUIRIES } from '../constants';

// Mock Data
const users: User[] = [
  { id: 'user1', name: 'Alex Young' },
  { id: 'user2', name: 'Sam Rivera' },
];

const contacts: Contact[] = [
  { id: 'c1', firstName: 'John', lastName: 'Doe', fullName: 'John Doe', email: 'john.d@example.com', phone: '123-456-7890', company: 'Innovate Inc.', title: 'CEO', source: 'Referral', status: 'Active', ownerId: 'user1', tags: ['vip'], notes: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'c2', firstName: 'Jane', lastName: 'Smith', fullName: 'Jane Smith', email: 'jane.s@example.com', phone: '098-765-4321', company: 'Tech Solutions', title: 'CTO', source: 'Inbound', status: 'Active', ownerId: 'user2', tags: [], notes: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const deals: Deal[] = [
  { id: 'd1', name: 'Innovate Inc. Website Redesign', company: 'Innovate Inc.', amount: 25000, currency: 'USD', stage: DealStage.Proposal, expectedCloseDate: '2024-08-15T00:00:00.000Z', contactIds: ['c1'], ownerId: 'user1', priority: 'High', probability: 75, healthScore: 85, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'd2', name: 'Tech Solutions Mobile App', company: 'Tech Solutions', amount: 40000, currency: 'USD', stage: DealStage.Qualification, expectedCloseDate: '2024-09-01T00:00:00.000Z', contactIds: ['c2'], ownerId: 'user2', priority: 'High', probability: 40, healthScore: 60, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'd3', name: 'Marketing Campaign SEO', company: 'Innovate Inc.', amount: 10000, currency: 'USD', stage: DealStage.NeedsAnalysis, expectedCloseDate: '2024-07-30T00:00:00.000Z', contactIds: ['c1'], ownerId: 'user1', priority: 'Medium', probability: 60, healthScore: 95, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'd4', name: 'E-commerce Platform', company: 'Retail Giant', amount: 75000, currency: 'USD', stage: DealStage.Prospecting, expectedCloseDate: '2024-10-01T00:00:00.000Z', contactIds: [], ownerId: 'user1', priority: 'High', probability: 20, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'd5', name: 'Internal CRM System', company: 'Corp Enterprises', amount: 120000, currency: 'USD', stage: DealStage.ClosedWon, expectedCloseDate: '2024-06-20T00:00:00.000Z', contactIds: [], ownerId: 'user2', priority: 'Medium', probability: 100, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const tasks: Task[] = [
    { id: 't1', title: 'Follow up with John Doe', dueDate: '2024-07-25T00:00:00.000Z', status: TaskStatus.ToDo, priority: 'High', assigneeId: 'user1', relatedType: 'Deal', relatedId: 'd1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 't2', title: 'Prepare proposal for Tech Solutions', dueDate: '2024-07-28T00:00:00.000Z', status: TaskStatus.InProgress, priority: 'High', assigneeId: 'user2', relatedType: 'Deal', relatedId: 'd2', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

interface CRMContextType {
  users: User[];
  contacts: Contact[];
  deals: Deal[];
  tasks: Task[];
  inquiries: Inquiry[];
  updateDealStage: (dealId: string, newStage: DealStage) => void;
  updateInquiryStatus: (inquiryId: string, newStatus: 'new' | 'in_progress' | 'done') => void;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export const CRMProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [dealState, setDealState] = useState<Deal[]>(deals);
  const [inquiryState, setInquiryState] = useState<Inquiry[]>(INQUIRIES);

  const updateDealStage = (dealId: string, newStage: DealStage) => {
    setDealState(prevDeals =>
      prevDeals.map(deal =>
        deal.id === dealId ? { ...deal, stage: newStage } : deal
      )
    );
  };

  const updateInquiryStatus = (inquiryId: string, newStatus: 'new' | 'in_progress' | 'done') => {
    setInquiryState(prevInquiries =>
        prevInquiries.map(inquiry =>
            inquiry.id === inquiryId ? { ...inquiry, status: newStatus } : inquiry
        )
    );
  };

  const value = {
    users,
    contacts,
    deals: dealState,
    tasks,
    inquiries: inquiryState,
    updateDealStage,
    updateInquiryStatus,
  };

  return <CRMContext.Provider value={value}>{children}</CRMContext.Provider>;
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (context === undefined) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
};
