
import React, { useState } from 'react';
import { useCRM } from '../contexts/CRMContext';
import { Inquiry, AnalysisResult } from '../types';
import { SparklesIcon } from './Icons';
import { analyzeInquiry } from '../services/api.service';
import AnalysisModal from './AnalysisModal';

const InquiryCard: React.FC<{
  inquiry: Inquiry;
  onAnalyze: (inquiry: Inquiry) => void;
  isAnalyzing: boolean;
}> = ({ inquiry, onAnalyze, isAnalyzing }) => {
  const getStatusColor = (status: Inquiry['status']) => {
    switch (status) {
      case 'new': return 'bg-sky-500';
      case 'in_progress': return 'bg-yellow-500';
      case 'done': return 'bg-green-500';
    }
  };

  return (
    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex justify-between items-start gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <span className={`w-2.5 h-2.5 rounded-full ${getStatusColor(inquiry.status)}`}></span>
          <h3 className="font-bold text-slate-100">{inquiry.subject}</h3>
        </div>
        <p className="text-sm text-slate-400 mb-1">From: {inquiry.name} ({inquiry.email})</p>
        <p className="text-sm text-slate-300 line-clamp-2">{inquiry.message}</p>
      </div>
      <button 
        onClick={() => onAnalyze(inquiry)}
        disabled={isAnalyzing}
        className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-slate-200 rounded-md hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <SparklesIcon className="w-4 h-4 text-purple-400" />
        {isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
      </button>
    </div>
  );
};


const InboxView: React.FC = () => {
  const { inquiries } = useCRM();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  
  const handleAnalyze = async (inquiry: Inquiry) => {
    setIsAnalyzing(true);
    setError(null);
    setSelectedInquiry(inquiry);
    try {
      const result = await analyzeInquiry(inquiry);
      setAnalysisResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setAnalysisResult(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const closeModal = () => {
    setSelectedInquiry(null);
    setAnalysisResult(null);
  };

  return (
    <div className="h-full flex flex-col">
      <header className="p-6 border-b border-slate-700">
        <h1 className="text-3xl font-bold text-white">Inbox</h1>
        <p className="text-slate-400 mt-1">New customer inquiries and leads.</p>
      </header>
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-4 max-w-4xl mx-auto">
          {inquiries.map(inquiry => (
            <InquiryCard 
              key={inquiry.id} 
              inquiry={inquiry} 
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing && selectedInquiry?.id === inquiry.id}
            />
          ))}
        </div>
      </div>
      {analysisResult && selectedInquiry && (
        <AnalysisModal 
          inquiry={selectedInquiry}
          analysis={analysisResult}
          onClose={closeModal}
        />
      )}
      {error && (
        <div className="fixed bottom-5 right-5 bg-red-500 text-white p-4 rounded-lg shadow-lg">
          <p><strong>Analysis Failed:</strong> {error}</p>
        </div>
      )}
    </div>
  );
};

export default InboxView;
