import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CategoryBreakdownData } from '../types';
import { formatCurrency } from '../utils/helpers';
import Table from './Table';

interface CategoryTabProps {
    data: CategoryBreakdownData[];
}

const CategoryTab: React.FC<CategoryTabProps> = ({ data }) => {
    const COLORS = ['#0ea5e9', '#10b981', '#f97316', '#8b5cf6', '#ec4899', '#f59e0b'];
    const chartData = data.map(d => ({name: d.categoryName, value: d.balance }));
    const headers = ['Category', 'Total Clients', 'Balance', 'CR', 'DR'];
    const tableData = data.map(d => [d.categoryName, d.totalClients, formatCurrency(d.balance), formatCurrency(d.cr), formatCurrency(d.dr)]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                            {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip formatter={(value: number) => formatCurrency(value)}/>
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="lg:col-span-3">
                <Table headers={headers} data={tableData} emptyStateMessage="No category breakdown data available."/>
            </div>
        </div>
    );
};

export default CategoryTab;
