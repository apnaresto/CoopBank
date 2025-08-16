

import React, { useState, useMemo } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Upload from './components/Upload';
import UploadHistory from './components/UploadHistory';
import BranchReport from './components/BranchReport';
import PanSearch from './components/PanSearch';
import ClientDashboard from './components/ClientDashboard';
import Management from './components/Management';
import ManagementDetail from './components/ManagementDetail';
import BranchManagement from './components/BranchManagement';
import Utilities from './components/Utilities';
import { IconDashboard, IconUpload, IconHistory, IconReports, IconBranch, IconSearch, IconUserSearch, IconUsers, IconWrench } from './components/Icons';
import { DataProvider, useData } from './contexts/DataContext';
import GlobalSearch from './components/GlobalSearch';
import UserProfileDropdown from './components/UserProfileDropdown';
import Client360Modal from './components/Client360Modal';

const navItems = [
  { path: '/', label: 'Dashboard', icon: IconDashboard },
  { path: '/branch-management', label: 'Branch Management', icon: IconBranch },
  { path: '/management', label: 'User Management', icon: IconUsers },
  { path: '/upload', label: 'Import Data', icon: IconUpload },
  { path: '/history', label: 'Upload History', icon: IconHistory },
  { path: '/reports', label: 'Branch Reports', icon: IconReports },
  { path: '/clients', label: 'Clients', icon: IconUserSearch, hidden: true },
  { path: '/pan-search', label: 'PAN Search', icon: IconSearch, legacy: true }, // Keep route but hide from nav
  { path: '/utilities', label: 'Utilities', icon: IconWrench },
];

const Sidebar: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredNavItems = useMemo(() => {
        const visibleItems = navItems.filter(item => !item.hidden && !item.legacy);
        if (!searchTerm) {
            return visibleItems;
        }
        return visibleItems.filter(item =>
            item.label.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

  return (
    <div className="w-64 bg-slate-900 text-slate-200 flex flex-col">
      <div className="h-16 flex items-center justify-center bg-slate-950 flex-shrink-0">
         <ReactRouterDOM.Link to="/" className="flex items-center">
            <IconBranch className="h-8 w-8 text-brand-blue-400" />
            <h1 className="ml-3 text-xl font-bold text-slate-100">CoopBank Admin</h1>
        </ReactRouterDOM.Link>
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
          <ReactRouterDOM.NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
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
          </ReactRouterDOM.NavLink>
        ))}
      </nav>
    </div>
  );
};

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 gap-4">
      <GlobalSearch />
      <UserProfileDropdown />
    </header>
  );
};

const MainApp: React.FC = () => {
  const { viewingClientPan, setViewClientPan } = useData();

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 p-6 relative">
          <ReactRouterDOM.Routes>
            <ReactRouterDOM.Route path="/" element={<Dashboard />} />
            <ReactRouterDOM.Route path="/branch-management" element={<BranchManagement />} />
            <ReactRouterDOM.Route path="/upload" element={<Upload />} />
            <ReactRouterDOM.Route path="/history" element={<UploadHistory />} />
            <ReactRouterDOM.Route path="/pan-search" element={<PanSearch />} />
            <ReactRouterDOM.Route path="/clients" element={<ClientDashboard />} />
            <ReactRouterDOM.Route path="/clients/:pan" element={<ClientDashboard />} />
            <ReactRouterDOM.Route path="/reports" element={<BranchReport />} />
            <ReactRouterDOM.Route path="/reports/:branchId" element={<BranchReport />} />
            <ReactRouterDOM.Route path="/management" element={<Management />} />
            <ReactRouterDOM.Route path="/management/:category" element={<ManagementDetail />} />
            <ReactRouterDOM.Route path="/utilities" element={<Utilities />} />
          </ReactRouterDOM.Routes>
          
          {viewingClientPan && (
            <Client360Modal
              pan={viewingClientPan}
              onClose={() => setViewClientPan(null)}
            />
          )}
        </main>
      </div>
    </div>
  );
};


const App: React.FC = () => {
  return (
    <ReactRouterDOM.HashRouter>
      <DataProvider>
        <MainApp />
      </DataProvider>
    </ReactRouterDOM.HashRouter>
  );
};

export default App;