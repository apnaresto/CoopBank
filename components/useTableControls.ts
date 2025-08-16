import { useState, useMemo, useEffect } from 'react';
import { useDebounce } from './useDebounce';

interface SortConfig<T> {
  key: keyof T;
  direction: 'asc' | 'desc';
}

interface UseTableControlsProps<T> {
  initialData: T[];
  initialItemsPerPage?: number;
  initialSortConfig?: SortConfig<T> | null;
  searchPredicate: (item: T, searchTerm: string) => boolean;
  filterPredicate?: (item: T) => boolean;
}

export function useTableControls<T>({
  initialData,
  initialItemsPerPage = 10,
  initialSortConfig = null,
  searchPredicate,
  filterPredicate = () => true,
}: UseTableControlsProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(initialSortConfig);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  const filteredData = useMemo(() => {
    return initialData
      .filter(filterPredicate)
      .filter(item => searchPredicate(item, debouncedSearchTerm.toLowerCase()));
  }, [initialData, debouncedSearchTerm, filterPredicate, searchPredicate]);

  const sortedData = useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig) {
      sortableItems.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;
        
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

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  useEffect(() => {
    // Reset to page 1 whenever filters or search term change
    if (currentPage !== 1) {
        setCurrentPage(1);
    }
  }, [debouncedSearchTerm, filterPredicate, itemsPerPage]);

  const requestSort = (key: keyof T) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  const paginationProps = {
    currentPage,
    totalPages,
    onPageChange: setCurrentPage,
    itemsPerPage,
    onItemsPerPageChange: setItemsPerPage,
    totalItems: sortedData.length,
  };

  return {
    searchTerm,
    setSearchTerm,
    processedData: sortedData, // Expose the full sorted/filtered list
    paginatedData,
    sortConfig,
    requestSort,
    paginationProps,
  };
}