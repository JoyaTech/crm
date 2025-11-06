
import React from 'react';
import { Deal, Contact, User } from '../types';
import { UserIcon, ClockIcon, ShieldCheckIcon, AlertTriangleIcon, XCircleIcon } from './Icons';

interface DealCardProps {
  deal: Deal;
  contacts: Contact[];
  owner?: User;
  onClick: () => void;
}

const DealHealthScore: React.FC<{ score: number }> = ({ score }) => {
  let color = 'text-green-500';
  let bgColor = 'bg-green-500/10';
  let Icon = ShieldCheckIcon;
  let text = 'בריא';

  if (score < 75) {
    color = 'text-yellow-500';
    bgColor = 'bg-yellow-500/10';
    Icon = AlertTriangleIcon;
    text = 'דורש תשומת לב';
  }
  if (score < 40) {
    color = 'text-red-500';
    bgColor = 'bg-red-500/10';
    Icon = XCircleIcon;
    text = 'בסיכון';
  }

  return (
    <div className="relative group">
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${color} ${bgColor}`}>
            <Icon className="w-4 h-4" />
            <span>{text}</span>
        </div>
        <div className="absolute bottom-full mb-2 right-1/2 translate-x-1/2 w-max px-2 py-1 bg-slate-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            ציון בריאות: {score}/100
        </div>
    </div>
  );
};


const DealCard: React.FC<DealCardProps> = ({ deal, contacts, owner, onClick }) => {
  const dealContacts = contacts.filter(c => deal.contactIds.includes(c.id));
  const primaryContact = dealContacts[0];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', { style: 'currency', currency: deal.currency }).format(amount);
  };

  const daysUntilClose = Math.round((new Date(deal.expectedCloseDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));


  return (
    <div 
        draggable
        onDragStart={(e) => {
            e.dataTransfer.setData('dealId', deal.id);
        }}
        className="bg-slate-800 rounded-lg p-4 mb-3 cursor-pointer border border-slate-700 hover:border-sky-500 transition-all shadow-lg"
        onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-slate-100">{deal.name}</h4>
        {typeof deal.healthScore !== 'undefined' && <DealHealthScore score={deal.healthScore} />}
      </div>
      <p className="text-sm text-slate-400 mb-3">{deal.company}</p>
      
      <div className="text-lg font-semibold text-sky-400 mb-3">
        {formatCurrency(deal.amount)}
      </div>

      {primaryContact && (
        <div className="flex items-center text-sm text-slate-400 mb-2">
          <UserIcon className="w-4 h-4 mr-2" />
          <span>{primaryContact.fullName}</span>
        </div>
      )}

      <div className="flex items-center text-sm text-slate-400 mb-4">
          <ClockIcon className="w-4 h-4 mr-2" />
          <span>סגירה צפויה בעוד {daysUntilClose} ימים</span>
      </div>

      <div className="flex justify-between items-center text-xs">
        <div className="flex items-center">
            {owner && (
                <div title={owner.name} className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center text-sky-300 font-bold ring-2 ring-slate-700">
                    {owner.name.charAt(0)}
                </div>
            )}
        </div>
        <div className="bg-slate-700 text-slate-300 px-2 py-1 rounded">
            {deal.priority}
        </div>
      </div>
    </div>
  );
};

export default DealCard;