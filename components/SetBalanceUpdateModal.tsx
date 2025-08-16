
import React, { useState } from 'react';
import { api } from '../services/mockApi';
import Modal from './Modal';
import { IconLoader } from './Icons';

interface SetBalanceUpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
    clientId: string;
    clientName: string;
    onSuccess: () => void;
}

const SetBalanceUpdateModal: React.FC<SetBalanceUpdateModalProps> = ({ isOpen, onClose, clientId, clientName, onSuccess }) => {
    const [newBalance, setNewBalance] = useState('');
    const [note, setNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const balanceValue = parseFloat(newBalance);
        if (isNaN(balanceValue) || balanceValue < 0) {
            setError('Please enter a valid, non-negative balance.');
            return;
        }

        setIsSubmitting(true);
        setError('');
        try {
            await api.updateSetBalance(clientId, balanceValue, note);
            onSuccess();
            onClose();
        } catch (err) {
            setError('Failed to update set balance. Please try again.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const modalFooter = (
      <>
        <button type="button" onClick={onClose} className="text-slate-600 bg-white hover:bg-slate-100 focus:ring-4 focus:outline-none focus:ring-slate-200 rounded-lg border border-slate-200 text-sm font-medium px-5 py-2.5 hover:text-slate-900">
            Cancel
        </button>
        <button type="submit" form="setbalance-form" disabled={isSubmitting} className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-center text-white bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700 focus:ring-4 focus:ring-brand-blue-300 disabled:bg-slate-400">
            {isSubmitting && <IconLoader className="animate-spin -ml-1 mr-3 h-5 w-5" />}
            Update Balance
        </button>
      </>
    );

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={`Update Set Balance for ${clientName}`} 
            footer={modalFooter}
            size="md"
        >
            <form id="setbalance-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="newBalance" className="block mb-2 text-sm font-medium text-slate-900">New Set Balance (₹)</label>
                    <input
                        type="number"
                        id="newBalance"
                        value={newBalance}
                        onChange={(e) => setNewBalance(e.target.value)}
                        className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500 block w-full p-2.5"
                        required
                        autoFocus
                    />
                </div>
                <div>
                    <label htmlFor="note" className="block mb-2 text-sm font-medium text-slate-900">Note (Optional)</label>
                    <textarea
                        id="note"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={3}
                        className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500 block w-full p-2.5"
                        placeholder="Reason for the update..."
                    ></textarea>
                </div>
                 {error && <p className="text-sm text-rose-600">{error}</p>}
            </form>
        </Modal>
    );
};

export default SetBalanceUpdateModal;
