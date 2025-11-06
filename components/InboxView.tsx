import React, { useState } from 'react';
import { Inquiry } from '../types';
import { SparklesIcon } from './Icons';

interface InboxViewProps {
  inquiries: Inquiry[];
  onAnalyze: (inquiry: Inquiry) => void;
}

const InquiryCard: React.FC<{ inquiry: Inquiry; onAnalyze: () => void }> = ({ inquiry, onAnalyze }) => {
  const statusStyles = {
    new: 'bg-sky-500/10 text-sky-400',
    in_progress: 'bg-amber-500/10 text-amber-400',
    done: 'bg-green-500/10 text-green-400',
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex-grow">
        <div className="flex items-center gap-3 mb-1">
          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusStyles[inquiry.status]}`}>
            {inquiry.status === 'new' ? 'חדש' : inquiry.status === 'in_progress' ? 'בטיפול' : 'טופל'}
          </span>
          <h3 className="font-semibold text-white">{inquiry.subject}</h3>
        </div>
        <p className="text-sm text-slate-400">
          מאת: <span className="font-medium text-slate-300">{inquiry.name}</span> ({inquiry.email})
        </p>
        <p className="text-sm text-slate-400 mt-2 line-clamp-2">{inquiry.message}</p>
      </div>
      <button
        onClick={onAnalyze}
        className="flex-shrink-0 flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg transition-colors w-full sm:w-auto"
      >
        <SparklesIcon className="w-5 h-5" />
        <span>נתח עם AI</span>
      </button>
    </div>
  );
};


const InboxView: React.FC<InboxViewProps> = ({ inquiries, onAnalyze }) => {
  const [filter, setFilter] = useState<'all' | Inquiry['status']>('all');

  const filteredInquiries = inquiries.filter(i => filter === 'all' || i.status === filter);
  const filters: ('all' | Inquiry['status'])[] = ['all', 'new', 'in_progress', 'done'];
  const filterLabels = {
    all: 'הכל',
    new: 'חדש',
    in_progress: 'בטיפול',
    done: 'טופל',
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 flex flex-col h-full">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white mb-4 sm:mb-0">תיבת פניות</h1>
        <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg p-1">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === f ? 'bg-sky-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
            >
              {filterLabels[f]}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-grow overflow-y-auto pr-2 space-y-4">
        {filteredInquiries.length > 0 ? (
          filteredInquiries.map(inquiry => (
            <InquiryCard key={inquiry.id} inquiry={inquiry} onAnalyze={() => onAnalyze(inquiry)} />
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500">
            אין פניות התואמות את הפילטר הנבחר.
          </div>
        )}
      </div>
    </div>
  );
};

export default InboxView;
