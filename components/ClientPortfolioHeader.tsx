
import React, { useState, useEffect } from 'react';
import { ClientPortfolioSummary } from '../types';
import { api } from '../services/mockApi';
import { formatCurrency } from '../utils/helpers';
import { IconFileEdit, IconLoader } from './Icons';
import clsx from 'clsx';

const getDeviationBadgeColor = (percent: number): string => {
    const absPercent = Math.abs(percent);
    if (absPercent <= 5) return 'bg-emerald-500';
    if (absPercent <= 15) return 'bg-amber-500';
    return 'bg-rose-500';
};

interface ClientPortfolioHeaderProps {
    pan: string;
    onToggleKycHistory: () => void;
    isKycHistoryOpen: boolean;
}

const ClientPortfolioHeader: React.FC<ClientPortfolioHeaderProps> = ({ pan, onToggleKycHistory, isKycHistoryOpen }) => {
    const [summary, setSummary] = useState<ClientPortfolioSummary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!pan) return;
        setLoading(true);
        api.getClientPortfolioSummary(pan)
            .then(setSummary)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [pan]);

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <div className="h-20 bg-slate-200 rounded animate-pulse"></div>
            </div>
        );
    }
    if (!summary) return null;

    const isPositive = summary.netDeviationAmount >= 0;
    const deviationBadgeColor = getDeviationBadgeColor(summary.netDeviationPercent);

    return (
        <div className="bg-white rounded-lg shadow p-6 border">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex items-center gap-3">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">{summary.name}</h2>
                        <p className="text-slate-500 font-mono mt-1">{summary.pan}</p>
                    </div>
                    <button
                        onClick={onToggleKycHistory}
                        title="View KYC Change History"
                        className={clsx(
                            "p-2 rounded-full border transition-colors shadow-sm",
                            isKycHistoryOpen
                                ? "bg-brand-blue-100 text-brand-blue-700 border-brand-blue-300 ring-2 ring-brand-blue-200"
                                : "bg-white text-slate-500 border-slate-300 hover:bg-slate-100 hover:text-slate-700"
                        )}
                    >
                        <IconFileEdit className="h-5 w-5" />
                    </button>
                </div>
                
                <div className="w-full md:w-auto">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-center sm:text-right w-full sm:pt-2">
                        <div>
                            <p className="text-sm text-slate-500">Total Portfolio</p>
                            <p className="text-xl font-bold text-slate-800">{formatCurrency(summary.totalPortfolioValue)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Total Set Balance</p>
                            <p className="text-xl font-bold text-slate-800">{formatCurrency(summary.totalSetBalance)}</p>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <p className="text-sm text-slate-500">Net Deviation</p>
                            <div className="flex items-center justify-center sm:justify-end gap-2">
                                 <span className={`px-2 py-0.5 text-white text-xs font-semibold rounded-full ${deviationBadgeColor}`}>
                                    {summary.netDeviationPercent.toFixed(2)}%
                                </span>
                                <p className={`text-xl font-bold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {formatCurrency(summary.netDeviationAmount)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientPortfolioHeader;
