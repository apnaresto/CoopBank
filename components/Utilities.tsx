

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Pincode } from '../types';
import { api } from '../services/mockApi';
import { IconLoader, IconMapPin, IconCalendarDays, IconPlus, IconEdit, IconTrash, IconSearch, IconAlertTriangle, IconFileJson, IconFilter, IconChevronDown } from './Icons';
import Table from './Table';
import PageHeader from './PageHeader';
import PaginationControls from './PaginationControls';
import AddPincodeModal from './AddPincodeModal';
import YearCalendar from './YearCalendar';
import SchemaMapper from './SchemaMapper';
import { useData } from '../contexts/DataContext';
import { useTableControls } from './useTableControls';

const PincodeManagement: React.FC = () => {
    const [pincodes, setPincodes] = useState<Pincode[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPincode, setEditingPincode] = useState<Pincode | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    
    const [stateFilter, setStateFilter] = useState('All');
    const [districtFilter, setDistrictFilter] = useState('All');
    const [cityFilter, setCityFilter] = useState('All');

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await api.getPincodes();
            setPincodes(data.sort((a,b) => a.code.localeCompare(b.code)));
        } catch (error) {
            console.error("Failed to fetch pincodes:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);
    
    const filterPredicate = useCallback((p: Pincode) => {
        const stateMatch = stateFilter === 'All' || p.state === stateFilter;
        const districtMatch = districtFilter === 'All' || p.district === districtFilter;
        const cityMatch = cityFilter === 'All' || p.city === cityFilter;
        return stateMatch && districtMatch && cityMatch;
    }, [stateFilter, districtFilter, cityFilter]);
    
    const searchPredicate = useCallback((p: Pincode, term: string) => {
        return p.code.toLowerCase().includes(term) ||
               p.city.toLowerCase().includes(term) ||
               p.district.toLowerCase().includes(term) ||
               p.state.toLowerCase().includes(term);
    }, []);

    const { searchTerm, setSearchTerm, paginatedData, paginationProps } = useTableControls({
        initialData: pincodes,
        searchPredicate,
        filterPredicate
    });

    const handleAddClick = () => {
        setEditingPincode(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (pincode: Pincode) => {
        setEditingPincode(pincode);
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this PIN code?')) {
            await api.deletePincode(id);
            fetchData();
        }
    };
    
    const handleSave = async (data: Omit<Pincode, 'id'> | Pincode) => {
        const isEditing = 'id' in data;
        try {
            if (isEditing) {
                await api.updatePincode(data.id, data);
            } else {
                await api.addPincode(data);
            }
            fetchData();
            setIsModalOpen(false);
        } catch (err) {
            console.error('Failed to save pincode:', err);
            alert('An error occurred while saving the PIN code.');
        }
    };

    const resetFilters = () => {
        setStateFilter('All');
    };

    const availableStates = useMemo(() => ['All', ...Array.from(new Set(pincodes.map(p => p.state))).sort()], [pincodes]);
    const availableDistricts = useMemo(() => {
        if (stateFilter === 'All') return ['All'];
        return ['All', ...Array.from(new Set(pincodes.filter(p => p.state === stateFilter).map(p => p.district))).sort()];
    }, [pincodes, stateFilter]);
    const availableCities = useMemo(() => {
        if (stateFilter === 'All') return ['All'];
        let cityPincodes = pincodes.filter(p => p.state === stateFilter);
        if (districtFilter !== 'All') cityPincodes = cityPincodes.filter(p => p.district === districtFilter);
        return ['All', ...Array.from(new Set(cityPincodes.map(p => p.city))).sort()];
    }, [pincodes, stateFilter, districtFilter]);
    
    useEffect(() => setDistrictFilter('All'), [stateFilter]);
    useEffect(() => setCityFilter('All'), [districtFilter]);

    const headers = ['PIN Code', 'City', 'District', 'State', 'Actions'];
    const tableData = paginatedData.map(p => [
        p.code, p.city, p.district, p.state,
        <div className="flex items-center space-x-3">
            <button onClick={() => handleEditClick(p)} className="text-slate-500 hover:text-brand-blue-600"><IconEdit className="h-5 w-5" /></button>
            <button onClick={() => handleDeleteClick(p.id)} className="text-slate-500 hover:text-rose-600"><IconTrash className="h-5 w-5" /></button>
        </div>
    ]);

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex w-full md:w-auto items-center gap-2">
                    <div className="relative flex-grow">
                        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input type="text" id="search-pincode" placeholder="Search by code, city, district..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-brand-blue-500 focus:border-brand-blue-500 text-sm" />
                    </div>
                     <button onClick={() => setShowFilters(s => !s)} className="inline-flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-600 text-sm font-medium rounded-md hover:bg-slate-50 shadow-sm">
                        <IconFilter className="h-4 w-4 mr-2" /><IconChevronDown className={`w-4 h-4 ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                    </button>
                </div>
                <div className="w-full md:w-auto flex-shrink-0">
                    <button onClick={handleAddClick} className="w-full justify-center inline-flex items-center px-4 py-2 bg-brand-blue-600 text-white text-sm font-medium rounded-md hover:bg-brand-blue-700">
                        <IconPlus className="h-4 w-4 mr-2" /> Add PIN Code
                    </button>
                </div>
            </div>

            {showFilters && (
                <div className="p-4 bg-slate-50 rounded-lg border animate-fade-in-down">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <select id="state-filter" value={stateFilter} onChange={e => setStateFilter(e.target.value)} className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500 block w-full p-2.5">
                             {availableStates.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                         <select id="district-filter" value={districtFilter} onChange={e => setDistrictFilter(e.target.value)} className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500 block w-full p-2.5" disabled={stateFilter === 'All'}>
                            {availableDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                         <select id="city-filter" value={cityFilter} onChange={e => setCityFilter(e.target.value)} className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500 block w-full p-2.5" disabled={stateFilter === 'All'}>
                            {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <button onClick={resetFilters} className="w-full justify-center inline-flex items-center px-3 py-2.5 bg-white border border-slate-300 text-slate-600 text-sm font-medium rounded-md hover:bg-slate-50">Clear Filters</button>
                    </div>
                </div>
            )}
            
             {loading ? <div className="flex justify-center items-center h-64"><IconLoader className="animate-spin h-8 w-8 text-brand-blue-600"/></div>
             : (
                <>
                    <Table headers={headers} data={tableData} emptyStateMessage={searchTerm || stateFilter !== 'All' ? "No PIN codes match your search/filter." : "No PIN codes found. Add one to get started."} />
                    <PaginationControls {...paginationProps} itemName="pincodes" />
                </>
             )}
            <AddPincodeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} itemToEdit={editingPincode} />
        </div>
    );
};

const WeekDateManagement: React.FC = () => {
    const { refetchWeekDates, refetchData } = useData();
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState<number>(-1); // -1 for All Months
    const [availableDates, setAvailableDates] = useState<Set<string>>(new Set());
    const [usedDates, setUsedDates] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const monthOptions = useMemo(() => [
        { value: -1, label: 'All Months' }, { value: 0, label: 'January' }, { value: 1, label: 'February' },
        { value: 2, label: 'March' }, { value: 3, label: 'April' }, { value: 4, label: 'May' },
        { value: 5, label: 'June' }, { value: 6, label: 'July' }, { value: 7, label: 'August' },
        { value: 8, label: 'September' }, { value: 9, label: 'October' }, { value: 10, label: 'November' },
        { value: 11, label: 'December' }
    ], []);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setFeedback(null);
        try {
            const [managedDates, usedDatesSet] = await Promise.all([
                api.getManagedWeekEndingDates(),
                api.getUsedWeekEndingDates()
            ]);
            setAvailableDates(new Set(managedDates));
            setUsedDates(usedDatesSet);
        } catch (error) {
            console.error("Failed to fetch week dates:", error);
            setFeedback({ type: 'error', message: 'Failed to load date information.' });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleGenerate = async () => {
        await api.generateAndAddWeekEndingDates(selectedYear, selectedMonth);
        await Promise.all([fetchData(), refetchWeekDates()]);
        const { addedCount } = await api.generateAndAddWeekEndingDates(selectedYear, selectedMonth);
        const monthName = monthOptions.find(m => m.value === selectedMonth)?.label;
        const scope = selectedMonth === -1 ? `for ${selectedYear}` : `for ${monthName} ${selectedYear}`;
        setFeedback({ type: 'success', message: `Successfully generated ${addedCount} new week-ending dates ${scope}.` });
        setTimeout(() => setFeedback(null), 5000);
    };

    const handleBulkDelete = async () => {
        const isYearScope = selectedMonth === -1;
        const scopeName = isYearScope
            ? `the year ${selectedYear}`
            : `${monthOptions.find(m => m.value === selectedMonth)?.label} ${selectedYear}`;

        if (window.confirm(`Are you sure you want to delete all unused week-ending dates for ${scopeName}? This action cannot be undone.`)) {
            let result: { deleted: number };
            if (isYearScope) {
                result = await api.deleteAllDatesForYear(selectedYear);
            } else {
                result = await api.deleteDatesForMonth(selectedYear, selectedMonth);
            }
            await Promise.all([fetchData(), refetchWeekDates()]);
            setFeedback({ type: 'success', message: `Successfully deleted ${result.deleted} unused dates for ${scopeName}.` });
            setTimeout(() => setFeedback(null), 5000);
        }
    };
    
    const handleDeleteDate = async (dateString: string) => {
         if (window.confirm(`Are you sure you want to delete the date ${dateString}?`)) {
            await api.deleteWeekEndingDate(dateString);
            await Promise.all([fetchData(), refetchWeekDates()]);
            setFeedback({ type: 'success', message: `Successfully deleted date ${dateString}.` });
            setTimeout(() => setFeedback(null), 5000);
        }
    };
    
    const yearOptions = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + 2 - i);

    const generateButtonText = useMemo(() => {
        if (selectedMonth === -1) {
            return `Generate Dates for ${selectedYear}`;
        }
        const monthName = monthOptions.find(m => m.value === selectedMonth)?.label;
        return `Generate for ${monthName} ${selectedYear}`;
    }, [selectedYear, selectedMonth, monthOptions]);

    const deleteButtonText = useMemo(() => {
        if (selectedMonth === -1) {
            return `Delete All for ${selectedYear}`;
        }
        const monthName = monthOptions.find(m => m.value === selectedMonth)?.label;
        return `Delete for ${monthName} ${selectedYear}`;
    }, [selectedYear, selectedMonth, monthOptions]);


    return (
        <div className="space-y-6">
            <div className="p-4 bg-slate-50 rounded-lg border flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                     <label htmlFor="month-select" className="text-sm font-medium text-slate-700">Select Period:</label>
                     <select id="month-select" value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))} className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500 block p-2">
                        {monthOptions.map(month => <option key={month.value} value={month.value}>{month.label}</option>)}
                     </select>
                     <select id="year-select" value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))} className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500 block p-2">
                        {yearOptions.map(year => <option key={year} value={year}>{year}</option>)}
                    </select>
                </div>
                 <div className="flex items-center gap-3">
                    <button onClick={handleGenerate} className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700">
                        <IconPlus className="h-4 w-4 mr-2"/> {generateButtonText}
                    </button>
                    <button onClick={handleBulkDelete} className="inline-flex items-center px-4 py-2 bg-rose-600 text-white text-sm font-medium rounded-md hover:bg-rose-700">
                        <IconTrash className="h-4 w-4 mr-2"/> {deleteButtonText}
                    </button>
                 </div>
            </div>

            {feedback && (
                <div className={`${feedback.type === 'success' ? 'bg-emerald-100 border-emerald-500 text-emerald-800' : 'bg-rose-100 border-rose-500 text-rose-800'} border-l-4 p-4 rounded-md`} role="alert">
                    <p>{feedback.message}</p>
                </div>
            )}

            {loading ? <div className="flex justify-center items-center h-64"><IconLoader className="animate-spin h-8 w-8 text-brand-blue-600"/></div>
            : <YearCalendar year={selectedYear} availableDates={availableDates} usedDates={usedDates} onDeleteDate={handleDeleteDate} />
            }
        </div>
    );
};


const Utilities: React.FC = () => {
    const [activeTab, setActiveTab] = useState('pincode');
    
    const tabs = [
        { id: 'pincode', label: 'PIN Code Database', icon: IconMapPin },
        { id: 'week', label: 'Week Date Management', icon: IconCalendarDays },
        { id: 'schema', label: 'Template Manager', icon: IconFileJson },
    ];
    
    const renderContent = () => {
        switch(activeTab) {
            case 'pincode': return <PincodeManagement />;
            case 'week': return <WeekDateManagement />;
            case 'schema': return <SchemaMapper />;
            default: return null;
        }
    };

    return (
        <>
            <PageHeader 
                title="System Utilities"
                description="Manage core application data like PIN codes, week-ending dates, and import templates."
            />
            <div className="bg-white rounded-lg shadow">
                <div className="p-5 border-b border-slate-200">
                    <div className="border-b border-slate-200">
                        <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
                            {tabs.map((tab) => (
                              <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
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
                </div>
                <div className="p-5">
                    {renderContent()}
                </div>
            </div>
        </>
    );
};

export default Utilities;