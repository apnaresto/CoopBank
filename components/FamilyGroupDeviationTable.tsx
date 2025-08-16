
import React, { useState } from 'react';
import { FamilyGroupDeviationSummary, ClientProfile } from '../types';
import { formatCurrency } from '../utils/helpers';
import { IconChevronDown } from './Icons';
import { useData } from '../contexts/DataContext';

const MemberLevelTable: React.FC<{ members: ClientProfile[] }> = ({ members }) => {
    const { setViewClientPan } = useData();

    if (members.length === 0) {
        return <p className="text-center text-slate-500 p-4">No members in this group.</p>;
    }

    return (
        <div className="overflow-x-auto max-h-72">
            <table className="w-full text-sm">
                <thead className="text-xs text-slate-700 uppercase bg-slate-100 sticky top-0">
                    <tr>
                        <th className="px-4 py-2 text-left">Member Name</th>
                        <th className="px-4 py-2 text-right">Set Balance</th>
                        <th className="px-4 py-2 text-right">Actual Balance</th>
                        <th className="px-4 py-2 text-right">Deviation (%)</th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {members.map(member => {
                         const deviationPercent = member.setBalance && member.setBalance > 0 
                            ? ((member.accountBalance - member.setBalance) / member.setBalance) * 100
                            : 0;
                         const isPositive = deviationPercent >= 0;
                        
                         return (
                            <tr key={member.id} className="border-b last:border-0">
                                <td className="px-4 py-2 font-medium text-slate-900">
                                     <button onClick={() => setViewClientPan(member.panPrimary)} className="hover:underline text-brand-blue-600 text-left">
                                        {member.nameFirstHolder}
                                     </button>
                                </td>
                                <td className="px-4 py-2 text-right">{formatCurrency(member.setBalance || 0)}</td>
                                <td className="px-4 py-2 text-right font-semibold">{formatCurrency(member.accountBalance)}</td>
                                <td className={`px-4 py-2 text-right font-semibold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {deviationPercent.toFixed(2)}%
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

interface FamilyGroupDeviationTableProps {
    summaries: FamilyGroupDeviationSummary[];
    weekEnding: string;
}

const FamilyGroupDeviationTable: React.FC<FamilyGroupDeviationTableProps> = ({ summaries }) => {
    const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);

    const handleToggle = (groupId: string) => {
        setExpandedGroupId(prev => (prev === groupId ? null : groupId));
    };

    const headers = ['Group Name', '# Members', 'Total Set Balance', 'Total Actual Balance', 'Avg. Deviation (%)'];
    
    if (summaries.length === 0) {
        return <div className="text-center py-10 text-slate-500">No family group data available for this week.</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-500">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                    <tr>{headers.map((h, i) => <th key={i} scope="col" className={`px-6 py-3 ${i > 1 ? 'text-right' : 'text-left'}`}>{h}</th>)}</tr>
                </thead>
                <tbody>
                    {summaries.map(summary => (
                        <React.Fragment key={summary.groupId}>
                            <tr 
                                className="bg-white border-b hover:bg-slate-50 cursor-pointer" 
                                onClick={() => handleToggle(summary.groupId)}
                                aria-expanded={expandedGroupId === summary.groupId}
                            >
                                <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                                     <IconChevronDown className={`w-4 h-4 transition-transform ${expandedGroupId === summary.groupId ? 'rotate-0' : '-rotate-90'}`} />
                                    {summary.groupName}
                                </td>
                                <td className="px-6 py-4 text-right">{summary.memberCount}</td>
                                <td className="px-6 py-4 text-right">{formatCurrency(summary.totalSetBalance)}</td>
                                <td className="px-6 py-4 text-right font-semibold">{formatCurrency(summary.totalActualBalance)}</td>
                                <td className="px-6 py-4 text-right font-semibold">{summary.averageDeviation.toFixed(2)}%</td>
                            </tr>
                            {expandedGroupId === summary.groupId && (
                                <tr>
                                    <td colSpan={headers.length} className="p-0">
                                        <div className="bg-slate-50 p-4 border-y-2 border-brand-blue-200">
                                            <MemberLevelTable members={summary.members} />
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FamilyGroupDeviationTable;
