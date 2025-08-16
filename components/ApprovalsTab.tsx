import React, { useState } from 'react';
import { PendingDeviation } from '../types';
import { useData } from '../contexts/DataContext';
import { formatCurrency } from '../utils/helpers';
import { IconLoader } from './Icons';
import Table from './Table';
import ApprovalActionModal from './ApprovalActionModal';

type ActionType = 'approve' | 'approve-update' | 'reject';

interface ApprovalsTabProps {
    pendingDeviations: PendingDeviation[];
    loading: boolean;
    onAction: (deviationId: string, type: ActionType, note: string) => Promise<void>;
}

const ApprovalsTab: React.FC<ApprovalsTabProps> = ({ pendingDeviations, loading, onAction }) => {
    const { setViewClientPan } = useData();
    const [actionState, setActionState] = useState<{ deviation: PendingDeviation, type: ActionType } | null>(null);

    const handleActionSubmit = async (note: string) => {
        if (!actionState) return;
        await onAction(actionState.deviation.id, actionState.type, note);
        setActionState(null);
    };

    const headers = ['Client', 'PAN', 'Week', 'Set Balance', 'New Balance', 'Deviation', 'Actions'];

    const tableData = pendingDeviations.map(item => [
        <button onClick={() => setViewClientPan(item.pan)} className="font-semibold text-brand-blue-600 hover:underline text-left">{item.clientName}</button>,
        item.pan,
        item.weekEnding,
        <span className="text-slate-600">{formatCurrency(item.setBalance)}</span>,
        <span className="font-semibold text-slate-800">{formatCurrency(item.newBalance)}</span>,
        <span className="font-bold text-rose-600">{item.deviationPercent.toFixed(2)}%</span>,
        <div className="flex items-center gap-2">
            <button
                onClick={() => setActionState({ deviation: item, type: 'approve' })}
                className="px-2.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-100 rounded-md hover:bg-emerald-200"
            >
                Approve
            </button>
            <button
                onClick={() => setActionState({ deviation: item, type: 'approve-update' })}
                className="px-2.5 py-1.5 text-xs font-semibold text-white bg-brand-blue-600 rounded-md hover:bg-brand-blue-700"
            >
                Approve &amp; Update
            </button>
            <button
                onClick={() => setActionState({ deviation: item, type: 'reject' })}
                className="px-2.5 py-1.5 text-xs font-semibold text-amber-700 bg-amber-100 rounded-md hover:bg-amber-200"
            >
                Reject
            </button>
        </div>
    ]);

    if (loading) {
        return <div className="flex justify-center items-center h-64"><IconLoader className="animate-spin h-8 w-8 text-brand-blue-600"/></div>;
    }

    return (
        <>
            <Table headers={headers} data={tableData} emptyStateMessage="No pending approvals for this branch and week." />
            {actionState && (
                <ApprovalActionModal
                    isOpen={!!actionState}
                    onClose={() => setActionState(null)}
                    deviation={actionState.deviation}
                    actionType={actionState.type}
                    onSubmit={handleActionSubmit}
                />
            )}
        </>
    );
};

export default ApprovalsTab;
