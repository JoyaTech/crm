
import React from 'react';
import { DealStage, DealStageOrder } from '../types';
import { useCRM } from '../contexts/CRMContext';
import DealCard from './DealCard';
import { PlusIcon, FilterIcon } from './Icons';

const DealsView: React.FC = () => {
  const { deals, users, contacts, updateDealStage } = useCRM();

  const getDealsForStage = (stage: DealStage) => {
    return deals.filter(deal => deal.stage === stage);
  };
  
  const getDealOwner = (ownerId: string) => users.find(u => u.id === ownerId);
  const getDealContacts = (contactIds: string[]) => contacts.filter(c => contactIds.includes(c.id));

  return (
    <div className="h-full flex flex-col">
      <header className="p-6 border-b border-slate-700 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Deals Pipeline</h1>
        <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-slate-200 rounded-md hover:bg-slate-600">
                <FilterIcon className="w-4 h-4" />
                Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-500">
                <PlusIcon className="w-4 h-4" />
                New Deal
            </button>
        </div>
      </header>
      <div className="flex-1 flex gap-5 p-6 overflow-x-auto">
        {DealStageOrder.map(stage => (
            <div 
                key={stage} 
                className="flex-1 bg-slate-800/50 rounded-lg p-3 min-w-[320px] max-w-[350px] flex flex-col"
                onDrop={(e) => {
                    e.preventDefault();
                    const dealId = e.dataTransfer.getData('dealId');
                    if (dealId) {
                        updateDealStage(dealId, stage);
                    }
                }}
                onDragOver={(e) => e.preventDefault()}
            >
                <div className="flex justify-between items-center mb-4 px-1">
                    <h3 className="font-bold text-slate-200">{stage}</h3>
                    <span className="text-sm text-slate-400 bg-slate-700 px-2 py-0.5 rounded-full">{getDealsForStage(stage).length}</span>
                </div>
                <div className="space-y-3 h-full overflow-y-auto pr-1">
                    {getDealsForStage(stage).map(deal => (
                        <DealCard 
                            key={deal.id} 
                            deal={deal} 
                            contacts={getDealContacts(deal.contactIds)}
                            owner={getDealOwner(deal.ownerId)}
                            onClick={() => { /* Open deal modal */ }}
                        />
                    ))}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default DealsView;
