

import React, { useState, useEffect, useCallback } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { api } from '../services/mockApi';
import { ClientProfile } from '../types';
import { IconLoader, IconAlertTriangle, IconArrowLeft, IconEdit, IconUser, IconMail, IconPhone, IconMapPin, IconBank, IconHome, IconShieldCheck, IconUsers, IconFileEdit } from './Icons';
import { useData } from '../contexts/DataContext';
import ClientDeviationCard from './ClientDeviationCard';
import ClientDeviationTrendChart from './ClientDeviationTrendChart';
import SetBalanceUpdateModal from './SetBalanceUpdateModal';
import ClientSetBalanceHistoryModal from './ClientSetBalanceHistoryModal';
import EditAssignmentsModal from './EditAssignmentsModal';
import clsx from 'clsx';
import PageHeader from './PageHeader';
import ClientPortfolioHeader from './ClientPortfolioHeader';
import KycHistoryCard from './KycHistoryCard';
import Card from './Card';
import ActivityFeedCard from './ActivityFeedCard';
import TransactionHistoryCard from './TransactionHistoryCard';

const getDeviationBadgeColor = (percent: number): string => {
    const absPercent = Math.abs(percent);
    if (absPercent <= 5) return 'bg-emerald-500';
    if (absPercent <= 15) return 'bg-amber-500';
    return 'bg-rose-500';
};

const DetailItem: React.FC<{ icon: React.ElementType, label: string; value: React.ReactNode, className?: string }> = ({ icon: Icon, label, value, className }) => (
  <div className={clsx("flex items-start gap-3", className)}>
    <Icon className="h-4 w-4 text-slate-400 mt-1 flex-shrink-0" />
    <div className="flex-1">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-semibold text-slate-800 break-words">{value}</p>
    </div>
  </div>
);

