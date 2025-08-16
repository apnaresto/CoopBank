

import React, { createContext, useState, useEffect, useCallback, useContext, ReactNode, useMemo } from 'react';
import { api } from '../services/mockApi';
import { Branch, RM, BranchManager, FamilyGroup, AccountTypeInfo, AccountCategoryInfo, SoftwareVendor, ClientProfile } from '../types';

interface DataContextType {
    loading: boolean;
    branches: Branch[];
    rms: RM[];
    branchManagers: BranchManager[];
    familyGroups: FamilyGroup[];
    accountTypes: AccountTypeInfo[];
    accountCategories: AccountCategoryInfo[];
    softwareVendors: SoftwareVendor[];
    weekDates: string[];
    getBranchName: (branchId: string) => string;
    refetchData: () => Promise<void>; // Full refetch
    // Granular refetch functions
    refetchBranches: () => Promise<void>;
    refetchRms: () => Promise<void>;
    refetchBranchManagers: () => Promise<void>;
    refetchFamilyGroups: () => Promise<void>;
    refetchAccountTypes: () => Promise<void>;
    refetchAccountCategories: () => Promise<void>;
    refetchSoftwareVendors: () => Promise<void>;
    refetchWeekDates: () => Promise<void>;
    refetchBranchesAndManagers: () => Promise<void>;
    refetchClientsForBranch: (branchId: string, weekEnding: string) => Promise<ClientProfile[]>;
    viewingClientPan: string | null;
    setViewClientPan: (pan: string | null) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [rms, setRms] = useState<RM[]>([]);
    const [branchManagers, setBranchManagers] = useState<BranchManager[]>([]);
    const [familyGroups, setFamilyGroups] = useState<FamilyGroup[]>([]);
    const [accountTypes, setAccountTypes] = useState<AccountTypeInfo[]>([]);
    const [accountCategories, setAccountCategories] = useState<AccountCategoryInfo[]>([]);
    const [softwareVendors, setSoftwareVendors] = useState<SoftwareVendor[]>([]);
    const [weekDates, setWeekDates] = useState<string[]>([]);
    const [viewingClientPan, setViewingClientPan] = useState<string | null>(null);

    // Individual fetch functions
    const fetchBranches = useCallback(async () => setBranches(await api.getBranches()), []);
    const fetchRms = useCallback(async () => setRms(await api.getRms()), []);
    const fetchBranchManagers = useCallback(async () => setBranchManagers(await api.getBranchManagers()), []);
    const fetchFamilyGroups = useCallback(async () => setFamilyGroups(await api.getFamilyGroups()), []);
    const fetchAccountTypes = useCallback(async () => setAccountTypes(await api.getAccountTypes()), []);
    const fetchAccountCategories = useCallback(async () => setAccountCategories(await api.getAccountCategories()), []);
    const fetchSoftwareVendors = useCallback(async () => setSoftwareVendors(await api.getSoftwareVendors()), []);
    const fetchWeekDates = useCallback(async () => setWeekDates(await api.getWeekEndingDates()), []);

    const fetchData = useCallback(async () => {
        try {
            await Promise.all([
                fetchBranches(),
                fetchRms(),
                fetchBranchManagers(),
                fetchFamilyGroups(),
                fetchAccountTypes(),
                fetchAccountCategories(),
                fetchSoftwareVendors(),
                fetchWeekDates(),
            ]);
        } catch (error) {
            console.error("Failed to fetch shared data:", error);
        } finally {
            setLoading(false);
        }
    }, [
        fetchBranches, fetchRms, fetchBranchManagers, fetchFamilyGroups, 
        fetchAccountTypes, fetchAccountCategories, fetchSoftwareVendors, fetchWeekDates
    ]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const branchMap = useMemo(() => new Map(branches.map(b => [b.id, b.name])), [branches]);

    const getBranchName = useCallback((branchId: string) => {
        return branchMap.get(branchId) || 'Unknown Branch';
    }, [branchMap]);
    
    const refetchBranchesAndManagers = useCallback(async () => {
         await Promise.all([fetchBranches(), fetchBranchManagers()]);
    }, [fetchBranches, fetchBranchManagers]);

    const refetchClientsForBranch = useCallback(async (branchId: string, weekEnding: string) => {
        return api.getBranchClientsForWeek(branchId, weekEnding);
    }, []);

    const setViewClientPan = useCallback((pan: string | null) => {
        setViewingClientPan(pan);
    }, []);

    const value = useMemo(() => ({
        loading,
        branches,
        rms,
        branchManagers,
        familyGroups,
        accountTypes,
        accountCategories,
        softwareVendors,
        weekDates,
        getBranchName,
        refetchData: fetchData,
        refetchBranches: fetchBranches,
        refetchRms: fetchRms,
        refetchBranchManagers: fetchBranchManagers,
        refetchFamilyGroups: fetchFamilyGroups,
        refetchAccountTypes: fetchAccountTypes,
        refetchAccountCategories: fetchAccountCategories,
        refetchSoftwareVendors: fetchSoftwareVendors,
        refetchWeekDates: fetchWeekDates,
        refetchBranchesAndManagers,
        refetchClientsForBranch,
        viewingClientPan,
        setViewClientPan,
    }), [
        loading, branches, rms, branchManagers, familyGroups, accountTypes, accountCategories, softwareVendors, weekDates,
        getBranchName, fetchData, fetchBranches, fetchRms, fetchBranchManagers, fetchFamilyGroups,
        fetchAccountTypes, fetchAccountCategories, fetchSoftwareVendors, fetchWeekDates,
        refetchBranchesAndManagers, refetchClientsForBranch, viewingClientPan, setViewClientPan
    ]);

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = (): DataContextType => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};