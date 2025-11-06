
import React, { useState, useCallback } from 'react';
import { BriefcaseIcon, UsersIcon, CheckSquareIcon, ChartBarIcon, SettingsIcon, InboxIcon, DollarSignIcon } from './components/Icons';
import DealsView from './components/DealsView';
import ContactsView from './components/ContactsView';
import TasksView from './components/TasksView';
import ReportsView from './components/ReportsView';
import SettingsView from './components/SettingsView';
import InboxView from './components/InboxView';
import ContactModal from './components/ContactModal';
import AnalysisModal from './components/AnalysisModal';
import { Contact, Deal, DealStage, Task, User, Inquiry, AnalysisResult, TaskStatus } from './types';
import { INQUIRIES } from './constants';
// Fix: Use correct import for GoogleGenAI and Type as per guidelines
import { GoogleGenAI, Type } from "@google/genai";

// Mock Data
const USERS: User[] = [
  { id: 'user1', name: 'אלי כהן' },
  { id: 'user2', name: 'גדי לוי' },
];

const CONTACTS_DATA: Contact[] = [
  { id: 'c1', firstName: 'יוסי', lastName: 'לוי', fullName: 'יוסי לוי', email: 'yossi@israel.co.il', phone: '050-1111111', company: 'ישראטק בע"מ', title: 'מנכ"ל', source: 'Referral', status: 'Active', ownerId: 'user1', tags: ['vip'], notes: 'פנה דרך המלצה של אבי.', createdAt: '2023-01-10T10:00:00Z', updatedAt: '2023-01-15T12:30:00Z' },
  { id: 'c2', firstName: 'שרה', lastName: 'כץ', fullName: 'שרה כץ', email: 'sara@katz.com', phone: '052-2222222', company: 'כץ פתרונות', title: 'סמנכ"ל שיווק', source: 'Inbound', status: 'New', ownerId: 'user2', tags: [], notes: 'השאירה פרטים באתר.', createdAt: '2023-02-05T14:00:00Z', updatedAt: '2023-02-05T14:00:00Z' },
  { id: 'c3', firstName: 'משה', lastName: 'אברהם', fullName: 'משה אברהם', email: 'moshe@ab.co', phone: '054-3333333', company: 'אברהם ובניו', title: 'מנהל פיתוח', source: 'Outbound', status: 'Inactive', ownerId: 'user1', tags: [], notes: '', createdAt: '2022-12-20T09:00:00Z', updatedAt: '2023-01-25T11:00:00Z' },
];

const DEALS_DATA: Deal[] = [
  { id: 'd1', name: 'פרויקט CRM חדש', company: 'ישראטק בע"מ', amount: 150000, currency: 'ILS', stage: DealStage.Proposal, expectedCloseDate: '2024-08-30', contactIds: ['c1'], ownerId: 'user1', priority: 'High', healthScore: 85, probability: 70, createdAt: '2023-02-01T11:00:00Z', updatedAt: '2023-02-20T16:00:00Z' },
  { id: 'd2', name: 'קמפיין שיווקי Q3', company: 'כץ פתרונות', amount: 75000, currency: 'ILS', stage: DealStage.NeedsAnalysis, expectedCloseDate: '2024-07-20', contactIds: ['c2'], ownerId: 'user2', priority: 'Medium', healthScore: 60, probability: 40, createdAt: '2023-02-10T09:30:00Z', updatedAt: '2023-02-18T10:00:00Z' },
  { id: 'd3', name: 'שדרוג מערכת קיימת', company: 'אברהם ובניו', amount: 200000, currency: 'ILS', stage: DealStage.ClosedLost, expectedCloseDate: '2024-06-15', contactIds: ['c3'], ownerId: 'user1', priority: 'High', probability: 0, createdAt: '2023-01-15T15:00:00Z', updatedAt: '2023-02-15T12:00:00Z' },
  { id: 'd4', name: 'רישיונות תוכנה', company: 'ישראטק בע"מ', amount: 50000, currency: 'ILS', stage: DealStage.ClosedWon, expectedCloseDate: '2024-05-10', contactIds: ['c1'], ownerId: 'user1', priority: 'Medium', probability: 100, createdAt: '2023-01-20T10:00:00Z', updatedAt: '2023-02-10T11:00:00Z' },
  { id: 'd5', name: 'חוזה תחזוקה שנתי', company: 'כץ פתרונות', amount: 30000, currency: 'ILS', stage: DealStage.Prospecting, expectedCloseDate: '2024-09-01', contactIds: ['c2'], ownerId: 'user2', priority: 'Low', healthScore: 95, probability: 10, createdAt: '2023-02-22T13:00:00Z', updatedAt: '2023-02-22T13:00:00Z' },
];

