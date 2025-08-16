import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Branch, WeeklySummaryData, CategoryBreakdownData, RMPerformanceData, ClientProfile, FamilyGroupDeviationSummary, PendingDeviation, DashboardStats } from '../types';
import { api } from '../services/mockApi';
import { IconLoader, IconLineChart, IconPieChart, IconUsers, IconFamilyGroup, IconDownload, IconCheckCircle, IconWallet, IconArrowRightLeft, IconShieldCheck } from './Icons';
import { formatCurrency } from '../utils/helpers';
import PageHeader from './PageHeader';
import { useData } from '../contexts/DataContext';
import WeekDatePicker from './WeekDatePicker';
import SummaryTab from './SummaryTab';
import CategoryTab from './CategoryTab';
import RMTab from './RMTab';
import FamilyGroupDeviationTable from './FamilyGroupDeviationTable';
import ClientsTab from './ClientsTab';
import ApprovalsTab from './ApprovalsTab';

interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  iconBgColor: string;
  loading: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, iconBgColor, loading }) => (
  <div className="bg-white rounded-lg shadow p-4 flex items-center">
    <div className={`rounded-full p-3 ${iconBgColor}`}>
      <Icon className="h-5 w-5 text-white" />
    </div>
    <div className="ml-3">
      <p className="text-xs font-medium text-slate-500">{title}</p>
      <p className="text-xl font-bold text-slate-800">{loading ? '...' : value}</p>
    </div>
  </div>
);

type ActionType = 'approve' | 'approve-update' | 'reject';

