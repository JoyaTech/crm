
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, FunnelChart, Funnel, LabelList, Cell } from 'recharts';
import { Deal, DealStage } from '../types';
import { BarChartIcon, CheckCircleIcon, DollarSignIcon } from './Icons';

interface ReportsViewProps {
  deals: Deal[];
}

const ReportsView: React.FC<ReportsViewProps> = ({ deals }) => {
    const pipeValue = deals.filter(d => d.stage !== DealStage.ClosedWon && d.stage !== DealStage.ClosedLost).reduce((sum, deal) => sum + deal.amount, 0);
    const weightedPipe = deals.filter(d => d.stage !== DealStage.ClosedWon && d.stage !== DealStage.ClosedLost).reduce((sum, deal) => sum + deal.amount * (deal.probability / 100), 0);
    const wonDeals = deals.filter(d => d.stage === DealStage.ClosedWon);
    const lostDeals = deals.filter(d => d.stage === DealStage.ClosedLost);
    const wonValue = wonDeals.reduce((sum, deal) => sum + deal.amount, 0);
    const winRate = wonDeals.length + lostDeals.length > 0 ? (wonDeals.length / (wonDeals.length + lostDeals.length)) * 100 : 0;
    const avgDealSize = wonDeals.length > 0 ? wonValue / wonDeals.length : 0;

    const formatCurrency = (amount: number) => new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS', maximumFractionDigits: 0 }).format(amount);

    const wonByMonth = wonDeals.reduce((acc, deal) => {
        const month = new Date(deal.updatedAt).toLocaleString('default', { month: 'short', year: 'numeric' });
        if (!acc[month]) {
            acc[month] = 0;
        }
        acc[month] += deal.amount;
        return acc;
    }, {} as Record<string, number>);

    const wonByMonthData = Object.keys(wonByMonth).map(month => ({
        name: month,
        'ערך נסגר': wonByMonth[month],
    })).sort((a,b) => new Date(a.name).getTime() - new Date(b.name).getTime());

    const kpis = [
        { title: 'ערך Pipeline פתוח', value: formatCurrency(pipeValue), icon: <DollarSignIcon className="w-8 h-8 text-sky-400" /> },
        { title: 'Pipeline משוקלל', value: formatCurrency(weightedPipe), icon: <BarChartIcon className="w-8 h-8 text-teal-400" /> },
        { title: 'שיעור זכייה', value: `${winRate.toFixed(1)}%`, icon: <CheckCircleIcon className="w-8 h-8 text-green-400" /> },
        { title: 'גודל עסקה ממוצע', value: formatCurrency(avgDealSize), icon: <DollarSignIcon className="w-8 h-8 text-amber-400" /> },
    ];

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8">
        <h1 className="text-3xl font-bold text-white">דוחות וניתוחים</h1>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpis.map(kpi => (
                <div key={kpi.title} className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex items-center space-x-4 space-x-reverse">
                    <div className="bg-slate-900 p-3 rounded-full">
                        {kpi.icon}
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm">{kpi.title}</p>
                        <p className="text-2xl font-bold text-white">{kpi.value}</p>
                    </div>
                </div>
            ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <h3 className="text-xl font-semibold text-white mb-4">דילים שנסגרו בהצלחה (לפי חודש)</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={wonByMonthData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis type="number" stroke="#9ca3af" tickFormatter={(value) => formatCurrency(value as number)}/>
                        <YAxis type="category" dataKey="name" stroke="#9ca3af" width={80} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem' }}
                            labelStyle={{ color: '#d1d5db' }}
                            formatter={(value) => [formatCurrency(value as number), 'ערך']}
                        />
                        <Legend wrapperStyle={{ color: '#d1d5db' }} />
                        <Bar dataKey="ערך נסגר" fill="#22d3ee" barSize={20}/>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <h3 className="text-xl font-semibold text-white mb-4">ביצועי צוות (דילים שנסגרו)</h3>
                 <div className="h-[300px] flex items-center justify-center">
                    <p className="text-slate-400">תרשים ביצועי צוות יתווסף כאן</p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ReportsView;
