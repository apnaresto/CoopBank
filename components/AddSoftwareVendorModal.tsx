
import React, { useState, useEffect } from 'react';
import { SoftwareVendor } from '../types';
import { IconLoader } from './Icons';
import Modal from './Modal';

interface AddSoftwareVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<SoftwareVendor, 'id' | 'schema'> | SoftwareVendor) => Promise<void>;
  itemToEdit: SoftwareVendor | null;
  title: string;
}

const AddSoftwareVendorModal: React.FC<AddSoftwareVendorModalProps> = ({ isOpen, onClose, onSave, itemToEdit, title }) => {
    
    const getInitialState = () => ({
        name: itemToEdit?.name || '',
        templateName: itemToEdit?.templateName || '',
    });

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
            const dataToSave = itemToEdit ? { ...formData, id: itemToEdit.id, schema: itemToEdit.schema } : formData;
            await onSave(dataToSave);
            onClose();
        } catch (error) {
            console.error("Failed to save software vendor:", error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const modalFooter = (
      <>
        <button type="button" onClick={onClose} className="text-slate-600 bg-white hover:bg-slate-100 focus:ring-4 focus:outline-none focus:ring-slate-200 rounded-lg border border-slate-200 text-sm font-medium px-5 py-2.5 hover:text-slate-900">
            Cancel
        </button>
        <button type="submit" form="vendor-form" disabled={isSubmitting} className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-center text-white bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700 focus:ring-4 focus:ring-brand-blue-300 disabled:bg-slate-400">
            {isSubmitting && <IconLoader className="animate-spin -ml-1 mr-3 h-5 w-5" />}
            {itemToEdit ? 'Save Changes' : 'Add Vendor'}
        </button>
      </>
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} footer={modalFooter}>
            <form id="vendor-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-slate-900">Vendor Name</label>
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500 block w-full p-2.5" />
                </div>
                <div>
                    <label htmlFor="templateName" className="block mb-2 text-sm font-medium text-slate-900">Template Name</label>
                    <input type="text" name="templateName" id="templateName" value={formData.templateName} onChange={handleChange} required className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500 block w-full p-2.5" placeholder="e.g. Standard Finacle Format" />
                </div>
            </form>
        </Modal>
    );
};

export default AddSoftwareVendorModal;
