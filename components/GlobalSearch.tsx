
import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { ClientProfile } from '../types';
import { api } from '../services/mockApi';
import { useDebounce } from './useDebounce';
import { IconLoader, IconSearch, IconUserSearch } from './Icons';
import { useData } from '../contexts/DataContext';

const GlobalSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Pick<ClientProfile, 'panPrimary' | 'nameFirstHolder' | 'contactMobile'>[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allClients, setAllClients] = useState<Pick<ClientProfile, 'panPrimary' | 'nameFirstHolder' | 'contactMobile'>[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const { setViewClientPan } = useData();

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Pre-fetch all clients for faster filtering
  useEffect(() => {
    api.getAllClients().then(setAllClients);
  }, []);

  const handleSearch = useCallback(() => {
    if (debouncedSearchTerm.length < 3) {
      setResults([]);
      setIsOpen(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    
    // Client-side filtering for responsiveness
    const lowercasedTerm = debouncedSearchTerm.toLowerCase();
    const filteredResults = allClients.filter(
      client =>
        client.nameFirstHolder.toLowerCase().includes(lowercasedTerm) ||
        client.panPrimary.toLowerCase().includes(lowercasedTerm) ||
        client.contactMobile.includes(debouncedSearchTerm)
    ).slice(0, 7); // Limit results to 7
    
    setResults(filteredResults);
    setIsOpen(filteredResults.length > 0);
    setLoading(false);
  }, [debouncedSearchTerm, allClients]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (pan: string) => {
    setViewClientPan(pan);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && results.length > 0) {
      handleResultClick(results[0].panPrimary);
    }
  };

  return (
    <div className="relative w-full max-w-xs" ref={searchRef}>
      <div className="relative">
        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Quick Search by PAN/Name/Mobile..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(results.length > 0)}
          onKeyDown={handleKeyDown}
          className="w-full bg-slate-100 text-slate-900 rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
        />
        {loading && <IconLoader className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 animate-spin" />}
      </div>
      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-md shadow-lg border border-slate-200 z-50 overflow-hidden">
          <ul className="max-h-80 overflow-y-auto">
            {results.map((client) => (
              <li key={client.panPrimary}>
                <button
                  onClick={() => handleResultClick(client.panPrimary)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-brand-blue-50 transition-colors w-full text-left"
                >
                  <div className="p-2 bg-brand-blue-100 rounded-full">
                    <IconUserSearch className="h-4 w-4 text-brand-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-slate-800">{client.nameFirstHolder}</p>
                    <p className="text-xs text-slate-500 font-mono">
                      {client.panPrimary} &bull; {client.contactMobile}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
