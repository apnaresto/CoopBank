import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { ClientProfile, RM, BranchManager, FamilyGroup, AccountCategoryInfo } from '../types';
import { api } from '../services/mockApi';
import { useData } from '../contexts/DataContext';
import { useTableControls } from './useTableControls';
import { formatCurrency } from '../utils/helpers';
import { IconLoader, IconSearch, IconFilter, IconChevronDown } from './Icons';
import Table from './Table';
import PaginationControls from './PaginationControls';

type SortableClientKeys = 'nameFirstHolder' | 'panPrimary' | 'weeklyCr' | 'weeklyDr' | 'accountBalance' | 'accountCategory' | 'rmId' | 'familyGroupId';

interface ClientsTabProps {
    branchId: string;
    clients: ClientProfile[];
    loading: boolean;
    rms: RM[];
    branchManagers: BranchManager[];
    familyGroups: FamilyGroup[];
    accountCategories: AccountCategoryInfo[];
    onDataRefresh: () => void;
}

const ClientsTab: React.FC<ClientsTabProps> = ({ clients: initialData, loading, rms, branchManagers, familyGroups, accountCategories, onDataRefresh }) => {
    const { setViewClientPan } = useData();
    const [selectedClients, setSelectedClients] = useState<Set<string>>(new Set());
    const [bulkAssign, setBulkAssign] = useState({ rmId: '', bmId: '', fgId: '' });
    const [isApplying, setIsApplying] = useState(false);
    const selectAllRef = useRef<HTMLInputElement>(null);

    const rmMap = useMemo(() => new Map(rms.map(r => [r.id, r.name])), [rms]);
    const fgMap = useMemo(() => new Map(familyGroups.map(fg => [fg.id, fg.name])), [familyGroups]);
    const categoryMap = useMemo(() => new Map(accountCategories.map(c => [c.code, c.name])), [accountCategories]);

    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({ balanceMin: '', weeklyCrMin: '', weeklyDrMin: '' });

    const filterPredicate = useCallback((client: ClientProfile) => {
        const { balanceMin, weeklyCrMin, weeklyDrMin } = filters;
        const balance = client.accountBalance;
        const cr = client.weeklyCr || 0;
        const dr = client.weeklyDr || 0;

        const balanceMinMatch = balanceMin === '' || balance >= parseFloat(balanceMin);
        const crMinMatch = weeklyCrMin === '' || cr >= parseFloat(weeklyCrMin);
        const drMinMatch = weeklyDrMin === '' || dr >= parseFloat(weeklyDrMin);

        return balanceMinMatch && crMinMatch && drMinMatch;
    }, [filters]);

    const searchPredicate = useCallback((client: ClientProfile, term: string) => {
        return client.nameFirstHolder.toLowerCase().includes(term) ||
               client.panPrimary.toLowerCase().includes(term) ||
               client.accountNumber.includes(term);
    }, []);

    const { 
        searchTerm, 
        setSearchTerm, 
        paginatedData, 
        sortConfig, 
        requestSort, 
        paginationProps 
    } = useTableControls({
        initialData,
        searchPredicate,
        filterPredicate,
        initialSortConfig: { key: 'nameFirstHolder', direction: 'asc' },
    });

    const getSortIndicator = (key: SortableClientKeys) => {
        if (!sortConfig || sortConfig.key !== key) return null;
        return <IconChevronDown className={`w-4 h-4 ml-1 inline-block transition-transform ${sortConfig.direction === 'asc' ? 'transform rotate-180' : ''}`} />;
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const resetFilters = () => {
        setFilters({ balanceMin: '', weeklyCrMin: '', weeklyDrMin: '' });
    };

    useEffect(() => {
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
        if (e.target.checked) pageClientIds.forEach(id => newSelection.add(id));
        else pageClientIds.forEach(id => newSelection.delete(id));
        setSelectedClients(newSelection);
    };

    const handleSelectClient = (clientId: string, isSelected: boolean) => {
        const newSelection = new Set(selectedClients);
        if (isSelected) newSelection.add(clientId);
        else newSelection.delete(clientId);
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

    const headerConfig: { key: keyof ClientProfile | 'checkbox', label: React.ReactNode, sortable: boolean, className?: string }[] = [
        { key: 'checkbox', label: <input type="checkbox" className="form-checkbox h-4 w-4 text-brand-blue-600" ref={selectAllRef} onChange={handleSelectAll} />, sortable: false },
        { key: 'nameFirstHolder', label: 'Client Name', sortable: true },
        { key: 'panPrimary', label: 'PAN', sortable: true },
        { key: 'accountCategory', label: 'Category', sortable: true },
        { key: 'rmId', label: 'RM', sortable: true },
        { key: 'familyGroupId', label: 'Family Group', sortable: true },
        { key: 'accountBalance', label: 'Closing Balance', sortable: true, className: 'text-right' },
    ];

    const headers: React.ReactNode[] = headerConfig.map(h => 
        h.sortable ? (
            <button key={h.key} onClick={() => requestSort(h.key as keyof ClientProfile)} className="flex items-center hover:text-slate-900 font-bold w-full p-0 bg-transparent border-none">
                <span className={`flex-1 ${h.className || 'text-left'}`}>{h.label}</span>
                {getSortIndicator(h.key as SortableClientKeys)}
            </button>
        ) : h.label
    );
    
    const tableData = paginatedData.map(d => [
        <input type="checkbox" className="form-checkbox h-4 w-4 text-brand-blue-600" checked={selectedClients.has(d.id)} onChange={e => handleSelectClient(d.id, e.target.checked)} />,
        <button onClick={() => setViewClientPan(d.panPrimary)} className="font-semibold text-brand-blue-600 hover:underline text-left">{d.nameFirstHolder}</button>,
        <button onClick={() => setViewClientPan(d.panPrimary)} className="font-mono text-slate-600 hover:underline text-left">{d.panPrimary}</button>,
        categoryMap.get(d.accountCategory) || d.accountCategory,
        rmMap.get(d.rmId) || 'N/A',
        d.familyGroupId ? fgMap.get(d.familyGroupId) || 'N/A' : 'N/A',
        <span className="font-semibold text-slate-800 text-right block">{formatCurrency(d.accountBalance)}</span>
    ]);

    return (
        <div className="space-y-4">
            <div className="space-y-4">
                <div className="flex justify-between items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-4 flex-grow">
                        <div className="relative flex-grow" style={{ maxWidth: '350px' }}>
                            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input type="text" placeholder="Search by name, PAN, or account..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                                className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500 block w-full p-2.5 pl-10" />
                        </div>
                        <button onClick={() => setShowFilters(s => !s)} className="inline-flex items-center px-3 py-2 bg-white border border-slate-300 text-slate-600 text-sm font-medium rounded-md hover:bg-slate-50">
                            <IconFilter className="h-4 w-4 mr-2" /><span>Filters</span><IconChevronDown className={`w-4 h-4 ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                        </button>
                    </div>
                </div>

                {showFilters && (
                    <div className="p-4 bg-slate-50 rounded-lg border">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            <input id="balanceMin" type="number" name="balanceMin" value={filters.balanceMin} onChange={handleFilterChange} placeholder="Min Balance" className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg p-2" />
                            <input id="weeklyCrMin" type="number" name="weeklyCrMin" value={filters.weeklyCrMin} onChange={handleFilterChange} placeholder="Min Weekly CR" className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg p-2" />
                            <input id="weeklyDrMin" type="number" name="weeklyDrMin" value={filters.weeklyDrMin} onChange={handleFilterChange} placeholder="Min Weekly DR" className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg p-2" />
                            <button onClick={resetFilters} className="w-full justify-center inline-flex items-center px-3 py-2.5 bg-white border border-slate-300 text-slate-600 text-sm font-medium rounded-md hover:bg-slate-50">Clear</button>
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
               <PaginationControls {...paginationProps} itemName="clients" />
            </div>

            {selectedClients.size > 0 && (
              <div className="sticky bottom-0 bg-white shadow-lg border-t-2 border-brand-blue-500 rounded-t-lg p-4 mt-4">
                <div className="flex justify-between items-center">
                    <p className="text-sm font-semibold text-slate-700">{selectedClients.size} client(s) selected</p>
                    <div className="flex items-center gap-4">
                        <select value={bulkAssign.rmId} onChange={e => setBulkAssign(p => ({...p, rmId: e.target.value}))} className="text-sm rounded-md border-slate-300"><option value="">Assign RM...</option>{rms.map(rm => <option key={rm.id} value={rm.id}>{rm.name}</option>)}</select>
                        <select value={bulkAssign.bmId} onChange={e => setBulkAssign(p => ({...p, bmId: e.target.value}))} className="text-sm rounded-md border-slate-300"><option value="">Assign BM...</option>{branchManagers.map(bm => <option key={bm.id} value={bm.id}>{bm.name}</option>)}</select>
                        <select value={bulkAssign.fgId || ''} onChange={e => setBulkAssign(p => ({...p, fgId: e.target.value}))} className="text-sm rounded-md border-slate-300"><option value="">Assign FG...</option><option value="null">Remove from Group</option>{familyGroups.map(fg => <option key={fg.id} value={fg.id}>{fg.name}</option>)}</select>
                        <button onClick={handleApplyBulkChanges} disabled={isApplying} className="inline-flex items-center px-4 py-2 bg-brand-blue-600 text-white text-sm font-medium rounded-md hover:bg-brand-blue-700 disabled:bg-slate-400">
                            {isApplying ? <IconLoader className="h-4 w-4 mr-2 animate-spin" /> : null}Apply Changes
                        </button>
                    </div>
                </div>
              </div>
            )}
        </div>
    );
};

export default ClientsTab;