const BranchReport: React.FC = () => {
    const { branchId } = ReactRouterDOM.useParams();
    const navigate = ReactRouterDOM.useNavigate();
    const { branches, weekDates, loading: contextLoading, rms, branchManagers, familyGroups: allFamilyGroups, accountCategories, refetchClientsForBranch } = useData();
    
    // Data state
    const [loading, setLoading] = useState(true);
    const [branch, setBranch] = useState<Branch | null>(null);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [weeklySummary, setWeeklySummary] = useState<WeeklySummaryData[]>([]);
    const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryBreakdownData[]>([]);
    const [rmPerformance, setRmPerformance] = useState<RMPerformanceData[]>([]);
    const [clients, setClients] = useState<ClientProfile[]>([]);
    const [familyGroupDeviations, setFamilyGroupDeviations] = useState<FamilyGroupDeviationSummary[]>([]);
    const [pendingApprovals, setPendingApprovals] = useState<PendingDeviation[]>([]);
    
    // Control state
    const [activeTab, setActiveTab] = useState('summary');
    const [selectedWeek, setSelectedWeek] = useState<string>('');
    const pdfRef = useRef<HTMLDivElement>(null);

    const branchSpecificRms = useMemo(() => rms.filter(r => r.branchId === branchId), [rms, branchId]);
    const branchSpecificBms = useMemo(() => branchManagers.filter(bm => bm.branchId === branchId), [branchManagers, branchId]);
    const branchSpecificFgs = useMemo(() => allFamilyGroups.filter(fg => fg.branchId === branchId), [allFamilyGroups, branchId]);

    useEffect(() => {
        if (!branchId && !contextLoading && branches.length > 0) {
            navigate(`/reports/${branches[0].id}`, { replace: true });
        }
    }, [branchId, contextLoading, branches, navigate]);
    
    useEffect(() => {
        if (weekDates.length > 0 && (!selectedWeek || !weekDates.includes(selectedWeek))) {
            setSelectedWeek(weekDates[0]);
        } else if (weekDates.length === 0) {
            setSelectedWeek('');
        }
    }, [weekDates, selectedWeek]);

    const fetchDataForWeek = useCallback(async () => {
        if (!branchId || !selectedWeek) {
             if (branchId) setLoading(false);
             return;
        }

        setLoading(true);
        try {
            const [ branchData, statsData, summaryData, categoryData, rmData, clientsData, familyDeviationData, pendingApprovalsData ] = await Promise.all([
                api.getBranchById(branchId),
                api.getDashboardStats(branchId, selectedWeek),
                api.getWeeklySummary(branchId, selectedWeek),
                api.getCategoryBreakdown(branchId, selectedWeek),
                api.getRMPerformance(branchId, selectedWeek),
                api.getBranchClientsForWeek(branchId, selectedWeek),
                api.getGroupDeviationSummary(branchId, selectedWeek),
                api.getPendingDeviationsForBranch(branchId, selectedWeek),
            ]);
            
            if (branchData) setBranch(branchData); else navigate('/');
            setStats(statsData);
            setWeeklySummary(summaryData);
            setCategoryBreakdown(categoryData);
            setRmPerformance(rmData);
            setClients(clientsData);
            setFamilyGroupDeviations(familyDeviationData);
            setPendingApprovals(pendingApprovalsData);

        } catch (err) {
            console.error("Failed to load branch report data:", err);
        } finally {
            setLoading(false);
        }
    }, [branchId, selectedWeek, navigate]);
    
    const handleApprovalAction = async (deviationId: string, type: ActionType, note: string) => {
        try {
            switch(type) {
                case 'approve':
                    await api.approveDeviation(deviationId, false, note);
                    break;
                case 'approve-update':
                    await api.approveDeviation(deviationId, true, note);
                    break;
                case 'reject':
                    await api.rejectDeviation(deviationId, note);
                    break;
            }
            await fetchDataForWeek(); // Refreshes the list
        } catch (error) {
            console.error("Failed to action deviation:", error);
            alert("An error occurred during the action.");
        }
    };

    const handleClientDataRefresh = async () => {
        if (!branchId || !selectedWeek) return;
        setLoading(true);
        try {
            const freshClients = await refetchClientsForBranch(branchId, selectedWeek);
            setClients(freshClients);
        } catch(e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
       fetchDataForWeek();
    }, [fetchDataForWeek]);


    const downloadPdf = () => {
        if (!branch || !selectedWeek) return;
        const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
        const addSection = (title: string, head: any[], body: any[], startY: number): number => {
            doc.setFontSize(14);
            doc.text(title, 14, startY);
            (doc as any).autoTable({
                startY: startY + 4,
                head: head,
                body: body,
                theme: 'striped',
                headStyles: { fillColor: [37, 99, 235] }
            });
            return (doc as any).lastAutoTable.finalY + 10;
        };

        doc.setFontSize(18);
        doc.text(`Branch Report: ${branch.name}`, 14, 20);
        doc.setFontSize(12);
        doc.text(`Week Ending: ${selectedWeek}`, 14, 28);
        
        let currentY = 40;

        // Weekly Summary table
        const weeklySummaryHeaders = [['Week', 'Total CR', 'Total DR', 'Clients Updated', 'KYC Changes']];
        const weeklySummaryBody = weeklySummary.map(d => [d.week, formatCurrency(d.totalCR), formatCurrency(d.totalDR), d.clientsUpdated, d.kycChanges]);
        currentY = addSection('Weekly Summary', weeklySummaryHeaders, weeklySummaryBody, currentY);

        // Category Breakdown
        const categoryHeaders = [['Category', 'Total Clients', 'Balance', 'CR', 'DR']];
        const categoryBody = categoryBreakdown.map(d => [d.categoryName, d.totalClients, formatCurrency(d.balance), formatCurrency(d.cr), formatCurrency(d.dr)]);
        currentY = addSection('Category Breakdown', categoryHeaders, categoryBody, currentY);

        // RM Performance
        const rmHeaders = [['RM Name', 'Clients', 'Total Portfolio', 'Weekly Change']];
        const rmBody = rmPerformance.map(d => [d.rmName, d.clients, formatCurrency(d.totalPortfolio), formatCurrency(d.weeklyChange)]);
        currentY = addSection('RM Performance', rmHeaders, rmBody, currentY);
        
        doc.addPage();
        currentY = 20;

        // Family Groups
        const fgHeaders = [['Group Name', '# Members', 'Total Set Balance', 'Total Actual Balance', 'Avg. Deviation (%)']];
        const fgBody = familyGroupDeviations.map(s => [s.groupName, s.memberCount, formatCurrency(s.totalSetBalance), formatCurrency(s.totalActualBalance), `${s.averageDeviation.toFixed(2)}%`]);
        currentY = addSection('Family Group Summary', fgHeaders, fgBody, currentY);

        // Client List
        const clientTableHeaders = [['Client Name', 'PAN', 'Category', 'RM', 'Balance']];
        const clientTableBody = clients.map(c => [
            c.nameFirstHolder,
            c.panPrimary,
            accountCategories.find(ac => ac.code === c.accountCategory)?.name || c.accountCategory,
            rms.find(r => r.id === c.rmId)?.name || 'N/A',
            formatCurrency(c.accountBalance)
        ]);
        addSection('Client List', clientTableHeaders, clientTableBody, currentY);

        doc.save(`report_${branch.code}_${selectedWeek}.pdf`);
    };

    if (contextLoading || (!branch && loading)) {
         return <div className="flex justify-center items-center h-full"><IconLoader className="animate-spin h-10 w-10 text-brand-blue-600"/></div>;
    }

    if (!branchId && !contextLoading && branches.length === 0) {
        return (
            <div className="text-center py-20 bg-white rounded-lg shadow">
                 <PageHeader
                    title="No Branches Available"
                    description="Please add a branch in Branch Management to view reports."
                    actions={
                        <ReactRouterDOM.Link to="/branch-management" className="mt-4 inline-block px-4 py-2 bg-brand-blue-600 text-white rounded-md hover:bg-brand-blue-700">
                            Go to Branch Management
                        </ReactRouterDOM.Link>
                    }
                />
            </div>
        );
    }

    const tabs = [
        { id: 'summary', label: 'Weekly Summary', icon: IconLineChart },
        { id: 'clients', label: 'Client List', icon: IconUsers },
        { id: 'category', label: 'Categories', icon: IconPieChart },
        { id: 'rm', label: 'RM Performance', icon: IconUsers },
        { id: 'family', label: 'Family Groups', icon: IconFamilyGroup },
        { id: 'approvals', label: 'Approvals', icon: IconShieldCheck },
    ];
    
    const renderTabContent = () => {
        if (loading) {
            return <div className="flex justify-center items-center h-80"><IconLoader className="animate-spin h-10 w-10 text-brand-blue-600"/></div>;
        }
        switch(activeTab) {
            case 'summary': return <SummaryTab data={weeklySummary}/>
            case 'category': return <CategoryTab data={categoryBreakdown}/>
            case 'rm': return <RMTab data={rmPerformance} branchId={branchId!} weekEnding={selectedWeek} />
            case 'family': return <FamilyGroupDeviationTable summaries={familyGroupDeviations} weekEnding={selectedWeek} />;
            case 'clients': return <ClientsTab 
                branchId={branchId!}
                clients={clients} 
                loading={loading}
                rms={branchSpecificRms}
                branchManagers={branchSpecificBms}
                familyGroups={branchSpecificFgs}
                accountCategories={accountCategories}
                onDataRefresh={handleClientDataRefresh}
            />
            case 'approvals': return <ApprovalsTab
                pendingDeviations={pendingApprovals}
                loading={loading}
                onAction={handleApprovalAction}
            />
            default: return null;
        }
    };

    return (
        <div className="space-y-6" ref={pdfRef}>
            <PageHeader
                title="Branch Report"
                description="A complete financial overview of branch activity."
                actions={
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4">
                        <div className="flex-1 min-w-[200px]">
                            <label htmlFor="branch-selector" className="block text-xs font-medium text-slate-600 mb-1">Branch</label>
                            <select id="branch-selector" value={branchId} onChange={e => navigate(`/reports/${e.target.value}`)} className="w-full bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500 block p-2.5 font-medium">
                                {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                        </div>
                        <div className="flex-1 min-w-[200px]">
                            <label htmlFor="report-date-picker" className="block text-xs font-medium text-slate-600 mb-1">Date</label>
                             <WeekDatePicker
                                id="report-date-picker"
                                availableDates={weekDates}
                                selectedDate={selectedWeek}
                                onSelectDate={setSelectedWeek}
                                popupAlignment="right"
                            />
                        </div>
                    </div>
                }
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <StatCard loading={loading} icon={IconUsers} title="Total Clients" value={stats?.totalClients.toString() || '0'} iconBgColor="bg-sky-500" />
                 <StatCard loading={loading} icon={IconWallet} title="Total Balance" value={stats ? formatCurrency(stats.totalBalance) : '...'} iconBgColor="bg-emerald-500" />
                 <StatCard loading={loading} icon={IconArrowRightLeft} title="Net Movement" value={stats ? formatCurrency(stats.netMovement) : '...'} iconBgColor="bg-amber-500" />
                 <StatCard loading={loading} icon={IconCheckCircle} title="Active Version" value={stats?.activeUploadVersion || '-'} iconBgColor="bg-indigo-500" />
            </div>
            
            <div className="bg-white rounded-lg shadow">
                 <div className="px-5 border-b border-slate-200">
                    <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
                        {tabs.map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === tab.id ? 'border-brand-blue-500 text-brand-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>
                                <tab.icon className="mr-2 h-5 w-5"/> {tab.label}
                            </button>
                        ))}
                         <div className="flex-grow flex justify-end items-center">
                            <button onClick={downloadPdf} disabled={loading} className="ml-auto inline-flex items-center px-3 py-1.5 bg-white border border-slate-300 text-xs font-medium rounded-md hover:bg-slate-50 shadow-sm disabled:opacity-50">
                                <IconDownload className="h-4 w-4 mr-2"/>
                                PDF
                            </button>
                        </div>
                    </nav>
                </div>
                <div className="p-5">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

export default BranchReport;