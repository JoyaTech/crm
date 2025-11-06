
import React, { useState } from 'react';
import { Deal, Contact, User, DealStage, Task, DealStageOrder } from '../types';
import DealCard from './DealCard';
import { PlusIcon } from './Icons';

interface DealsViewProps {
  deals: Deal[];
  contacts: Contact[];
  users: User[];
  onDealStageChange: (dealId: string, newStage: DealStage) => void;
  showPipelineView: boolean;
}

const DealsView: React.FC<DealsViewProps> = ({ deals, contacts, users, onDealStageChange, showPipelineView }) => {
  const [draggedOverColumn, setDraggedOverColumn] = useState<DealStage | null>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, stage: DealStage) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('dealId');
    if (dealId) {
      onDealStageChange(dealId, stage);
    }
    setDraggedOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, stage: DealStage) => {
    e.preventDefault();
    setDraggedOverColumn(stage);
  };

  const handleDragLeave = () => {
    setDraggedOverColumn(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS', notation: 'compact' }).format(amount);
  };

  const dealStageColumns = DealStageOrder.filter(stage => 
      showPipelineView ? stage !== DealStage.ClosedWon && stage !== DealStage.ClosedLost && stage !== DealStage.OnHold : true
  );

  return (
    <div className="p-4 sm:p-6 md:p-8 flex flex-col h-full">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white mb-4 sm:mb-0">{showPipelineView ? 'Pipeline' : 'דילים'}</h1>
        <button className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
          <PlusIcon className="w-5 h-5" />
          <span>דיל חדש</span>
        </button>
      </div>
      <div className="flex-grow overflow-x-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 min-w-max pb-4" style={{gridTemplateColumns: `repeat(${dealStageColumns.length}, minmax(300px, 1fr))`}}>
          {dealStageColumns.map(stage => {
            const dealsInStage = deals.filter(deal => deal.stage === stage);
            const stageValue = dealsInStage.reduce((sum, deal) => sum + deal.amount, 0);
            return (
              <div
                key={stage}
                onDrop={(e) => handleDrop(e, stage)}
                onDragOver={(e) => handleDragOver(e, stage)}
                onDragLeave={handleDragLeave}
                className={`bg-slate-900/70 rounded-xl transition-colors ${draggedOverColumn === stage ? 'bg-sky-900/50' : ''}`}
              >
                <div className="p-4 border-b border-slate-700 sticky top-0 bg-slate-900/70 backdrop-blur-sm rounded-t-xl">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-white">{stage} <span className="text-sm text-slate-400">({dealsInStage.length})</span></h3>
                        <span className="text-sm font-medium text-sky-400">{formatCurrency(stageValue)}</span>
                    </div>
                </div>
                <div className="p-2 space-y-3 h-[calc(100vh-250px)] overflow-y-auto">
                  {dealsInStage.map(deal => (
                    <DealCard
                      key={deal.id}
                      deal={deal}
                      contacts={contacts}
                      owner={users.find(u => u.id === deal.ownerId)}
                      onClick={() => {}}
                    />
                  ))}
                   {dealsInStage.length === 0 && (
                       <div className="flex items-center justify-center h-24 text-sm text-slate-500">
                           גרור דילים לכאן
                       </div>
                   )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DealsView;
