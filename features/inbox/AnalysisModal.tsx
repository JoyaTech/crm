import React from 'react';
import { AnalysisResult, Inquiry } from '../../types';
import { XIcon, CalendarIcon, SheetIcon, FileTextIcon, FolderIcon, CheckCircleIcon, AlertTriangleIcon, BarChartIcon, ShieldCheckIcon } from '../../components/Icons';

const PotentialScore: React.FC<{ score: 'high' | 'medium' | 'low' }> = ({ score }) => {
  const scoreMap = {
    high: { icon: <BarChartIcon className="text-green-400 w-5 h-5" />, text: 'High Potential', color: 'text-green-400' },
    medium: { icon: <BarChartIcon className="text-yellow-400 w-5 h-5" />, text: 'Medium Potential', color: 'text-yellow-400' },
    low: { icon: <BarChartIcon className="text-red-400 w-5 h-5" />, text: 'Low Potential', color: 'text-red-400' },
  };
  const { icon, text, color } = scoreMap[score];
  return (
    <div className={`flex items-center ${color}`}>
      {icon}
      <span className="ml-2 font-semibold">{text}</span>
    </div>
  );
};

const GoogleAction: React.FC<{ label: string; active: boolean }> = ({ label, active }) => {
  const iconMap: Record<string, React.ReactNode> = {
    'Calendar Event': <CalendarIcon className="w-5 h-5" />,
    'Sheet Log': <SheetIcon className="w-5 h-5" />,
    'Create Doc Summary': <FileTextIcon className="w-5 h-5" />,
    'Share Drive Folder': <FolderIcon className="w-5 h-5" />,
  };
  return (
    <div className={`flex items-center p-2 rounded-md ${active ? 'bg-blue-600/20 text-blue-300' : 'bg-slate-700 text-slate-400'}`}>
      {iconMap[label]}
      <span className="ml-2 text-sm">{label}</span>
      {active && <CheckCircleIcon className="w-4 h-4 ml-auto text-green-400" />}
    </div>
  );
};

const AnalysisModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  inquiry: Inquiry | null;
  analysis: AnalysisResult | null;
}> = ({ isOpen, onClose, inquiry, analysis }) => {
  if (!isOpen || !inquiry || !analysis) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-4xl text-white max-h-[90vh] flex flex-col">
        <header className="p-4 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold">AI Analysis for: {analysis.name}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-700">
            <XIcon className="w-6 h-6" />
          </button>
        </header>
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-slate-300">Analysis & Suggestions</h3>
              <div className="space-y-4">
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-slate-400 mb-2">Potential Score</h4>
                  <PotentialScore score={analysis.potential_score} />
                </div>
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-slate-400 mb-2">Suggested Category</h4>
                  <p className="font-semibold">{analysis.suggested_category}</p>
                </div>
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-slate-400 mb-2">Human Follow-up</h4>
                  <div className="flex items-center">
                    {analysis.human_required ? <AlertTriangleIcon className="w-5 h-5 text-yellow-400" /> : <ShieldCheckIcon className="w-5 h-5 text-green-400" />}
                    <span className="ml-2 font-semibold">{analysis.human_required ? 'Required' : 'Not Required'}</span>
                  </div>
                </div>
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-slate-400 mb-2">Team Notes</h4>
                  <p className="text-slate-300 italic">"{analysis.google_action.notes}"</p>
                </div>
              </div>
            </div>
            {/* Right Column */}
            <div>
               <h3 className="font-bold text-lg mb-4 text-slate-300">Suggested Actions</h3>
               <div className="space-y-2 mb-4">
                  <GoogleAction label="Calendar Event" active={analysis.google_action.calendar_event === 'yes'} />
                  <GoogleAction label="Sheet Log" active={analysis.google_action.sheet_log === 'yes'} />
                  <GoogleAction label="Create Doc Summary" active={analysis.google_action.create_doc_summary === 'yes'} />
                  <GoogleAction label="Share Drive Folder" active={analysis.google_action.share_drive_folder === 'yes'} />
               </div>
               <h3 className="font-bold text-lg mb-4 mt-6 text-slate-300">Suggested Auto-Reply</h3>
               <div className="bg-slate-900 p-4 rounded-lg text-slate-300 text-sm whitespace-pre-wrap font-mono">
                  <p className="font-semibold text-slate-400 mb-2">To: {inquiry.email}</p>
                  <p className="font-semibold text-slate-400 mb-2">Subject: Re: {inquiry.subject}</p>
                  <hr className="border-slate-700 my-2" />
                  {analysis.auto_reply}
               </div>
            </div>
          </div>
        </div>
        <footer className="p-4 border-t border-slate-700 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-slate-700 hover:bg-slate-600">Close</button>
          <button className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 font-semibold">Accept Suggestions</button>
        </footer>
      </div>
    </div>
  );
};

export default AnalysisModal;
