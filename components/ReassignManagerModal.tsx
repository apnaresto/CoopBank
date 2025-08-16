import React, { useState, useMemo } from 'react';
import { RM, BranchManager, ClientProfile } from '../types';
import { api } from '../services/mockApi';
import Modal from './Modal';
import { useData } from '../contexts/DataContext';
import { IconLoader, IconAlertTriangle } from './Icons';

type ReassignmentInfo = {
    manager: RM | BranchManager;
    type: 'rm' | 'bm';
    clients: ClientProfile[];
}

interface ReassignManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
    reassignmentInfo: ReassignmentInfo;
    onSuccess: () => void;
}

const ReassignManagerModal: React.FC<ReassignManagerModalProps> = ({ isOpen, onClose, reassignmentInfo, onSuccess }) => {
    const { manager, type, clients } = reassignmentInfo;
    const { rms, branchManagers } = useData();

    const potentialNewManagers = useMemo(() => {
        if (type === 'rm') {
            return rms.filter(r => r.branchId === manager.branchId && r.id !== manager.id);
        }
        return branchManagers.filter(bm => bm.branchId === manager.branchId && bm.id !== manager.id);
    }, [type, manager, rms, branchManagers]);

    const [newManagerId, setNewManagerId] = useState(potentialNewManagers[0]?.id || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newManagerId) {
            alert('Please select a new manager to reassign clients to.');
            return;
        }

        setIsSaving(true);
        try {
            const clientIds = clients.map(c => c.id);
            const assignmentUpdate = type === 'rm' ? { rmId: newManagerId } : { branchManagerId: newManagerId };
            
            await api.updateClientAssignments(clientIds, assignmentUpdate);

            if (type === 'rm') {
                await api.deleteRm(manager.id);
            } else {
                await api.deleteBranchManager(manager.id);
            }

            onSuccess();
        } catch (error) {
            console.error('Failed to reassign and delete manager:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const modalFooter = (
      <>
        <button type="button" onClick={onClose} className="text-slate-600 bg-white hover:bg-slate-100 focus:ring-4 focus:outline-none focus:ring-slate-200 rounded-lg border border-slate-200 text-sm font-medium px-5 py-2.5 hover:text-slate-900">
            Cancel
        </button>
        <button type="submit" form="reassign-form" disabled={isSaving || !newManagerId} className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-center text-white bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700 focus:ring-4 focus:ring-brand-blue-300 disabled:bg-slate-400">
            {isSaving && <IconLoader className="animate-spin -ml-1 mr-3 h-5 w-5" />}
            Reassign and Delete
        </button>
      </>
    );

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={`Delete Manager: ${manager.name}`}
            footer={modalFooter}
            size="lg"
        >
            <form id="reassign-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="p-4 bg-amber-50 border-l-4 border-amber-400 text-amber-800 rounded-md">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <IconAlertTriangle className="h-5 w-5 text-amber-500" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-semibold">This manager cannot be deleted directly.</p>
                            <p className="mt-1 text-sm">
                                {manager.name} is currently assigned to {clients.length} client(s). You must reassign them before deleting this manager.
                            </p>
                        </div>
                    </div>
                </div>

                <div>
                    <label htmlFor="newManager" className="block text-sm font-medium text-slate-700 mb-1">Reassign {clients.length} clients to:</label>
                    <select
                        id="newManager"
                        value={newManagerId}
                        onChange={(e) => setNewManagerId(e.target.value)}
                        className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-500 focus:border-brand-blue-500 sm:text-sm bg-slate-50"
                    >
                        {potentialNewManagers.length > 0 ? (
                            potentialNewManagers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)
                        ) : (
                            <option value="">No other managers available in this branch</option>
                        )}
                    </select>
                </div>

                <div className="max-h-40 overflow-y-auto border rounded-md p-2 bg-slate-50">
                    <p className="text-sm font-medium text-slate-600 mb-1">Clients to be reassigned:</p>
                    <ul className="text-xs text-slate-500 list-disc list-inside">
                        {clients.map(c => <li key={c.id}>{c.nameFirstHolder} ({c.panPrimary})</li>)}
                    </ul>
                </div>
            </form>
        </Modal>
    );
};

export default ReassignManagerModal;
