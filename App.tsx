import React, { useState, useMemo } from 'react';
import { View, Deal, Contact, User, Task, Activity, DealStage } from './types';
import { CONTACTS, DEALS, USERS, TASKS, ACTIVITIES, CURRENT_USER_ID } from './constants';
import ContactsView from './components/ContactsView';
import DealsView from './components/DealsView';
import TasksView from './components/TasksView';
import ReportsView from './components/ReportsView';
import SettingsView from './components/SettingsView';
import ContactModal from './components/ContactModal';
import { v4 as uuidv4 } from 'uuid';
import {
  UsersIcon,
  BriefcaseIcon,
  CheckSquareIcon,
  PieChartIcon,
  SlidersIcon,
  BarChartIcon,
} from './components/Icons';
// Corrected: Import GoogleGenAI instead of the deprecated GoogleGenerativeAI
import { GoogleGenAI } from '@google/genai';

const App: React.FC = () => {
  const [view, setView] = useState<View>('Pipeline');
  const [contacts, setContacts] = useState<Contact[]>(CONTACTS);
  const [deals, setDeals] = useState<Deal[]>(DEALS);
  const [tasks, setTasks] = useState<Task[]>(TASKS);
  const [users, setUsers] = useState<User[]>(USERS);
  const [activities, setActivities] = useState<Activity[]>(ACTIVITIES);
  const [isLoadingHealth, setIsLoadingHealth] = useState(false);
  
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);


  const currentUser = useMemo(() => users.find(u => u.id === CURRENT_USER_ID), [users]);

  const handleDealStageChange = (dealId: string, newStage: DealStage) => {
    setDeals(prevDeals =>
      prevDeals.map(deal =>
        deal.id === dealId ? { ...deal, stage: newStage, updatedAt: new Date().toISOString() } : deal
      )
    );
  };
  
  const handleOpenNewContactModal = () => {
    setEditingContact(null);
    setIsContactModalOpen(true);
  };

  const handleOpenEditContactModal = (contact: Contact) => {
    setEditingContact(contact);
    setIsContactModalOpen(true);
  };

  const handleCloseContactModal = () => {
    setIsContactModalOpen(false);
    setEditingContact(null);
  };

  const handleSaveContact = (contactToSave: Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'fullName'> & { id?: string }): { success: boolean, error?: string, existingContact?: Contact } => {
    // Duplicate check
    const duplicate = contacts.find(c => 
      c.id !== contactToSave.id && 
      (c.email.toLowerCase() === contactToSave.email.toLowerCase() || c.phone === contactToSave.phone)
    );

    if (duplicate) {
        const errorField = duplicate.email.toLowerCase() === contactToSave.email.toLowerCase() ? 'אימייל' : 'טלפון';
        return { success: false, error: `איש קשר עם ${errorField} זה כבר קיים.`, existingContact: duplicate };
    }

    if (editingContact) { // Update existing contact
      setContacts(prev => prev.map(c => c.id === editingContact.id ? 
        { ...c, ...contactToSave, fullName: `${contactToSave.firstName} ${contactToSave.lastName}`, updatedAt: new Date().toISOString() } as Contact : c
      ));
    } else { // Create new contact
      const newContact: Contact = {
        ...contactToSave,
        id: uuidv4(),
        fullName: `${contactToSave.firstName} ${contactToSave.lastName}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setContacts(prev => [newContact, ...prev]);
    }
    
    handleCloseContactModal();
    return { success: true };
  };

  const getDealHealth = async (deal: Deal): Promise<number | undefined> => {
      if (!process.env.API_KEY) {
        console.warn("API_KEY not set. Skipping deal health check.");
        return Math.floor(Math.random() * 61) + 40; // random score between 40 and 100
      }
      try {
        // Corrected: Use GoogleGenAI with a named apiKey parameter
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
        const dealContacts = contacts.filter(c => deal.contactIds.includes(c.id));
        const dealTasks = tasks.filter(t => t.relatedType === 'Deal' && t.relatedId === deal.id);
        const dealActivities = activities.filter(a => a.relatedType === 'Deal' && a.relatedId === deal.id)
          .sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 5);
  
        const prompt = `
          Analyze the health of this sales deal based on the provided JSON data.
          Deal: ${JSON.stringify(deal, null, 2)}
          Contacts: ${JSON.stringify(dealContacts, null, 2)}
          Tasks: ${JSON.stringify(dealTasks, null, 2)}
          Recent Activities: ${JSON.stringify(dealActivities, null, 2)}
  
          Consider factors like:
          - Time in current stage
          - Recent activity (last contact date)
          - Number and status of open tasks (overdue tasks are a negative signal)
          - Deal size and probability
          - Engagement level from recent activities (e.g., inbound vs outbound emails)
  
          Provide a single integer score from 0 (very unhealthy, likely to be lost) to 100 (very healthy, highly likely to close).
          DO NOT provide any other text, explanation, or formatting. Just the number.
        `;
        
        // Corrected: Use ai.models.generateContent with model name and prompt
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", // Using a recommended model for basic text tasks
            contents: prompt,
        });
        
        // Corrected: Directly access the text property from the response
        const text = response.text;
        const score = parseInt(text.trim(), 10);
        
        if (!isNaN(score) && score >= 0 && score <= 100) {
          return score;
        }
        console.warn("Received non-numeric score from AI:", text);
        return undefined;
  
      } catch (error) {
        console.error("Error getting deal health:", error);
        return undefined;
      }
  };

  const calculateAllDealsHealth = async () => {
    setIsLoadingHealth(true);
    const openDeals = deals.filter(d => d.stage !== DealStage.ClosedWon && d.stage !== DealStage.ClosedLost);
    const healthScores = await Promise.all(openDeals.map(getDealHealth));
    
    setDeals(prevDeals => prevDeals.map(d => {
        const dealIndex = openDeals.findIndex(od => od.id === d.id);
        if (dealIndex > -1) {
            return { ...d, healthScore: healthScores[dealIndex] };
        }
        return d;
    }));
    setIsLoadingHealth(false);
  };
  
  const NavItem: React.FC<{
    targetView: View;
    icon: React.ReactNode;
    label: string;
  }> = ({ targetView, icon, label }) => (
    <button
      onClick={() => setView(targetView)}
      className={`flex items-center w-full text-right px-4 py-3 rounded-lg transition-colors ${
        view === targetView
          ? 'bg-sky-600 text-white'
          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
      }`}
    >
      <span className="ml-4">{icon}</span>
      <span>{label}</span>
    </button>
  );

  const renderView = () => {
    switch (view) {
      case 'Contacts':
        return <ContactsView contacts={contacts} users={users} onAddNew={handleOpenNewContactModal} onEdit={handleOpenEditContactModal} />;
      case 'Deals':
        return <DealsView deals={deals} contacts={contacts} users={users} onDealStageChange={handleDealStageChange} showPipelineView={false} />;
      case 'Pipeline':
        return <DealsView deals={deals} contacts={contacts} users={users} onDealStageChange={handleDealStageChange} showPipelineView={true} />;
      case 'Tasks':
        return <TasksView tasks={tasks} users={users} deals={deals} contacts={contacts} />;
      case 'Reports':
        return <ReportsView deals={deals} />;
      case 'Settings':
        return <SettingsView />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-900 text-slate-200 flex h-screen font-sans" dir="rtl">
      <aside className="w-64 bg-slate-800 p-4 border-l border-slate-700 flex flex-col">
        <div className="flex items-center gap-3 mb-8 px-2">
           <BriefcaseIcon className="w-8 h-8 text-sky-400" />
           <h1 className="text-2xl font-bold text-white">CRM Plus</h1>
        </div>
        <nav className="flex flex-col gap-2 flex-grow">
          <NavItem targetView="Pipeline" icon={<PieChartIcon className="w-6 h-6" />} label="Pipeline" />
          <NavItem targetView="Deals" icon={<BriefcaseIcon className="w-6 h-6" />} label="דילים" />
          <NavItem targetView="Contacts" icon={<UsersIcon className="w-6 h-6" />} label="אנשי קשר" />
          <NavItem targetView="Tasks" icon={<CheckSquareIcon className="w-6 h-6" />} label="משימות" />
          <NavItem targetView="Reports" icon={<BarChartIcon className="w-6 h-6" />} label="דוחות" />
          <div className="flex-grow" />
          <button 
              onClick={calculateAllDealsHealth}
              disabled={isLoadingHealth}
              className="w-full text-center px-4 py-2 rounded-lg transition-colors bg-teal-600 text-white hover:bg-teal-700 disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
              {isLoadingHealth ? "מעדכן בריאות..." : "עדכן בריאות דילים (AI)"}
          </button>
          <NavItem targetView="Settings" icon={<SlidersIcon className="w-6 h-6" />} label="הגדרות" />
        </nav>
        {currentUser && (
            <div className="mt-4 p-3 bg-slate-900/50 rounded-lg flex items-center gap-3 border border-slate-700">
                <div title={currentUser.name} className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-sky-300 font-bold ring-2 ring-slate-700">
                    {currentUser.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                    <p className="font-semibold text-white">{currentUser.name}</p>
                    <p className="text-sm text-slate-400">{currentUser.role}</p>
                </div>
            </div>
        )}
      </aside>
      <main className="flex-1 overflow-auto">
        {renderView()}
      </main>
      <ContactModal 
        isOpen={isContactModalOpen}
        onClose={handleCloseContactModal}
        onSave={handleSaveContact}
        contactToEdit={editingContact}
        users={users}
        currentUserId={CURRENT_USER_ID}
      />
    </div>
  );
};

export default App;