import React from 'react';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (size: number) => void;
  totalItems: number;
  itemName?: string;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalItems,
  itemName = 'items',
}) => {
  if (totalPages <= 1 && totalItems <= itemsPerPage) return null;

  return (
    <div className="px-4 py-2 flex justify-between items-center text-sm bg-white border-t rounded-b-lg">
      <div className="flex items-center space-x-2">
        <span className="text-slate-600">Rows per page:</span>
        <select
          value={itemsPerPage}
          onChange={(e) => {
              onItemsPerPageChange(Number(e.target.value));
              onPageChange(1); // Reset to first page
          }}
          className="border border-slate-300 rounded-md py-1 pl-2 pr-7 text-sm focus:ring-brand-blue-500 focus:border-brand-blue-500"
          aria-label="Rows per page"
        >
          {[10, 25, 50, 100].map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </div>
      <span className="text-slate-600">
        Page {totalPages > 0 ? currentPage : 0} of {totalPages} ({totalItems} {itemName})
      </span>
      <div className="inline-flex rounded-md shadow-sm">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 text-sm font-medium text-slate-500 bg-white border border-slate-300 rounded-l-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Go to previous page"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-3 py-1.5 text-sm font-medium text-slate-500 bg-white border-y border-r border-slate-300 rounded-r-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Go to next page"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaginationControls;