const TASKS_DATA: Task[] = [
  { id: 't1', title: 'הכנת הצעת מחיר לישראטק', dueDate: '2024-07-15', status: TaskStatus.InProgress, priority: 'High', assigneeId: 'user1', relatedType: 'Deal', relatedId: 'd1', createdAt: '2023-02-20T17:00:00Z', updatedAt: '2023-02-21T09:00:00Z' },
  { id: 't2', title: 'פגישת אפיון עם שרה כץ', dueDate: '2024-07-10', status: TaskStatus.ToDo, priority: 'Medium', assigneeId: 'user2', relatedType: 'Deal', relatedId: 'd2', createdAt: '2023-02-18T11:00:00Z', updatedAt: '2023-02-18T11:00:00Z' },
  { id: 't3', title: 'Follow-up ליוסי לוי', dueDate: '2024-06-25', status: TaskStatus.Done, priority: 'Low', assigneeId: 'user1', relatedType: 'Contact', relatedId: 'c1', createdAt: '2023-02-15T10:00:00Z', updatedAt: '2023-02-16T14:00:00Z' },
  { id: 't4', title: 'בדיקת אינטגרציה למערכת', dueDate: '2024-06-30', status: TaskStatus.ToDo, priority: 'High', assigneeId: 'user1', relatedType: 'Deal', relatedId: 'd1', createdAt: '2023-02-22T10:00:00Z', updatedAt: '2023-02-22T10:00:00Z' },
];

type View = 'Pipeline' | 'AllDeals' | 'Contacts' | 'Tasks' | 'Reports' | 'Settings' | 'Inbox';

