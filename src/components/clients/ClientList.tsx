import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  FolderKanban,
  Edit,
  Trash2,
  Eye,
  FileBadge,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Client } from '../../types';
import { ClientFormModal } from './ClientFormModal';
import { ClientDetailModal } from './ClientDetailModal';

export const ClientList: React.FC = () => {
  const {
    clients,
    projects,
    deleteClient,
    selectedClientId,
    setSelectedClientId,
    setSelectedProjectId,
    setActiveTab,
    currentCompany,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  const sym = currentCompany.currencySymbol || '৳';

  // Filtered clients
  const filteredClients = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return clients;
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.clientCode.toLowerCase().includes(q) ||
        c.mobile.includes(q) ||
        (c.address && c.address.toLowerCase().includes(q))
    );
  }, [clients, searchQuery]);

  const activeClientDetail = useMemo(() => {
    return clients.find((c) => c.id === selectedClientId) || null;
  }, [clients, selectedClientId]);

  const handleDeleteConfirm = async () => {
    if (clientToDelete) {
      await deleteClient(clientToDelete.id);
      setClientToDelete(null);
    }
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Top Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl dark:text-white">
              Client &amp; Landowner Directory
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage client profiles, project links, commitments, and historical accounts
          </p>
        </div>

        <button
          onClick={() => {
            setClientToEdit(null);
            setIsFormOpen(true);
          }}
          className="flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-orange-500 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Register New Client</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client name, client ID (e.g. HC-CLI-101), mobile phone, or address..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-900"
          />
        </div>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredClients.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-300 py-12 text-center text-slate-400 dark:border-slate-800">
            <Users className="mx-auto h-8 w-8 text-slate-400 mb-2" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              No clients found matching &ldquo;{searchQuery}&rdquo;
            </p>
            <p className="text-xs text-slate-400 mt-1">Try clearing filters or register a new client.</p>
          </div>
        ) : (
          filteredClients.map((client) => {
            const clientProjects = projects.filter((p) => p.clientId === client.id);
            const totalDue = clientProjects.reduce((sum, p) => sum + (p.dueAmount || 0), 0);

            return (
              <div
                key={client.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
              >
                <div>
                  {/* Top: Name & Code */}
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="rounded bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-700 dark:bg-orange-950/80 dark:text-orange-400">
                        {client.clientCode}
                      </span>
                      <h3 className="mt-1 text-base font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                        {client.name}
                      </h3>
                      {client.fatherHusbandName && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          s/o / w/o: {client.fatherHusbandName}
                        </p>
                      )}
                    </div>

                    {/* Quick view button */}
                    <button
                      onClick={() => setSelectedClientId(client.id)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-white"
                      title="View Full Profile"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Contact Info */}
                  <div className="mt-3 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                    <p className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {client.mobile}
                      </span>
                    </p>
                    {client.email && (
                      <p className="flex items-center gap-2 truncate">
                        <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{client.email}</span>
                      </p>
                    )}
                    <p className="flex items-start gap-2 line-clamp-2">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="truncate">{client.address}</span>
                    </p>
                  </div>

                  {/* Projects Badge */}
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800/80 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <FolderKanban className="h-3.5 w-3.5" />
                      <span>{clientProjects.length} Projects</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400">Due: </span>
                      <strong className={`font-bold ${totalDue > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                        {sym} {totalDue.toLocaleString()}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                  <button
                    onClick={() => setSelectedClientId(client.id)}
                    className="text-xs font-bold text-orange-600 hover:underline dark:text-orange-400"
                  >
                    View Dossier →
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setClientToEdit(client);
                        setIsFormOpen(true);
                      }}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-white"
                      title="Edit Client"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setClientToDelete(client)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                      title="Delete Client"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Client Edit/Add Modal */}
      <ClientFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setClientToEdit(null);
        }}
        clientToEdit={clientToEdit}
      />

      {/* Client Detail Profile Modal */}
      <ClientDetailModal
        client={activeClientDetail}
        onClose={() => setSelectedClientId(null)}
        onEdit={(client) => {
          setClientToEdit(client);
          setIsFormOpen(true);
        }}
        onSelectProject={(projId) => {
          setSelectedProjectId(projId);
          setActiveTab('projects');
        }}
      />

      {/* Delete Confirmation Modal */}
      {clientToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-5 text-white shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-rose-600/20 p-2 text-rose-500">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold">Delete Client?</h3>
                <p className="text-xs text-slate-400">This action cannot be undone.</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-300">
              Are you sure you want to remove <strong>{clientToDelete.name}</strong> ({clientToDelete.clientCode})?
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => setClientToDelete(null)}
                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="rounded-lg bg-rose-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-rose-500"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
