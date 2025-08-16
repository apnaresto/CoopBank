
import React, { useState, useEffect } from 'react';
import { AccountTypeInfo } from '../types';
import { IconLoader } from './Icons';
import Modal from './Modal';

interface AddAccountTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<AccountTypeInfo, 'id'>) => Promise<void>;
  itemToEdit: AccountTypeInfo | null;
  title: string;
}

const AddAccountTypeModal: React.FC<AddAccountTypeModalProps> = ({ isOpen, onClose, onSave, itemToEdit, title }) => {
    
    const getInitialState = () => ({ name: itemToEdit?.name || '' });

    const [formData, setFormData] = useState(getInitialState());
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setFormData(getInitialState());
    }, [itemToEdit, isOpen]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ name: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error("Failed to save account type:", error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const modalFooter = (
      <>
        <button type="button" onClick={onClose} className="text-slate-600 bg-white hover:bg-slate-100 focus:ring-4 focus:outline-none focus:ring-slate-200 rounded-lg border border-slate-200 text-sm font-medium px-5 py-2.5 hover:text-slate-900">
            Cancel
        </button>
        <button type="submit" form="at-form" disabled={isSubmitting} className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-center text-white bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700 focus:ring-4 focus:ring-brand-blue-300 disabled:bg-slate-400">
            {isSubmitting && <IconLoader className="animate-spin -ml-1 mr-3 h-5 w-5" />}
            {itemToEdit ? 'Save Changes' : 'Add Type'}
        </button>
      </>
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} footer={modalFooter} size="md">
            <form id="at-form" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-slate-900">Account Type Name</label>
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500 block w-full p-2.5" />
                </div>
            </form>
        </Modal>
    );
};

export default AddAccountTypeModal;