const App: React.FC = () => {
    const [view, setView] = useState<View>('Pipeline');
    const [deals, setDeals] = useState<Deal[]>(DEALS_DATA);
    const [contacts, setContacts] = useState<Contact[]>(CONTACTS_DATA);
    const [tasks, setTasks] = useState<Task[]>(TASKS_DATA);
    const [inquiries] = useState<Inquiry[]>(INQUIRIES);
    
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [contactToEdit, setContactToEdit] = useState<Contact | null>(null);
    
    const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleDealStageChange = useCallback((dealId: string, newStage: DealStage) => {
        setDeals(prevDeals => prevDeals.map(deal => 
            deal.id === dealId ? { ...deal, stage: newStage, updatedAt: new Date().toISOString() } : deal
        ));
    }, []);

    const handleOpenContactModal = (contact: Contact | null) => {
        setContactToEdit(contact);
        setIsContactModalOpen(true);
    };

    const handleSaveContact = useCallback((contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'fullName'> & { id?: string }) => {
        if (!contactData.id) { // New contact
            const existing = contacts.find(c => c.email.toLowerCase() === contactData.email.toLowerCase());
            if (existing) {
                return { success: false, error: 'אימייל כבר קיים במערכת', existingContact: existing };
            }
            const newContact: Contact = {
                ...contactData,
                id: `c${Date.now()}`,
                fullName: `${contactData.firstName} ${contactData.lastName}`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            setContacts(prev => [newContact, ...prev]);
        } else { // Editing contact
            setContacts(prev => prev.map(c => 
                c.id === contactData.id 
                ? { ...c, ...contactData, fullName: `${contactData.firstName} ${contactData.lastName}`, updatedAt: new Date().toISOString() } 
                : c
            ));
        }
        setIsContactModalOpen(false);
        return { success: true };
    }, [contacts]);
    
    // Fix: Implement Gemini API call for inquiry analysis
    const handleAnalyzeInquiry = async (inquiry: Inquiry) => {
        setSelectedInquiry(inquiry);
        setIsAnalysisModalOpen(true);
        setIsAnalyzing(true);
        setAnalysisResult(null);

        const analysisSchema = {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING },
                potential_score: { type: Type.STRING },
                suggested_status: { type: Type.STRING },
                suggested_category: { type: Type.STRING },
                auto_reply: { type: Type.STRING },
                human_required: { type: Type.BOOLEAN },
                google_action: {
                    type: Type.OBJECT,
                    properties: {
                        calendar_event: { type: Type.STRING },
                        sheet_log: { type: Type.STRING },
                        create_doc_summary: { type: Type.STRING },
                        share_drive_folder: { type: Type.STRING },
                        notes: { type: Type.STRING }
                    },
                    required: ['calendar_event', 'sheet_log', 'create_doc_summary', 'share_drive_folder', 'notes']
                }
            },
            required: ['name', 'potential_score', 'suggested_status', 'suggested_category', 'auto_reply', 'human_required', 'google_action']
        };

        const prompt = `
You are an intelligent assistant for a CRM system. Analyze the following inquiry from a potential customer and provide a structured analysis in JSON format.
The output MUST strictly follow the provided JSON schema.

Inquiry Details:
Name: ${inquiry.name}
Email: ${inquiry.email}
Phone: ${inquiry.phone || 'N/A'}
Subject: ${inquiry.subject}
Message: ${inquiry.message}
Service of Interest: ${inquiry.service_interest}
Language: ${inquiry.language}

Based on the inquiry, provide the following analysis:
1.  **name**: The full name of the person who made the inquiry.
2.  **potential_score**: Assess the business potential. Must be one of: 'high', 'medium', 'low'. High potential would be a new project, a clear business need. Low potential might be a support request for a non-customer or spam.
3.  **suggested_status**: What should be the next status for this inquiry? Must be one of: 'in_progress' or 'done'. 'in_progress' if it requires action, 'done' if it's a simple query that can be closed.
4.  **suggested_category**: Categorize the inquiry (e.g., 'New Business Lead', 'Support Request', 'Collaboration Proposal', 'Job Application', 'Spam').
5.  **auto_reply**: Write a polite and professional reply in the same language as the inquiry (${inquiry.language === 'he' ? 'Hebrew' : 'English'}). The reply should acknowledge their message and state the next steps.
6.  **human_required**: Does this inquiry require a human to follow up? (true/false).
7.  **google_action**: Based on the inquiry, suggest actions to be taken in Google Workspace. All values must be 'yes' or 'no'.
    -   **calendar_event**: Suggest 'yes' if the inquiry mentions scheduling a meeting or call.
    -   **sheet_log**: Always suggest 'yes' for new business leads to log them.
    -   **create_doc_summary**: Suggest 'yes' if the inquiry is detailed and describes a new project.
    -   **share_drive_folder**: Suggest 'yes' if they mention sending documents or starting a project.
    -   **notes**: A brief summary of the suggested actions for an internal team member.
`;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.REACT_APP_API_KEY! });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: analysisSchema
                }
            });
            const resultText = response.text.trim();
            const resultJson = JSON.parse(resultText) as AnalysisResult;
            setAnalysisResult(resultJson);
        } catch (e) {
            console.error("Error analyzing inquiry:", e);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const NavItem: React.FC<{ icon: React.FC<any>, label: string, isActive: boolean, onClick: () => void }> = ({ icon: Icon, label, isActive, onClick }) => (
        <button onClick={onClick} className={`w-full flex items-center space-x-3 space-x-reverse text-right px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-sky-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}>
            <Icon className="w-6 h-6" />
            <span className="font-semibold">{label}</span>
        </button>
    );

    const renderView = () => {
        switch (view) {
            case 'Pipeline': return <DealsView deals={deals} contacts={contacts} users={USERS} onDealStageChange={handleDealStageChange} showPipelineView={true} />;
            case 'AllDeals': return <DealsView deals={deals} contacts={contacts} users={USERS} onDealStageChange={handleDealStageChange} showPipelineView={false} />;
            case 'Contacts': return <ContactsView contacts={contacts} users={USERS} onAddNew={() => handleOpenContactModal(null)} onEdit={handleOpenContactModal} />;
            case 'Tasks': return <TasksView tasks={tasks} users={USERS} deals={deals} contacts={contacts}/>;
            case 'Reports': return <ReportsView deals={deals} />;
            case 'Settings': return <SettingsView />;
            case 'Inbox': return <InboxView inquiries={inquiries} onAnalyze={handleAnalyzeInquiry} />;
            default: return null;
        }
    };

    return (
        <div className="bg-slate-900 text-slate-300 flex h-screen font-sans" dir="rtl">
            <nav className="w-64 bg-slate-800 p-4 border-l border-slate-700 flex flex-col space-y-2">
                <div className="flex items-center space-x-2 space-x-reverse px-2 py-4 mb-4">
                    <DollarSignIcon className="w-8 h-8 text-sky-400" />
                    <h1 className="text-2xl font-bold text-white">CRM Pro</h1>
                </div>
                <NavItem icon={BriefcaseIcon} label="Pipeline" isActive={view === 'Pipeline'} onClick={() => setView('Pipeline')} />
                <NavItem icon={BriefcaseIcon} label="כל הדילים" isActive={view === 'AllDeals'} onClick={() => setView('AllDeals')} />
                <NavItem icon={UsersIcon} label="אנשי קשר" isActive={view === 'Contacts'} onClick={() => setView('Contacts')} />
                <NavItem icon={CheckSquareIcon} label="משימות" isActive={view === 'Tasks'} onClick={() => setView('Tasks')} />
                <NavItem icon={InboxIcon} label="תיבת פניות" isActive={view === 'Inbox'} onClick={() => setView('Inbox')} />
                <NavItem icon={ChartBarIcon} label="דוחות" isActive={view === 'Reports'} onClick={() => setView('Reports')} />
                <NavItem icon={SettingsIcon} label="הגדרות" isActive={view === 'Settings'} onClick={() => setView('Settings')} />
            </nav>
            <main className="flex-1 overflow-y-auto">
                {renderView()}
            </main>
            <ContactModal 
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
                onSave={handleSaveContact}
                contactToEdit={contactToEdit}
                users={USERS}
                currentUserId="user1"
            />
             <AnalysisModal 
                isOpen={isAnalysisModalOpen}
                onClose={() => setIsAnalysisModalOpen(false)}
                inquiry={selectedInquiry}
                analysisResult={analysisResult}
                isLoading={isAnalyzing}
            />
        </div>
    );
};

export default App;