interface ClientDashboardProps {
    panProp?: string;
    isModalMode?: boolean;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ panProp, isModalMode = false }) => {
    const { pan: panFromParams } = ReactRouterDOM.useParams();
    const pan = panProp || panFromParams;

    const location = ReactRouterDOM.useLocation();
    const cameFrom = location.state?.from;

    const { loading: contextLoading, getBranchName, rms, branchManagers, familyGroups } = useData();

    const [loading, setLoading] = useState(!!pan);
    const [clientProfiles, setClientProfiles] = useState<ClientProfile[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [activeBranchId, setActiveBranchId] = useState<string>('');
    
    // Modal states
    const [isUpdateBalanceModalOpen, setUpdateBalanceModalOpen] = useState(false);
    const [isHistoryModalOpen, setHistoryModalOpen] = useState(false);
    const [isEditAssignmentsModalOpen, setEditAssignmentsModalOpen] = useState(false);
    const [isKycPanelOpen, setIsKycPanelOpen] = useState(false);

    const fetchClientData = useCallback(async (panToFetch: string) => {
        setLoading(true);
        setError(null);
        try {
            const profiles = await api.getClientsByPan(panToFetch);
            if (profiles.length > 0) {
                setClientProfiles(profiles);
                const sourceBranchId = location.state?.sourceBranchId;
                setActiveBranchId((sourceBranchId && profiles.some(p => p.branchId === sourceBranchId)) ? sourceBranchId : profiles[0].branchId);
            } else {
                setError(`No client found with PAN: ${panToFetch}`);
                setClientProfiles([]);
            }
        } catch {
            setError('An error occurred while searching.');
        } finally {
            setLoading(false);
        }
    }, [location.state]);

    useEffect(() => {
        if (pan) {
            fetchClientData(pan);
        }
    }, [pan, fetchClientData]);
    
    const activeProfile = clientProfiles.find(p => p.branchId === activeBranchId) || null;

    const handleSuccess = () => {
        if(pan) fetchClientData(pan);
    };

    if (contextLoading || loading) {
         return <div className="flex justify-center items-center h-full"><IconLoader className="animate-spin h-10 w-10 text-brand-blue-600"/></div>;
    }
    
    if (error) {
        return (
            <div className="bg-rose-100 border-l-4 border-rose-500 text-rose-700 p-4 rounded-md flex items-center" role="alert">
                <IconAlertTriangle className="h-5 w-5 mr-3"/>
                <p>{error}</p>
            </div>
        );
    }
    
    if (!pan || !activeProfile) {
        return (
            <div className="text-center text-slate-500 py-10">
                <p>Use the global search in the header to find a client.</p>
            </div>
        );
    }

    return (
        <div className={isModalMode ? 'p-6' : ''}>
            <PageHeader
                title={`Client 360° Hub - ${getBranchName(activeProfile.branchId)}`}
                actions={ cameFrom && !isModalMode && (
                    <ReactRouterDOM.Link to={cameFrom} className="inline-flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-600 text-sm font-medium rounded-md hover:bg-slate-50 shadow-sm">
                        <IconArrowLeft className="h-4 w-4 mr-2"/> Back
                    </ReactRouterDOM.Link>
                )}
            />
            
            <div className="sticky top-0 z-20 bg-slate-100/90 backdrop-blur-sm pt-2 pb-4 -mt-6">
                 <ClientPortfolioHeader
                    pan={pan}
                    onToggleKycHistory={() => setIsKycPanelOpen(p => !p)}
                    isKycHistoryOpen={isKycPanelOpen}
                />
            </div>
            
            {isKycPanelOpen && (
                <div className="mt-6">
                    <KycHistoryCard pan={pan} onClose={() => setIsKycPanelOpen(false)} />
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                
                {/* Branch Navigation Column */}
                <div className="lg:col-span-1">
                     <Card title="Client Accounts">
                        <nav className="space-y-2">
                            {clientProfiles.map(profile => {
                                const deviationPercent = profile.setBalance ? ((profile.accountBalance - profile.setBalance) / profile.setBalance) * 100 : 0;
                                return (
                                    <button
                                        key={profile.branchId}
                                        onClick={() => setActiveBranchId(profile.branchId)}
                                        className={clsx(
                                            'w-full flex items-center justify-between text-left p-3 rounded-lg transition-colors',
                                            activeBranchId === profile.branchId
                                                ? 'bg-brand-blue-600 text-white shadow'
                                                : 'hover:bg-slate-200'
                                        )}
                                    >
                                        <span className="font-semibold">{getBranchName(profile.branchId)}</span>
                                        <span className={`h-3 w-3 rounded-full ${getDeviationBadgeColor(deviationPercent)} border-2 ${activeBranchId === profile.branchId ? 'border-white' : 'border-slate-100'}`}></span>
                                    </button>
                                )
                            })}
                        </nav>
                     </Card>
                </div>

                {/* Main Dynamic Content Column */}
                <div className="lg:col-span-2 xl:col-span-2 space-y-6">
                    <Card title="Account Assignments" actions={
                        <button onClick={() => setEditAssignmentsModalOpen(true)} className="text-sm font-semibold text-brand-blue-600 hover:underline inline-flex items-center gap-1.5">
                            <IconEdit className="h-4 w-4" /> Edit
                        </button>
                    }>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <DetailItem icon={IconHome} label="Account Number" value={activeProfile.accountNumber} />
                            <DetailItem icon={IconUser} label="RM" value={rms.find(r => r.id === activeProfile.rmId)?.name || 'N/A'} />
                            <DetailItem icon={IconUser} label="BM" value={branchManagers.find(bm => bm.id === activeProfile.branchManagerId)?.name || 'N/A'} />
                            <DetailItem icon={IconHome} label="Account Type" value={activeProfile.accountType} />
                            <DetailItem icon={IconUser} label="Family Group" value={familyGroups.find(fg => fg.id === activeProfile.familyGroupId)?.name || 'N/A'} />
                        </div>
                    </Card>

                    <ClientDeviationCard 
                        client={activeProfile}
                        weekEnding={useData().weekDates[0]}
                        onUpdateBalance={() => setUpdateBalanceModalOpen(true)}
                        onViewHistory={() => setHistoryModalOpen(true)}
                    />
                    <ClientDeviationTrendChart clientId={activeProfile.id} />
                    <TransactionHistoryCard profile={activeProfile} />
                    <ActivityFeedCard pan={pan} />
                </div>

                {/* Static Info Column */}
                <div className="lg:col-span-1 xl:col-span-1">
                     <div className="space-y-6">
                         <Card title="Contact Information">
                            <div className="space-y-4">
                               <DetailItem icon={IconPhone} label="Mobile Number" value={<a href={`tel:${activeProfile.contactMobile}`} className="text-brand-blue-600 hover:underline">{activeProfile.contactMobile}</a>} />
                               <DetailItem icon={IconMail} label="Email Address" value={<a href={`mailto:${activeProfile.contactEmail}`} className="text-brand-blue-600 hover:underline">{activeProfile.contactEmail}</a>}/>
                           </div>
                         </Card>
                         <Card title="Communication Address">
                             <div className="space-y-4">
                               <DetailItem icon={IconMapPin} label="Address" value={[activeProfile.address1, activeProfile.address2, activeProfile.address3, activeProfile.address4].filter(Boolean).join(', ')} />
                               <DetailItem icon={IconMapPin} label="City / PIN" value={`${activeProfile.city} - ${activeProfile.pinCode}`} />
                               <DetailItem icon={IconMapPin} label="State / Country" value={`${activeProfile.state}, ${activeProfile.country}`} />
                           </div>
                         </Card>
                          <Card title="External Bank Details">
                             <div className="space-y-4">
                               <DetailItem icon={IconBank} label="Bank Name" value={activeProfile.bankName} />
                               <DetailItem icon={IconBank} label="Account Number" value={activeProfile.bankAcNo} />
                               <DetailItem icon={IconBank} label="IFSC Code" value={activeProfile.bankIfsc} />
                               <DetailItem icon={IconBank} label="MICR Code" value={activeProfile.bankMicr} />
                           </div>
                         </Card>
                    </div>
                </div>
            </div>
            
            {/* Modals */}
            {isUpdateBalanceModalOpen && (
                <SetBalanceUpdateModal
                    isOpen={isUpdateBalanceModalOpen}
                    onClose={() => setUpdateBalanceModalOpen(false)}
                    clientId={activeProfile.id}
                    clientName={activeProfile.nameFirstHolder}
                    onSuccess={handleSuccess}
                />
            )}
            {isHistoryModalOpen && (
                <ClientSetBalanceHistoryModal
                    isOpen={isHistoryModalOpen}
                    onClose={() => setHistoryModalOpen(false)}
                    clientId={activeProfile.id}
                />
            )}
            {isEditAssignmentsModalOpen && (
                <EditAssignmentsModal
                    isOpen={isEditAssignmentsModalOpen}
                    onClose={() => setEditAssignmentsModalOpen(false)}
                    profile={activeProfile}
                    onSuccess={handleSuccess}
                />
            )}
        </div>
    );
};

export default ClientDashboard;