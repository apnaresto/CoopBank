import React, { useMemo, useState } from 'react';
import { Branch, UploadBatch, UploadStatus } from '../types';
import { getStatusBadgeStyle } from '../utils/helpers';
import * as ReactRouterDOM from 'react-router-dom';
import { IconChevronLeft, IconChevronRight } from './Icons';

interface UploadHealthGridProps {
  branches: Branch[];
  uploads: UploadBatch[];
  weekDates: string[];
}

const UploadHealthGrid: React.FC<UploadHealthGridProps> = ({ branches, uploads, weekDates }) => {
  const WEEKS_PER_PAGE = 12;
  const [weekPage, setWeekPage] = useState(0);

  const totalWeekPages = Math.ceil(weekDates.length / WEEKS_PER_PAGE);

  const displayedWeeks = useMemo(() => {
    const start = weekPage * WEEKS_PER_PAGE;
    const end = start + WEEKS_PER_PAGE;
    return weekDates.slice(start, end);
  }, [weekDates, weekPage, WEEKS_PER_PAGE]);

  const uploadsMap = useMemo(() => {
    const map = new Map<string, UploadBatch>();
    uploads.forEach(upload => {
      const key = `${upload.branchId}_${upload.weekEnding}`;
      const existing = map.get(key);
      if (!existing || upload.version > existing.version) {
        map.set(key, upload);
      }
    });
    return map;
  }, [uploads]);

  const getStatusForCell = (branchId: string, week: string): UploadStatus => {
    const upload = uploadsMap.get(`${branchId}_${week}`);
    return upload ? upload.status : 'Missing';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b">
        <h3 className="text-lg font-semibold text-slate-800">Weekly Submission Health</h3>
        {totalWeekPages > 1 && (
            <div className="flex items-center gap-2">
                <button
                    onClick={() => setWeekPage(p => Math.max(0, p - 1))}
                    disabled={weekPage === 0}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-300 text-sm font-medium rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Previous weeks"
                >
                    <IconChevronLeft className="h-4 w-4" />
                    <span>Prev</span>
                </button>
                <span className="text-sm font-medium text-slate-500 w-20 text-center">
                    Page {weekPage + 1} of {totalWeekPages}
                </span>
                <button
                    onClick={() => setWeekPage(p => Math.min(p + 1, totalWeekPages - 1))}
                    disabled={(weekPage + 1) >= totalWeekPages}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-300 text-sm font-medium rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Next weeks"
                >
                    <span>Next</span>
                    <IconChevronRight className="h-4 w-4" />
                </button>
            </div>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50 sticky top-0 z-20">
            <tr>
              <th scope="col" className="px-6 py-3 whitespace-nowrap sticky left-0 bg-slate-50 z-30">Branch Name</th>
              {displayedWeeks.map(week => (
                <th key={week} scope="col" className="px-6 py-3 text-center whitespace-nowrap min-w-[120px]">{week}</th>
              ))}
            </tr>
          </thead>
          <tbody className="relative z-10">
            {branches.map(branch => (
              <tr key={branch.id} className="bg-white border-b last:border-0 hover:bg-slate-50 group">
                <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap sticky left-0 bg-white group-hover:bg-slate-50">
                   <ReactRouterDOM.Link to={`/history?view=log&branch=${branch.id}`} className="hover:underline text-brand-blue-600">
                      {branch.name}
                   </ReactRouterDOM.Link>
                </td>
                {displayedWeeks.map(week => {
                  const status = getStatusForCell(branch.id, week);
                  return (
                    <td key={`${branch.id}-${week}`} className="px-6 py-4 text-center">
                      <ReactRouterDOM.Link to={`/history?view=log&branch=${branch.id}&week=${week}`} title={`View log for ${branch.name} on ${week}`}>
                        <span className={`${getStatusBadgeStyle(status)} transition-transform hover:scale-110 inline-block`}>{status}</span>
                      </ReactRouterDOM.Link>
                    </td>
                  );
                })}
              </tr>
            ))}
            {branches.length === 0 && (
                <tr>
                    <td colSpan={displayedWeeks.length + 1} className="text-center py-10">
                        No branches found. Please add branches in Branch Management.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UploadHealthGrid;
