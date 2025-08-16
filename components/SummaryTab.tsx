import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { WeeklySummaryData } from '../types';
import { formatCurrency, formatCurrencyShort } from '../utils/helpers';
import Table from './Table';

interface SummaryTabProps {
    data: WeeklySummaryData[];
}

const SummaryTab: React.FC<SummaryTabProps> = ({ data }) => {
    const headers = ['Week', 'Total CR', 'Total DR', 'Clients Updated', 'KYC Changes'];
    const tableData = data.map(d => [d.week, formatCurrency(d.totalCR), formatCurrency(d.totalDR), d.clientsUpdated, d.kycChanges]);
    return (
        <div className="space-y-6">
             <div className="h-80">
                 <ResponsiveContainer width="100%" height="100%">
                     <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                         <CartesianGrid strokeDasharray="3 3" />
                         <XAxis dataKey="week" />
                         <YAxis tickFormatter={formatCurrencyShort}/>
                         <Tooltip formatter={(value: number) => formatCurrency(value)}/>
                         <Legend />
                         <Line type="monotone" dataKey="totalCR" name="Total Credit" stroke="#10b981" activeDot={{ r: 8 }} />
                         <Line type="monotone" dataKey="totalDR" name="Total Debit" stroke="#f43f5e" />
                     </LineChart>
                 </ResponsiveContainer>
             </div>
             <Table headers={headers} data={tableData} emptyStateMessage="No weekly summary data available." />
        </div>
    );
};

export default SummaryTab;
