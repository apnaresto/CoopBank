import React, { useState } from 'react';
import { RMPerformanceData } from '../types';
import RMDeviationSummaryCard from './RMDeviationSummaryCard';
import RMClientsListView from './RMClientsListView';

interface RMTabProps {
    data: RMPerformanceData[];
    branchId: string;
    weekEnding: string;
}

const RMTab: React.FC<RMTabProps> = ({ data, branchId, weekEnding }) => {
    
    const [selectedRm, setSelectedRm] = useState<RMPerformanceData | null>(null);

    if (selectedRm) {
        return <RMClientsListView rm={selectedRm} branchId={branchId} weekEnding={weekEnding} onClose={() => setSelectedRm(null)} />;
    }
    
    if (data.length === 0) {
      return <div className="text-center py-10 text-slate-500">No RM performance data found for this branch.</div>
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((d) => (
                <RMDeviationSummaryCard key={d.rmId} rmId={d.rmId} weekEnding={weekEnding} onClick={() => setSelectedRm(d)} />
            ))}
        </div>
    );
};

export default RMTab;
