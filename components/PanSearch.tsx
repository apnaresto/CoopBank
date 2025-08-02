
import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/mockApi';
import { ClientProfile, AccountCategoryInfo } from '../types';
import { IconSearch, IconLoader, IconAlertTriangle } from './Icons';
import { formatCurrency } from '../utils/helpers';

const DetailItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-slate-200">
    <dt className="text-sm font-medium text-slate-500">{label}</dt>
    <dd className="mt-1 text-sm text-slate-900 sm:mt-0 font-semibold">{value || '-'}</dd>
  </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        </div>
        <div className="p-4">
            <dl>{children}</dl>
        </div>
    </div>
);


const PanSearch: React.FC = () => {
  const [pan, setPan] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ClientProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [accountCategories, setAccountCategories] = useState<AccountCategoryInfo[]>([]);

  useEffect(() => {
    api.getAccountCategories().then(setAccountCategories);
  }, []);

  const categoryMap = useMemo(() => new Map(accountCategories.map(c => [c.code, c.name])), [accountCategories]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pan) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const clients = await api.getClientsByPan(pan);
      if (clients.length > 0) {
        setResult(clients[0]);
      } else {
        setError(`No client found with PAN: ${pan}`);
      }
    } catch (e) {
      setError('An error occurred while searching.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Search Client by PAN</h2>
        <p className="text-slate-500 mb-6">Enter a client's Primary PAN to retrieve their full profile.</p>
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <input
            type="text"
            value={pan}
            onChange={(e) => setPan(e.target.value.toUpperCase())}
            placeholder="Enter PAN..."
            className="flex-grow bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-brand-blue-500 focus:border-brand-blue-500 block w-full p-2.5"
            maxLength={10}
          />
          <button
            type="submit"
            disabled={loading || !pan}
            className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-center text-white bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700 focus:ring-4 focus:ring-brand-blue-300 disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            {loading ? <IconLoader className="animate-spin h-5 w-5" /> : <IconSearch className="h-5 w-5" />}
          </button>
        </form>
      </div>

      <div className="mt-8">
        {error && (
            <div className="bg-rose-100 border-l-4 border-rose-500 text-rose-700 p-4 rounded-md flex items-center" role="alert">
                <IconAlertTriangle className="h-5 w-5 mr-3"/>
                <p>{error}</p>
            </div>
        )}
        {result && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
                <Section title="Account Details">
                    <DetailItem label="Account Number" value={result.accountNumber} />
                    <DetailItem label="Primary Holder" value={result.nameFirstHolder} />
                    <DetailItem label="Primary PAN" value={result.panPrimary} />
                    <DetailItem label="Joint Holder 1" value={result.jointName1} />
                    <DetailItem label="Joint PAN 1" value={result.panJoint1} />
                    <DetailItem label="Joint Holder 2" value={result.jointName2} />
                    <DetailItem label="Joint PAN 2" value={result.panJoint2} />
                    <DetailItem label="Account Type" value={result.accountType} />
                    <DetailItem label="Account Category" value={`${categoryMap.get(result.accountCategory) || result.accountCategory} (${result.accountCategory})`} />
                </Section>
                 <Section title="Contact Details">
                    <DetailItem label="Mobile" value={result.contactMobile} />
                    <DetailItem label="Email" value={result.contactEmail} />
                    <DetailItem label="Date of Birth" value={result.contactDob} />
                </Section>
                 <Section title="External Bank Details">
                    <DetailItem label="Bank Name" value={result.bankName} />
                    <DetailItem label="Account Number" value={result.bankAcNo} />
                    <DetailItem label="IFSC" value={result.bankIfsc} />
                    <DetailItem label="MICR" value={result.bankMicr} />
                </Section>
            </div>
             <div>
                <Section title="Communication Details">
                    <DetailItem label="Address" value={<div className="text-right">{[result.address1, result.address2, result.address3, result.address4].filter(Boolean).join(', ')}</div>} />
                    <DetailItem label="City" value={result.city} />
                    <DetailItem label="PIN Code" value={result.pinCode} />
                    <DetailItem label="State" value={result.state} />
                    <DetailItem label="Country" value={result.country} />
                </Section>
                <Section title="Transaction Details">
                    <DetailItem label="Account Balance" value={formatCurrency(result.accountBalance)} />
                    <DetailItem label="Free Balance" value={formatCurrency(result.freeBalance)} />
                    <DetailItem label="Pledge Balance" value={formatCurrency(result.pledgeBalance)} />
                    <DetailItem label="Locked Balance" value={formatCurrency(result.lockSBal)} />
                    <DetailItem label="Frozen Balance" value={formatCurrency(result.freezeZeBal)} />
                    <DetailItem label="Pledge Lock" value={result.pledgeLock} />
                    <DetailItem label="Lock Date" value={result.lockDate} />
                </Section>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PanSearch;
