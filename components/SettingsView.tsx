
import React from 'react';
import { DealStage, DealStageOrder } from '../types';

const SettingsView: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-8">הגדרות</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-4">עריכת שלבי Pipeline</h2>
          <p className="text-slate-400 mb-4">גרור ושחרר כדי לסדר מחדש את שלבי המכירה.</p>
          <div className="space-y-2">
            {DealStageOrder.map(stage => (
              <div key={stage} className="bg-slate-700 p-3 rounded flex items-center cursor-move">
                <span className="text-slate-300">{stage}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-4">ניהול תפקידים והרשאות</h2>
          <div className="space-y-4">
            {['Admin', 'Manager', 'Rep', 'Viewer'].map(role => (
              <div key={role} className="flex justify-between items-center bg-slate-700 p-3 rounded">
                <span className="text-slate-300 font-medium">{role}</span>
                <button className="text-sm text-sky-400 hover:text-sky-300">עריכת הרשאות</button>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-4">אינטגרציות</h2>
           <p className="text-slate-400">חבר את ה-CRM שלך לכלים אחרים.</p>
           <div className="mt-4 flex items-center justify-center h-32">
             <p className="text-slate-500">אפשרויות אינטגרציה יופיעו כאן</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
