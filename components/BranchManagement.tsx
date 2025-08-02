import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Branch, BranchManager } from '../types';
import { api } from '../services/mockApi';
import { IconLoader, IconSearch, IconFilter, IconPlus, IconEdit, IconTrash } from './Icons';
import AddBranchModal from './AddBranchModal';
import PaginationControls from './PaginationControls';

type BranchManagementInfo = Branch & {
    clientCount: number;
    managerName: string;
};

const BranchManagement: React.FC = () => {
    const [branches, setBranches] = useState<BranchManagementInfo[]>([]);
    const [managers, setManagers] = useState<BranchManager[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [branchData, managerData] = await Promise.all([
                api.getBranchManagementList(),
                api.getBranchManagers()
            ]);
            setBranches(branchData);
            setManagers(managerData);
        } catch (error) {
            console.error("Failed to fetch branch data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

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
                fetchData(); // Refresh data
            } catch (error) {
                console.error("Failed to delete branch:", error);
                alert('An error occurred while deleting the branch.');
            }
        }
    };
    
    const handleSave = async (branchData: Omit<Branch, 'id'> | Branch) => {
        try {
            if ('id' in branchData) {
                // Editing existing branch
                await api.updateBranch(branchData.id, branchData);
            } else {
                // Adding new branch
                await api.addBranch(branchData);
            }
            fetchData();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to save branch', error);
            alert('An error occurred while saving the branch.');
        }
    };

    const filteredBranches = useMemo(() => {
        return branches
            .filter(branch => {
                if (statusFilter === 'All') return true;
                return branch.status === statusFilter;
            })
            .filter(branch => 
                branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                branch.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                branch.managerName.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [branches, statusFilter, searchTerm]);

    const totalPages = Math.ceil(filteredBranches.length / itemsPerPage);

    const paginatedBranches = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredBranches.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredBranches, currentPage, itemsPerPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, itemsPerPage]);


    const getStatusStyle = (status: Branch['status']) => {
        switch (status) {
            case 'Active': return 'bg-emerald-100 text-emerald-800';
            case 'Pending': return 'bg-amber-100 text-amber-800';
            case 'Inactive': return 'bg-slate-100 text-slate-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Branch Management</h1>
                    <p className="text-slate-500 mt-1">Create and manage branch locations</p>
                </div>
                <button onClick={handleAddClick} className="inline-flex items-center justify-center px-4 py-2 bg-brand-blue-600 text-white font-medium rounded-md hover:bg-brand-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue-500">
                    <IconPlus className="h-5 w-5 mr-2 -ml-1" />
                    Add New Branch
                </button>
            </div>

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
                    <button className="p-2 border border-slate-300 rounded-md hover:bg-slate-100">
                        <IconFilter className="h-5 w-5 text-slate-600" />
                    </button>
                 </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <IconLoader className="animate-spin h-10 w-10 text-brand-blue-600" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-500">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                <tr>
                                    {['Branch Name', 'Location', 'Manager', 'Clients', 'Status', 'Actions'].map(header => (
                                        <th key={header} scope="col" className="px-6 py-3 font-medium">{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedBranches.map(branch => (
                                    <tr key={branch.id} className="bg-white border-b hover:bg-slate-50">
                                        <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                                            <Link to={`/reports/${branch.id}`} className="hover:underline text-brand-blue-600">
                                                {branch.name}
                                            </Link>
                                        </td>
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
                        {filteredBranches.length === 0 && <p className="text-center py-10 text-slate-500">No branches found matching your criteria.</p>}
                    </div>
                )}
                <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={setItemsPerPage}
                    totalItems={filteredBranches.length}
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