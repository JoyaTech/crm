
import React from 'react';
import { BarChartIcon, DollarSignIcon, UsersIcon } from './Icons';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
        <div className="flex items-center justify-between">
            <p className="text-slate-400">{title}</p>
            <div className="text-sky-400">{icon}</div>
        </div>
        <p className="text-3xl font-bold text-white mt-2">{value}</p>
    </div>
);

const ReportsView: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Reports Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Pipeline Value" value="$450,200" icon={<DollarSignIcon className="w-6 h-6" />} />
        <StatCard title="Active Deals" value="14" icon={<BarChartIcon className="w-6 h-6" />} />
        <StatCard title="New Contacts (30d)" value="32" icon={<UsersIcon className="w-6 h-6" />} />
      </div>

       <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-4">Deals by Stage</h2>
          <div className="h-64 flex items-center justify-center">
            <p className="text-slate-500">Chart will be displayed here.</p>
          </div>
       </div>
    </div>
  );
};

export default ReportsView;
