import React, { useState, useEffect } from 'react';
import { Branch, BranchManager } from '../types';
import { IconLoader } from './Icons';
import Modal from './Modal';

interface AddBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Branch, 'id'> | Branch) => Promise<void>;
  branchToEdit: Branch | null;
  managers: BranchManager[];
}

const AddBranchModal: React.FC<AddBranchModalProps> = ({ isOpen, onClose, onSave, branchToEdit, managers }) => {
    
    const getInitialState = () => ({
        name: branchToEdit?.name || '',
        code: branchToEdit?.code || '',
        location: branchToEdit?.location || '',
        managerId: branchToEdit?.managerId || null,
        status: branchToEdit?.status || 'Active',
    });

    const [formData, setFormData] = useState(getInitialState());
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setFormData(getInitialState());
    }, [branchToEdit, isOpen]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let finalValue: string | null = value;

        if (name === 'code') {
            finalValue = value.toUpperCase();
        } else if (name === 'managerId' && value === 'null') {
            finalValue = null;
        }

        setFormData(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const dataToSave = branchToEdit ? { ...formData, id: branchToEdit.id } : formData;
            await onSave(dataToSave);
        } catch (error) {
            console.error("Failed to save branch:", error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const modalFooter = (
        <>
            <button type="button" onClick={onClose} className="text-slate-600 bg-white hover:bg-slate-100 focus:ring-4 focus:outline-none focus:ring-slate-200 rounded-lg border border-slate-200 text-sm font-medium px-5 py-2.5 hover:text-slate-900 focus:z-10">
                Cancel
            </button>
            <button type="submit" form="branch-form" disabled={isSubmitting} className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-center text-white bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700 focus:ring-4 focus:ring-brand-blue-300 disabled:bg-slate-400">
                {isSubmitting && <IconLoader className="animate-spin -ml-1 mr-3 h-5 w-5" />}
                {branchToEdit ? 'Save Changes' : 'Add Branch'}
            </button>
        </>
    );

    return (
        <Modal 
            isOpen={isOpen}
            onClose={onClose}
            title={branchToEdit ? 'Edit Branch' : 'Add New Branch'}
            footer={modalFooter}
        >
            <form id="branch-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-slate-900">Branch Name</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500 block w-full p-2.5" />
                    </div>
                    <div>
                        <label htmlFor="code" className="block mb-2 text-sm font-medium text-slate-900">Branch Code</label>
                        <input
                            type="text"
                            name="code"
                            id="code"
                            value={formData.code}
                            onChange={handleChange}
                            required
                            maxLength={6}
                            pattern="[A-Za-z]{2}[0-9]{4}"
                            title="Branch code must be 2 letters followed by 4 numbers (e.g., AB1234)."
                            className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500 block w-full p-2.5 uppercase font-mono"
                            placeholder="e.g. AB1234"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="location" className="block mb-2 text-sm font-medium text-slate-900">Location</label>
                    <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} required className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500 block w-full p-2.5" placeholder="e.g. City, State" />
                </div>
                <div>
                    <label htmlFor="managerId" className="block mb-2 text-sm font-medium text-slate-900">Branch Manager</label>
                    <select name="managerId" id="managerId" value={formData.managerId || 'null'} onChange={handleChange} className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500 block w-full p-2.5">
                        <option value="null">Unassigned</option>
                        {managers.map(manager => <option key={manager.id} value={manager.id}>{manager.name}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="status" className="block mb-2 text-sm font-medium text-slate-900">Status</label>
                    <select name="status" id="status" value={formData.status} onChange={handleChange} required className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500 block w-full p-2.5">
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
            </form>
        </Modal>
    );
};

export default AddBranchModal;