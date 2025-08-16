

import React, { useState, useEffect } from 'react';
import { KycChangeItem } from '../types';
import { api } from '../services/mockApi';
import { IconLoader, IconFileEdit, IconX } from './Icons';
import { formatTimeAgo } from '../utils/helpers';
import Card from './Card';


const formatFieldLabel = (field: string): string => {
    return field
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase());
};

interface KycHistoryCardProps {
    pan: string;
    onClose: () => void;
}

const KycHistoryCard: React.FC<KycHistoryCardProps> = ({ pan, onClose }) => {
    const [history, setHistory] = useState<KycChangeItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!pan) return;
        setLoading(true);
        api.getKycChangeHistory(pan)
            .then(setHistory)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [pan]);

    const renderContent = () => {
        if (loading) {
            return <div className="h-40 flex items-center justify-center"><IconLoader className="h-6 w-6 animate-spin text-brand-blue-600"/></div>;
        }
        if (history.length === 0) {
            return <p className="text-center text-slate-500 py-4">No KYC changes recorded.</p>;
        }
        return (
            <ul className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {history.map(item => (
                    <li key={item.id} className="flex gap-3">
                        <div className="relative h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-full text-white bg-slate-500">
                            <IconFileEdit className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-slate-800">
                                <span className="font-semibold">{formatFieldLabel(item.fieldName as string)}</span> changed to <span className="font-semibold text-brand-blue-600">{item.newValue}</span>
                            </p>
                            <p className="text-xs text-slate-500 italic">
                                (Previously: {item.oldValue || 'N/A'})
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                                {formatTimeAgo(new Date(item.timestamp))} by {item.author} (Batch: {item.uploadBatchId})
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <Card
            title="KYC Change History"
            className="animate-fade-in-down"
            actions={
                <button
                    onClick={onClose}
                    className="p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    aria-label="Close KYC history"
                >
                    <IconX className="h-5 w-5" />
                </button>
            }
        >
            {renderContent()}
        </Card>
    );
};


export default KycHistoryCard;
