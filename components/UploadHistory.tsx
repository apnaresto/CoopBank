import React, { useState, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { UploadBatch } from '../types';
import { api } from '../services/mockApi';
import { IconLoader } from './Icons';
import PageHeader from './PageHeader';
import { useData } from '../contexts/DataContext';
import UploadHealthGrid from './UploadHealthGrid';
import UploadLogView from './UploadLogView';


const UploadHistory: React.FC = () => {
  const { branches, weekDates, loading: contextLoading } = useData();
  const [allUploads, setAllUploads] = useState<UploadBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = ReactRouterDOM.useSearchParams();
  const activeTab = searchParams.get('view') || 'status';

  // This effect will correct an invalid `view` parameter in the URL
  useEffect(() => {
    if (activeTab !== 'status' && activeTab !== 'log') {
      setSearchParams({ view: 'status' }, { replace: true });
    }
  }, [activeTab, setSearchParams]);

  useEffect(() => {
    const fetchUploads = async () => {
      setLoading(true);
      try {
        const uploadsData = await api.getAllUploads();
        setAllUploads(uploadsData.sort((a,b) => new Date(b.uploadTime).getTime() - new Date(a.uploadTime).getTime()));
      } catch (error) {
        console.error("Failed to fetch upload history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUploads();
  }, []);

  const handleTabChange = (tab: 'status' | 'log') => {
      setSearchParams({ view: tab });
  };

  const renderContent = () => {
    if (loading || contextLoading) {
      return <div className="flex justify-center items-center h-96"><IconLoader className="animate-spin h-10 w-10 text-brand-blue-600"/></div>;
    }
    
    if (activeTab === 'status') {
      return <UploadHealthGrid branches={branches} uploads={allUploads} weekDates={weekDates} />;
    }
    
    if (activeTab === 'log') {
      const branchFilter = searchParams.get('branch');
      const weekFilter = searchParams.get('week');
      return <UploadLogView uploads={allUploads} branchFilter={branchFilter} weekFilter={weekFilter} />;
    }

    // Return a loader or null while the useEffect corrects the URL
    return <div className="flex justify-center items-center h-96"><IconLoader className="animate-spin h-10 w-10 text-brand-blue-600"/></div>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Upload Monitoring"
        description="Track weekly data submission status across all branches or review the complete historical log."
      />
      
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button onClick={() => handleTabChange('status')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'status' ? 'border-brand-blue-500 text-brand-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>
              Weekly Upload Status
          </button>
          <button onClick={() => handleTabChange('log')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'log' ? 'border-brand-blue-500 text-brand-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>
              Upload Log
          </button>
        </nav>
      </div>

      {renderContent()}
    </div>
  );
};

export default UploadHistory;