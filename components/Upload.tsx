

import React, { useState, useEffect, useCallback } from 'react';
import { Branch } from '../types';
import { api } from '../services/mockApi';
import { IconFileUp, IconCheckCircle, IconLoader, IconX, IconDownload } from './Icons';
import { generateSampleCsv } from '../utils/csv';

const Upload: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [weekDates, setWeekDates] = useState<string[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [selectedWeek, setSelectedWeek] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const [branchesData, datesData] = await Promise.all([api.getBranches(), api.getWeekEndingDates()]);
      setBranches(branchesData);
      setWeekDates(datesData);
      if (branchesData.length > 0) setSelectedBranch(branchesData[0].id);
      if (datesData.length > 0) setSelectedWeek(datesData[0]);
    };
    fetchData();
  }, []);

  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      setFile(files[0]);
      setUploadSuccess(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };
  
  const handleDragEvents = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if(e.type === 'dragenter' || e.type === 'dragover') {
        setIsDragging(true);
    } else if (e.type === 'dragleave') {
        setIsDragging(false);
    }
  };
  
  const handleDownloadSample = () => {
    const csvData = generateSampleCsv();
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'sample_upload_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file || !selectedBranch || !selectedWeek) {
      alert('Please select a branch, a week, and a file.');
      return;
    }
    setIsUploading(true);
    setUploadSuccess(false);

    // Simulate upload
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      setFile(null); // Clear file after successful upload
      console.log(`Uploaded ${file.name} for branch ${selectedBranch} for week ending ${selectedWeek}`);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-8">
        <div className="flex justify-between items-start mb-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Upload Weekly Data</h2>
                <p className="text-slate-500 mt-1">Select the branch and week, then upload the corresponding .csv or .xlsx file.</p>
            </div>
            <button
                type="button"
                onClick={handleDownloadSample}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-center text-brand-blue-600 bg-brand-blue-50 rounded-lg hover:bg-brand-blue-100 focus:ring-4 focus:ring-brand-blue-200"
            >
                <IconDownload className="h-4 w-4 mr-2"/>
                Download Sample
            </button>
        </div>
        
        {uploadSuccess && (
          <div className="bg-emerald-100 border-l-4 border-emerald-500 text-emerald-700 p-4 rounded-md flex items-center mb-6" role="alert">
            <IconCheckCircle className="h-5 w-5 mr-3" />
            <p>File uploaded successfully! The data will be processed shortly.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="branch" className="block mb-2 text-sm font-medium text-slate-900">Select Branch</label>
              <select id="branch" value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)} className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500 block w-full p-2.5">
                {branches.map(branch => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="week" className="block mb-2 text-sm font-medium text-slate-900">Select Week Ending (Saturday)</label>
              <select id="week" value={selectedWeek} onChange={(e) => setSelectedWeek(e.target.value)} className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500 block w-full p-2.5">
                {weekDates.map(date => <option key={date} value={date}>{date}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-slate-900">Upload File</label>
            <label 
              htmlFor="dropzone-file"
              onDrop={handleDrop} 
              onDragEnter={handleDragEvents}
              onDragLeave={handleDragEvents}
              onDragOver={handleDragEvents}
              className={`flex justify-center items-center w-full px-6 py-10 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragging ? 'border-brand-blue-500 bg-brand-blue-50' : 'border-slate-300 hover:border-slate-400 bg-slate-50'}`}>
              <div className="text-center">
                <IconFileUp className={`mx-auto h-12 w-12 ${isDragging ? 'text-brand-blue-600' : 'text-slate-400'}`} />
                <p className="mt-2 text-sm text-slate-500">
                  <span className="font-semibold text-brand-blue-600">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-slate-500">CSV or XLSX (MAX. 10MB)</p>
              </div>
              <input id="dropzone-file" type="file" className="hidden" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={(e) => handleFileChange(e.target.files)} />
            </label>
             {file && (
              <div className="mt-4 bg-slate-100 p-3 rounded-lg flex justify-between items-center">
                <span className="text-sm text-slate-700 font-medium">{file.name}</span>
                <button type="button" onClick={() => setFile(null)} className="text-slate-500 hover:text-slate-700">
                  <IconX className="h-5 w-5"/>
                </button>
              </div>
            )}
          </div>
          
          <div className="flex justify-end pt-2">
            <button type="submit" disabled={!file || isUploading} className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-center text-white bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700 focus:ring-4 focus:ring-brand-blue-300 disabled:bg-slate-400 disabled:cursor-not-allowed">
              {isUploading ? (
                <>
                  <IconLoader className="animate-spin -ml-1 mr-3 h-5 w-5" />
                  Uploading...
                </>
              ) : (
                'Upload and Process File'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Upload;