import React from 'react';
import { Deal } from '../../types';
import { DollarSignIcon, UserIcon, ClockIcon } from '../../components/Icons';

const DealCard: React.FC<{ deal: Deal }> = ({ deal }) => {
  return (
    <div className="bg-slate-800 p-4 rounded-lg shadow-md mb-3 hover:bg-slate-700 cursor-pointer transition-colors duration-150">
      <h4 className="font-bold text-white text-md mb-2">{deal.name}</h4>
      <p className="text-sm text-slate-400 mb-3">{deal.company}</p>
      <div className="flex items-center text-sm text-slate-300 mb-3">
        <DollarSignIcon className="w-4 h-4 mr-2" />
        <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: deal.currency }).format(deal.amount)}</span>
      </div>
      <div className="flex items-center text-sm text-slate-400">
        <ClockIcon className="w-4 h-4 mr-2" />
        <span>Close: {new Date(deal.expectedCloseDate).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default DealCard;
