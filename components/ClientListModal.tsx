import React from 'react';
import { Link } from 'react-router-dom';
import { ClientProfile } from '../types';
import { IconLoader, IconX, IconUsers } from './Icons';

interface ClientListModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  clients: ClientProfile[];
  loading: boolean;
}

const ClientListModal: React.FC<ClientListModalProps> = ({ isOpen, onClose, title, clients, loading }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center">
            <IconUsers className="mr-2 h-5 w-5 text-brand-blue-600"/>
            {title}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <IconX className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <IconLoader className="animate-spin h-8 w-8 text-brand-blue-600" />
            </div>
          ) : (
            clients.length > 0 ? (
              <ul className="space-y-2">
                {clients.map(client => (
                  <li key={client.id + client.branchId}>
                    <Link
                      to={`/clients/${client.panPrimary}`}
                      onClick={onClose}
                      className="block p-3 bg-slate-50 rounded-md hover:bg-brand-blue-100 hover:text-brand-blue-800 transition-colors"
                    >
                      <p className="font-semibold text-slate-900">{client.nameFirstHolder}</p>
                      <p className="text-sm text-slate-500 font-mono">{client.panPrimary} - Acct: {client.accountNumber}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-slate-500 py-8">No clients found.</p>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientListModal;
