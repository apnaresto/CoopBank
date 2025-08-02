import React, { useState, useEffect } from 'react';
import { Branch, BranchManager } from '../types';
import { IconX, IconLoader } from './Icons';

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
        setFormData(prev => ({ ...prev, [name]: value === 'null' ? null : value }));
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
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-16" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-semibold text-slate-800">{branchToEdit ? 'Edit Branch' : 'Add New Branch'}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <IconX className="h-6 w-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-slate-900">Branch Name</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500 block w-full p-2.5" />
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
                    </div>
                    <div className="flex items-center justify-end p-4 border-t bg-slate-50 rounded-b-lg">
                        <button type="button" onClick={onClose} className="text-slate-600 bg-white hover:bg-slate-100 focus:ring-4 focus:outline-none focus:ring-slate-200 rounded-lg border border-slate-200 text-sm font-medium px-5 py-2.5 hover:text-slate-900 focus:z-10 mr-2">
                            Cancel
                        </button>
                        <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-center text-white bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700 focus:ring-4 focus:ring-brand-blue-300 disabled:bg-slate-400">
                            {isSubmitting && <IconLoader className="animate-spin -ml-1 mr-3 h-5 w-5" />}
                            {branchToEdit ? 'Save Changes' : 'Add Branch'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddBranchModal;