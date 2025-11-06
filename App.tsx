import React, { useState } from 'react';
import {
  BriefcaseIcon,
  UsersIcon,
  CheckSquareIcon,
  InboxIcon,
  ChartBarIcon,
  SettingsIcon,
} from './components/Icons';
import ErrorBoundary from './components/ErrorBoundary';
import { CRMProvider } from './contexts/CRMContext';
import DealsView from './features/deals/DealsView';
import ContactsView from './features/contacts/ContactsView';
import TasksView from './features/tasks/TasksView';
import InboxView from './features/inbox/InboxView';
import ReportsView from './features/reports/ReportsView';
import SettingsView from './features/settings/SettingsView';

type View = 'Deals' | 'Contacts' | 'Tasks' | 'Inbox' | 'Reports' | 'Settings';

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: View;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500 transition-colors duration-150 ${
      isActive
        ? 'bg-slate-700 text-white'
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    {icon}
    <span className="ml-3">{label}</span>
  </button>
);

const MainApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('Inbox');

  const navItems: { label: View; icon: React.ReactNode }[] = [
    { label: 'Inbox', icon: <InboxIcon className="w-5 h-5" /> },
    { label: 'Deals', icon: <BriefcaseIcon className="w-5 h-5" /> },
    { label: 'Contacts', icon: <UsersIcon className="w-5 h-5" /> },
    { label: 'Tasks', icon: <CheckSquareIcon className="w-5 h-5" /> },
    { label: 'Reports', icon: <ChartBarIcon className="w-5 h-5" /> },
    { label: 'Settings', icon: <SettingsIcon className="w-5 h-5" /> },
  ];

  const renderView = () => {
    switch (currentView) {
      case 'Deals': return <DealsView />;
      case 'Contacts': return <ContactsView />;
      case 'Tasks': return <TasksView />;
      case 'Inbox': return <InboxView />;
      case 'Reports': return <ReportsView />;
      case 'Settings': return <SettingsView />;
      default: return <InboxView />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 font-sans">
      <aside className="w-64 bg-slate-950 p-4 border-r border-slate-800 flex flex-col">
        <div className="flex items-center mb-8">
          <BriefcaseIcon className="w-8 h-8 text-blue-500" />
          <h1 className="ml-2 text-xl font-bold">CRM.ai</h1>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              isActive={currentView === item.label}
              onClick={() => setCurrentView(item.label)}
            />
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto">
        {renderView()}
      </main>
    </div>
  );
};

const App: React.FC = () => (
  <ErrorBoundary>
    <CRMProvider>
      <MainApp />
    </CRMProvider>
  </ErrorBoundary>
);

export default App;
