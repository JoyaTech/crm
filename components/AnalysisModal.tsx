
import React from 'react';
import { Inquiry, AnalysisResult } from '../types';
import { XIcon, SparklesIcon, CalendarIcon, SheetIcon, FileTextIcon, FolderIcon, AlertTriangleIcon, ShieldCheckIcon, XCircleIcon } from './Icons';
import { useCRM } from '../contexts/CRMContext';

const AnalysisModal: React.FC<{
  inquiry: Inquiry;
  analysis: AnalysisResult;
  onClose: () => void;
}> = ({ inquiry, analysis, onClose }) => {
    const { updateInquiryStatus } = useCRM();

    const handleApplySuggestions = () => {
        if(analysis.suggested_status) {
            updateInquiryStatus(inquiry.id, analysis.suggested_status);
        }
        onClose();
    };

    const PotentialScore: React.FC<{ score: 'high' | 'medium' | 'low' }> = ({ score }) => {
        const scoreMap = {
            high: { text: "High", color: "text-green-400", Icon: ShieldCheckIcon },
            medium: { text: "Medium", color: "text-yellow-400", Icon: AlertTriangleIcon },
            low: { text: "Low", color: "text-red-400", Icon: XCircleIcon },
        };
        const { text, color, Icon } = scoreMap[score] || scoreMap.low;
        return (
            <div className={`flex items-center gap-2 font-semibold ${color}`}>
                <Icon className="w-5 h-5" />
                <span>{text} Potential</span>
            </div>
        )
    };

    const ActionItem: React.FC<{ icon: React.ReactNode; text: string; enabled: boolean }> = ({ icon, text, enabled }) => (
        <div className={`flex items-center gap-3 p-3 rounded-md ${enabled ? 'bg-slate-700 text-slate-200' : 'bg-slate-700/50 text-slate-500'}`}>
            {icon}
            <span>{text}</span>
            {enabled && <ShieldCheckIcon className="w-4 h-4 ml-auto text-green-500" />}
        </div>
    )

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg shadow-2xl border border-slate-700 w-full max-w-3xl max-h-[90vh] flex flex-col">
        <header className="p-4 border-b border-slate-700 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-bold text-white">AI Analysis: {inquiry.subject}</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-700">
            <XIcon className="w-5 h-5 text-slate-400" />
          </button>
        </header>

        <main className="p-6 flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div>
                <h3 className="font-semibold text-slate-300 mb-3 border-b border-slate-700 pb-2">Summary & Suggestions</h3>
                <div className="space-y-4">
                    <PotentialScore score={analysis.potential_score} />
                    <div className="bg-slate-700/50 p-3 rounded-md">
                        <p className="text-sm text-slate-400 mb-1">Suggested Category</p>
                        <p className="font-medium text-slate-100">{analysis.suggested_category}</p>
                    </div>
                     <div className="bg-slate-700/50 p-3 rounded-md">
                        <p className="text-sm text-slate-400 mb-1">Suggested Status</p>
                        <p className="font-medium text-slate-100 capitalize">{analysis.suggested_status.replace('_', ' ')}</p>
                    </div>
                    <div className="bg-slate-700/50 p-3 rounded-md">
                        <p className="text-sm text-slate-400 mb-1">Requires Human Follow-up?</p>
                        <p className={`font-medium ${analysis.human_required ? 'text-green-400' : 'text-yellow-400'}`}>{analysis.human_required ? 'Yes' : 'No'}</p>
                    </div>
                </div>
                <h3 className="font-semibold text-slate-300 my-4 border-b border-slate-700 pb-2">Suggested Reply</h3>
                <div className="bg-slate-900 p-4 rounded-md text-slate-300 text-sm whitespace-pre-wrap font-mono">
                    {analysis.auto_reply}
                </div>
            </div>
            
            {/* Right Column */}
            <div>
                 <h3 className="font-semibold text-slate-300 mb-3 border-b border-slate-700 pb-2">Google Workspace Actions</h3>
                 <div className="space-y-3">
                    <ActionItem icon={<CalendarIcon className="w-5 h-5"/>} text="Create Calendar Event" enabled={analysis.google_action.calendar_event === 'yes'} />
                    <ActionItem icon={<SheetIcon className="w-5 h-5"/>} text="Log in Google Sheet" enabled={analysis.google_action.sheet_log === 'yes'} />
                    <ActionItem icon={<FileTextIcon className="w-5 h-5"/>} text="Create Doc Summary" enabled={analysis.google_action.create_doc_summary === 'yes'} />
                    <ActionItem icon={<FolderIcon className="w-5 h-5"/>} text="Share Drive Folder" enabled={analysis.google_action.share_drive_folder === 'yes'} />
                 </div>
                 <h3 className="font-semibold text-slate-300 my-4 border-b border-slate-700 pb-2">Notes for Team</h3>
                 <div className="bg-slate-700/50 p-3 rounded-md text-slate-300 text-sm">
                    {analysis.google_action.notes}
                 </div>
            </div>
        </main>
        
        <footer className="p-4 border-t border-slate-700 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-slate-700 text-slate-200 rounded-md hover:bg-slate-600">
            Close
          </button>
          <button onClick={handleApplySuggestions} className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-500">
            Apply Suggestions
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AnalysisModal;
