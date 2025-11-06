
import React from 'react';
import { InboxIcon } from './Icons';

const InboxView: React.FC = () => {
  return (
    <div className="p-8 flex flex-col items-center justify-center h-full text-slate-500">
      <InboxIcon className="w-24 h-24 mb-4" />
      <h1 className="text-3xl font-bold text-slate-400 mb-2">תיבת דואר נכנס</h1>
      <p>כל האימיילים והתקשורת שלך יופיעו כאן.</p>
    </div>
  );
};

export default InboxView;
