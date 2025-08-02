import React, { useState, useEffect } from 'react';
import { FamilyGroup, Branch } from '../types';
import { IconX, IconLoader } from './Icons';

type FamilyGroupData = Omit<FamilyGroup, 'id'>;

interface AddFamilyGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: FamilyGroupData) => Promise<void>;
  branches: Branch[];
}

const AddFamilyGroupModal: React.FC<AddFamilyGroupModalProps> = ({ isOpen, onClose, onAdd, branches }) => {
    const initialState = { name: '', code: '', branchId: '' };
    const [formData, setFormData] = useState<FamilyGroupData>(initialState);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (branches.length > 0 && !formData.branchId) {
            setFormData(prev => ({ ...prev, branchId: branches[0].id }));
        }
    }, [branches, formData.branchId]);
    
    const resetForm = () => {
        setFormData({ ...initialState, branchId: branches.length > 0 ? branches[0].id : '' });
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onAdd(formData);
            onClose();
            resetForm();
        } catch (error) {
            console.error("Failed to add family group:", error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-semibold text-slate-800">Add Family Group</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <IconX className="h-6 w-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-slate-900">Group Name</label>
                                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500 block w-full p-2.5" />
                            </div>
                            <div>
                                <label htmlFor="code" className="block mb-2 text-sm font-medium text-slate-900">Short Code</label>
                                <input type="text" name="code" id="code" value={formData.code} onChange={handleChange} required className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500 block w-full p-2.5" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="branchId" className="block mb-2 text-sm font-medium text-slate-900">Assign to Branch</label>
                            <select name="branchId" id="branchId" value={formData.branchId} onChange={handleChange} required className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500 block w-full p-2.5">
                                {branches.map(branch => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="flex items-center justify-end p-4 border-t">
                        <button type="button" onClick={onClose} className="text-slate-600 bg-white hover:bg-slate-100 focus:ring-4 focus:outline-none focus:ring-slate-200 rounded-lg border border-slate-200 text-sm font-medium px-5 py-2.5 hover:text-slate-900 focus:z-10 mr-2">
                            Cancel
                        </button>
                        <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-center text-white bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700 focus:ring-4 focus:ring-brand-blue-300 disabled:bg-slate-400">
                            {isSubmitting && <IconLoader className="animate-spin -ml-1 mr-3 h-5 w-5" />}
                            Add Group
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddFamilyGroupModal;