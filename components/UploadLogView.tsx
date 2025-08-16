import React, { useState, useEffect, useCallback, useMemo } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { UploadBatch, UploadStatus } from '../types';
import { IconLoader, IconFilter, IconChevronDown } from './Icons';
import { formatCurrency, getStatusBadgeStyle, formatTimeAgo } from '../utils/helpers';
import Table from './Table';
import PaginationControls from './PaginationControls';
import { useData } from '../contexts/DataContext';
import { useTableControls } from './useTableControls';
import WeekDatePicker from './WeekDatePicker';

const StatusCheckbox: React.FC<{ status: UploadStatus, checked: boolean, onChange: (status: UploadStatus, checked: boolean) => void }> = ({ status, checked, onChange }) => {
    const baseStyle = "w-4 h-4 rounded focus:ring-2";
    const colorStyles = {
        'Active': 'text-emerald-600 focus:ring-emerald-500',
        'Corrected': 'text-amber-600 focus:ring-amber-500',
        'Pending': 'text-rose-600 focus:ring-rose-500',
        'Missing': ''
    };
    return (
        <label className="flex items-center space-x-2 cursor-pointer">
            <input
                type="checkbox"
                checked={checked}
                onChange={e => onChange(status, e.target.checked)}
                className={`${baseStyle} ${colorStyles[status]}`}
            />
            <span className={getStatusBadgeStyle(status)}>{status}</span>
        </label>
    );
};

const StatCard: React.FC<{ title: string, value: number | string, }> = ({ title, value }) => (
    <div className="bg-slate-50 p-4 rounded-lg text-center border">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
);


