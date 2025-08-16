import React, { useState, useEffect, useCallback } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { UploadBatch, DashboardStats } from '../types';
import { api } from '../services/mockApi';
import { IconUsers, IconWallet, IconArrowRightLeft, IconCheckCircle, IconAlertTriangle, IconFileClock, IconLoader, IconLineChart } from './Icons';
import { formatCurrency, getStatusBadgeStyle, formatCurrencyShort } from '../utils/helpers';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Table from './Table';
import PageHeader from './PageHeader';
import { useData } from '../contexts/DataContext';

interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  iconBgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, iconBgColor }) => (
  <div className="bg-white rounded-lg shadow p-5 flex items-center">
    <div className={`rounded-full p-3 ${iconBgColor}`}>
      <Icon className="h-6 w-6 text-white" />
    </div>
    <div className="ml-4">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

const BranchSelector: React.FC<{ branches: {id: string, name: string}[], selectedBranch: string, onSelectBranch: (id: string) => void }> = ({ branches, selectedBranch, onSelectBranch }) => (
    <div className="max-w-xs">
        <select
            id="branch"
            value={selectedBranch}
            onChange={(e) => onSelectBranch(e.target.value)}
            className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500 block w-full p-2.5"
        >
            {branches.map(branch => (
                <option key={branch.id} value={branch.id}>{branch.name}</option>
            ))}
        </select>
    </div>
);


const Dashboard: React.FC = () => {
  const { branches, weekDates, loading: contextLoading, getBranchName } = useData();
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [balanceHistory, setBalanceHistory] = useState<{week: string, balance: number}[]>([]);
  const [recentUploads, setRecentUploads] = useState<UploadBatch[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (branches.length > 0 && !selectedBranch) {
      setSelectedBranch(branches[0].id);
    }
  }, [branches, selectedBranch]);

  const fetchDashboardData = useCallback(async () => {
    if (!selectedBranch || weekDates.length === 0) return;
    setStatsLoading(true);
    try {
      const latestWeek = weekDates[0];
      const [statsData, uploadsData, historyData] = await Promise.all([
        api.getDashboardStats(selectedBranch, latestWeek),
        api.getRecentUploads(5),
        api.getBranchBalanceHistory(selectedBranch, 12)
      ]);
      setStats(statsData);
      setRecentUploads(uploadsData);
      setBalanceHistory(historyData);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setStatsLoading(false);
    }
  }, [selectedBranch, weekDates]);

  useEffect(() => {
    if (selectedBranch) {
        fetchDashboardData();
    }
  }, [selectedBranch, fetchDashboardData]);

  if (contextLoading) {
    return <div className="flex justify-center items-center h-full"><IconLoader className="animate-spin h-10 w-10 text-brand-blue-600"/></div>;
  }
  
  const uploadTableHeaders = ['Branch', 'Week Ending', 'Version', 'Status', 'Upload Time', 'CR/DR'];
  const uploadTableData = recentUploads.map(upload => [
      getBranchName(upload.branchId),
      upload.weekEnding,
      `v${upload.version}`,
      <span className={getStatusBadgeStyle(upload.status)}>{upload.status}</span>,
      new Date(upload.uploadTime).toLocaleString(),
      <div className="text-right">
          <span className="text-emerald-600">{formatCurrency(upload.totalCR)}</span> / <span className="text-rose-600">{formatCurrency(upload.totalDR)}</span>
      </div>
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="High-level overview of branch performance and recent activity."
        actions={branches.length > 0 && selectedBranch && (
            <div className="flex items-center space-x-4">
              <BranchSelector branches={branches} selectedBranch={selectedBranch} onSelectBranch={setSelectedBranch} />
              <ReactRouterDOM.Link to={`/reports/${selectedBranch}`} className="text-sm font-medium text-brand-blue-600 hover:underline whitespace-nowrap">
                View Full Report &rarr;
              </ReactRouterDOM.Link>
            </div>
          )}
      />
      
      {statsLoading ? <div className="text-sm text-slate-500">Loading branch data...</div> : stats?.uploadWarning && (
        <div className="bg-rose-100 border-l-4 border-rose-500 text-rose-700 p-4 rounded-md flex items-center" role="alert">
          <IconAlertTriangle className="h-5 w-5 mr-3"/>
          <p><span className="font-bold">Warning:</span> {stats.uploadWarning}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={IconUsers} title="Total Clients" value={statsLoading ? '...' : (stats?.totalClients.toString() || '0')} iconBgColor="bg-sky-500" />
        <StatCard icon={IconWallet} title="Total Balance" value={statsLoading ? '...' : (stats ? formatCurrency(stats.totalBalance) : '...')} iconBgColor="bg-emerald-500" />
        <StatCard icon={IconArrowRightLeft} title="DR/CR Movement" value={statsLoading ? '...' : (stats ? formatCurrency(stats.netMovement) : '...')} iconBgColor="bg-amber-500" />
        <StatCard icon={IconCheckCircle} title="Active Upload Version" value={statsLoading ? '...' : (stats?.activeUploadVersion || '-')} iconBgColor="bg-indigo-500" />
      </div>

       <div className="bg-white rounded-lg shadow">
          <div className="p-5 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center"><IconLineChart className="mr-2 h-5 w-5"/>Branch Balance Trend (Last 12 Weeks)</h3>
          </div>
          <div className="p-5 h-80">
            {statsLoading ? (
                 <div className="flex justify-center items-center h-full"><IconLoader className="animate-spin h-8 w-8 text-brand-blue-600"/></div>
            ): (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={balanceHistory} margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" tickFormatter={(tick) => tick.slice(5)} />
                  <YAxis tickFormatter={formatCurrencyShort} domain={['dataMin - 100000', 'dataMax + 100000']}/>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                  <Line type="monotone" dataKey="balance" name="Total Balance" stroke="#2563eb" strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-5 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center"><IconFileClock className="mr-2 h-5 w-5"/>Recent Uploads (All Branches)</h3>
        </div>
        <Table headers={uploadTableHeaders} data={uploadTableData} />
      </div>
    </div>
  );
};

export default Dashboard;