
import React, { useState, useMemo } from 'react';
import { HashRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Upload from './components/Upload';
import UploadHistory from './components/UploadHistory';
import BranchReport from './components/BranchReport';
import PanSearch from './components/PanSearch';
import ClientDashboard from './components/ClientDashboard';
import Management from './components/Management';
import BranchManagement from './components/BranchManagement';
import { IconDashboard, IconUpload, IconHistory, IconReports, IconBranch, IconSearch, IconUserSearch, IconUsers } from './components/Icons';

const navItems = [
  { path: '/', label: 'Dashboard', icon: IconDashboard },
  { path: '/branch-management', label: 'Branch Management', icon: IconBranch },
  { path: '/management', label: 'User Management', icon: IconUsers },
  { path: '/upload', label: 'Import Data', icon: IconUpload },
  { path: '/history', label: 'Upload History', icon: IconHistory },
  { path: '/reports', label: 'Branch Reports', icon: IconReports },
  { path: '/clients', label: 'Clients', icon: IconUserSearch },
  { path: '/search', label: 'PAN Search', icon: IconSearch },
];

const Sidebar: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredNavItems = useMemo(() => {
        if (!searchTerm) {
            return navItems;
        }
        return navItems.filter(item =>
            item.label.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

  return (
    <div className="w-64 bg-slate-900 text-slate-200 flex flex-col">
      <div className="h-16 flex items-center justify-center bg-slate-950 flex-shrink-0">
        <IconBranch className="h-8 w-8 text-brand-blue-400" />
        <h1 className="ml-3 text-xl font-bold text-slate-100">CoopBank Admin</h1>
      </div>
      <div className="p-4 flex-shrink-0">
        <div className="relative">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search menu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 text-white rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
          />
        </div>
      </div>
      <nav className="flex-1 px-4 pb-6 space-y-2 overflow-y-auto">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'} // Important for proper active state matching
            className={({ isActive }) =>
              `flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                isActive
                  ? 'bg-brand-blue-600 text-white'
                  : 'hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

const Header: React.FC = () => {
  const location = useLocation();
  const currentNavItem = navItems.find(item => location.pathname === '/' ? item.path === '/' : item.path !== '/' && location.pathname.startsWith(item.path));
  let title = currentNavItem?.label || 'Dashboard';
  if (location.pathname.startsWith('/reports/')) {
    title = 'Branch Report';
  } else if (location.pathname.startsWith('/clients/')) {
    title = 'Client Dashboard';
  }


  return (
    <header className="bg-white shadow-sm h-16 flex items-center px-6">
      <h2 className="text-2xl font-semibold text-slate-800">{title}</h2>
    </header>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="flex h-screen bg-slate-100">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/branch-management" element={<BranchManagement />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/history" element={<UploadHistory />} />
              <Route path="/search" element={<PanSearch />} />
              <Route path="/clients" element={<ClientDashboard />} />
              <Route path="/clients/:pan" element={<ClientDashboard />} />
              <Route path="/reports" element={<BranchReport />} />
              <Route path="/reports/:branchId" element={<BranchReport />} />
              <Route path="/management" element={<Management />} />
            </Routes>
          </main>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
