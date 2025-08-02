import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { RM, BranchManager, FamilyGroup, Branch, AccountTypeInfo, AccountCategoryInfo } from '../types';
import { api } from '../services/mockApi';
import { IconLoader, IconUsers, IconFamilyGroup, IconBriefcase, IconTags, IconShapes, IconEdit, IconTrash, IconSearch } from './Icons';
import Table from './Table';
import AddManagerModal from './AddManagerModal';
import AddFamilyGroupModal from './AddFamilyGroupModal';
import AddAccountTypeModal from './AddAccountTypeModal';
import AddAccountCategoryModal from './AddAccountCategoryModal';
import PaginationControls from './PaginationControls';


const Management: React.FC = () => {
    const [activeTab, setActiveTab] = useState('rm');
    const [loading, setLoading] = useState(true);

    const [rms, setRms] = useState<RM[]>([]);
    const [branchManagers, setBranchManagers] = useState<BranchManager[]>([]);
    const [familyGroups, setFamilyGroups] = useState<FamilyGroup[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [accountTypes, setAccountTypes] = useState<AccountTypeInfo[]>([]);
    const [accountCategories, setAccountCategories] = useState<AccountCategoryInfo[]>([]);
    
    const [isRmModalOpen, setIsRmModalOpen] = useState(false);
    const [isBmModalOpen, setIsBmModalOpen] = useState(false);
    const [isFgModalOpen, setIsFgModalOpen] = useState(false);
    const [isAtModalOpen, setIsAtModalOpen] = useState(false);
    const [isAcModalOpen, setIsAcModalOpen] = useState(false);
    
    const [editingEntity, setEditingEntity] = useState<any>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const branchMap = new Map(branches.map(b => [b.id, b.name]));

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [rmData, bmData, fgData, branchData, atData, acData] = await Promise.all([
                api.getRms(),
                api.getBranchManagers(),
                api.getFamilyGroups(),
                api.getBranches(),
                api.getAccountTypes(),
                api.getAccountCategories(),
            ]);
            setRms(rmData);
            setBranchManagers(bmData);
            setFamilyGroups(fgData);
            setBranches(branchData);
            setAccountTypes(atData);
            setAccountCategories(acData);
        } catch (error) {
            console.error("Failed to fetch management data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleTabClick = (tabId: string) => {
        setActiveTab(tabId);
        setSearchTerm('');
        setCurrentPage(1);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const filteredRms = useMemo(() => {
        if (!searchTerm) return rms;
        const lowercasedFilter = searchTerm.toLowerCase();
        return rms.filter(item =>
            item.name.toLowerCase().includes(lowercasedFilter) ||
            item.code.toLowerCase().includes(lowercasedFilter) ||
            item.email.toLowerCase().includes(lowercasedFilter) ||
            item.phone.includes(searchTerm)
        );
    }, [rms, searchTerm]);

    const filteredBranchManagers = useMemo(() => {
        if (!searchTerm) return branchManagers;
        const lowercasedFilter = searchTerm.toLowerCase();
        return branchManagers.filter(item =>
            item.name.toLowerCase().includes(lowercasedFilter) ||
            item.code.toLowerCase().includes(lowercasedFilter) ||
            item.email.toLowerCase().includes(lowercasedFilter) ||
            item.phone.includes(searchTerm)
        );
    }, [branchManagers, searchTerm]);

    const filteredFamilyGroups = useMemo(() => {
        if (!searchTerm) return familyGroups;
        const lowercasedFilter = searchTerm.toLowerCase();
        return familyGroups.filter(item =>
            item.name.toLowerCase().includes(lowercasedFilter) ||
            item.code.toLowerCase().includes(lowercasedFilter)
        );
    }, [familyGroups, searchTerm]);

    const handleAddClick = () => {
        setEditingEntity(null);
        switch(activeTab) {
            case 'rm': setIsRmModalOpen(true); break;
            case 'bm': setIsBmModalOpen(true); break;
            case 'fg': setIsFgModalOpen(true); break;
            case 'at': setIsAtModalOpen(true); break;
            case 'ac': setIsAcModalOpen(true); break;
        }
    }
    
    const handleEditClick = (entity: any) => {
        setEditingEntity(entity);
        switch(activeTab) {
            case 'rm': setIsRmModalOpen(true); break;
            case 'bm': setIsBmModalOpen(true); break;
            case 'fg': setIsFgModalOpen(true); break;
            case 'at': setIsAtModalOpen(true); break;
            case 'ac': setIsAcModalOpen(true); break;
        }
    }

    const handleDeleteClick = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
            try {
                switch(activeTab) {
                    case 'rm': /* Not implemented */ break;
                    case 'bm': /* Not implemented */ break;
                    case 'fg': /* Not implemented */ break;
                    case 'at': await api.deleteAccountType(id); break;
                    case 'ac': await api.deleteAccountCategory(id); break;
                }
                fetchData();
            } catch (error) {
                console.error(`Failed to delete item:`, error);
                alert('An error occurred while deleting the item.');
            }
        }
    };
    
    const handleSave = async (data: any) => {
        const isEditing = !!editingEntity;
        try {
             switch(activeTab) {
                case 'rm': await api.addRm(data); break;
                case 'bm': await api.addBranchManager(data); break;
                case 'fg': await api.addFamilyGroup(data); break;
                case 'at': isEditing ? await api.updateAccountType(editingEntity.id, data) : await api.addAccountType(data); break;
                case 'ac': isEditing ? await api.updateAccountCategory(editingEntity.id, data) : await api.addAccountCategory(data); break;
            }
            fetchData();
        } catch(e) {
            console.error("Save failed", e);
        }
    };
    
    const tabs = [
        { id: 'rm', label: 'Relationship Managers', icon: IconUsers },
        { id: 'bm', label: 'Branch Managers', icon: IconBriefcase },
        { id: 'fg', label: 'Family Groups', icon: IconFamilyGroup },
        { id: 'ac', label: 'Account Categories', icon: IconTags },
        { id: 'at', label: 'Account Types', icon: IconShapes },
    ];
    const paginatedTabs = ['rm', 'bm', 'fg'];

    const getModalTitle = () => {
        const isEditing = !!editingEntity;
        const noun = tabs.find(t => t.id === activeTab)?.label.slice(0,-1) || 'Item';
        return `${isEditing ? 'Edit' : 'Add'} ${noun}`;
    }

    const renderContent = () => {
        if (loading) {
            return <div className="flex justify-center items-center h-64"><IconLoader className="animate-spin h-10 w-10 text-brand-blue-600"/></div>;
        }

        const actions = (item: any) => (
            <div className="flex items-center space-x-3">
                <button onClick={() => handleEditClick(item)} className="text-slate-500 hover:text-brand-blue-600">
                    <IconEdit className="h-5 w-5" />
                </button>
                <button onClick={() => handleDeleteClick(item.id)} className="text-slate-500 hover:text-rose-600">
                    <IconTrash className="h-5 w-5" />
                </button>
            </div>
        );

        let headers: React.ReactNode[] = [];
        let allData: any[] = [];
        let dataMapper: (item: any) => (string | number | React.ReactNode)[] = () => [];
        let itemName = 'items';
        const isPaginated = paginatedTabs.includes(activeTab);

        switch (activeTab) {
            case 'rm':
                headers = ['Name', 'Code', 'Email', 'Phone', 'Branch'];
                allData = filteredRms;
                dataMapper = (item) => [item.name, item.code, item.email, item.phone, branchMap.get(item.branchId) || 'N/A'];
                itemName = 'RMs';
                break;
            case 'bm':
                headers = ['Name', 'Code', 'Email', 'Phone', 'Branch'];
                allData = filteredBranchManagers;
                dataMapper = (item) => [item.name, item.code, item.email, item.phone, branchMap.get(item.branchId) || 'N/A'];
                itemName = 'managers';
                break;
            case 'fg':
                headers = ['Group Name', 'Code', 'Branch'];
                allData = filteredFamilyGroups;
                dataMapper = (item) => [item.name, item.code, branchMap.get(item.branchId) || 'N/A'];
                itemName = 'groups';
                break;
            case 'at':
                headers = ['Name', 'Actions'];
                allData = accountTypes;
                dataMapper = (item) => [item.name, actions(item)];
                itemName = 'types';
                break;
            case 'ac':
                headers = ['Name', 'Code', 'Actions'];
                allData = accountCategories;
                dataMapper = (item) => [item.name, item.code, actions(item)];
                itemName = 'categories';
                break;
            default:
                return null;
        }
        
        const totalItems = allData.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        const currentItems = isPaginated ? allData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) : allData;
        const tableData = currentItems.map(dataMapper);
        
        const getEmptyStateMessage = () => {
            const nounPlural = tabs.find(t => t.id === activeTab)?.label.toLowerCase() || 'items';
            const nounSingular = tabs.find(t => t.id === activeTab)?.label.slice(0, -1).toLowerCase() || 'item';
            if (searchTerm) return `No ${nounPlural} match your search.`;
            return `No ${nounPlural} found. Click 'Add New ${nounSingular}' to create one.`;
        };

        return (
            <div>
                <div className="overflow-x-auto">
                    <Table headers={headers} data={tableData} emptyStateMessage={getEmptyStateMessage()} />
                </div>
                {isPaginated && (
                    <PaginationControls
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        itemsPerPage={itemsPerPage}
                        onItemsPerPageChange={setItemsPerPage}
                        totalItems={totalItems}
                        itemName={itemName}
                    />
                )}
            </div>
        );
    };
    
    return (
        <>
            <div className="bg-white rounded-lg shadow">
                <div className="p-5 border-b border-slate-200 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">User &amp; Group Management</h2>
                        <p className="text-slate-500 mt-1">Manage Relationship Managers, Branch Managers, and other system data.</p>
                    </div>
                    <button onClick={handleAddClick} className="inline-flex items-center px-4 py-2 bg-brand-blue-600 text-white text-sm font-medium rounded-md hover:bg-brand-blue-700">
                        Add New {tabs.find(t => t.id === activeTab)?.label.slice(0,-1)}
                    </button>
                </div>
                <div className="p-5">
                    <div className="border-b border-slate-200">
                        <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabClick(tab.id)}
                                    className={`${activeTab === tab.id ? 'border-brand-blue-500 text-brand-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                                >
                                    <tab.icon className="mr-2 h-5 w-5"/>
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                    <div className="mt-6">
                        {paginatedTabs.includes(activeTab) && (
                            <div className="mb-4">
                                <div className="relative max-w-sm">
                                    <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder={`Search ${tabs.find(t => t.id === activeTab)?.label}...`}
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-brand-blue-500 focus:border-brand-blue-500 text-sm"
                                    />
                                </div>
                            </div>
                        )}
                        {renderContent()}
                    </div>
                </div>
            </div>

            <AddManagerModal 
                isOpen={isRmModalOpen} 
                onClose={() => setIsRmModalOpen(false)}
                onAdd={handleSave}
                title="Add Relationship Manager"
                branches={branches}
            />
            <AddManagerModal 
                isOpen={isBmModalOpen} 
                onClose={() => setIsBmModalOpen(false)}
                onAdd={handleSave}
                title="Add Branch Manager"
                branches={branches}
            />
            <AddFamilyGroupModal
                isOpen={isFgModalOpen}
                onClose={() => setIsFgModalOpen(false)}
                onAdd={handleSave}
                branches={branches}
            />
            <AddAccountTypeModal
                isOpen={isAtModalOpen}
                onClose={() => setIsAtModalOpen(false)}
                onSave={handleSave}
                itemToEdit={editingEntity}
                title={getModalTitle()}
            />
            <AddAccountCategoryModal
                isOpen={isAcModalOpen}
                onClose={() => setIsAcModalOpen(false)}
                onSave={handleSave}
                itemToEdit={editingEntity}
                title={getModalTitle()}
            />
        </>
    );
};

export default Management;