const UploadLogView: React.FC<{ uploads: UploadBatch[], branchFilter: string | null, weekFilter: string | null }> = ({ uploads, branchFilter: initialBranch, weekFilter: initialWeek }) => {
  const { branches, weekDates, getBranchName, loading: contextLoading } = useData();
  const [searchParams, setSearchParams] = ReactRouterDOM.useSearchParams();
  const [showFilters, setShowFilters] = useState(!!initialBranch || !!initialWeek);

  // Derive filter state directly from URL search params
  const filterBranch = searchParams.get('branch') || 'All';
  const filterDateStart = searchParams.get('start_week') || (weekDates.length > 0 ? weekDates[Math.min(weekDates.length - 1, 7)] : '');
  const filterDateEnd = searchParams.get('end_week') || (weekDates.length > 0 ? weekDates[0] : '');
  const filterStatuses = useMemo(() => new Set<UploadStatus>((searchParams.get('status')?.split(',') || ['Active', 'Corrected', 'Pending']) as UploadStatus[]), [searchParams]);

  useEffect(() => {
    // If props from parent specify filters, set them in the URL on mount
    const newParams = new URLSearchParams(searchParams);
    if(initialBranch && !newParams.has('branch')) newParams.set('branch', initialBranch);
    if(initialWeek && !newParams.has('start_week')) newParams.set('start_week', initialWeek);
    if(initialWeek && !newParams.has('end_week')) newParams.set('end_week', initialWeek);
    setSearchParams(newParams, {replace: true});
  }, [initialBranch, initialWeek, setSearchParams, searchParams]);


  const updateSearchParams = (key: string, value: string | null) => {
    setSearchParams(prev => {
        if (value === null || value === '') {
            prev.delete(key);
        } else {
            prev.set(key, value);
        }
        return prev;
    }, { replace: true });
  };
  
  const handleBranchChange = (value: string) => updateSearchParams('branch', value === 'All' ? null : value);
  const handleDateStartChange = (date: string) => updateSearchParams('start_week', date);
  const handleDateEndChange = (date: string) => updateSearchParams('end_week', date);

  const filterPredicate = useCallback((upload: UploadBatch) => {
    const statusMatch = filterStatuses.size === 0 || filterStatuses.has(upload.status);
    const dateStartMatch = !filterDateStart || new Date(upload.weekEnding) >= new Date(filterDateStart);
    const dateEndMatch = !filterDateEnd || new Date(upload.weekEnding) <= new Date(filterDateEnd);
    const branchMatch = filterBranch === 'All' || upload.branchId === filterBranch;
    return statusMatch && dateStartMatch && dateEndMatch && branchMatch;
  }, [filterStatuses, filterDateStart, filterDateEnd, filterBranch]);

  const {
    paginatedData,
    processedData,
    paginationProps,
  } = useTableControls({
    initialData: uploads,
    searchPredicate: () => true,
    filterPredicate,
  });

  const handleStatusFilterChange = (status: UploadStatus, checked: boolean) => {
    const newSet = new Set(filterStatuses);
    if (checked) newSet.add(status); else newSet.delete(status);
    updateSearchParams('status', Array.from(newSet).join(','));
  };
  
  const handleClearFilters = () => {
    setSearchParams({ view: 'log' });
  };

  if (contextLoading) {
    return <div className="flex justify-center items-center h-full"><IconLoader className="animate-spin h-10 w-10 text-brand-blue-600"/></div>;
  }
  
  const summaryStats = useMemo(() => {
    return {
        total: processedData.length,
        pending: processedData.filter(u => u.status === 'Pending').length,
        corrected: processedData.filter(u => u.status === 'Corrected').length
    };
  }, [processedData]);

  const tableHeaders = ['Branch', 'Week Ending', 'Version', 'Status', 'Upload Time', 'Total CR', 'Total DR'];
  
  const getRowClassName = (upload: UploadBatch) => {
    switch (upload.status) {
      case 'Pending': return 'bg-rose-50';
      case 'Corrected': return 'bg-amber-50';
      default: return 'bg-white';
    }
  };

  return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard title="Total Uploads (in view)" value={summaryStats.total} />
            <StatCard title="Pending Uploads" value={summaryStats.pending} />
            <StatCard title="Corrected Uploads" value={summaryStats.corrected} />
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-slate-700">Filters</h3>
                <button onClick={() => setShowFilters(s => !s)} className="inline-flex items-center px-3 py-1 bg-white border border-slate-300 text-slate-600 text-sm font-medium rounded-md hover:bg-slate-50">
                    <IconFilter className="h-4 w-4 mr-2" /><span>{showFilters ? 'Hide' : 'Show'} Filters</span><IconChevronDown className={`w-4 h-4 ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
            </div>
            {showFilters && (
                <div className="pt-4 mt-4 border-t animate-fade-in-down">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                         <div className="lg:col-span-1">
                            <label htmlFor="branch-filter" className="block mb-2 text-sm font-medium text-slate-900">Filter by Branch</label>
                            <select id="branch-filter" value={filterBranch} onChange={e => handleBranchChange(e.target.value)} className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500 block w-full p-2.5">
                                <option value="All">All Branches</option>
                                {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                        </div>
                        <div className="lg:col-span-1">
                            <label id="status-filter-label" className="block mb-2 text-sm font-medium text-slate-900">Filter by Status</label>
                            <div role="group" aria-labelledby="status-filter-label" className="flex items-center flex-wrap gap-x-4 h-[42px]">
                                {(['Active', 'Corrected', 'Pending'] as UploadStatus[]).map(status => 
                                    <StatusCheckbox key={status} status={status} checked={filterStatuses.has(status)} onChange={handleStatusFilterChange}/>
                                )}
                            </div>
                        </div>
                        <div className="lg:col-span-2">
                             <div className="flex items-end gap-2">
                                <div className="flex-1">
                                    <label htmlFor="log-start-date" className="block mb-2 text-sm font-medium text-slate-900">Select Start Week</label>
                                    <WeekDatePicker id="log-start-date" availableDates={weekDates} selectedDate={filterDateStart} onSelectDate={handleDateStartChange} />
                                </div>
                                <span className="pb-2.5 text-slate-500">to</span>
                                <div className="flex-1">
                                    <label htmlFor="log-end-date" className="block mb-2 text-sm font-medium text-slate-900">Select End Week</label>
                                    <WeekDatePicker id="log-end-date" availableDates={weekDates} selectedDate={filterDateEnd} onSelectDate={handleDateEndChange} />
                                </div>
                             </div>
                        </div>
                    </div>
                     <div className="mt-6 pt-4 border-t flex justify-end">
                        <button onClick={handleClearFilters} className="text-sm font-medium text-brand-blue-600 hover:underline">Clear All Filters</button>
                    </div>
                </div>
            )}
        </div>
        
        <div className="bg-white rounded-lg shadow">
            <Table 
              headers={tableHeaders} 
              data={paginatedData.map(upload => [
                  getBranchName(upload.branchId),
                  upload.weekEnding,
                  `v${upload.version}`,
                  <span className={getStatusBadgeStyle(upload.status)}>{upload.status}</span>,
                  formatTimeAgo(new Date(upload.uploadTime)),
                  <span className="font-medium text-emerald-600 text-right block">{formatCurrency(upload.totalCR)}</span>,
                  <span className="font-medium text-rose-600 text-right block">{formatCurrency(upload.totalDR)}</span>
              ])}
              getRowClassName={getRowClassName}
            />
            <PaginationControls {...paginationProps} itemName="uploads" />
        </div>
    </div>
  );
};

export default UploadLogView;