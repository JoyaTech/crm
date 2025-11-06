
import React, { useState } from 'react';
import { useCRM } from '../../hooks/useCRM';
import { Inquiry, AnalysisResult } from '../../types';
import { analyzeInquiry } from '../../services/api.service';
import AnalysisModal from './AnalysisModal';
// FIX: Imported XIcon to resolve 'Cannot find name' error.
import { SparklesIcon, UserIcon, ClockIcon, AlertTriangleIcon, XIcon } from '../../components/Icons';
import Skeleton from '../../components/ui/Skeleton';

const InquiryCard: React.FC<{
  inquiry: Inquiry;
  onAnalyze: (inquiry: Inquiry) => void;
  isAnalyzing: boolean;
  isSelected: boolean;
}> = ({ inquiry, onAnalyze, isAnalyzing, isSelected }) => {
  const statusColors = {
    new: 'bg-blue-500',
    in_progress: 'bg-yellow-500',
    done: 'bg-green-500',
  };

  return (
    <div className="bg-slate-800 p-4 rounded-lg shadow-md mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-white text-lg mb-1">{inquiry.subject}</h3>
          <div className="flex items-center text-sm text-slate-400 mb-3">
            <UserIcon className="w-4 h-4 mr-2" />
            <span>{inquiry.name}</span>
            <span className="mx-2">|</span>
            <div className={`w-2 h-2 rounded-full ${statusColors[inquiry.status]} mr-2`}></div>
            <span className="capitalize">{inquiry.status.replace('_', ' ')}</span>
          </div>
        </div>
        <button
          onClick={() => onAnalyze(inquiry)}
          disabled={isAnalyzing}
          className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
        >
          {isAnalyzing && isSelected ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5 mr-2" />
              Analyze
            </>
          )}
        </button>
      </div>
      <p className="text-slate-300 text-sm line-clamp-2">{inquiry.message}</p>
    </div>
  );
};

const InboxView: React.FC = () => {
  const { inquiries } = useCRM();
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setIsLoading(true);
    setAnalysis(null);
    setError(null);
    try {
      const result = await analyzeInquiry(inquiry);
      setAnalysis(result);
      setIsModalOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Inbox</h1>
      {error && (
         <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative mb-4 flex items-center" role="alert">
            <AlertTriangleIcon className="w-5 h-5 mr-3" />
            <span className="block sm:inline">{error}</span>
            <button onClick={() => setError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3">
              <XIcon className="w-5 h-5" />
            </button>
        </div>
      )}
      <div className="bg-slate-800/50 p-6 rounded-lg">
        {inquiries.length > 0 ? (
          inquiries.map(inq => (
            <InquiryCard
              key={inq.id}
              inquiry={inq}
              onAnalyze={handleAnalyze}
              isAnalyzing={isLoading}
              isSelected={selectedInquiry?.id === inq.id}
            />
          ))
        ) : (
          <p className="text-slate-400">No inquiries found.</p>
        )}
      </div>
      <AnalysisModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        inquiry={selectedInquiry}
        analysis={analysis}
      />
    </div>
  );
};

export default InboxView;
