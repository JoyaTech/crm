
import React, { useState } from 'react';
import { USERS, CONTACTS, DEALS, TASKS } from './constants';
import { Contact, Deal, DealStage, Task, User, View } from './types';

import DealsView from './components/DealsView';
import ContactsView from './components/ContactsView';
import TasksView from './components/TasksView';
import ReportsView from './components/ReportsView';
import SettingsView from './components/SettingsView';
import InboxView from './components/InboxView';
import ContactModal from './components/ContactModal';
import { BriefcaseIcon, UsersIcon, CheckCircleIcon, BarChartIcon, InboxIcon, SettingsIcon, LayoutGridIcon, ListIcon } from './components/Icons';


const App: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>(DEALS);
  const [contacts, setContacts] = useState<Contact[]>(CONTACTS);
  const [tasks, setTasks] = useState<Task[]>(TASKS);
  const [users] = useState<User[]>(USERS);
  const [currentUser] = useState<User>(USERS[0]);
  
  const [activeView, setActiveView] = useState<View>('pipeline');
  const [showPipelineView, setShowPipelineView] = useState(true);

  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactToEdit, setContactToEdit] = useState<Contact | null>(null);

  const handleDealStageChange = (dealId: string, newStage: DealStage) => {
    setDeals(prevDeals =>
      prevDeals.map(deal =>
        deal.id === dealId ? { ...deal, stage: newStage, updatedAt: new Date().toISOString() } : deal
      )
    );
  };

  const handleOpenNewContactModal = () => {
    setContactToEdit(null);
    setIsContactModalOpen(true);
  };

  const handleOpenEditContactModal = (contact: Contact) => {
    setContactToEdit(contact);
    setIsContactModalOpen(true);
  }

  const handleSaveContact = (contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'fullName'> & { id?: string }) => {
    const existingContact = contacts.find(c => c.email.toLowerCase() === contactData.email.toLowerCase() && c.id !== contactData.id);
    if (existingContact) {
        return { success: false, error: 'אימייל כבר קיים במערכת', existingContact };
    }
    
    if (contactData.id) {
        // Edit existing contact
        setContacts(prev => prev.map(c => c.id === contactData.id ? { ...c, ...contactData, fullName: `${contactData.firstName} ${contactData.lastName}`, updatedAt: new Date().toISOString() } : c))
    } else {
        // Add new contact
        const newContact: Contact = {
            id: `contact-${Date.now()}`,
            ...contactData,
            fullName: `${contactData.firstName} ${contactData.lastName}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        setContacts(prev => [newContact, ...prev]);
    }
    setIsContactModalOpen(false);
    return { success: true };
  }

  const renderView = () => {
    switch (activeView) {
      case 'pipeline':
      case 'deals':
        return <DealsView deals={deals} contacts={contacts} users={users} onDealStageChange={handleDealStageChange} showPipelineView={showPipelineView} />;
      case 'contacts':
        return <ContactsView contacts={contacts} users={users} onAddNew={handleOpenNewContactModal} onEdit={handleOpenEditContactModal} />;
      case 'tasks':
        return <TasksView tasks={tasks} users={users} deals={deals} contacts={contacts} />;
      case 'reports':
        return <ReportsView deals={deals} />;
      case 'settings':
        return <SettingsView />;
      case 'inbox':
          return <InboxView />;
      default:
        return <DealsView deals={deals} contacts={contacts} users={users} onDealStageChange={handleDealStageChange} showPipelineView={true} />;
    }
  };

  const NavItem: React.FC<{ view: View, icon: React.ReactNode, label: string }> = ({ view, icon, label }) => (
    <button 
        onClick={() => {
            setActiveView(view);
            if (view === 'pipeline' || view === 'deals') {
                setShowPipelineView(view === 'pipeline');
            }
        }} 
        className={`flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${activeView === view ? 'bg-sky-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}>
        {icon}
        <span className="mr-3">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100" dir="rtl">
      <aside className="w-64 bg-slate-800 p-4 border-l border-slate-700 flex flex-col">
        <div className="flex items-center mb-8 pr-2">
            <BriefcaseIcon className="w-8 h-8 text-sky-400" />
            <h1 className="text-2xl font-bold mr-2">מערכת CRM</h1>
        </div>
        <nav className="space-y-2 flex-grow">
            <NavItem view="pipeline" icon={<LayoutGridIcon className="w-5 h-5"/>} label="Pipeline" />
            <NavItem view="deals" icon={<ListIcon className="w-5 h-5"/>} label="כל הדילים" />
            <NavItem view="tasks" icon={<CheckCircleIcon className="w-5 h-5"/>} label="משימות" />
            <NavItem view="contacts" icon={<UsersIcon className="w-5 h-5"/>} label="אנשי קשר" />
            <NavItem view="reports" icon={<BarChartIcon className="w-5 h-5"/>} label="דוחות" />
            <NavItem view="inbox" icon={<InboxIcon className="w-5 h-5"/>} label="דואר נכנס" />
        </nav>
        <div className="mt-auto">
            <NavItem view="settings" icon={<SettingsIcon className="w-5 h-5"/>} label="הגדרות" />
             <div className="flex items-center p-3 mt-4 rounded-lg bg-slate-700/50">
                <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-sky-300 font-bold">
                    {currentUser.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="mr-3">
                    <p className="font-semibold text-white">{currentUser.name}</p>
                    <p className="text-xs text-slate-400">{currentUser.email}</p>
                </div>
            </div>
        </div>
      </aside>
      <main className="flex-1 overflow-hidden">
        {renderView()}
      </main>
      <ContactModal 
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        onSave={handleSaveContact}
        contactToEdit={contactToEdit}
        users={users}
        currentUserId={currentUser.id}
      />
    </div>
  );
};

export default App;
