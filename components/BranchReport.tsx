import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Branch, WeeklySummaryData, CategoryBreakdownData, RMPerformanceData, FamilyGroupData, ClientProfile, RM, BranchManager, FamilyGroup, AccountCategoryInfo } from '../types';
import { api } from '../services/mockApi';
import { IconLoader, IconLineChart, IconPieChart, IconUsers, IconFamilyGroup, IconDownload, IconTable, IconSearch, IconChevronDown, IconFilter } from './Icons';
import { formatCurrency, formatCurrencyShort } from '../utils/helpers';
import Table from './Table';
import PaginationControls from './PaginationControls';

type SortableClientKeys = 'nameFirstHolder' | 'panPrimary' | 'weeklyCr' | 'weeklyDr' | 'accountBalance';

const ExpandedClientList: React.FC<{ entityId: string; branchId: string; entityType: 'rm' | 'familyGroup' }> = ({ entityId, branchId, entityType }) => {
    const [clients, setClients] = useState<ClientProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState<{ key: SortableClientKeys; direction: 'asc' | 'desc' }>({ key: 'nameFirstHolder', direction: 'asc' });
    const location = useLocation();

    useEffect(() => {
        setLoading(true);
        const fetchClients = async () => {
            try {
                let clientData: ClientProfile[];
                if (entityType === 'rm') {
                    clientData = await api.getClientsByRmId(entityId, branchId);
                } else {
                    clientData = await api.getClientsByFamilyGroupId(entityId, branchId);
                }
                setClients(clientData);
            } catch (error) {
                console.error(`Failed to fetch clients for ${entityType} ${entityId}`, error);
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, [entityId, branchId, entityType]);
    
    const sortedClients = useMemo(() => {
        let sortableClients = [...clients];
        if (sortConfig !== null) {
            sortableClients.sort((a, b) => {
                const aValue = a[sortConfig.key] ?? 0;
                const bValue = b[sortConfig.key] ?? 0;
                
                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableClients;
    }, [clients, sortConfig]);

    const requestSort = (key: SortableClientKeys) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key: SortableClientKeys) => {
        if (!sortConfig || sortConfig.key !== key) {
            return null;
        }
        return (
            <IconChevronDown
                className={`w-4 h-4 ml-1 inline-block transition-transform ${
                    sortConfig.direction === 'asc' ? 'transform rotate-180' : ''
                }`}
            />
        );
    };

    const headers: { key: SortableClientKeys, label: string, className?: string }[] = [
        { key: 'nameFirstHolder', label: 'Name' },
        { key: 'panPrimary', label: 'PAN' },
        { key: 'weeklyCr', label: 'Weekly CR', className: 'text-right' },
        { key: 'weeklyDr', label: 'Weekly DR', className: 'text-right' },
        { key: 'accountBalance', label: 'Net Balance', className: 'text-right' },
    ];

    if (loading) {
        return <div className="flex justify-center items-center p-4"><IconLoader className="animate-spin h-6 w-6 text-brand-blue-600" /></div>;
    }

    if (clients.length === 0) {
        return <p className="text-center text-slate-500 p-4">No clients found for this selection.</p>;
    }
    
    return (
        <div className="overflow-x-auto max-h-96">
            <table className="w-full text-sm text-left text-slate-500">
                <thead className="text-xs text-slate-700 uppercase bg-slate-100 sticky top-0 z-10">
                    <tr>
                        {headers.map(({ key, label, className }) => (
                            <th key={key} scope="col" className={`px-4 py-3 ${className || ''}`}>
                                <button onClick={() => requestSort(key)} className="flex items-center hover:text-slate-900 font-bold w-full">
                                    <span className="flex-1 text-left">{label}</span>
                                    {getSortIndicator(key)}
                                </button>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {sortedClients.map(client => (
                        <tr key={client.id} className="border-b hover:bg-slate-50">
                            <td className="px-4 py-3 font-medium text-slate-900 whitespace-nowrap">
                                <Link to={`/clients/${client.panPrimary}`} state={{ from: location.pathname }} className="hover:underline text-brand-blue-600">
                                    {client.nameFirstHolder}
                                </Link>
                            </td>
                            <td className="px-4 py-3 font-mono">{client.panPrimary}</td>
                            <td className="px-4 py-3 text-emerald-600 text-right">{formatCurrency(client.weeklyCr || 0)}</td>
                            <td className="px-4 py-3 text-rose-600 text-right">{formatCurrency(client.weeklyDr || 0)}</td>
                            <td className="px-4 py-3 font-semibold text-slate-800 text-right">{formatCurrency(client.accountBalance)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


const SummaryTab: React.FC<{ data: WeeklySummaryData[] }> = ({ data }) => {
    const headers = ['Week', 'Total CR', 'Total DR', 'Clients Updated', 'KYC Changes'];
    const tableData = data.map(d => [d.week, formatCurrency(d.totalCR), formatCurrency(d.totalDR), d.clientsUpdated, d.kycChanges]);
    return (
        <div className="space-y-6">
             <div className="h-80">
                 <ResponsiveContainer width="100%" height="100%">
                     <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                         <CartesianGrid strokeDasharray="3 3" />
                         <XAxis dataKey="week" />
                         <YAxis tickFormatter={formatCurrencyShort}/>
                         <Tooltip formatter={(value: number) => formatCurrency(value)}/>
                         <Legend />
                         <Line type="monotone" dataKey="totalCR" name="Total Credit" stroke="#10b981" activeDot={{ r: 8 }} />
                         <Line type="monotone" dataKey="totalDR" name="Total Debit" stroke="#f43f5e" />
                     </LineChart>
                 </ResponsiveContainer>
             </div>
             <Table headers={headers} data={tableData} emptyStateMessage="No weekly summary data available." />
        </div>
    );
};

const CategoryTab: React.FC<{ data: CategoryBreakdownData[] }> = ({ data }) => {
    const COLORS = ['#0ea5e9', '#10b981', '#f97316', '#8b5cf6', '#ec4899', '#f59e0b'];
    const chartData = data.map(d => ({name: d.categoryName, value: d.balance }));
    const headers = ['Category', 'Total Clients', 'Balance', 'CR', 'DR'];
    const tableData = data.map(d => [d.categoryName, d.totalClients, formatCurrency(d.balance), formatCurrency(d.cr), formatCurrency(d.dr)]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                            {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip formatter={(value: number) => formatCurrency(value)}/>
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="lg:col-span-3">
                <Table headers={headers} data={tableData} emptyStateMessage="No category breakdown data available."/>
            </div>
        </div>
    );
};

const RMTab: React.FC<{ data: RMPerformanceData[]; branchId: string; }> = ({ data, branchId }) => {
    const [expandedRmId, setExpandedRmId] = useState<string | null>(null);

    const handleToggle = (rmId: string) => {
        setExpandedRmId(prevId => (prevId === rmId ? null : rmId));
    };
    
    const headers = ['RM Name', 'Clients', 'Total Portfolio', 'Weekly Change'];

    if (data.length === 0) {
      return <div className="text-center py-10 text-slate-500">No RM performance data found for this branch.</div>
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-500">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                    <tr>{headers.map((h, i) => <th key={i} scope="col" className="px-6 py-3">{h}</th>)}</tr>
                </thead>
                <tbody>
                    {data.map((d) => (
                        <React.Fragment key={d.rmId}>
                            <tr className="bg-white border-b hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{d.rmName}</td>
                                <td className="px-6 py-4">
                                    <button 
                                        onClick={() => handleToggle(d.rmId)} 
                                        className="text-brand-blue-600 hover:underline font-semibold disabled:text-slate-400 disabled:no-underline disabled:cursor-not-allowed" 
                                        disabled={d.clients === 0}
                                        aria-expanded={expandedRmId === d.rmId}
                                        aria-controls={`client-list-${d.rmId}`}
                                    >
                                        {d.clients}
                                    </button>
                                </td>
                                <td className="px-6 py-4">{formatCurrency(d.totalPortfolio)}</td>
                                <td className={`px-6 py-4 ${d.weeklyChange >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {d.weeklyChange >= 0 ? '+' : ''}{formatCurrency(d.weeklyChange)}
                                </td>
                            </tr>
                            {expandedRmId === d.rmId && (
                                <tr id={`client-list-${d.rmId}`}>
                                    <td colSpan={headers.length} className="p-0">
                                        <div className="bg-slate-50 p-4">
                                            <ExpandedClientList entityId={d.rmId} branchId={branchId} entityType="rm" />
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const FamilyTab: React.FC<{ data: FamilyGroupData[], branchId: string }> = ({ data, branchId }) => {
    const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);

    const handleToggle = (groupId: string) => {
        setExpandedGroupId(prevId => (prevId === groupId ? null : groupId));
    };

    const headers = ['Group Name', '# of Clients', 'Combined Balance'];

    if (data.length === 0) {
      return <div className="text-center py-10 text-slate-500">No family group data found for this branch.</div>
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-500">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                    <tr>{headers.map((h, i) => <th key={i} scope="col" className="px-6 py-3">{h}</th>)}</tr>
                </thead>
                <tbody>
                    {data.map((d) => (
                        <React.Fragment key={d.groupId}>
                            <tr className="bg-white border-b hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{d.groupName}</td>
                                <td className="px-6 py-4">
                                    <button 
                                        onClick={() => handleToggle(d.groupId)}
                                        className="text-brand-blue-600 hover:underline font-semibold disabled:text-slate-400 disabled:no-underline disabled:cursor-not-allowed" 
                                        disabled={d.clients === 0}
                                        aria-expanded={expandedGroupId === d.groupId}
                                        aria-controls={`client-list-${d.groupId}`}
                                    >
                                        {d.clients}
                                    </button>
                                </td>
                                <td className="px-6 py-4">{formatCurrency(d.combinedBalance)}</td>
                            </tr>
                            {expandedGroupId === d.groupId && (
                                <tr id={`client-list-${d.groupId}`}>
                                    <td colSpan={headers.length} className="p-0">
                                        <div className="bg-slate-50 p-4">
                                            <ExpandedClientList entityId={d.groupId} branchId={branchId} entityType="familyGroup" />
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const ClientsTab: React.FC<{
    branchId: string;
    initialData: ClientProfile[];
    loading: boolean;
    availableWeeks: string[];
    selectedWeek: string;
    onWeekChange: (week: string) => void;
    rms: RM[];
    branchManagers: BranchManager[];
    familyGroups: FamilyGroup[];
    onDataRefresh: () => void;
}> = ({ branchId, initialData, loading, availableWeeks, selectedWeek, onWeekChange, rms, branchManagers, familyGroups, onDataRefresh }) => {
    const location = useLocation();
    const [filter, setFilter] = useState('');
    const [selectedClients, setSelectedClients] = useState<Set<string>>(new Set());
    const [bulkAssign, setBulkAssign] = useState({ rmId: '', bmId: '', fgId: '' });
    const [isApplying, setIsApplying] = useState(false);
    const selectAllRef = useRef<HTMLInputElement>(null);

    // Filter state
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        balanceMin: '',
        weeklyCrMin: '',
        weeklyDrMin: '',
    });

    // Sorting state
    type ClientListSortKeys = 'nameFirstHolder' | 'panPrimary' | 'weeklyCr' | 'weeklyDr' | 'accountBalance';
    const [sortConfig, setSortConfig] = useState<{ key: ClientListSortKeys; direction: 'asc' | 'desc' } | null>({ key: 'nameFirstHolder', direction: 'asc' });

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);


    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const resetFilters = () => {
        setFilters({ balanceMin: '', weeklyCrMin: '', weeklyDrMin: '' });
    };

    const requestSort = (key: ClientListSortKeys) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key: ClientListSortKeys) => {
        if (!sortConfig || sortConfig.key !== key) return null;
        return (
            <IconChevronDown
                className={`w-4 h-4 ml-1 inline-block transition-transform ${sortConfig.direction === 'asc' ? 'transform rotate-180' : ''}`}
            />
        );
    };

    const filteredData = useMemo(() => {
        return initialData.filter(d => {
            const textMatch = d.nameFirstHolder.toLowerCase().includes(filter.toLowerCase()) ||
                d.panPrimary.toLowerCase().includes(filter.toLowerCase()) ||
                d.accountNumber.includes(filter);

            const balance = d.accountBalance;
            const cr = d.weeklyCr || 0;
            const dr = d.weeklyDr || 0;

            const balanceMinMatch = filters.balanceMin === '' || balance >= parseFloat(filters.balanceMin);
            const crMinMatch = filters.weeklyCrMin === '' || cr >= parseFloat(filters.weeklyCrMin);
            const drMinMatch = filters.weeklyDrMin === '' || dr >= parseFloat(filters.weeklyDrMin);

            return textMatch && balanceMinMatch && crMinMatch && drMinMatch;
        });
    }, [initialData, filter, filters]);

    const sortedData = useMemo(() => {
        let sortableItems = [...filteredData];
        if (sortConfig) {
            sortableItems.sort((a, b) => {
                const aVal = a[sortConfig.key] ?? 0;
                const bVal = b[sortConfig.key] ?? 0;

                if (typeof aVal === 'string' && typeof bVal === 'string') {
                    return sortConfig.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
                }
                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [filteredData, sortConfig]);
    
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedData.slice(startIndex, startIndex + itemsPerPage);
    }, [sortedData, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(sortedData.length / itemsPerPage);

    // Reset page to 1 when filters or sorting change
    useEffect(() => {
        setCurrentPage(1);
    }, [filter, filters, sortConfig, itemsPerPage]);


    useEffect(() => {
        // Handle select all checkbox state
        if (selectAllRef.current) {
            const pageClientIds = new Set(paginatedData.map(d => d.id));
            const selectedOnPageCount = Array.from(selectedClients).filter(id => pageClientIds.has(id)).length;
            
            if (paginatedData.length > 0 && selectedOnPageCount === paginatedData.length) {
                selectAllRef.current.checked = true;
                selectAllRef.current.indeterminate = false;
            } else if (selectedOnPageCount > 0) {
                selectAllRef.current.checked = false;
                selectAllRef.current.indeterminate = true;
            } else {
                selectAllRef.current.checked = false;
                selectAllRef.current.indeterminate = false;
            }
        }
    }, [selectedClients, paginatedData]);


    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSelection = new Set(selectedClients);
        const pageClientIds = paginatedData.map(d => d.id);

        if (e.target.checked) {
            pageClientIds.forEach(id => newSelection.add(id));
        } else {
            pageClientIds.forEach(id => newSelection.delete(id));
        }
        setSelectedClients(newSelection);
    };

    const handleSelectClient = (clientId: string, isSelected: boolean) => {
        const newSelection = new Set(selectedClients);
        if (isSelected) {
            newSelection.add(clientId);
        } else {
            newSelection.delete(clientId);
        }
        setSelectedClients(newSelection);
    };

    const handleApplyBulkChanges = async () => {
      if (selectedClients.size === 0) return;
      
      const updates: { rmId?: string; branchManagerId?: string; familyGroupId?: string | null } = {};
      if (bulkAssign.rmId) updates.rmId = bulkAssign.rmId;
      if (bulkAssign.bmId) updates.branchManagerId = bulkAssign.bmId;
      if (bulkAssign.fgId) updates.familyGroupId = bulkAssign.fgId === "null" ? null : bulkAssign.fgId;
      
      if(Object.keys(updates).length === 0) {
        alert("Please select an assignment to apply.");
        return;
      }
      
      setIsApplying(true);
      try {
        await api.updateClientAssignments(Array.from(selectedClients), updates);
        onDataRefresh();
        setSelectedClients(new Set());
        setBulkAssign({ rmId: '', bmId: '', fgId: '' });
      } catch (error) {
        console.error("Failed to apply bulk changes", error);
        alert("An error occurred. Please try again.");
      } finally {
        setIsApplying(false);
      }
    };

    const headerConfig: { key: ClientListSortKeys | 'checkbox', label: string | React.ReactNode, sortable: boolean, className?: string }[] = [
        { key: 'checkbox', label: <input type="checkbox" className="form-checkbox h-4 w-4 text-brand-blue-600" ref={selectAllRef} onChange={handleSelectAll} aria-label="Select all on page"/>, sortable: false },
        { key: 'nameFirstHolder', label: 'Client Name', sortable: true },
        { key: 'panPrimary', label: 'PAN', sortable: true },
        { key: 'weeklyCr', label: 'Weekly Credit', sortable: true, className: 'text-right' },
        { key: 'weeklyDr', label: 'Weekly Debit', sortable: true, className: 'text-right' },
        { key: 'accountBalance', label: 'Closing Balance', sortable: true, className: 'text-right' },
    ];

    const headers: React.ReactNode[] = headerConfig.map(h => {
        if (h.sortable) {
            return (
                <button key={h.key} onClick={() => requestSort(h.key as ClientListSortKeys)} className="flex items-center hover:text-slate-900 font-bold w-full p-0 bg-transparent border-none">
                    <span className={`flex-1 ${h.className || 'text-left'}`}>{h.label}</span>
                    {getSortIndicator(h.key as ClientListSortKeys)}
                </button>
            )
        }
        return h.label;
    });
    
    const tableData = paginatedData.map(d => [
        <input type="checkbox" className="form-checkbox h-4 w-4 text-brand-blue-600"
          checked={selectedClients.has(d.id)}
          onChange={(e) => handleSelectClient(d.id, e.target.checked)}
          aria-label={`Select client ${d.nameFirstHolder}`}
        />,
        <Link to={`/clients/${d.panPrimary}`} state={{ from: location.pathname }} className="font-semibold text-brand-blue-600 hover:underline">
            {d.nameFirstHolder}
        </Link>,
        d.panPrimary,
        <span className="font-medium text-emerald-600 text-right block">{formatCurrency(d.weeklyCr || 0)}</span>,
        <span className="font-medium text-rose-600 text-right block">{formatCurrency(d.weeklyDr || 0)}</span>,
        <span className="font-semibold text-slate-800 text-right block">{formatCurrency(d.accountBalance)}</span>
    ]);

    return (
        <div className="space-y-4">
            <div className="space-y-4">
                <div className="flex justify-between items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-4 flex-grow">
                        <div className="relative flex-grow" style={{ maxWidth: '350px' }}>
                            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input type="text" placeholder="Search by name, PAN, or account..." value={filter} onChange={e => setFilter(e.target.value)}
                                className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500 block w-full p-2.5 pl-10" />
                        </div>
                        <button onClick={() => setShowFilters(s => !s)} className="inline-flex items-center px-3 py-2 bg-white border border-slate-300 text-slate-600 text-sm font-medium rounded-md hover:bg-slate-50 shadow-sm">
                            <IconFilter className="h-4 w-4 mr-2" />
                            <span>Filters</span>
                            <IconChevronDown className={`w-4 h-4 ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                        </button>
                    </div>
                    <div className="max-w-xs w-full">
                        <label htmlFor="week-selector" className="sr-only">Select Week</label>
                        <select id="week-selector" value={selectedWeek} onChange={(e) => onWeekChange(e.target.value)} disabled={availableWeeks.length === 0}
                            className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500 block w-full p-2.5">
                            {availableWeeks.length > 0 ? availableWeeks.map(week => <option key={week} value={week}>Week of {week}</option>) : <option>No uploads found</option>}
                        </select>
                    </div>
                </div>

                {showFilters && (
                    <div className="p-4 bg-slate-50 rounded-lg border">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <div>
                                <label htmlFor="balanceMin" className="block text-xs font-medium text-slate-600 mb-1">Min Balance</label>
                                <input id="balanceMin" type="number" name="balanceMin" value={filters.balanceMin} onChange={handleFilterChange} placeholder="e.g. 50000"
                                    className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500 block w-full p-2" />
                            </div>
                            <div>
                                <label htmlFor="weeklyCrMin" className="block text-xs font-medium text-slate-600 mb-1">Min Weekly CR</label>
                                <input id="weeklyCrMin" type="number" name="weeklyCrMin" value={filters.weeklyCrMin} onChange={handleFilterChange} placeholder="e.g. 1000"
                                    className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500 block w-full p-2" />
                            </div>
                            <div>
                                <label htmlFor="weeklyDrMin" className="block text-xs font-medium text-slate-600 mb-1">Min Weekly DR</label>
                                <input id="weeklyDrMin" type="number" name="weeklyDrMin" value={filters.weeklyDrMin} onChange={handleFilterChange} placeholder="e.g. 500"
                                    className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500 block w-full p-2" />
                            </div>
                            <div>
                                <button onClick={resetFilters} className="w-full justify-center inline-flex items-center px-3 py-2 bg-white border border-slate-300 text-slate-600 text-sm font-medium rounded-md hover:bg-slate-50 shadow-sm">
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="bg-white rounded-lg shadow-sm">
              {loading ? (
                  <div className="flex justify-center items-center h-64"><IconLoader className="animate-spin h-8 w-8 text-brand-blue-600"/></div>
              ) : (
                  <Table headers={headers} data={tableData} emptyStateMessage="No client data found for the selected week and filters." />
              )}
               <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  onItemsPerPageChange={setItemsPerPage}
                  totalItems={sortedData.length}
                  itemName="clients"
               />
            </div>

            {selectedClients.size > 0 && (
              <div className="sticky bottom-0 bg-white shadow-lg border-t-2 border-brand-blue-500 rounded-t-lg p-4 mt-4">
                <div className="flex justify-between items-center">
                    <p className="text-sm font-semibold text-slate-700">{selectedClients.size} client(s) selected</p>
                    <div className="flex items-center gap-4">
                        <select value={bulkAssign.rmId} onChange={e => setBulkAssign(p => ({...p, rmId: e.target.value}))} className="text-sm rounded-md border-slate-300">
                          <option value="">Assign RM...</option>
                          {rms.map(rm => <option key={rm.id} value={rm.id}>{rm.name}</option>)}
                        </select>
                        <select value={bulkAssign.bmId} onChange={e => setBulkAssign(p => ({...p, bmId: e.target.value}))} className="text-sm rounded-md border-slate-300">
                           <option value="">Assign BM...</option>
                           {branchManagers.map(bm => <option key={bm.id} value={bm.id}>{bm.name}</option>)}
                        </select>
                        <select value={bulkAssign.fgId} onChange={e => setBulkAssign(p => ({...p, fgId: e.target.value}))} className="text-sm rounded-md border-slate-300">
                           <option value="">Assign Family Group...</option>
                           {familyGroups.map(fg => <option key={fg.id} value={fg.id}>{fg.name}</option>)}
                           <option value="null">Remove from group</option>
                        </select>
                        <button onClick={handleApplyBulkChanges} disabled={isApplying} className="px-4 py-2 text-sm font-medium text-white bg-brand-blue-600 rounded-md hover:bg-brand-blue-700 disabled:bg-slate-400">
                          {isApplying ? <IconLoader className="animate-spin h-5 w-5"/> : "Apply Changes"}
                        </button>
                    </div>
                </div>
              </div>
            )}
        </div>
    );
};

const ReportTabs: React.FC<{ activeTab: string, onTabClick: (tab: string) => void }> = ({ activeTab, onTabClick }) => {
  const tabs = [
    { id: 'summary', label: 'Weekly Summary', icon: IconLineChart },
    { id: 'category', label: 'Category Breakdown', icon: IconPieChart },
    { id: 'rm', label: 'RM/Manager View', icon: IconUsers },
    { id: 'family', label: 'Family Group Summary', icon: IconFamilyGroup },
    { id: 'clients', label: 'Clients List', icon: IconTable },
  ];

  return (
    <div className="border-b border-slate-200">
      <nav className="-mb-px flex space-x-6" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabClick(tab.id)}
            className={`${
              activeTab === tab.id
                ? 'border-brand-blue-500 text-brand-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <tab.icon className="mr-2 h-5 w-5"/>
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

const BranchReport: React.FC = () => {
  const { branchId } = useParams();
  const navigate = useNavigate();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [activeTab, setActiveTab] = useState('summary');
  const [loading, setLoading] = useState(true);
  const [branch, setBranch] = useState<Branch | null>(null);
  
  // Relational data for selects/lookups
  const [rms, setRms] = useState<RM[]>([]);
  const [branchManagers, setBranchManagers] = useState<BranchManager[]>([]);
  const [familyGroups, setFamilyGroups] = useState<FamilyGroup[]>([]);
  const [accountCategories, setAccountCategories] = useState<AccountCategoryInfo[]>([]);

  
  // Report data states
  const [weeklySummary, setWeeklySummary] = useState<WeeklySummaryData[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryBreakdownData[]>([]);
  const [rmPerformance, setRmPerformance] = useState<RMPerformanceData[]>([]);
  const [familyGroup, setFamilyGroup] = useState<FamilyGroupData[]>([]);
  const [availableWeeks, setAvailableWeeks] = useState<string[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<string>('');
  const [clientListData, setClientListData] = useState<ClientProfile[]>([]);
  const [clientListLoading, setClientListLoading] = useState(false);

  const categoryMap = useMemo(() => new Map(accountCategories.map(c => [c.code, c.name])), [accountCategories]);

  useEffect(() => {
    api.getBranches().then(data => {
      setBranches(data);
    });
  }, []);
  
  const fetchBranchData = () => {
    if (!branchId) return;
    setLoading(true);
      Promise.all([
        api.getBranchById(branchId),
        api.getWeeklySummary(branchId),
        api.getCategoryBreakdown(branchId),
        api.getRMPerformance(branchId),
        api.getFamilyGroupSummary(branchId),
        api.getAvailableWeeksForBranch(branchId),
        api.getRms(),
        api.getBranchManagers(),
        api.getFamilyGroups(),
        api.getAccountCategories(),
      ]).then(([branchData, summaryData, categoryData, rmData, familyData, weeksData, allRms, allBms, allFgs, allCategories]) => {
        setBranch(branchData || null);
        setWeeklySummary(summaryData);
        setCategoryBreakdown(categoryData);
        setRmPerformance(rmData);
        setFamilyGroup(familyData);
        setAvailableWeeks(weeksData);
        setRms(allRms.filter(r => r.branchId === branchId));
        setBranchManagers(allBms.filter(bm => bm.branchId === branchId));
        setFamilyGroups(allFgs.filter(fg => fg.branchId === branchId));
        setAccountCategories(allCategories);

        if (weeksData.length > 0 && !selectedWeek) {
            setSelectedWeek(weeksData[0]);
        } else if (weeksData.length === 0) {
            setSelectedWeek('');
            setClientListData([]);
        }
        setLoading(false);
      }).catch(err => {
        console.error("Failed to load report data:", err);
        setLoading(false);
      });
  }

  useEffect(() => {
      fetchBranchData();
  }, [branchId]);

  const fetchClientsForWeek = () => {
      if (branchId && selectedWeek) {
          setClientListLoading(true);
          api.getBranchClientsForWeek(branchId, selectedWeek)
              .then(data => {
                  setClientListData(data);
              })
              .finally(() => {
                  setClientListLoading(false);
              });
      }
  }

  useEffect(() => {
    fetchClientsForWeek()
  }, [branchId, selectedWeek]);
  
  const handleDataRefresh = () => {
    fetchClientsForWeek();
  }

  const handleExportPdf = () => {
    const doc = new jsPDF();
    const tabInfo = [
        { id: 'summary', label: 'Weekly Summary' },
        { id: 'category', label: 'Category Breakdown' },
        { id: 'rm', label: 'RM/Manager View' },
        { id: 'family', label: 'Family Group Summary' },
        { id: 'clients', label: 'Clients List' },
    ].find(t => t.id === activeTab);

    const title = `Report for: ${branch?.name} - ${tabInfo?.label}`;
    doc.text(title, 14, 15);
    if(activeTab === 'clients') {
        doc.text(`Week Ending: ${selectedWeek}`, 14, 22)
    }

    let head: string[][] = [];
    let body: (string|number)[][] = [];

    switch(activeTab) {
        case 'summary':
            head = [['Week', 'Total CR', 'Total DR', 'Clients Updated', 'KYC Changes']];
            body = weeklySummary.map(d => [d.week, formatCurrency(d.totalCR), formatCurrency(d.totalDR), d.clientsUpdated, d.kycChanges]);
            break;
        case 'category':
            head = [['Category', 'Total Clients', 'Balance', 'CR', 'DR']];
            body = categoryBreakdown.map(d => [d.categoryName, d.totalClients, formatCurrency(d.balance), formatCurrency(d.cr), formatCurrency(d.dr)]);
            break;
        case 'rm':
            head = [['RM Name', 'Clients', 'Total Portfolio', 'Weekly Change']];
            body = rmPerformance.map(d => [d.rmName, d.clients, formatCurrency(d.totalPortfolio), `${d.weeklyChange >= 0 ? '+' : ''}${formatCurrency(d.weeklyChange)}`]);
            break;
        case 'family':
            head = [['Group Name', '# of Clients', 'Combined Balance']];
            body = familyGroup.map(d => [d.groupName, d.clients, formatCurrency(d.combinedBalance)]);
            break;
        case 'clients':
            head = [['Client Name', 'PAN', 'Weekly Credit', 'Weekly Debit', 'Closing Balance']];
            body = clientListData.map(d => [
                d.nameFirstHolder, 
                d.panPrimary,
                formatCurrency(d.weeklyCr || 0),
                formatCurrency(d.weeklyDr || 0),
                formatCurrency(d.accountBalance)
            ]);
            break;
    }
    
    (doc as any).autoTable({
        startY: activeTab === 'clients' ? 28 : 22,
        head: head,
        body: body,
    });
    doc.save(`report_${branch?.name?.replace(/\s/g, '_')}_${activeTab}.pdf`);
  };
  
  if (!branchId) {
    return (
        <div className="bg-white rounded-lg shadow p-8 text-center">
            <h2 className="text-xl font-semibold text-slate-700">Select a Branch</h2>
            <p className="mt-2 text-slate-500">Please select a branch to view its report.</p>
             <div className="mt-4 max-w-xs mx-auto">
                 {branches.length === 0 ? <IconLoader className="animate-spin h-8 w-8 text-brand-blue-600 mx-auto"/> :
                 <select
                     onChange={(e) => navigate(`/reports/${e.target.value}`)}
                     defaultValue=""
                     className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500 block w-full p-2.5"
                 >
                     <option value="" disabled>-- Choose a Branch --</option>
                     {branches.map(b => (
                         <option key={b.id} value={b.id}>{b.name}</option>
                     ))}
                 </select>}
             </div>
        </div>
    );
  }
  
  if (loading) {
    return <div className="flex justify-center items-center h-full"><IconLoader className="animate-spin h-10 w-10 text-brand-blue-600"/></div>;
  }
  
  const renderContent = () => {
    if (!branchId) return null;
    switch(activeTab) {
      case 'summary': return <SummaryTab data={weeklySummary} />;
      case 'category': return <CategoryTab data={categoryBreakdown} />;
      case 'rm': return <RMTab data={rmPerformance} branchId={branchId} />;
      case 'family': return <FamilyTab data={familyGroup} branchId={branchId} />;
      case 'clients': return <ClientsTab branchId={branchId} initialData={clientListData} loading={clientListLoading} availableWeeks={availableWeeks} selectedWeek={selectedWeek} onWeekChange={setSelectedWeek} rms={rms} branchManagers={branchManagers} familyGroups={familyGroups} onDataRefresh={handleDataRefresh} />;
      default: return null;
    }
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow">
          <div className="p-5 border-b border-slate-200 flex justify-between items-center">
              <div>
                   <h3 className="text-xl font-semibold text-slate-800">Report for: {branch?.name}</h3>
                   <p className="text-sm text-slate-500">{branch?.location}</p>
              </div>
              <button onClick={handleExportPdf} className="inline-flex items-center px-4 py-2 bg-brand-blue-600 text-white text-sm font-medium rounded-md hover:bg-brand-blue-700">
                  <IconDownload className="h-4 w-4 mr-2"/>
                  Export PDF
              </button>
          </div>
          <div className="p-5">
              <ReportTabs activeTab={activeTab} onTabClick={setActiveTab} />
              <div className="mt-6">
                  {renderContent()}
              </div>
          </div>
      </div>
    </>
  );
};

export default BranchReport;