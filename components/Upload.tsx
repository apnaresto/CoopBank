import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { IconFileUp, IconCheckCircle, IconLoader, IconX, IconDownload, IconUsers, IconBriefcase } from './Icons';
import { generateSampleCsv, generateRelationshipMappingSampleCsv } from '../utils/csv';
import WeekDatePicker from './WeekDatePicker';
import PageHeader from './PageHeader';
import { useData } from '../contexts/DataContext';
import clsx from 'clsx';

const Upload: React.FC = () => {
    const { branches, weekDates, softwareVendors: vendors, loading: contextLoading } = useData();
    const [activeTab, setActiveTab] = useState<'clientData' | 'relationship'>('clientData');
    
    // Form state
    const [selectedBranch, setSelectedBranch] = useState<string>('');
    const [selectedWeek, setSelectedWeek] = useState<string>('');
    const [selectedVendor, setSelectedVendor] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Default form values
    useEffect(() => {
        if (!contextLoading) {
            if (branches.length > 0 && !selectedBranch) setSelectedBranch(branches[0].id);
            if (vendors.length > 0 && !selectedVendor) setSelectedVendor(vendors[0].id);
        }
    }, [contextLoading, branches, vendors]);

    useEffect(() => {
        if (weekDates.length > 0 && (!selectedWeek || !weekDates.includes(selectedWeek))) {
            setSelectedWeek(weekDates[0]);
        } else if (weekDates.length === 0) {
            setSelectedWeek('');
        }
    }, [weekDates]);

    const resetFileState = () => {
        setFile(null);
        setUploadSuccess(false);
    };

    const handleTabChange = (tab: 'clientData' | 'relationship') => {
        setActiveTab(tab);
        resetFileState();
    };

    const handleFileChange = (files: FileList | null) => {
        if (files && files.length > 0) {
            resetFileState();
            setFile(files[0]);
        }
    };
    
    const handleDownloadSample = (type: 'clientData' | 'relationship') => {
        const isClientData = type === 'clientData';
        const csvData = isClientData ? generateSampleCsv() : generateRelationshipMappingSampleCsv();
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', isClientData ? 'sample_client_upload.csv' : 'sample_relationship_mapping.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Validation for client data tab
        if (activeTab === 'clientData') {
            if (!file || !selectedBranch || !selectedWeek || !selectedVendor) {
                alert('Please select a branch, a week, a vendor, and a file.'); return;
            }
        }
        // Validation for relationship mapping tab
        if (activeTab === 'relationship' && (!file || !selectedBranch)) {
            alert('Please select a branch and a file for relationship mapping.'); return;
        }

        setIsUploading(true);
        setUploadSuccess(false);

        setTimeout(() => {
            setIsUploading(false);
            setUploadSuccess(true);
            setSuccessMessage(activeTab === 'clientData'
                ? 'Client & Transaction data uploaded successfully! The data will be processed shortly.'
                : 'Relationship mapping file uploaded successfully! Mappings will be applied shortly.'
            );
            console.log(`Uploaded ${file!.name} for ${activeTab} for branch ${selectedBranch}`);
        }, 2000);
    };

    const selectedVendorInfo = vendors.find(v => v.id === selectedVendor);
    const canSubmit = useMemo(() => {
        if (!file || isUploading) return false;
        if (activeTab === 'clientData') {
            return !!selectedBranch && !!selectedWeek && !!selectedVendor;
        }
        return !!selectedBranch;
    }, [file, isUploading, activeTab, selectedBranch, selectedWeek, selectedVendor]);


    const FileDropzone = () => {
      const [isDragging, setIsDragging] = useState<boolean>(false);
      
      const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault(); e.stopPropagation(); setIsDragging(false); handleFileChange(e.dataTransfer.files);
      };
      const handleDragEvents = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault(); e.stopPropagation();
        if(e.type === 'dragenter' || e.type === 'dragover') setIsDragging(true);
        else if (e.type === 'dragleave') setIsDragging(false);
      };

      if (file) {
          return (
             <div className="relative p-4 border border-slate-300 rounded-lg bg-slate-50">
                <div className="flex items-start gap-4">
                    <IconFileUp className="h-8 w-8 text-slate-500 flex-shrink-0" />
                    <div className="flex-grow">
                        <p className="font-semibold text-slate-800">{file.name}</p>
                        <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                    <button type="button" onClick={resetFileState} className="text-slate-500 hover:text-slate-700 absolute top-3 right-3"><IconX className="h-5 w-5"/></button>
                </div>
            </div>
          );
      }

      return (
        <label htmlFor="dropzone-file" onDrop={handleDrop} onDragEnter={handleDragEvents} onDragLeave={handleDragEvents} onDragOver={handleDragEvents} className={clsx("flex justify-center items-center w-full px-6 py-10 border-2 border-dashed rounded-lg cursor-pointer transition-colors", isDragging ? 'border-brand-blue-500 bg-brand-blue-50' : 'border-slate-300 hover:border-slate-400 bg-slate-50')}>
            <div className="text-center">
                <IconFileUp className={clsx("mx-auto h-12 w-12", isDragging ? 'text-brand-blue-600' : 'text-slate-400')} />
                <p className="mt-2 text-sm text-slate-500"><span className="font-semibold text-brand-blue-600">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-slate-500">CSV or XLSX (MAX. 10MB)</p>
            </div>
            <input id="dropzone-file" type="file" className="hidden" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={(e) => handleFileChange(e.target.files)} />
        </label>
      );
    }

    if (contextLoading) {
        return <div className="flex justify-center items-center h-full"><IconLoader className="animate-spin h-10 w-10 text-brand-blue-600"/></div>;
    }
    
    const clientDataForm = (
        <>
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800">Upload Weekly Client Data</h3>
                <p className="text-sm text-slate-600">Select the branch and week, then upload the corresponding data file.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label htmlFor="branch" className="block mb-2 text-sm font-medium text-slate-900">Select Branch</label>
                        <select id="branch" value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)} className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500 block w-full p-2.5">{branches.map(branch => <option key={branch.id} value={branch.id}>{branch.name}</option>)}</select>
                    </div>
                    <div>
                        <label htmlFor="upload-week-picker" className="block mb-2 text-sm font-medium text-slate-900">Select Week</label>
                        <WeekDatePicker id="upload-week-picker" availableDates={weekDates} selectedDate={selectedWeek} onSelectDate={setSelectedWeek}/>
                    </div>
                    <div>
                        <label htmlFor="vendor" className="block mb-2 text-sm font-medium text-slate-900">Software Vendor</label>
                        <select id="vendor" value={selectedVendor} onChange={(e) => setSelectedVendor(e.target.value)} className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500 block w-full p-2.5">
                            {vendors.map(vendor => <option key={vendor.id} value={vendor.id}>{vendor.name}</option>)}
                        </select>
                    </div>
                </div>
                 {selectedVendorInfo && <div className="text-sm text-slate-500 mt-2">File format will be mapped using: <span className="font-semibold text-slate-700">{selectedVendorInfo.templateName}</span></div>}
            </div>
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-slate-800">Upload File</h3>
                     <button type="button" onClick={() => handleDownloadSample('clientData')} className="inline-flex items-center text-sm font-medium text-brand-blue-600 hover:underline">
                        <IconDownload className="h-4 w-4 mr-1"/> Download Sample
                    </button>
                </div>
                <FileDropzone />
            </div>
        </>
    );

    const relationshipMappingForm = (
        <>
             <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800">Upload Relationship Mapping</h3>
                <p className="text-sm text-slate-600">Select a branch and upload the mapping file (PAN/AcctNo to RM/BM/FG).</p>
                <div className="max-w-xs">
                    <label htmlFor="rel_branch" className="block mb-2 text-sm font-medium text-slate-900">Select Branch</label>
                    <select id="rel_branch" value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)} className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500 block w-full p-2.5">
                        {branches.map(branch => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
                    </select>
                </div>
            </div>
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-slate-800">Upload Mapping File</h3>
                    <button type="button" onClick={() => handleDownloadSample('relationship')} className="inline-flex items-center text-sm font-medium text-brand-blue-600 hover:underline">
                        <IconDownload className="h-4 w-4 mr-1"/> Download Sample
                    </button>
                </div>
                <FileDropzone />
            </div>
        </>
    );

    return (
        <div className="max-w-4xl mx-auto">
            <PageHeader title="Import Data" description="Upload weekly client data or relationship mapping files." />
            <div className="bg-white rounded-lg shadow p-8">
                <div className="border-b border-slate-200 mb-8">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        <button onClick={() => handleTabChange('clientData')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'clientData' ? 'border-brand-blue-500 text-brand-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>
                            <IconBriefcase className="mr-2 h-5 w-5"/> Client & Transaction Data
                        </button>
                        <button onClick={() => handleTabChange('relationship')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'relationship' ? 'border-brand-blue-500 text-brand-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>
                            <IconUsers className="mr-2 h-5 w-5"/> Relationship Mapping
                        </button>
                    </nav>
                </div>
                
                {uploadSuccess && (
                  <div className="bg-emerald-100 border-l-4 border-emerald-500 text-emerald-700 p-4 rounded-md flex items-center mb-6" role="alert">
                    <IconCheckCircle className="h-5 w-5 mr-3" />
                    <p>{successMessage}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {activeTab === 'clientData' ? clientDataForm : relationshipMappingForm}
                  
                    <div className="flex justify-end pt-4 border-t border-slate-200 mt-8">
                        <button type="submit" disabled={!canSubmit} className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-center text-white bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700 focus:ring-4 focus:ring-brand-blue-300 disabled:bg-slate-400 disabled:cursor-not-allowed">
                            {isUploading ? (<><IconLoader className="animate-spin -ml-1 mr-3 h-5 w-5" />Uploading...</>) : ('Upload and Process File')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Upload;
