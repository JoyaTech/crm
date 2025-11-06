import React from 'react';
import { useCRM } from '../../hooks/useCRM';
import { Deal, DealStage, DealStageOrder } from '../../types';
import DealCard from './DealCard';

const DealsView: React.FC = () => {
  const { deals } = useCRM();

  const dealsByStage = DealStageOrder.reduce((acc, stage) => {
    acc[stage] = deals.filter(deal => deal.stage === stage);
    return acc;
  }, {} as Record<DealStage, Deal[]>);

  return (
    <div className="p-8 text-white h-full flex flex-col">
      <h1 className="text-3xl font-bold mb-6">Deals Pipeline</h1>
      <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
        {DealStageOrder.map(stage => (
          <div key={stage} className="w-80 bg-slate-900 rounded-lg p-3 flex-shrink-0 flex flex-col">
            <h3 className="font-bold text-lg mb-4 px-2 text-slate-300">{stage} ({dealsByStage[stage].length})</h3>
            <div className="flex-1 overflow-y-auto pr-1">
              {dealsByStage[stage].map(deal => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DealsView;
