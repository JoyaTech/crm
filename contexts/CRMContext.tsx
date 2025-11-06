import React, { createContext, useState, ReactNode, useMemo } from 'react';
import { Contact, Deal, Task, User, Inquiry, DealStage, TaskStatus } from '../types';
import { INQUIRIES } from '../constants';

// Mock Data
const mockUsers: User[] = [
  { id: 'user1', name: 'Alex Doe' },
  { id: 'user2', name: 'Jane Smith' },
];

const mockContacts: Contact[] = [
  { id: 'c1', firstName: 'John', lastName: 'Snow', fullName: 'John Snow', email: 'john.s@winter.com', phone: '123-456-7890', company: 'Night Watch', title: 'Lord Commander', source: 'Referral', status: 'Active', ownerId: 'user1', tags: ['VIP'], notes: 'Knows nothing.', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'c2', firstName: 'Daenerys', lastName: 'Targaryen', fullName: 'Daenerys Targaryen', email: 'dany.t@dragonstone.com', phone: '987-654-3210', company: 'Targaryen Restorations', title: 'Queen', source: 'Inbound', status: 'New', ownerId: 'user2', tags: ['High-Priority'], notes: 'Has dragons.', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const mockDeals: Deal[] = [
  { id: 'd1', name: 'Iron Throne', company: 'Westeros', amount: 1000000, currency: 'USD', stage: DealStage.Negotiation, expectedCloseDate: '2024-12-31', contactIds: ['c2'], ownerId: 'user2', priority: 'High', probability: 75, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'd2', name: 'The Wall Maintenance', company: 'Night Watch', amount: 50000, currency: 'USD', stage: DealStage.Proposal, expectedCloseDate: '2024-09-30', contactIds: ['c1'], ownerId: 'user1', priority: 'Medium', probability: 50, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'd3', name: 'Dragon Glass Supply', company: 'Dragonstone Mines', amount: 250000, currency: 'USD', stage: DealStage.ClosedWon, expectedCloseDate: '2024-06-01', contactIds: ['c2'], ownerId: 'user2', priority: 'High', probability: 100, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'd4', name: 'Fleet Expansion', company: 'Iron Bank', amount: 500000, currency: 'USD', stage: DealStage.Prospecting, expectedCloseDate: '2025-01-31', contactIds: [], ownerId: 'user1', priority: 'High', probability: 20, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
];

const mockTasks: Task[] = [
  { id: 't1', title: 'Follow up with Daenerys', dueDate: '2024-08-15', status: TaskStatus.ToDo, priority: 'High', assigneeId: 'user2', relatedType: 'Deal', relatedId: 'd1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 't2', title: 'Prepare proposal for The Wall', dueDate: '2024-08-10', status: TaskStatus.InProgress, priority: 'Medium', assigneeId: 'user1', relatedType: 'Deal', relatedId: 'd2', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 't3', title: 'Celebrate Dragon Glass deal', dueDate: '2024-08-20', status: TaskStatus.Done, priority: 'Low', assigneeId: 'user2', relatedType: 'Deal', relatedId: 'd3', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];


interface CRMContextType {
  users: User[];
  contacts: Contact[];
  deals: Deal[];
  tasks: Task[];
  inquiries: Inquiry[];
  updateInquiry: (updatedInquiry: Inquiry) => void;
}

export const CRMContext = createContext<CRMContextType | undefined>(undefined);

export const CRMProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users] = useState<User[]>(mockUsers);
  const [contacts] = useState<Contact[]>(mockContacts);
  const [deals] = useState<Deal[]>(mockDeals);
  const [tasks] = useState<Task[]>(mockTasks);
  const [inquiries, setInquiries] = useState<Inquiry[]>(INQUIRIES);

  const updateInquiry = (updatedInquiry: Inquiry) => {
    setInquiries(prev => prev.map(inq => inq.id === updatedInquiry.id ? updatedInquiry : inq));
  };
  
  const value = useMemo(() => ({
    users,
    contacts,
    deals,
    tasks,
    inquiries,
    updateInquiry,
  }), [users, contacts, deals, tasks, inquiries]);

  return (
    <CRMContext.Provider value={value}>
      {children}
    </CRMContext.Provider>
  );
};
