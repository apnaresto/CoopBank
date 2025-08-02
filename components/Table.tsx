import React from 'react';

interface TableProps {
  headers: React.ReactNode[];
  data: (string | number | React.ReactNode)[][];
  renderCell?: (data: any, rowIndex: number, cellIndex: number) => React.ReactNode;
  emptyStateMessage?: string;
}

const Table: React.FC<TableProps> = ({ headers, data, renderCell, emptyStateMessage = "No data available." }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-slate-500">
        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
          <tr>
            {headers.map((header, index) => (
              <th key={index} scope="col" className="px-6 py-3">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="bg-white border-b hover:bg-slate-50">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className={`px-6 py-4 ${cellIndex === 0 ? 'font-medium text-slate-900 whitespace-nowrap' : ''}`}>
                  {renderCell ? renderCell(cell, rowIndex, cellIndex) : cell}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={headers.length} className="text-center py-10 text-slate-500">
                {emptyStateMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;