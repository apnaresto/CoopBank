
import React, { useState, useMemo } from 'react';
import { PendingDeviation } from '../types';
import Modal from './Modal';
import { IconLoader } from './Icons';
import { formatCurrency } from '../utils/helpers';

type ActionType = 'approve' | 'approve-update' | 'reject';

interface ApprovalActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    deviation: PendingDeviation;
    actionType: ActionType;
    onSubmit: (note: string) => Promise<void>;
}

const ApprovalActionModal: React.FC<ApprovalActionModalProps> = ({ isOpen, onClose, deviation, actionType, onSubmit }) => {
    const [note, setNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const config = useMemo(() => {
        switch (actionType) {
            case 'approve':
                return {
                    title: 'Approve Deviation',
                    description: `Approve the deviation, keeping the client's Set Balance at ${formatCurrency(deviation.setBalance)}.`,
                    buttonText: 'Approve',
                    buttonClass: 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-300',
                };
            case 'approve-update':
                return {
                    title: 'Approve & Update Set Balance',
                    description: `Approve the deviation and update the client's Set Balance to match the new balance of ${formatCurrency(deviation.newBalance)}.`,
                    buttonText: 'Approve & Update',
                    buttonClass: 'bg-brand-blue-600 hover:bg-brand-blue-700 focus:ring-brand-blue-300',
                };
            case 'reject':
                return {
                    title: 'Reject Deviation',
                    description: `Reject this deviation. The Set Balance of ${formatCurrency(deviation.setBalance)} will not be changed.`,
                    buttonText: 'Reject',
                    buttonClass: 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-300',
                };
        }
    }, [actionType, deviation]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (note.trim() === '') {
            alert('A decision note is required.');
            return;
        }
        setIsSubmitting(true);
        await onSubmit(note);
        setIsSubmitting(false);
        setNote('');
    };

    const modalFooter = (
      <>
        <button type="button" onClick={onClose} className="text-slate-600 bg-white hover:bg-slate-100 focus:ring-4 focus:outline-none focus:ring-slate-200 rounded-lg border border-slate-200 text-sm font-medium px-5 py-2.5 hover:text-slate-900">
            Cancel
        </button>
        <button
            type="submit"
            form="approval-action-form"
            disabled={isSubmitting || !note.trim()}
            className={`inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-center text-white rounded-lg focus:ring-4 disabled:bg-slate-400 ${config.buttonClass}`}
        >
            {isSubmitting && <IconLoader className="animate-spin -ml-1 mr-3 h-5 w-5" />}
            {config.buttonText}
        </button>
      </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={config.title}
            footer={modalFooter}
            size="lg"
        >
            <form id="approval-action-form" onSubmit={handleSubmit} className="space-y-4">
                <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-md">{config.description}</p>
                <div>
                    <h4 className="font-semibold text-slate-800">Client: {deviation.clientName} ({deviation.pan})</h4>
                </div>
                <div>
                    <label htmlFor="note" className="block mb-2 text-sm font-medium text-slate-900">Decision Note <span className="text-rose-500">*</span></label>
                    <textarea
                        id="note"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={4}
                        className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500 block w-full p-2.5"
                        placeholder="Provide a reason for this decision..."
                        required
                        autoFocus
                    ></textarea>
                </div>
            </form>
        </Modal>
    );
};

export default ApprovalActionModal;
