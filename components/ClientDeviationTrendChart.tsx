
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { api } from '../services/mockApi';
import { ClientDeviationHistoryItem } from '../types';
import { formatCurrency, formatCurrencyShort } from '../utils/helpers';
import { IconLoader, IconHelpCircle } from './Icons';

interface ClientDeviationTrendChartProps {
    clientId: string;
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-white p-3 rounded-lg shadow-lg border">
                <p className="text-sm font-semibold text-slate-700">{`Week: ${label}`}</p>
                <p className="text-xs text-slate-500">{`Set Balance: ${formatCurrency(data.setBalance)}`}</p>
                <p className="text-xs text-slate-500">{`Actual Balance: ${formatCurrency(data.actualBalance)}`}</p>
                <p className={`text-xs font-bold ${data.deviationPercent >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{`Deviation: ${data.deviationPercent.toFixed(2)}%`}</p>
            </div>
        );
    }
    return null;
};

const ClientDeviationTrendChart: React.FC<ClientDeviationTrendChartProps> = ({ clientId }) => {
    const [history, setHistory] = useState<ClientDeviationHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        api.getClientDeviationHistory(clientId)
            .then(setHistory)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [clientId]);
    
    if (loading) {
        return <div className="p-6 bg-white rounded-lg shadow border flex justify-center items-center h-80"><IconLoader className="animate-spin h-8 w-8 text-brand-blue-600" /></div>;
    }

    if (history.length === 0) {
        return (
            <div className="p-6 bg-white rounded-lg shadow border text-center text-slate-500 h-80 flex flex-col justify-center items-center">
                 <IconHelpCircle className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                <p>No deviation history found for this client.</p>
            </div>
        );
    }

    return (
         <div className="bg-white p-4 rounded-lg shadow border h-96">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Deviation History (Last 12 Weeks)</h4>
             <ResponsiveContainer width="100%" height="90%">
                <LineChart data={history} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="week" tick={{ fontSize: 12 }} tickFormatter={(tick) => tick.slice(5)} />
                    <YAxis tickFormatter={(tick) => formatCurrencyShort(tick)} tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{fontSize: "14px"}}/>
                    <Line type="monotone" dataKey="setBalance" name="Set Balance" stroke="#8884d8" strokeDasharray="5 5" dot={false} />
                    <Line type="monotone" dataKey="actualBalance" name="Actual Balance" stroke="#82ca9d" strokeWidth={2} activeDot={{ r: 6 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ClientDeviationTrendChart;
