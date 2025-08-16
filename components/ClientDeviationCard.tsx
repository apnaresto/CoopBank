import React, { useState, useEffect } from 'react';
import { ClientProfile, ClientDeviationInfo } from '../types';
import { api } from '../services/mockApi';
import { IconLoader, IconWallet, IconTrendingUp, IconTrendingDown, IconHelpCircle, IconEdit, IconHistory } from './Icons';
import { formatCurrency } from '../utils/helpers';

interface ClientDeviationCardProps {
    client: ClientProfile;
    weekEnding: string;
    onUpdateBalance: () => void;
    onViewHistory: () => void;
}

const getDeviationBadgeColor = (percent: number): string => {
    const absPercent = Math.abs(percent);
    if (absPercent <= 5) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (absPercent <= 15) return 'bg-amber-100 text-amber-800 border-amber-300';
    return 'bg-rose-100 text-rose-800 border-rose-300';
};

const StatItem: React.FC<{ label: string; value: string; icon: React.ElementType }> = ({ label, value, icon: Icon }) => (
    <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-slate-500" />
        <div>
            <p className="text-xs text-slate-500">{label}</p>
            <p className="text-md font-semibold text-slate-800">{value}</p>
        </div>
    </div>
);

const ClientDeviationCard: React.FC<ClientDeviationCardProps> = ({ client, weekEnding, onUpdateBalance, onViewHistory }) => {
    const [deviationInfo, setDeviationInfo] = useState<ClientDeviationInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        api.getClientDeviation(client.id, weekEnding)
            .then(setDeviationInfo)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [client.id, weekEnding]);

    if (loading) {
        return <div className="p-6 bg-white rounded-lg shadow border flex justify-center items-center"><IconLoader className="animate-spin h-8 w-8 text-brand-blue-600" /></div>;
    }
    
    if (!deviationInfo) {
        return (
            <div className="p-6 bg-white rounded-lg shadow border text-center text-slate-500">
                <IconHelpCircle className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                <p>Could not load deviation information for this client.</p>
                <p className="text-sm">They may not have a 'Set Balance' configured.</p>
                <button onClick={onUpdateBalance} className="mt-4 text-sm font-semibold text-brand-blue-600 hover:underline">Set Balance Now</button>
            </div>
        );
    }
    
    const { setBalance, currentBalance, deviationAmount, deviationPercent } = deviationInfo;
    const isPositive = deviationAmount >= 0;

    return (
        <div className="bg-white rounded-lg shadow border">
            <div className="p-4 border-b flex justify-between items-center">
                 <h4 className="text-lg font-semibold text-slate-800">Account Balance</h4>
                 <div className="flex items-center gap-2">
                     <button onClick={onUpdateBalance} className="text-xs font-medium text-brand-blue-600 bg-brand-blue-50 hover:bg-brand-blue-100 rounded-md px-3 py-1.5 inline-flex items-center gap-1.5">
                        <IconEdit className="h-3 w-3" /> Update Set Balance
                     </button>
                     <button onClick={onViewHistory} className="text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md px-3 py-1.5 inline-flex items-center gap-1.5">
                        <IconHistory className="h-3 w-3" /> View History
                     </button>
                 </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                <div className="space-y-4">
                    <StatItem label="Current Balance" value={formatCurrency(currentBalance)} icon={IconWallet} />
                    <StatItem label="Set Balance" value={formatCurrency(setBalance)} icon={IconWallet} />
                </div>
                <div className="bg-slate-50 rounded-lg p-4 flex flex-col justify-center items-center text-center">
                    <p className="text-sm text-slate-500">Deviation</p>
                    <p className={`text-2xl font-bold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {isPositive ? '+' : ''}{formatCurrency(deviationAmount)}
                    </p>
                     <div className={`mt-2 text-sm font-bold px-3 py-1 rounded-full border ${getDeviationBadgeColor(deviationPercent)}`}>
                        <span className="flex items-center gap-1">
                           {isPositive ? <IconTrendingUp className="h-4 w-4" /> : <IconTrendingDown className="h-4 w-4" />}
                            {deviationPercent.toFixed(2)}%
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientDeviationCard;