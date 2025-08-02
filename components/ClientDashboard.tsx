
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { api } from '../services/mockApi';
import { ClientProfile, Branch, RM, BranchManager, FamilyGroup, WeeklyTransactionHistory, AccountCategoryInfo } from '../types';
import { IconSearch, IconLoader, IconAlertTriangle, IconArrowLeft, IconCheckCircle } from './Icons';
import { formatCurrency } from '../utils/helpers';
import Table from './Table';

// --- Reusable Sub-components ---

const DetailItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:justify-between py-2.5 border-b border-slate-200 last:border-b-0">
    <dt className="text-sm font-medium text-slate-500 whitespace-nowrap mr-2">{label}</dt>
    <dd className="mt-1 text-sm text-slate-900 sm:mt-0 font-semibold text-left sm:text-right">{value || '-'}</dd>
  </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <div className={`bg-white rounded-lg shadow ${className}`}>
        <div className="p-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        </div>
        <div className="p-4">
            <dl>{children}</dl>
        </div>
    </div>
);

const TransactionHistory: React.FC<{ profile: ClientProfile }> = ({ profile }) => {
    const [history, setHistory] = useState<WeeklyTransactionHistory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        api.getClientWeeklyTransactions(profile.panPrimary, profile.branchId)
            .then(setHistory)
            .finally(() => setLoading(false));
    }, [profile.panPrimary, profile.branchId]);
    
    if(loading) return <div className="flex justify-center items-center h-40"><IconLoader className="animate-spin h-8 w-8 text-brand-blue-600"/></div>;
    
    const headers = ['Week Ending', 'Credit', 'Debit', 'Closing Balance'];
    const tableData = history.map(h => [
        h.weekEnding,
        <span className="font-medium text-emerald-600">{formatCurrency(h.weeklyCr)}</span>,
        <span className="font-medium text-rose-600">{formatCurrency(h.weeklyDr)}</span>,
        formatCurrency(h.closingBalance),
    ]);

    return (
        <Table headers={headers} data={tableData} emptyStateMessage="No transaction history found."/>
    );
};


// --- Main Dashboard Component ---

const ClientDashboard: React.FC = () => {
    const { pan } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const cameFrom = location.state?.from;

    const [searchPan, setSearchPan] = useState(pan || '');
    const [loading, setLoading] = useState(false);
    const [clientProfiles, setClientProfiles] = useState<ClientProfile[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [activeBranchId, setActiveBranchId] = useState<string>('');

    // Editing state
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<{ rmId: string, branchManagerId: string, familyGroupId: string | null }>({ rmId: '', branchManagerId: '', familyGroupId: null });
    const [isSaving, setIsSaving] = useState(false);
    
    // Preload all relational data for lookups
    const [branches, setBranches] = useState<Branch[]>([]);
    const [rms, setRms] = useState<RM[]>([]);
    const [branchManagers, setBranchManagers] = useState<BranchManager[]>([]);
    const [familyGroups, setFamilyGroups] = useState<FamilyGroup[]>([]);
    const [accountCategories, setAccountCategories] = useState<AccountCategoryInfo[]>([]);

    const fetchRelationalData = useCallback(async () => {
         const [branchData, rmData, bmData, fgData, catData] = await Promise.all([
            api.getBranches(),
            api.getRms(),
            api.getBranchManagers(),
            api.getFamilyGroups(),
            api.getAccountCategories(),
        ]);
        setBranches(branchData);
        setRms(rmData);
        setBranchManagers(bmData);
        setFamilyGroups(fgData);
        setAccountCategories(catData);
    }, []);
    
    useEffect(() => {
        fetchRelationalData();
    }, [fetchRelationalData]);

    const dataMaps = useMemo(() => ({
        branch: new Map(branches.map(b => [b.id, b.name])),
        rm: new Map(rms.map(r => [r.id, r.name])),
        branchManager: new Map(branchManagers.map(bm => [bm.id, bm.name])),
        familyGroup: new Map(familyGroups.map(fg => [fg.id, fg.name])),
        accountCategory: new Map(accountCategories.map(c => [c.code, c.name])),
    }), [branches, rms, branchManagers, familyGroups, accountCategories]);

    const fetchClientData = useCallback(async (panToFetch: string) => {
        setLoading(true);
        setError(null);
        setClientProfiles([]);
        try {
            const profiles = await api.getClientsByPan(panToFetch);
            if (profiles.length > 0) {
                setClientProfiles(profiles);
                setActiveBranchId(profiles[0].branchId);
            } else {
                setError(`No client found with PAN: ${panToFetch}`);
            }
        } catch {
            setError('An error occurred while searching.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (pan) {
            fetchClientData(pan);
        }
    }, [pan, fetchClientData]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchPan && searchPan !== pan) {
            navigate(`/clients/${searchPan}`);
        }
    };
    
    const primaryProfile = clientProfiles.length > 0 ? clientProfiles[0] : null;
    const activeProfile = clientProfiles.find(p => p.branchId === activeBranchId) || null;

    const handleEditToggle = () => {
        if (activeProfile) {
            setEditData({
                rmId: activeProfile.rmId,
                branchManagerId: activeProfile.branchManagerId,
                familyGroupId: activeProfile.familyGroupId,
            });
            setIsEditing(!isEditing);
        }
    };

    const handleEditDataChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setEditData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSaveChanges = async () => {
        if (!activeProfile) return;
        setIsSaving(true);
        try {
            await api.updateClientProfile(activeProfile.id, editData);
            // Refetch data to see changes
            await fetchClientData(activeProfile.panPrimary);
            setIsEditing(false);
        } catch (err) {
            console.error("Failed to save changes", err);
            // Optionally show error toast
        } finally {
            setIsSaving(false);
        }
    };

    const branchScopedRMs = useMemo(() => rms.filter(r => r.branchId === activeBranchId), [rms, activeBranchId]);
    const branchScopedBMs = useMemo(() => branchManagers.filter(bm => bm.branchId === activeBranchId), [branchManagers, activeBranchId]);
    const branchScopedFGs = useMemo(() => familyGroups.filter(fg => fg.branchId === activeBranchId), [familyGroups, activeBranchId]);


    const renderAccountDetails = () => {
        if (!activeProfile) return null;
        if (isEditing) {
            return (
                <div className="space-y-4">
                    <div>
                        <label htmlFor="rmId" className="block text-sm font-medium text-slate-700">Relationship Manager</label>
                        <select id="rmId" name="rmId" value={editData.rmId} onChange={handleEditDataChange} className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-500 focus:border-brand-blue-500 sm:text-sm">
                            {branchScopedRMs.map(rm => <option key={rm.id} value={rm.id}>{rm.name} ({rm.code})</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="branchManagerId" className="block text-sm font-medium text-slate-700">Branch Manager</label>
                        <select id="branchManagerId" name="branchManagerId" value={editData.branchManagerId} onChange={handleEditDataChange} className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-500 focus:border-brand-blue-500 sm:text-sm">
                            {branchScopedBMs.map(bm => <option key={bm.id} value={bm.id}>{bm.name} ({bm.code})</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="familyGroupId" className="block text-sm font-medium text-slate-700">Family Group</label>
                        <select id="familyGroupId" name="familyGroupId" value={editData.familyGroupId || ''} onChange={handleEditDataChange} className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-500 focus:border-brand-blue-500 sm:text-sm">
                            <option value="">N/A</option>
                            {branchScopedFGs.map(fg => <option key={fg.id} value={fg.id}>{fg.name} ({fg.code})</option>)}
                        </select>
                    </div>
                </div>
            );
        }
        return (
             <dl className="space-y-1">
                <DetailItem label="Account Number" value={activeProfile.accountNumber} />
                <DetailItem label="Account Type" value={activeProfile.accountType} />
                <DetailItem label="Category" value={`${dataMaps.accountCategory.get(activeProfile.accountCategory) || activeProfile.accountCategory} (${activeProfile.accountCategory})`} />
                <DetailItem label="Branch Manager" value={dataMaps.branchManager.get(activeProfile.branchManagerId)} />
                <DetailItem label="Relationship Manager" value={dataMaps.rm.get(activeProfile.rmId)} />
                <DetailItem label="Family Group" value={activeProfile.familyGroupId ? dataMaps.familyGroup.get(activeProfile.familyGroupId) : 'N/A'} />
                <DetailItem label="Joint Holder 1" value={activeProfile.jointName1} />
                <DetailItem label="Current Balance" value={<span className="font-bold text-lg">{formatCurrency(activeProfile.accountBalance)}</span>} />
            </dl>
        )
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow p-6 mb-8 relative">
                {cameFrom && (
                    <Link
                        to={cameFrom}
                        className="absolute top-6 right-6 inline-flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-600 text-sm font-medium rounded-md hover:bg-slate-50 shadow-sm"
                    >
                        <IconArrowLeft className="h-4 w-4 mr-2"/>
                        Back to Report
                    </Link>
                )}
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Client Dashboard</h2>
                <p className="text-slate-500 mb-6">Enter a client's Primary PAN to retrieve their full profile and multi-branch history.</p>
                <form onSubmit={handleSearch} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={searchPan}
                        onChange={(e) => setSearchPan(e.target.value.toUpperCase())}
                        placeholder="Enter PAN to search..."
                        className="flex-grow bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500 block w-full p-2.5"
                        maxLength={10}
                    />
                    <button type="submit" disabled={loading || !searchPan} className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-center text-white bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700 focus:ring-4 focus:ring-brand-blue-300 disabled:bg-slate-400 disabled:cursor-not-allowed">
                        {loading ? <IconLoader className="animate-spin h-5 w-5" /> : <IconSearch className="h-5 w-5" />}
                    </button>
                </form>
            </div>

            {/* Loading/Error/Result States */}
            {loading && <div className="flex justify-center items-center h-64"><IconLoader className="animate-spin h-10 w-10 text-brand-blue-600"/></div>}

            {error && (
                <div className="bg-rose-100 border-l-4 border-rose-500 text-rose-700 p-4 rounded-md flex items-center" role="alert">
                    <IconAlertTriangle className="h-5 w-5 mr-3"/>
                    <p>{error}</p>
                </div>
            )}
            
            {primaryProfile && (
                <div className="space-y-8">
                     {/* Primary Info Header */}
                     <div>
                        <h2 className="text-3xl font-bold text-slate-800">{primaryProfile.nameFirstHolder}</h2>
                        <p className="text-lg text-slate-500 font-mono">{primaryProfile.panPrimary}</p>
                    </div>

                    {/* Shared Details Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Section title="Contact & Communication">
                             <DetailItem label="Mobile" value={primaryProfile.contactMobile} />
                             <DetailItem label="Email" value={primaryProfile.contactEmail} />
                             <DetailItem label="Date of Birth" value={primaryProfile.contactDob} />
                             <DetailItem label="Address" value={`${[primaryProfile.address1, primaryProfile.address2, primaryProfile.city, primaryProfile.pinCode].filter(Boolean).join(', ')}`} />
                        </Section>
                         <Section title="External Bank Details">
                            <DetailItem label="Bank Name" value={primaryProfile.bankName} />
                            <DetailItem label="Account Number" value={primaryProfile.bankAcNo} />
                            <DetailItem label="IFSC Code" value={primaryProfile.bankIfsc} />
                            <DetailItem label="MICR Code" value={primaryProfile.bankMicr} />
                        </Section>
                    </div>
                    
                    {/* Branch-Specific Tabs Section */}
                    <div>
                        <h3 className="text-2xl font-semibold text-slate-800 mb-4">Branch-Specific Accounts</h3>
                        <div className="border-b border-slate-200">
                            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                                {clientProfiles.map(profile => (
                                    <button key={profile.branchId} onClick={() => { setActiveBranchId(profile.branchId); setIsEditing(false); }}
                                        className={`${activeBranchId === profile.branchId ? 'border-brand-blue-500 text-brand-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                                    >
                                        {dataMaps.branch.get(profile.branchId) || 'Unknown Branch'}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Tab Content */}
                        <div className="mt-6 bg-white rounded-lg shadow p-6">
                            {activeProfile && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Left column: Key info */}
                                    <div>
                                        <div className="flex justify-between items-center mb-3">
                                            <h4 className="text-lg font-semibold text-slate-700">Account Details</h4>
                                            {!isEditing ? (
                                                <button onClick={handleEditToggle} className="text-sm text-brand-blue-600 hover:underline">Edit Assignments</button>
                                            ) : (
                                                <div className="space-x-2">
                                                    <button onClick={handleEditToggle} className="text-sm text-slate-600 hover:underline">Cancel</button>
                                                    <button onClick={handleSaveChanges} disabled={isSaving} className="text-sm font-semibold text-brand-blue-600 hover:underline disabled:text-slate-400">
                                                        {isSaving ? 'Saving...' : 'Save'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        {renderAccountDetails()}
                                    </div>
                                    {/* Right column: Transactions */}
                                    <div>
                                        <h4 className="text-lg font-semibold text-slate-700 mb-3">Historical Transactions</h4>
                                        <TransactionHistory profile={activeProfile} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Initial State Message */}
            {!pan && !loading && !error && (
                <div className="text-center text-slate-500 py-10">
                    <p>Please enter a PAN number above to search for a client.</p>
                </div>
            )}
        </div>
    );
};

export default ClientDashboard;
