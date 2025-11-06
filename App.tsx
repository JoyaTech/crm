import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Contact, Deal, Task, User, DealStage, TaskStatus, Inquiry, AnalysisResult } from './types';
import { INQUIRIES } from './constants';
import DealsView from './components/DealsView';
import ContactsView from './components/ContactsView';
import TasksView from './components/TasksView';
import ReportsView from './components/ReportsView';
import SettingsView from './components/SettingsView';
import ContactModal from './components/ContactModal';
import InboxView from './components/InboxView';
import AnalysisModal from './components/AnalysisModal';
import {
  BriefcaseIcon,
  UsersIcon,
  CheckSquareIcon,
  ChartBarIcon,
  SettingsIcon,
  InboxIcon,
} from './components/Icons';

// Mock Data
const users: User[] = [
  { id: 'u1', name: 'Alice' },
  { id: 'u2', name: 'Bob' },
];

const initialContacts: Contact[] = [
  { id: 'c1', firstName: 'John', lastName: 'Doe', fullName: 'John Doe', email: 'john.d@example.com', phone: '123-456-7890', company: 'Acme Inc.', title: 'CEO', source: 'Inbound', status: 'Active', ownerId: 'u1', tags: [], notes: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'c2', firstName: 'Jane', lastName: 'Smith', fullName: 'Jane Smith', email: 'jane.s@example.com', phone: '098-765-4321', company: 'Globex Corp.', title: 'CTO', source: 'Referral', status: 'New', ownerId: 'u2', tags: [], notes: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const initialDeals: Deal[] = [
  { id: 'd1', name: 'Acme Website Redesign', company: 'Acme Inc.', amount: 50000, currency: 'USD', stage: DealStage.Proposal, expectedCloseDate: new Date(Date.now() + 10 * 24 * 3600 * 1000).toISOString(), contactIds: ['c1'], ownerId: 'u1', priority: 'High', healthScore: 90, probability: 75, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'd2', name: 'Globex Security Audit', company: 'Globex Corp.', amount: 75000, currency: 'USD', stage: DealStage.Qualification, expectedCloseDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(), contactIds: ['c2'], ownerId: 'u2', priority: 'Medium', healthScore: 60, probability: 20, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'd3', name: 'Won Deal Example', company: 'Example LLC', amount: 25000, currency: 'USD', stage: DealStage.ClosedWon, expectedCloseDate: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(), contactIds: [], ownerId: 'u1', priority: 'High', probability: 100, createdAt: new Date().toISOString(), updatedAt: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString() },
];

const initialTasks: Task[] = [
    { id: 't1', title: 'Send proposal to John', dueDate: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString(), status: TaskStatus.ToDo, priority: 'High', assigneeId: 'u1', relatedType: 'Deal', relatedId: 'd1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 't2', title: 'Follow up with Jane', dueDate: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(), status: TaskStatus.ToDo, priority: 'Medium', assigneeId: 'u2', relatedType: 'Contact', relatedId: 'c2', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];


type View = 'pipeline' | 'deals' | 'contacts' | 'tasks' | 'reports' | 'settings' | 'inbox';

function App() {
  const [activeView, setActiveView] = useState<View>('pipeline');
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [inquiries, setInquiries] = useState<Inquiry[]>(INQUIRIES);
  
  const [isContactModalOpen, setContactModalOpen] = useState(false);
  const [contactToEdit, setContactToEdit] = useState<Contact | null>(null);

  const [isAnalysisModalOpen, setAnalysisModalOpen] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  const currentUserId = 'u1'; // Assume current user is Alice

  const handleDealStageChange = (dealId: string, newStage: DealStage) => {
    setDeals(deals.map(d => d.id === dealId ? { ...d, stage: newStage, updatedAt: new Date().toISOString() } : d));
  };
  
  const handleOpenNewContactModal = () => {
    setContactToEdit(null);
    setContactModalOpen(true);
  };

  const handleOpenEditContactModal = (contact: Contact) => {
    setContactToEdit(contact);
    setContactModalOpen(true);
  };

  const handleSaveContact = (contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'fullName'> & { id?: string }) => {
    const existing = contacts.find(c => c.email.toLowerCase() === contactData.email.toLowerCase() && c.id !== contactData.id);
    if (existing) {
        return { success: false, error: 'אימייל כבר קיים במערכת', existingContact: existing };
    }
    
    if (contactData.id) { // Edit
        setContacts(contacts.map(c => c.id === contactData.id ? { ...c, ...contactData, fullName: `${contactData.firstName} ${contactData.lastName}`, updatedAt: new Date().toISOString() } : c));
    } else { // Create
        const newContact: Contact = {
            id: `c${Date.now()}`,
            ...contactData,
            fullName: `${contactData.firstName} ${contactData.lastName}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setContacts([...contacts, newContact]);
    }
    setContactModalOpen(false);
    return { success: true };
  };

  const handleAnalyzeInquiry = async (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setAnalysisModalOpen(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const systemInstruction = `You are a smart CRM assistant connected to the user's Google Workspace. Your goal is to analyze customer inquiries, identify business opportunities, and suggest concrete actions within Google's tools. Analyze the inquiry and provide a structured JSON response.`;
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `${systemInstruction}\nAnalyze this inquiry: ${JSON.stringify(inquiry)}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              potential_score: { type: Type.STRING, enum: ['high', 'medium', 'low'] },
              suggested_status: { type: Type.STRING, enum: ['in_progress', 'done'] },
              suggested_category: { type: Type.STRING },
              auto_reply: { type: Type.STRING },
              human_required: { type: Type.BOOLEAN },
              google_action: {
                type: Type.OBJECT,
                properties: {
                  calendar_event: { type: Type.STRING, enum: ['yes', 'no'] },
                  sheet_log: { type: Type.STRING, enum: ['yes', 'no'] },
                  create_doc_summary: { type: Type.STRING, enum: ['yes', 'no'] },
                  share_drive_folder: { type: Type.STRING, enum: ['yes', 'no'] },
                  notes: { type: Type.STRING, description: 'Explain the reasoning for the suggested action.' },
                },
              },
            },
          },
        },
      });
      const resultText = response.text.trim();
      const resultJson = JSON.parse(resultText);
      setAnalysisResult(resultJson);
    } catch (error) {
      console.error("Error analyzing inquiry:", error);
       // You could set an error state here to show in the modal
    } finally {
        setIsAnalyzing(false);
    }
  };


  const navItems = [
    { id: 'pipeline', label: 'Pipeline', icon: BriefcaseIcon, view: 'pipeline' },
    { id: 'deals', label: 'כל הדילים', icon: BriefcaseIcon, view: 'deals' },
    { id: 'contacts', label: 'אנשי קשר', icon: UsersIcon, view: 'contacts' },
    { id: 'tasks', label: 'משימות', icon: CheckSquareIcon, view: 'tasks' },
    { id: 'inbox', label: 'תיבת פניות', icon: InboxIcon, view: 'inbox' },
    { id: 'reports', label: 'דוחות', icon: ChartBarIcon, view: 'reports' },
    { id: 'settings', label: 'הגדרות', icon: SettingsIcon, view: 'settings' },
  ];

  return (
    <div className="flex h-screen bg-slate-900 text-slate-300" dir="rtl">
      <nav className="w-64 bg-slate-800 border-l border-slate-700 p-4 flex flex-col">
        <div className="text-2xl font-bold text-white mb-8">Zenith CRM</div>
        <ul className="space-y-2">
            {navItems.map(item => (
                <li key={item.id}>
                    <button
                        onClick={() => setActiveView(item.view as View)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            activeView === item.view ? 'bg-sky-600 text-white' : 'hover:bg-slate-700'
                        }`}
                    >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                    </button>
                </li>
            ))}
        </ul>
      </nav>
      <main className="flex-1 overflow-hidden">
        {activeView === 'pipeline' && <DealsView deals={deals} contacts={contacts} users={users} onDealStageChange={handleDealStageChange} showPipelineView={true} />}
        {activeView === 'deals' && <DealsView deals={deals} contacts={contacts} users={users} onDealStageChange={handleDealStageChange} showPipelineView={false} />}
        {activeView === 'contacts' && <ContactsView contacts={contacts} users={users} onAddNew={handleOpenNewContactModal} onEdit={handleOpenEditContactModal} />}
        {activeView === 'tasks' && <TasksView tasks={tasks} users={users} deals={deals} contacts={contacts} />}
        {activeView === 'inbox' && <InboxView inquiries={inquiries} onAnalyze={handleAnalyzeInquiry} />}
        {activeView === 'reports' && <ReportsView deals={deals} />}
        {activeView === 'settings' && <SettingsView />}
      </main>
      
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setContactModalOpen(false)}
        onSave={handleSaveContact}
        contactToEdit={contactToEdit}
        users={users}
        currentUserId={currentUserId}
      />

      <AnalysisModal
        isOpen={isAnalysisModalOpen}
        onClose={() => setAnalysisModalOpen(false)}
        result={analysisResult}
        inquiry={selectedInquiry}
        isLoading={isAnalyzing}
      />
    </div>
  );
}

export default App;
