import React, { useState, useEffect, useMemo } from 'react';
import { Branch, UploadBatch } from '../types';
import { api } from '../services/mockApi';
import { IconLoader } from './Icons';
import { formatCurrency, getStatusBadgeStyle } from '../utils/helpers';
import Table from './Table';
import PaginationControls from './PaginationControls';

const UploadHistory: React.FC = () => {
  const [allUploads, setAllUploads] = useState<UploadBatch[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterBranch, setFilterBranch] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [uploadsData, branchesData] = await Promise.all([
          api.getAllUploads(),
          api.getBranches()
        ]);
        setAllUploads(uploadsData.sort((a,b) => new Date(b.uploadTime).getTime() - new Date(a.uploadTime).getTime()));
        setBranches(branchesData);
      } catch (error) {
        console.error("Failed to fetch upload history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredUploads = useMemo(() => {
    setCurrentPage(1); // Reset page when filter changes
    if (filterBranch === 'all') {
      return allUploads;
    }
    return allUploads.filter(upload => upload.branchId === filterBranch);
  }, [allUploads, filterBranch]);

  const totalPages = Math.ceil(filteredUploads.length / itemsPerPage);

  const paginatedUploads = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUploads.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUploads, currentPage, itemsPerPage]);


  const getBranchName = (branchId: string) => branches.find(b => b.id === branchId)?.name || 'Unknown';
  
  if (loading) {
    return <div className="flex justify-center items-center h-full"><IconLoader className="animate-spin h-10 w-10 text-brand-blue-600"/></div>;
  }

  const tableHeaders = ['Branch', 'Week Ending', 'Version', 'Status', 'Upload Time', 'Total CR', 'Total DR'];
  const tableData = paginatedUploads.map(upload => [
      getBranchName(upload.branchId),
      upload.weekEnding,
      `v${upload.version}`,
      <span className={getStatusBadgeStyle(upload.status)}>{upload.status}</span>,
      new Date(upload.uploadTime).toLocaleString(),
      <span className="font-medium text-emerald-600 text-right block">{formatCurrency(upload.totalCR)}</span>,
      <span className="font-medium text-rose-600 text-right block">{formatCurrency(upload.totalDR)}</span>
  ]);


  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-5 border-b border-slate-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-800">Complete Upload History</h3>
        <div>
          <label htmlFor="branch-filter" className="sr-only">Filter by branch</label>
          <select id="branch-filter" value={filterBranch} onChange={e => setFilterBranch(e.target.value)} className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500 block w-full p-2.5">
            <option value="all">All Branches</option>
            {branches.map(branch => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
          </select>
        </div>
      </div>
      <Table headers={tableHeaders} data={tableData} />
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
        totalItems={filteredUploads.length}
        itemName="uploads"
      />
    </div>
  );
};

export default UploadHistory;