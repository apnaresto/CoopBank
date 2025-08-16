
import React, { useState, useMemo, useEffect } from 'react';
import { ClientProfile } from '../types';
import { api } from '../services/mockApi';
import Modal from './Modal';
import { useData } from '../contexts/DataContext';
import { IconLoader } from './Icons';

interface EditAssignmentsModalProps {
    isOpen: boolean;
    onClose: () => void;
    profile: ClientProfile;
    onSuccess: () => void;
}

const EditAssignmentsModal: React.FC<EditAssignmentsModalProps> = ({ isOpen, onClose, profile, onSuccess }) => {
    const { rms, branchManagers, familyGroups } = useData();
    const [editData, setEditData] = useState({
        rmId: profile.rmId,
        branchManagerId: profile.branchManagerId,
        familyGroupId: profile.familyGroupId,
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setEditData({
            rmId: profile.rmId,
            branchManagerId: profile.branchManagerId,
            familyGroupId: profile.familyGroupId,
        });
    }, [profile, isOpen]);

    const handleDataChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setEditData(prev => ({ ...prev, [e.target.name]: e.target.value === 'null' ? null : e.target.value }));
    };

    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await api.updateClientProfile(profile.id, editData);
            onSuccess();
            onClose();
        } catch (err) {
            console.error("Failed to save changes", err);
            alert("Failed to save assignment changes. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const branchScopedRMs = useMemo(() => rms.filter(r => r.branchId === profile.branchId), [rms, profile.branchId]);
    const branchScopedBMs = useMemo(() => branchManagers.filter(bm => bm.branchId === profile.branchId), [branchManagers, profile.branchId]);
    const branchScopedFGs = useMemo(() => familyGroups.filter(fg => fg.branchId === profile.branchId), [familyGroups, profile.branchId]);
    
    const modalFooter = (
      <>
        <button type="button" onClick={onClose} className="text-slate-600 bg-white hover:bg-slate-100 focus:ring-4 focus:outline-none focus:ring-slate-200 rounded-lg border border-slate-200 text-sm font-medium px-5 py-2.5 hover:text-slate-900">
            Cancel
        </button>
        <button type="submit" form="assignments-form" disabled={isSaving} className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-center text-white bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700 focus:ring-4 focus:ring-brand-blue-300 disabled:bg-slate-400">
            {isSaving && <IconLoader className="animate-spin -ml-1 mr-3 h-5 w-5" />}
            Save Changes
        </button>
      </>
    );

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={`Edit Assignments for ${profile.nameFirstHolder}`}
            footer={modalFooter}
        >
            <form id="assignments-form" onSubmit={handleSaveChanges} className="space-y-4">
                <div>
                    <label htmlFor="rmId" className="block text-sm font-medium text-slate-700 mb-1">Relationship Manager</label>
                    <select id="rmId" name="rmId" value={editData.rmId} onChange={handleDataChange} className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-500 focus:border-brand-blue-500 sm:text-sm bg-slate-50">
                        {branchScopedRMs.map(rm => <option key={rm.id} value={rm.id}>{rm.name} ({rm.code})</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="branchManagerId" className="block text-sm font-medium text-slate-700 mb-1">Branch Manager</label>
                    <select id="branchManagerId" name="branchManagerId" value={editData.branchManagerId} onChange={handleDataChange} className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-500 focus:border-brand-blue-500 sm:text-sm bg-slate-50">
                        {branchScopedBMs.map(bm => <option key={bm.id} value={bm.id}>{bm.name} ({bm.code})</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="familyGroupId" className="block text-sm font-medium text-slate-700 mb-1">Family Group</label>
                    <select id="familyGroupId" name="familyGroupId" value={editData.familyGroupId || 'null'} onChange={handleDataChange} className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-500 focus:border-brand-blue-500 sm:text-sm bg-slate-50">
                        <option value="null">N/A</option>
                        {branchScopedFGs.map(fg => <option key={fg.id} value={fg.id}>{fg.name} ({fg.code})</option>)}
                    </select>
                </div>
            </form>
        </Modal>
    );
};

export default EditAssignmentsModal;
