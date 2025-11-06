
import React, { useState } from 'react';
import './index.css';
import { BriefcaseIcon, UsersIcon, CheckSquareIcon, ChartBarIcon, SettingsIcon, InboxIcon } from './components/Icons';
import DealsView from './components/DealsView';
import ContactsView from './components/ContactsView';
import TasksView from './components/TasksView';
import ReportsView from './components/ReportsView';
import SettingsView from './components/SettingsView';
import InboxView from './components/InboxView';
import { CRMProvider } from './contexts/CRMContext';
import ErrorBoundary from './components/ErrorBoundary';

type View = 'inbox' | 'deals' | 'contacts' | 'tasks' | 'reports' | 'settings';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('inbox');

  const renderView = () => {
    switch (currentView) {
      case 'inbox':
        return <InboxView />;
      case 'deals':
        return <DealsView />;
      case 'contacts':
        return <ContactsView />;
      case 'tasks':
        return <TasksView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DealsView />;
    }
  };

  const NavItem: React.FC<{ view: View; icon: React.ReactNode; label: string }> = ({ view, icon, label }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`flex items-center w-full text-left px-4 py-2.5 rounded-md transition-colors ${
        currentView === view
          ? 'bg-sky-500/20 text-sky-400'
          : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'
      }`}
    >
      <span className="mr-3">{icon}</span>
      {label}
    </button>
  );

  return (
    <ErrorBoundary>
      <CRMProvider>
        <div className="flex h-screen bg-slate-900 text-slate-300 font-sans">
          <aside className="w-64 bg-slate-800 p-4 border-r border-slate-700 flex flex-col">
            <div className="text-2xl font-bold text-white mb-8 px-2">CRM Pro</div>
            <nav className="flex flex-col space-y-2">
              <NavItem view="inbox" icon={<InboxIcon className="w-5 h-5" />} label="Inbox" />
              <NavItem view="deals" icon={<BriefcaseIcon className="w-5 h-5" />} label="Deals" />
              <NavItem view="contacts" icon={<UsersIcon className="w-5 h-5" />} label="Contacts" />
              <NavItem view="tasks" icon={<CheckSquareIcon className="w-5 h-5" />} label="Tasks" />
              <NavItem view="reports" icon={<ChartBarIcon className="w-5 h-5" />} label="Reports" />
            </nav>
            <div className="mt-auto">
              <NavItem view="settings" icon={<SettingsIcon className="w-5 h-5" />} label="Settings" />
            </div>
          </aside>
          <main className="flex-1 overflow-y-auto">
            {renderView()}
          </main>
        </div>
      </CRMProvider>
    </ErrorBoundary>
  );
};

export default App;
