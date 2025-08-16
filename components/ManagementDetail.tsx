import React, { useState, useMemo, useCallback } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { RM, BranchManager, FamilyGroup, AccountTypeInfo, AccountCategoryInfo, SoftwareVendor, ClientProfile } from '../types';
import { api } from '../services/mockApi';
import { useData } from '../contexts/DataContext';
import { IconLoader, IconPlus, IconEdit, IconTrash, IconSearch, IconArrowLeft, IconChevronDown } from './Icons';
import Table from './Table';
import PageHeader from './PageHeader';
import PaginationControls from './PaginationControls';
import AddManagerModal from './AddManagerModal';
import AddFamilyGroupModal from './AddFamilyGroupModal';
import AddAccountTypeModal from './AddAccountTypeModal';
import AddAccountCategoryModal from './AddAccountCategoryModal';
import AddSoftwareVendorModal from './AddSoftwareVendorModal';
import { useTableControls } from './useTableControls';
import ReassignManagerModal from './ReassignManagerModal';

type ReassignmentInfo = {
    manager: RM | BranchManager;
    type: 'rm' | 'bm';
    clients: ClientProfile[];
}

const ManagementDetail: React.FC = () => {
    const { category } = ReactRouterDOM.useParams();
    const dataContext = useData();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEntity, setEditingEntity] = useState<any>(null);
    const [reassignmentInfo, setReassignmentInfo] = useState<ReassignmentInfo | null>(null);

    const branchMap = useMemo(() => new Map(dataContext.branches.map(b => [b.id, b.name])), [dataContext.branches]);

    const refetchCategoryData = useCallback(async () => {
        switch(category) {
            case 'rm': await dataContext.refetchRms(); break;
            case 'bm': await dataContext.refetchBranchManagers(); break;
            case 'fg': await dataContext.refetchFamilyGroups(); break;
            case 'at': await dataContext.refetchAccountTypes(); break;
            case 'ac': await dataContext.refetchAccountCategories(); break;
            case 'vendor': await dataContext.refetchSoftwareVendors(); break;
        }
    }, [category, dataContext]);
    
    const handleDeleteClick = async (item: any) => {
        if (category === 'rm' || category === 'bm') {
            const managerType = category as 'rm' | 'bm';
            const clients = await api.getClientsByManager(item.id, managerType);
            if (clients.length > 0) {
                setReassignmentInfo({ manager: item, type: managerType, clients: clients });
            } else {
                 if (window.confirm(`Are you sure you want to delete ${item.name}? This manager has no clients assigned.`)) {
                    managerType === 'rm' ? await api.deleteRm(item.id) : await api.deleteBranchManager(item.id);
                    await refetchCategoryData();
                 }
            }
        } else {
             if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
                try {
                    switch(category) {
                        case 'fg': await api.deleteFamilyGroup(item.id); break;
                        case 'at': await api.deleteAccountType(item.id); break;
                        case 'ac': await api.deleteAccountCategory(item.id); break;
                        case 'vendor': await api.deleteSoftwareVendor(item.id); break;
                    }
                    await refetchCategoryData();
                } catch (error) {
                    console.error(`Failed to delete item:`, error);
                    alert('An error occurred while deleting the item.');
                }
            }
        }
    };

    const handleEditClick = (entity: any) => {
        setEditingEntity(entity);
        setIsModalOpen(true);
    };
    
    const { 
        config,
        initialData,
        isPaginated
    } = useMemo(() => {
        const getActions = (item: any) => (
            <div className="flex items-center space-x-3">
                <button onClick={() => handleEditClick(item)} className="text-slate-500 hover:text-brand-blue-600"><IconEdit className="h-5 w-5" /></button>
                <button onClick={() => handleDeleteClick(item)} className="text-slate-500 hover:text-rose-600"><IconTrash className="h-5 w-5" /></button>
            </div>
        );
        switch(category) {
            case 'rm': return {
                config: {
                    title: 'Relationship Managers', 
                    headers: [
                        { key: 'name', label: 'Name' }, { key: 'code', label: 'Code' }, 
                        { key: 'email', label: 'Email' }, { key: 'phone', label: 'Phone' },
                        { key: 'branchId', label: 'Branch' }
                    ],
                    searchPredicate: (item: RM, term: string) => item.name.toLowerCase().includes(term) || item.code.toLowerCase().includes(term) || item.email.toLowerCase().includes(term) || item.phone.includes(term),
                    itemName: 'RMs',
                    dataMapper: (item: RM) => [item.name, item.code, item.email, item.phone, branchMap.get(item.branchId) || 'N/A', getActions(item)]
                }, initialData: dataContext.rms, isPaginated: true
            };
            case 'bm': return {
                config: {
                    title: 'Branch Managers', 
                    headers: [
                         { key: 'name', label: 'Name' }, { key: 'code', label: 'Code' }, 
                        { key: 'email', label: 'Email' }, { key: 'phone', label: 'Phone' },
                        { key: 'branchId', label: 'Branch' }
                    ],
                    searchPredicate: (item: BranchManager, term: string) => item.name.toLowerCase().includes(term) || item.code.toLowerCase().includes(term) || item.email.toLowerCase().includes(term) || item.phone.includes(term),
                    itemName: 'managers',
                    dataMapper: (item: BranchManager) => [item.name, item.code, item.email, item.phone, branchMap.get(item.branchId) || 'N/A', getActions(item)]
                }, initialData: dataContext.branchManagers, isPaginated: true
            };
            case 'fg': return {
                config: {
                    title: 'Family Groups', 
                    headers: [{key: 'name', label: 'Group Name'}, {key: 'code', label: 'Code'}, {key: 'branchId', label: 'Branch'}], 
                    searchPredicate: (item: FamilyGroup, term: string) => item.name.toLowerCase().includes(term) || item.code.toLowerCase().includes(term),
                    itemName: 'groups',
                    dataMapper: (item: FamilyGroup) => [item.name, item.code, branchMap.get(item.branchId) || 'N/A', getActions(item)]
                }, initialData: dataContext.familyGroups, isPaginated: true,
            };
            case 'vendor': return {
                 config: {
                    title: 'Software Vendors', 
                    headers: [{key: 'name', label: 'Vendor Name'}, {key: 'templateName', label: 'Template Name'}],
                    searchPredicate: (item: SoftwareVendor, term: string) => item.name.toLowerCase().includes(term) || item.templateName.toLowerCase().includes(term),
                    itemName: 'vendors',
                    dataMapper: (item: SoftwareVendor) => [item.name, item.templateName, getActions(item)]
                }, initialData: dataContext.softwareVendors, isPaginated: true,
            };
            case 'ac': return { 
                config: {
                    title: 'Account Categories', headers: [{key: 'name', label: 'Name'}, {key: 'code', label: 'Code'}],
                    itemName: 'categories', searchPredicate: () => true,
                    dataMapper: (item: AccountCategoryInfo) => [item.name, item.code, getActions(item)]
                }, initialData: dataContext.accountCategories, isPaginated: false,
            };
            case 'at': return { 
                config: {
                    title: 'Account Types', headers: [{key: 'name', label: 'Name'}],
                    itemName: 'types', searchPredicate: () => true,
                    dataMapper: (item: AccountTypeInfo) => [item.name, getActions(item)] 
                }, initialData: dataContext.accountTypes, isPaginated: false,
            };
            default: return { config: { title: 'Management', headers: [], searchPredicate: () => false, itemName: '', dataMapper: () => [] }, initialData: [], isPaginated: false };
        }
    }, [category, dataContext, branchMap, handleEditClick, handleDeleteClick]);

    const { searchTerm, setSearchTerm, paginatedData, sortConfig, requestSort, paginationProps } = useTableControls({ initialData, searchPredicate: config.searchPredicate });

    const getSortIndicator = (key: string) => {
        if (!sortConfig || sortConfig.key !== key) return null;
        return <IconChevronDown className={`w-4 h-4 ml-1 inline-block transition-transform ${sortConfig.direction === 'asc' ? 'transform rotate-180' : ''}`} />;
    };
    
    const tableHeaders = [...config.headers.map(h => h.sortable !== false ? (
        <button key={h.key} onClick={() => requestSort(h.key as any)} className="flex items-center p-0 bg-transparent border-none">
            {h.label} {getSortIndicator(h.key)}
        </button>
    ) : h.label), 'Actions'];

    const tableData = (isPaginated ? paginatedData : initialData).map(config.dataMapper as (item: any) => React.ReactNode[]);

    const handleAddClick = () => {
        setEditingEntity(null);
        setIsModalOpen(true);
    };

    const handleSave = async (data: any) => {
        const isEditing = !!editingEntity;
        try {
             switch(category) {
                case 'rm': 
                    isEditing ? await api.updateRm(editingEntity.id, data) : await api.addRm(data);
                    break;
                case 'bm': 
                    isEditing ? await api.updateBranchManager(editingEntity.id, data) : await api.addBranchManager(data);
                    break;
                case 'fg': 
                    isEditing ? await api.updateFamilyGroup(editingEntity.id, data) : await api.addFamilyGroup(data);
                    break;
                case 'at': 
                    isEditing ? await api.updateAccountType(editingEntity.id, data) : await api.addAccountType(data); 
                    break;
                case 'ac': 
                    isEditing ? await api.updateAccountCategory(editingEntity.id, data) : await api.addAccountCategory(data); 
                    break;
                case 'vendor': 
                    isEditing ? await api.updateSoftwareVendor(editingEntity.id, data) : await api.addSoftwareVendor(data); 
                    break;
            }
            await refetchCategoryData();
            setIsModalOpen(false);
        } catch(e) { console.error("Save failed", e); }
    };
    
    const renderModal = () => {
        const modalTitle = `${editingEntity ? 'Edit' : 'Add'} ${config.title.replace(/s$/, '')}`;
        switch(category) {
            case 'rm': return <AddManagerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} title={modalTitle} branches={dataContext.branches} itemToEdit={editingEntity} />;
            case 'bm': return <AddManagerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} title={modalTitle} branches={dataContext.branches} itemToEdit={editingEntity} />;
            case 'fg': return <AddFamilyGroupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} branches={dataContext.branches} itemToEdit={editingEntity} title={modalTitle} />;
            case 'at': return <AddAccountTypeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} itemToEdit={editingEntity} title={modalTitle} />;
            case 'ac': return <AddAccountCategoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} itemToEdit={editingEntity} title={modalTitle} />;
            case 'vendor': return <AddSoftwareVendorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} itemToEdit={editingEntity} title={modalTitle} />;
            default: return null;
        }
    };
    
    return (
        <div className="space-y-6">
             <PageHeader
                title={config.title}
                description={`Manage all ${config.title.toLowerCase()} in the system.`}
                actions={
                    <>
                        <ReactRouterDOM.Link to="/management" className="inline-flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-600 text-sm font-medium rounded-md hover:bg-slate-50 shadow-sm">
                            <IconArrowLeft className="h-4 w-4 mr-2"/> Back to Management
                        </ReactRouterDOM.Link>
                        <button onClick={handleAddClick} className="inline-flex items-center px-4 py-2 bg-brand-blue-600 text-white text-sm font-medium rounded-md hover:bg-brand-blue-700">
                            Add New {config.title.replace(/s$/, '')}
                        </button>
                    </>
                }
            />

            <div className="bg-white rounded-lg shadow">
                 <div className="p-5 border-b border-slate-200">
                    {isPaginated && (
                        <div className="relative max-w-sm">
                            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input type="text" placeholder={`Search ${config.title}...`} value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-brand-blue-500 focus:border-brand-blue-500 text-sm" />
                        </div>
                    )}
                 </div>
                 {dataContext.loading ? (
                     <div className="flex justify-center items-center h-64"><IconLoader className="animate-spin h-10 w-10 text-brand-blue-600"/></div>
                 ) : (
                    <Table headers={tableHeaders} data={tableData} emptyStateMessage={`No ${config.itemName} found.`} />
                 )}
                 {isPaginated && !dataContext.loading && <PaginationControls {...paginationProps} itemName={config.itemName} />}
            </div>
            {renderModal()}
            {reassignmentInfo && (
                <ReassignManagerModal
                    isOpen={!!reassignmentInfo}
                    onClose={() => setReassignmentInfo(null)}
                    reassignmentInfo={reassignmentInfo}
                    onSuccess={() => {
                        setReassignmentInfo(null);
                        refetchCategoryData();
                    }}
                />
            )}
        </div>
    );
};

export default ManagementDetail;