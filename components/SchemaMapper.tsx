
import React, { useState, useEffect, useCallback } from 'react';
import { SoftwareVendor, ClientProfile } from '../types';
import { api } from '../services/mockApi';
import { IconLoader, IconCheckCircle, IconAlertTriangle } from './Icons';

// Define the structure of the schema fields, grouped for the UI
// State, country, and district are derived from pinCode, but city is now mappable.
const SCHEMA_FIELD_GROUPS: Record<string, (keyof Omit<ClientProfile, 'district' | 'state' | 'country'>)[]> = {
    'Account & Holder Info': ['accountNumber', 'nameFirstHolder', 'panPrimary', 'jointName1', 'panJoint1', 'jointName2', 'panJoint2', 'accountType', 'accountCategory'],
    'Contact & Address': ['address1', 'address2', 'address3', 'city', 'pinCode', 'contactMobile', 'contactEmail'],
    'Financials & Balances': ['accountBalance', 'freeBalance', 'pledgeBalance', 'lockSBal', 'freezeZeBal', 'aaBalPercentage', 'freeBalPercentage', 'pledgeBalPercentage'],
    'External Bank Details': ['bankName', 'bankAcNo', 'bankIfsc', 'bankMicr'],
    'Pledge & Lock Info': ['pledgeLock', 'lockDate']
};

// Function to format the field key into a readable label
const formatFieldLabel = (field: string): string => {
    return field
        .replace(/([A-Z])/g, ' $1') // insert a space before all caps
        .replace(/^./, (str) => str.toUpperCase()); // uppercase the first character
};


const SchemaMapper: React.FC = () => {
    const [vendors, setVendors] = useState<SoftwareVendor[]>([]);
    const [selectedVendorId, setSelectedVendorId] = useState<string>('');
    const [currentSchema, setCurrentSchema] = useState<Partial<Record<keyof ClientProfile, string>>>({});
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const fetchVendors = useCallback(async () => {
        setLoading(true);
        try {
            const vendorData = await api.getSoftwareVendors();
            setVendors(vendorData);
            if (vendorData.length > 0) {
                // Select the first vendor by default
                const firstVendorId = vendorData[0].id;
                setSelectedVendorId(firstVendorId);
                setCurrentSchema(vendorData[0].schema || {});
            }
        } catch (error) {
            console.error("Failed to fetch vendors:", error);
            setFeedback({ type: 'error', message: "Could not load vendor data." });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchVendors();
    }, [fetchVendors]);

    useEffect(() => {
        const selectedVendor = vendors.find(v => v.id === selectedVendorId);
        if (selectedVendor) {
            setCurrentSchema(selectedVendor.schema || {});
        }
    }, [selectedVendorId, vendors]);

    const handleVendorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedVendorId(e.target.value);
        setFeedback(null);
    };

    const handleSchemaChange = (field: keyof ClientProfile, value: string) => {
        setCurrentSchema(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!selectedVendorId) return;

        setIsSaving(true);
        setFeedback(null);
        try {
            await api.updateSoftwareVendor(selectedVendorId, { schema: currentSchema });
            setFeedback({ type: 'success', message: "Template saved successfully!" });
            // Refetch vendors to update the main state
            await fetchVendors();
        } catch (error) {
            console.error("Failed to save template:", error);
            setFeedback({ type: 'error', message: "An error occurred while saving." });
        } finally {
            setIsSaving(false);
            setTimeout(() => setFeedback(null), 5000);
        }
    };
    
    if (loading) {
        return <div className="flex justify-center items-center h-64"><IconLoader className="animate-spin h-8 w-8 text-brand-blue-600"/></div>;
    }
    
    const selectedVendor = vendors.find(v => v.id === selectedVendorId);

    return (
        <div className="space-y-6">
            <div className="p-4 bg-slate-50 rounded-lg border flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <label htmlFor="vendor-select" className="text-sm font-medium text-slate-700">Select Vendor Template:</label>
                    <select id="vendor-select" value={selectedVendorId} onChange={handleVendorChange} className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500 block p-2.5 min-w-[250px]">
                        {vendors.length > 0 ? (
                            vendors.map(v => <option key={v.id} value={v.id}>{v.name} - ({v.templateName})</option>)
                        ) : (
                            <option>No vendors available</option>
                        )}
                    </select>
                </div>
                {selectedVendor && (
                     <button onClick={handleSave} disabled={isSaving} className="inline-flex items-center justify-center px-4 py-2 bg-brand-blue-600 text-white text-sm font-medium rounded-md hover:bg-brand-blue-700 disabled:bg-slate-400">
                        {isSaving ? <IconLoader className="animate-spin h-5 w-5 mr-2" /> : <IconCheckCircle className="h-5 w-5 mr-2" />}
                        {isSaving ? 'Saving...' : 'Save Template'}
                    </button>
                )}
            </div>

            {feedback && (
                <div className={`${feedback.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'} p-4 rounded-md flex items-center gap-3`} role="alert">
                    {feedback.type === 'success' ? <IconCheckCircle className="h-5 w-5" /> : <IconAlertTriangle className="h-5 w-5" />}
                    <span>{feedback.message}</span>
                </div>
            )}
            
            {!selectedVendor ? (
                <div className="text-center py-10 text-slate-500">
                    <p>Please add a software vendor in the Management section to begin mapping schemas.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {Object.entries(SCHEMA_FIELD_GROUPS).map(([groupName, fields]) => (
                        <div key={groupName} className="bg-white p-4 rounded-lg border shadow-sm">
                            <h3 className="text-md font-semibold text-slate-800 border-b pb-2 mb-3">{groupName}</h3>
                            <div className="space-y-3">
                                {fields.map(field => (
                                    <div key={field}>
                                        <label htmlFor={field} className="block text-xs font-medium text-slate-600">{formatFieldLabel(field as string)}</label>
                                        <input
                                            type="text"
                                            id={field}
                                            name={field}
                                            value={currentSchema[field as keyof ClientProfile] || ''}
                                            onChange={(e) => handleSchemaChange(field as keyof ClientProfile, e.target.value)}
                                            placeholder={`e.g. ${field.toUpperCase()}`}
                                            className="mt-1 bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500 block w-full p-2"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SchemaMapper;
