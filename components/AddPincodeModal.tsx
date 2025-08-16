
import React, { useState, useEffect } from 'react';
import { Pincode } from '../types';
import { IconLoader } from './Icons';
import Modal from './Modal';

interface AddPincodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Pincode, 'id'> | Pincode) => Promise<void>;
  itemToEdit: Pincode | null;
}

const AddPincodeModal: React.FC<AddPincodeModalProps> = ({ isOpen, onClose, onSave, itemToEdit }) => {
    
    const getInitialState = () => ({
        code: itemToEdit?.code || '',
        city: itemToEdit?.city || '',
        district: itemToEdit?.district || '',
        state: itemToEdit?.state || '',
        country: itemToEdit?.country || 'India',
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
            const dataToSave = itemToEdit ? { ...formData, id: itemToEdit.id } : formData;
            await onSave(dataToSave);
        } catch (error) {
            console.error("Failed to save pincode:", error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const modalFooter = (
      <>
        <button type="button" onClick={onClose} className="text-slate-600 bg-white hover:bg-slate-100 focus:ring-4 focus:outline-none focus:ring-slate-200 rounded-lg border border-slate-200 text-sm font-medium px-5 py-2.5 hover:text-slate-900">
            Cancel
        </button>
        <button type="submit" form="pincode-form" disabled={isSubmitting} className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-center text-white bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700 focus:ring-4 focus:ring-brand-blue-300 disabled:bg-slate-400">
            {isSubmitting && <IconLoader className="animate-spin -ml-1 mr-3 h-5 w-5" />}
            {itemToEdit ? 'Save Changes' : 'Add PIN Code'}
        </button>
      </>
    );

    return (
      <Modal isOpen={isOpen} onClose={onClose} title={itemToEdit ? 'Edit PIN Code' : 'Add New PIN Code'} footer={modalFooter}>
          <form id="pincode-form" onSubmit={handleSubmit} className="space-y-4">
              <div>
                  <label htmlFor="code" className="block mb-2 text-sm font-medium text-slate-900">PIN Code</label>
                  <input type="text" name="code" id="code" value={formData.code} onChange={handleChange} required className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500 block w-full p-2.5" />
              </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                      <label htmlFor="city" className="block mb-2 text-sm font-medium text-slate-900">City</label>
                      <input type="text" name="city" id="city" value={formData.city} onChange={handleChange} required className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500 block w-full p-2.5" />
                  </div>
                  <div>
                      <label htmlFor="district" className="block mb-2 text-sm font-medium text-slate-900">District</label>
                      <input type="text" name="district" id="district" value={formData.district} onChange={handleChange} required className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500 block w-full p-2.5" />
                  </div>
              </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <label htmlFor="state" className="block mb-2 text-sm font-medium text-slate-900">State</label>
                      <input type="text" name="state" id="state" value={formData.state} onChange={handleChange} required className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500 block w-full p-2.5" />
                  </div>
                  <div>
                      <label htmlFor="country" className="block mb-2 text-sm font-medium text-slate-900">Country</label>
                      <input type="text" name="country" id="country" value={formData.country} onChange={handleChange} required className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500 block w-full p-2.5" />
                  </div>
              </div>
          </form>
      </Modal>
    );
};

export default AddPincodeModal;
