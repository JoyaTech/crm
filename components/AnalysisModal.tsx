import React from 'react';
import { XIcon, AlertTriangleIcon, SparklesIcon, CalendarIcon, SheetIcon, FileTextIcon, FolderIcon } from './Icons';
import { AnalysisResult, Inquiry } from '../types';

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: AnalysisResult | null;
  inquiry: Inquiry | null;
  isLoading: boolean;
}

const LoadingSpinner: React.FC = () => (
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-400"></div>
);

const PotentialScore: React.FC<{ score: 'high' | 'medium' | 'low' }> = ({ score }) => {
    const styles = {
        high: 'bg-green-500/10 text-green-400',
        medium: 'bg-amber-500/10 text-amber-400',
        low: 'bg-slate-600/20 text-slate-400',
    };
    const labels = {
        high: 'גבוה',
        medium: 'בינוני',
        low: 'נמוך',
    }
    return (
        <span className={`px-3 py-1 text-sm font-medium rounded-full ${styles[score]}`}>
            {labels[score]}
        </span>
    );
};

const GoogleActionButton: React.FC<{ icon: React.ReactNode, text: string }> = ({ icon, text }) => (
    <button className="flex items-center gap-2 w-full text-left bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-slate-200 font-medium py-2 px-3 rounded-lg transition-colors">
        {icon}
        <span>{text}</span>
    </button>
);


const AnalysisModal: React.FC<AnalysisModalProps> = ({ isOpen, onClose, result, inquiry, isLoading }) => {
  if (!isOpen) {
    return null;
  }

  const actions = result ? [
      { show: result.google_action.calendar_event === 'yes', icon: <CalendarIcon className="w-5 h-5 text-sky-400" />, text: 'צור אירוע ביומן' },
      { show: result.google_action.sheet_log === 'yes', icon: <SheetIcon className="w-5 h-5 text-green-400" />, text: 'תעד פנייה ב-Sheets' },
      { show: result.google_action.create_doc_summary === 'yes', icon: <FileTextIcon className="w-5 h-5 text-blue-400" />, text: 'צור תקציר ב-Docs' },
      { show: result.google_action.share_drive_folder === 'yes', icon: <FolderIcon className="w-5 h-5 text-amber-400" />, text: 'פתח תיקייה ב-Drive' },
  ].filter(a => a.show) : [];

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center backdrop-blur-sm" dir="rtl" onClick={onClose}>
      <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-3xl border border-slate-700 m-4 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-slate-700 flex-shrink-0">
          <div className="flex items-center gap-3">
             <div className="bg-sky-500/10 p-2 rounded-full"><SparklesIcon className="w-6 h-6 text-sky-400" /></div>
             <div>
                <h2 className="text-xl font-bold text-white">ניתוח פנייה חכם</h2>
                <p className="text-sm text-slate-400">מ- {inquiry?.name}</p>
             </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-700">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
                <LoadingSpinner />
                <p className="text-slate-400">מנתח את הפנייה באמצעות AI...</p>
            </div>
          )}
          {result && !isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div>
                    <h3 className="text-lg font-semibold text-slate-200 mb-3">תובנות עסקיות</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg">
                           <span className="font-medium text-slate-400">פוטנציאל עסקי</span>
                           <PotentialScore score={result.potential_score} />
                        </div>
                         <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg">
                           <span className="font-medium text-slate-400">קטגוריה מוצעת</span>
                           <span className="font-semibold text-white">{result.suggested_category}</span>
                        </div>
                    </div>

                    <h3 className="text-lg font-semibold text-slate-200 mt-6 mb-3">תגובה מוצעת</h3>
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                        <p className="text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">{result.auto_reply}</p>
                        <button className="text-xs text-sky-400 hover:text-sky-300 mt-3 font-semibold">העתק טקסט</button>
                    </div>
                </div>

                {/* Right Column */}
                <div>
                    <h3 className="text-lg font-semibold text-slate-200 mb-3">פעולות Google מוצעות</h3>
                    {actions.length > 0 ? (
                        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                            <p className="text-sm text-slate-400 mb-4">{result.google_action.notes}</p>
                            <div className="space-y-3">
                                {actions.map(action => <GoogleActionButton key={action.text} icon={action.icon} text={action.text} />)}
                            </div>
                        </div>
                    ) : (
                         <div className="flex items-center justify-center h-full text-slate-500 bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                            <p>לא נמצאו פעולות מומלצות.</p>
                        </div>
                    )}
                </div>
            </div>
          )}
        </div>
        <div className="flex justify-end items-center p-4 bg-slate-800/50 border-t border-slate-700 rounded-b-xl gap-3 flex-shrink-0">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-slate-600 text-white hover:bg-slate-500 transition-colors">
              סגירה
            </button>
            <button type="button" className="px-4 py-2 rounded-md bg-sky-600 text-white hover:bg-sky-700 transition-colors font-semibold">
              המר לאיש קשר ודיל
            </button>
          </div>
      </div>
    </div>
  );
};

export default AnalysisModal;
