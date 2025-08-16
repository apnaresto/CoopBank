
import React, { useState, useEffect } from 'react';
import { api } from '../services/mockApi';
import { SetBalanceHistoryItem } from '../types';
import Modal from './Modal';
import Table from './Table';
import { IconLoader } from './Icons';
import { formatCurrency } from '../utils/helpers';

interface ClientSetBalanceHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    clientId: string;
}

const ClientSetBalanceHistoryModal: React.FC<ClientSetBalanceHistoryModalProps> = ({ isOpen, onClose, clientId }) => {
    const [history, setHistory] = useState<SetBalanceHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            api.getSetBalanceHistory(clientId)
                .then(setHistory)
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [isOpen, clientId]);

    const headers = ['Date', 'Set Balance', 'Changed By', 'Note'];
    const tableData = history.map(item => [
        new Date(item.date).toLocaleString(),
        formatCurrency(item.setBalance),
        item.changedBy,
        item.note,
    ]);
    
    return (
        <Modal 
            isOpen={isOpen}
            onClose={onClose}
            title="Set Balance Change History"
            size="2xl"
        >
             <div className="min-h-[200px]">
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <IconLoader className="animate-spin h-8 w-8 text-brand-blue-600" />
                    </div>
                ) : (
                    <Table headers={headers} data={tableData} emptyStateMessage="No history found." />
                )}
            </div>
        </Modal>
    );
};

export default ClientSetBalanceHistoryModal;
