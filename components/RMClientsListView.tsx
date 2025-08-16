import React, { useState, useEffect } from 'react';
import { ClientProfile, RMPerformanceData } from '../types';
import { api } from '../services/mockApi';
import { useData } from '../contexts/DataContext';
import { formatCurrency } from '../utils/helpers';
import Table from './Table';
import { IconLoader, IconArrowLeft } from './Icons';

interface RMClientsListViewProps { 
    rm: RMPerformanceData;
    branchId: string;
    weekEnding: string;
    onClose: () => void;
}

const RMClientsListView: React.FC<RMClientsListViewProps> = ({ rm, branchId, weekEnding, onClose }) => {
    const [clients, setClients] = useState<ClientProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const { setViewClientPan } = useData();

    useEffect(() => {
        setLoading(true);
        api.getClientsByRmId(rm.rmId, branchId, weekEnding)
            .then(data => setClients(data.sort((a,b) => a.nameFirstHolder.localeCompare(b.nameFirstHolder))))
            .finally(() => setLoading(false));
    }, [rm.rmId, branchId, weekEnding]);
    
    const headers = ['Client Name', 'PAN', 'Account Balance', 'Set Balance', 'Deviation (%)'];
    const tableData = clients.map(client => {
        const deviationPercent = client.setBalance && client.setBalance > 0 
                            ? ((client.accountBalance - client.setBalance) / client.setBalance) * 100
                            : 0;
        const isPositive = deviationPercent >= 0;
        return [
            <button onClick={() => setViewClientPan(client.panPrimary)} className="font-semibold text-brand-blue-600 hover:underline text-left">{client.nameFirstHolder}</button>,
            <span className="font-mono">{client.panPrimary}</span>,
            <span className="text-right block">{formatCurrency(client.accountBalance)}</span>,
            <span className="text-right block">{formatCurrency(client.setBalance || 0)}</span>,
            <span className={`font-semibold text-right block ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                {deviationPercent.toFixed(2)}%
            </span>
        ];
    });

    return (
        <div className="space-y-4 animate-fade-in-down">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-slate-800">Clients Managed by {rm.rmName}</h3>
                <button onClick={onClose} className="inline-flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-600 text-sm font-medium rounded-md hover:bg-slate-50 shadow-sm">
                    <IconArrowLeft className="h-4 w-4 mr-2"/> Back to RM Summary
                </button>
            </div>
            {loading ? (
                <div className="flex justify-center items-center h-64"><IconLoader className="animate-spin h-8 w-8 text-brand-blue-600"/></div>
            ) : (
                <Table headers={headers} data={tableData} emptyStateMessage="No clients found for this RM." />
            )}
        </div>
    );
};

export default RMClientsListView;
