
import React from 'react';
import { XIcon, BarChartIcon } from './Icons';

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

const AnalysisModal: React.FC<AnalysisModalProps> = ({ isOpen, onClose, title }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center" dir="rtl" onClick={onClose}>
      <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl border border-slate-700 m-4" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChartIcon className="w-6 h-6 text-sky-400" />
            {title}
          </h2>
          <button type="button" onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-700">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          <p className="text-slate-400">
            ניתוח מעמיק ותובנות יופיעו כאן.
          </p>
          <div className="h-64 bg-slate-900 mt-4 rounded-lg flex items-center justify-center">
            <p className="text-slate-500">מקום לתרשימים ונתונים</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisModal;
