
import { User, Contact, Deal, Task, DealStage, TaskStatus, Activity } from './types';
import { v4 as uuidv4 } from 'uuid';

export const USERS: User[] = [
  { id: 'user-1', name: 'אבי כהן', email: 'avi@example.com', role: 'Manager', team: 'Sales A' },
  { id: 'user-2', name: 'יעל לוי', email: 'yael@example.com', role: 'Rep', team: 'Sales A' },
  { id: 'user-3', name: 'משה ישראל', email: 'moshe@example.com', role: 'Rep', team: 'Sales B' },
  { id: 'user-4', name: 'שרה שרון', email: 'sara@example.com', role: 'Admin', team: 'Management' },
];

export const CURRENT_USER_ID = 'user-2'; // Logged in as Yael Levi

const now = new Date();
const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result.toISOString();
};

export const CONTACTS: Contact[] = Array.from({ length: 25 }, (_, i) => {
  const firstName = ['דני', 'יוסי', 'גדי', 'מיכל', 'רות', 'דנה', 'אורן'][i % 7];
  const lastName = ['לוי', 'כהן', 'מזרחי', 'פרץ', 'ביטון', 'דהן', 'פרידמן'][i % 7];
  return {
    id: `contact-${i + 1}`,
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    email: `contact${i+1}@company${i % 5}.com`,
    phone: `+972-52-12345${i < 10 ? '0' : ''}${i}`,
    company: `חברה ${String.fromCharCode(65 + (i % 5))}`,
    title: ['מנכ"ל', 'סמנכ"ל שיווק', 'מנהל פיתוח', 'מנהל מוצר'][i % 4],
    source: (['Inbound', 'Outbound', 'Referral', 'Ad'] as const)[i % 4],
    status: (['New', 'Active', 'Inactive'] as const)[i % 3],
    ownerId: USERS[i % 3].id,
    tags: [['VIP', 'Qualified'][i%2]],
    notes: 'פתק חשוב לגבי איש קשר זה.',
    createdAt: addDays(now, -30-i),
    updatedAt: addDays(now, -i),
    lastActivityAt: addDays(now, -(i%5)),
  };
});

export const DEALS: Deal[] = Array.from({ length: 18 }, (_, i) => ({
  id: `deal-${i + 1}`,
  name: `דיל עם חברה ${String.fromCharCode(65 + (i % 5))}`,
  company: `חברה ${String.fromCharCode(65 + (i % 5))}`,
  contactIds: [`contact-${i + 1}`],
  amount: (i + 1) * 5000,
  currency: 'ILS',
  probability: [10, 20, 40, 60, 80, 100, 0, 5][i % 8],
  expectedCloseDate: addDays(now, 30 + i * 5),
  stage: Object.values(DealStage)[i % 8],
  pipeline: 'Default Sales',
  source: (['Inbound', 'Outbound', 'Referral', 'Ad'] as const)[i % 4],
  ownerId: USERS[i % 3].id,
  lastActivityAt: addDays(now, -i),
  nextAction: 'שיחת מעקב',
  priority: (['Low', 'Medium', 'High'] as const)[i % 3],
  attachments: [],
  createdAt: addDays(now, -20 - i),
  updatedAt: addDays(now, -i),
}));

export const TASKS: Task[] = Array.from({ length: 40 }, (_, i) => ({
    id: `task-${i + 1}`,
    title: `משימה ${i + 1} עבור דיל ${i%18+1}`,
    description: 'תיאור משימה.',
    relatedType: 'Deal',
    relatedId: `deal-${i%18+1}`,
    assigneeId: USERS[i % 3].id,
    dueDate: addDays(now, i - 10), // Some will be overdue
    status: Object.values(TaskStatus)[i % 4],
    priority: (['Low', 'Medium', 'High'] as const)[i % 3],
    createdAt: addDays(now, -15 - i),
    updatedAt: addDays(now, -i),
}));

export const ACTIVITIES: Activity[] = Array.from({ length: 50 }, (_, i) => ({
    id: `activity-${i + 1}`,
    relatedType: i % 2 === 0 ? 'Deal' : 'Contact',
    relatedId: i % 2 === 0 ? `deal-${(i/2)%18+1}` : `contact-${(i/2)%25+1}`,
    type: (['call', 'email', 'meeting', 'note'] as const)[i % 4],
    summary: `סיכום פעילות ${i + 1}`,
    body: 'גוף הפעילות עם פרטים נוספים.',
    direction: (['inbound', 'outbound'] as const)[i % 2],
    timestamp: addDays(now, -i),
    ownerId: USERS[i % 3].id,
}));
