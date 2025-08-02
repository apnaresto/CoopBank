import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Branch, UploadBatch, DashboardStats } from '../types';
import { api } from '../services/mockApi';
import { IconUsers, IconWallet, IconArrowRightLeft, IconCheckCircle, IconAlertTriangle, IconFileClock, IconLoader } from './Icons';
import { formatCurrency, getStatusBadgeStyle } from '../utils/helpers';
import Table from './Table';

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

const BranchSelector: React.FC<{ branches: Branch[], selectedBranch: string, onSelectBranch: (id: string) => void }> = ({ branches, selectedBranch, onSelectBranch }) => (
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
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>('b1');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentUploads, setRecentUploads] = useState<UploadBatch[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
        const branchesData = await api.getBranches();
        setBranches(branchesData);
        if (branchesData.length > 0) {
             const defaultBranch = branchesData[0].id;
             // Set the selected branch, or use the first one if not set
             const currentSelected = selectedBranch || defaultBranch;
             setSelectedBranch(currentSelected);

            const [statsData, uploadsData] = await Promise.all([
                api.getDashboardStats(currentSelected),
                api.getRecentUploads(5)
            ]);
            setStats(statsData);
            setRecentUploads(uploadsData);
        }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedBranch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading && !stats) {
    return <div className="flex justify-center items-center h-full"><IconLoader className="animate-spin h-10 w-10 text-brand-blue-600"/></div>;
  }

  const getBranchName = (branchId: string) => branches.find(b => b.id === branchId)?.name || 'Unknown Branch';
  
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
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-700">Branch Overview</h2>
        {branches.length > 0 && (
          <div className="flex items-center space-x-4">
            <BranchSelector branches={branches} selectedBranch={selectedBranch} onSelectBranch={setSelectedBranch} />
            {selectedBranch && (
              <Link to={`/reports/${selectedBranch}`} className="text-sm font-medium text-brand-blue-600 hover:underline whitespace-nowrap">
                View Report &rarr;
              </Link>
            )}
          </div>
        )}
      </div>

      {stats?.uploadWarning && (
        <div className="bg-rose-100 border-l-4 border-rose-500 text-rose-700 p-4 rounded-md flex items-center" role="alert">
          <IconAlertTriangle className="h-5 w-5 mr-3"/>
          <p><span className="font-bold">Warning:</span> {stats.uploadWarning}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={IconUsers} title="Total Clients" value={stats?.totalClients.toString() || '...'} iconBgColor="bg-sky-500" />
        <StatCard icon={IconWallet} title="Total Balance" value={stats ? formatCurrency(stats.totalBalance) : '...'} iconBgColor="bg-emerald-500" />
        <StatCard icon={IconArrowRightLeft} title="DR/CR Movement" value={stats ? formatCurrency(stats.netMovement) : '...'} iconBgColor="bg-amber-500" />
        <StatCard icon={IconCheckCircle} title="Active Upload Version" value={stats?.activeUploadVersion || '...'} iconBgColor="bg-indigo-500" />
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