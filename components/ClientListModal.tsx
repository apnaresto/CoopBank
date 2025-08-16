
import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { ClientProfile } from '../types';
import { IconLoader, IconUsers } from './Icons';
import Modal from './Modal';

interface ClientListModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  clients: ClientProfile[];
  loading: boolean;
}

const ClientListModal: React.FC<ClientListModalProps> = ({ isOpen, onClose, title, clients, loading }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="lg"
    >
      <div className="min-h-[200px]">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <IconLoader className="animate-spin h-8 w-8 text-brand-blue-600" />
          </div>
        ) : (
          clients.length > 0 ? (
            <ul className="space-y-2">
              {clients.map(client => (
                <li key={client.id + client.branchId}>
                  <ReactRouterDOM.Link
                    to={`/clients/${client.panPrimary}`}
                    onClick={onClose}
                    className="block p-3 bg-slate-50 rounded-md hover:bg-brand-blue-100 hover:text-brand-blue-800 transition-colors"
                  >
                    <p className="font-semibold text-slate-900">{client.nameFirstHolder}</p>
                    <p className="text-sm text-slate-500 font-mono">{client.panPrimary} - Acct: {client.accountNumber}</p>
                  </ReactRouterDOM.Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-slate-500 py-8">No clients found.</p>
          )
        )}
      </div>
    </Modal>
  );
};

export default ClientListModal;
