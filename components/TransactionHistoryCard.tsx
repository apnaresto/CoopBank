import React, { useState, useEffect } from 'react';
import { ClientProfile, WeeklyTransactionHistory } from '../types';
import { api } from '../services/mockApi';
import { formatCurrency } from '../utils/helpers';
import Table from './Table';
import Card from './Card';
import { IconLoader } from './Icons';

const TransactionHistoryCard: React.FC<{ profile: ClientProfile }> = ({ profile }) => {
    const [history, setHistory] = useState<WeeklyTransactionHistory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        api.getClientWeeklyTransactions(profile.panPrimary, profile.branchId)
            .then(setHistory)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [profile.panPrimary, profile.branchId]);
    
    return (
        <Card title="Weekly Transaction History">
            {loading ? <div className="h-40 flex items-center justify-center"><IconLoader className="h-6 w-6 animate-spin"/></div> : (
                <Table 
                    headers={['Week Ending', 'Credit', 'Debit', 'Closing Balance']}
                    data={history.map(item => [
                        item.weekEnding,
                        <span className="text-emerald-600">{formatCurrency(item.weeklyCr)}</span>,
                        <span className="text-rose-600">{formatCurrency(item.weeklyDr)}</span>,
                        <span className="font-semibold">{formatCurrency(item.closingBalance)}</span>,
                    ])}
                    emptyStateMessage="No recent transaction history."
                />
            )}
        </Card>
    );
};

export default TransactionHistoryCard;
