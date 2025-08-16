
import React, { useState, useEffect } from 'react';
import { api } from '../services/mockApi';
import { RMDeviationSummary } from '../types';
import { IconLoader, IconUsers, IconTrendingUp, IconAlertTriangle } from './Icons';
import { useData } from '../contexts/DataContext';

interface RMDeviationSummaryCardProps {
    rmId: string;
    weekEnding: string;
    onClick: () => void;
}

const RMDeviationSummaryCard: React.FC<RMDeviationSummaryCardProps> = ({ rmId, weekEnding, onClick }) => {
    const { rms } = useData();
    const [summary, setSummary] = useState<RMDeviationSummary | null>(null);
    const [loading, setLoading] = useState(true);

    const rmInfo = rms.find(r => r.id === rmId);

    useEffect(() => {
        setLoading(true);
        api.getRMDeviationSummary(rmId, weekEnding)
            .then(setSummary)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [rmId, weekEnding]);

    if (loading) {
        return <div className="p-4 bg-white rounded-lg shadow border flex justify-center items-center h-48"><IconLoader className="animate-spin h-6 w-6 text-brand-blue-600" /></div>;
    }

    if (!summary || !rmInfo) {
        return <div className="p-4 bg-white rounded-lg shadow border text-center text-slate-500 h-48 flex items-center justify-center">No summary available.</div>;
    }

    return (
        <div 
            onClick={onClick}
            className="bg-white rounded-lg shadow border flex flex-col min-h-[12rem] transition-all duration-300 cursor-pointer hover:shadow-lg hover:border-brand-blue-400"
            role="button"
            tabIndex={0}
            onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
        >
            <div className="p-4 border-b">
                <h4 className="font-semibold text-slate-800">{rmInfo.name}</h4>
                <p className="text-xs text-slate-500">Portfolio Deviation Summary</p>
            </div>
            <div className="p-4 space-y-3 flex-grow">
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-600 flex items-center gap-2"><IconUsers className="h-4 w-4"/> Clients Managed</span>
                    <span className="font-bold text-slate-800">{summary.totalClientsManaged}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-600 flex items-center gap-2"><IconTrendingUp className="h-4 w-4"/> Avg. Deviation</span>
                    <span className="font-bold text-slate-800">{summary.averageDeviation.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-600 flex items-center gap-2"><IconAlertTriangle className="h-4 w-4 text-amber-500"/> Clients &gt; 10% Deviation</span>
                    <span className="font-bold text-rose-600">{summary.highDeviationCount}</span>
                </div>
            </div>
            <div className="p-4 border-t bg-slate-50 text-center text-sm font-medium text-brand-blue-600">
                View Details
            </div>
        </div>
    );
};

export default RMDeviationSummaryCard;
