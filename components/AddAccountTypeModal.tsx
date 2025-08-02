
import React, { useState, useEffect } from 'react';
import { AccountTypeInfo } from '../types';
import { IconX, IconLoader } from './Icons';

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
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-16" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <IconX className="h-6 w-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-slate-900">Account Type Name</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500 block w-full p-2.5" />
                        </div>
                    </div>
                    <div className="flex items-center justify-end p-4 border-t bg-slate-50 rounded-b-lg">
                        <button type="button" onClick={onClose} className="text-slate-600 bg-white hover:bg-slate-100 focus:ring-4 focus:outline-none focus:ring-slate-200 rounded-lg border border-slate-200 text-sm font-medium px-5 py-2.5 hover:text-slate-900 focus:z-10 mr-2">
                            Cancel
                        </button>
                        <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-center text-white bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700 focus:ring-4 focus:ring-brand-blue-300 disabled:bg-slate-400">
                            {isSubmitting && <IconLoader className="animate-spin -ml-1 mr-3 h-5 w-5" />}
                            {itemToEdit ? 'Save Changes' : 'Add Type'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAccountTypeModal;
