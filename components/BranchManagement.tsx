import React, { useState, useEffect, useCallback, useMemo } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { Branch } from '../types';
import { api } from '../services/mockApi';
import { IconLoader, IconSearch, IconFilter, IconPlus, IconEdit, IconTrash, IconChevronDown } from './Icons';
import AddBranchModal from './AddBranchModal';
import PageHeader from './PageHeader';
import PaginationControls from './PaginationControls';
import { useData } from '../contexts/DataContext';
import { useTableControls } from './useTableControls';

type BranchManagementInfo = Branch & {
    clientCount: number;
    managerName: string;
};

const BranchManagement: React.FC = () => {
    const { branchManagers: managers, refetchBranchesAndManagers, loading: contextLoading } = useData();
    const [allBranches, setAllBranches] = useState<BranchManagementInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const branchData = await api.getBranchManagementList();
            setAllBranches(branchData);
        } catch (error) {
            console.error("Failed to fetch branch data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);
    
    const filterPredicate = useCallback((branch: BranchManagementInfo) => {
        if (statusFilter === 'All') return true;
        return branch.status === statusFilter;
    }, [statusFilter]);
    
    const searchPredicate = useCallback((branch: BranchManagementInfo, term: string) => {
        const lowerTerm = term.toLowerCase();
        return branch.name.toLowerCase().includes(lowerTerm) ||
               branch.code.toLowerCase().includes(lowerTerm) ||
               branch.location.toLowerCase().includes(lowerTerm) ||
               branch.managerName.toLowerCase().includes(lowerTerm);
    }, []);

    const {
        searchTerm,
        setSearchTerm,
        paginatedData,
        sortConfig,
        requestSort,
        paginationProps,
    } = useTableControls({
        initialData: allBranches,
        searchPredicate,
        filterPredicate,
        initialSortConfig: { key: 'name', direction: 'asc' }
    });


    const handleAddClick = () => {
        setEditingBranch(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (branch: Branch) => {
        setEditingBranch(branch);
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (branchId: string) => {
        if (window.confirm('Are you sure you want to delete this branch? This action cannot be undone.')) {
            try {
                await api.deleteBranch(branchId);
                await refetchBranchesAndManagers(); 
                fetchData();
            } catch (error) {
                console.error("Failed to delete branch:", error);
                alert('An error occurred while deleting the branch.');
            }
        }
    };
    
    const handleSave = async (branchData: Omit<Branch, 'id'> | Branch) => {
        try {
            if ('id' in branchData) {
                await api.updateBranch(branchData.id, branchData);
            } else {
                await api.addBranch(branchData);
            }
            await refetchBranchesAndManagers();
            fetchData();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to save branch', error);
            alert('An error occurred while saving the branch.');
        }
    };

    const getStatusStyle = (status: Branch['status']) => {
        switch (status) {
            case 'Active': return 'bg-emerald-100 text-emerald-800';
            case 'Pending': return 'bg-amber-100 text-amber-800';
            case 'Inactive': return 'bg-slate-100 text-slate-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    const getSortIndicator = (key: keyof BranchManagementInfo) => {
        if (!sortConfig || sortConfig.key !== key) return null;
        return <IconChevronDown className={`w-4 h-4 ml-1 inline-block transition-transform ${sortConfig.direction === 'asc' ? 'transform rotate-180' : ''}`} />;
    };

    const tableHeaders: { key: keyof BranchManagementInfo; label: string; sortable: boolean }[] = [
        { key: 'name', label: 'Branch Name', sortable: true },
        { key: 'code', label: 'Branch Code', sortable: true },
        { key: 'location', label: 'Location', sortable: true },
        { key: 'managerName', label: 'Manager', sortable: true },
        { key: 'clientCount', label: 'Clients', sortable: true },
        { key: 'status', label: 'Status', sortable: true },
    ];


    return (
        <div className="space-y-6">
            <PageHeader 
                title="Branch Management"
                description="Create and manage branch locations and their assignments."
                actions={
                    <button onClick={handleAddClick} className="inline-flex items-center justify-center px-4 py-2 bg-brand-blue-600 text-white font-medium rounded-md hover:bg-brand-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue-500">
                        <IconPlus className="h-5 w-5 mr-2 -ml-1" />
                        Add New Branch
                    </button>
                }
            />

            <div className="bg-white p-4 rounded-lg shadow">
                 <div className="flex items-center space-x-4">
                    <div className="relative flex-grow">
                        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search branches..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-brand-blue-500 focus:border-brand-blue-500"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="border border-slate-300 rounded-md py-2 pl-3 pr-8 focus:ring-brand-blue-500 focus:border-brand-blue-500"
                    >
                        <option value="All">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                 </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading || contextLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <IconLoader className="animate-spin h-10 w-10 text-brand-blue-600" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-500">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                <tr>
                                    {tableHeaders.map(header => (
                                        <th key={header.key} scope="col" className="px-6 py-3 font-medium">
                                            {header.sortable ? (
                                                <button onClick={() => requestSort(header.key)} className="flex items-center p-0 bg-transparent border-none">
                                                    {header.label} {getSortIndicator(header.key)}
                                                </button>
                                            ) : header.label}
                                        </th>
                                    ))}
                                    <th scope="col" className="px-6 py-3 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedData.map(branch => (
                                    <tr key={branch.id} className="bg-white border-b hover:bg-slate-50">
                                        <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                                            <ReactRouterDOM.Link to={`/reports/${branch.id}`} className="hover:underline text-brand-blue-600">
                                                {branch.name}
                                            </ReactRouterDOM.Link>
                                        </td>
                                        <td className="px-6 py-4 font-mono">{branch.code}</td>
                                        <td className="px-6 py-4">{branch.location}</td>
                                        <td className="px-6 py-4">{branch.managerName}</td>
                                        <td className="px-6 py-4">{branch.clientCount}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusStyle(branch.status)}`}>
                                                {branch.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 flex items-center space-x-3">
                                            <button onClick={() => handleEditClick(branch)} className="text-slate-500 hover:text-brand-blue-600">
                                                <IconEdit className="h-5 w-5" />
                                            </button>
                                            <button onClick={() => handleDeleteClick(branch.id)} className="text-slate-500 hover:text-rose-600">
                                                <IconTrash className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {paginatedData.length === 0 && <p className="text-center py-10 text-slate-500">No branches found matching your criteria.</p>}
                    </div>
                )}
                <PaginationControls
                   {...paginationProps}
                   itemName="branches"
                />
            </div>
            
            <AddBranchModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                branchToEdit={editingBranch}
                managers={managers}
            />

        </div>
    );
};

export default BranchManagement;