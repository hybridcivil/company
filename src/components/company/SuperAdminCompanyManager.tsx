import React, { useState } from 'react';
import {
  Building2,
  Plus,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Edit3,
  Phone,
  Mail,
  MapPin,
  Save,
  X,
  Search,
  Building,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Company } from '../../types';

export const SuperAdminCompanyManager: React.FC = () => {
  const {
    companies,
    currentCompany,
    switchCompany,
    createCompany,
    toggleCompanyStatus,
    currentUser,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Company>>({
    name: '',
    slogan: '',
    managingDirector: '',
    managingDirectorQualifications: '',
    email: '',
    phone: '',
    alternativePhone: '',
    address: '',
    currencySymbol: '৳',
    status: 'active',
    plan: 'Enterprise',
  });

  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const isSuperAdmin = currentUser.role === 'Super Admin';

  const filteredCompanies = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.managingDirector.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.managingDirector?.trim()) {
      setFormError('Company Name and Managing Director are required.');
      return;
    }

    const now = new Date().toISOString();
    const newCompany: Company = {
      id: `comp-${Date.now().toString(36)}`,
      name: formData.name.trim(),
      slogan: formData.slogan?.trim() || 'Engineering Consultancy Excellence',
      managingDirector: formData.managingDirector.trim(),
      managingDirectorQualifications: formData.managingDirectorQualifications?.trim() || '',
      email: formData.email?.trim() || 'info@hybridcivil.com',
      phone: formData.phone?.trim() || '+8801700000000',
      alternativePhone: formData.alternativePhone?.trim(),
      address: formData.address?.trim() || 'Dhaka, Bangladesh',
      currencySymbol: formData.currencySymbol?.trim() || '৳',
      status: 'active',
      plan: 'Enterprise',
      createdAt: now,
      updatedAt: now,
    };

    await createCompany(newCompany);
    setIsModalOpen(false);
    setFormData({
      name: '',
      slogan: '',
      managingDirector: '',
      managingDirectorQualifications: '',
      email: '',
      phone: '',
      alternativePhone: '',
      address: '',
      currencySymbol: '৳',
      status: 'active',
      plan: 'Enterprise',
    });
    setSuccessMsg(`Company "${newCompany.name}" successfully provisioned.`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white border border-purple-800/40 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-2 border border-purple-500/30">
              <ShieldAlert className="w-3.5 h-3.5" />
              Super Admin Multi-Tenancy Console
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Company &amp; Tenant Management
            </h1>
            <p className="text-purple-200/80 text-sm mt-1 max-w-xl">
              Control and switch between active firm branches, subsidiaries, or franchise consultancy tenants.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm shadow-lg shadow-purple-900/30 transition duration-150 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            Provision New Company
          </button>
        </div>

        {/* Current Active Workspace Card */}
        <div className="mt-6 pt-5 border-t border-purple-800/40 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-300 font-bold border border-purple-500/40">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase font-medium text-purple-300/70">Current Active Workspace</div>
              <div className="text-base font-bold text-white flex items-center gap-2">
                {currentCompany.name}
                <span className="px-2 py-0.5 text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full">
                  Active
                </span>
              </div>
            </div>
          </div>
          <div className="text-xs text-purple-300/70 bg-purple-900/30 px-3 py-1.5 rounded-lg border border-purple-700/30">
            MD: <span className="font-semibold text-white">{currentCompany.managingDirector}</span>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-3 animate-fade-in text-sm font-medium">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Filter and stats */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search companies by name, MD, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
          />
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
          <span className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200">
            Total Tenants: <strong className="text-slate-900">{companies.length}</strong>
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            Active: <strong className="text-emerald-900">{companies.filter(c => c.status === 'active').length}</strong>
          </span>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCompanies.map((comp) => {
          const isCurrent = comp.id === currentCompany.id;
          const isActive = comp.status === 'active';
          return (
            <div
              key={comp.id}
              className={`rounded-2xl border transition-all duration-200 bg-white p-6 relative flex flex-col justify-between ${
                isCurrent
                  ? 'border-purple-500 shadow-md ring-2 ring-purple-500/20'
                  : 'border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base ${
                        isCurrent
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {comp.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base leading-tight">
                        {comp.name}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-1">{comp.slogan || 'Consultancy Firm'}</p>
                    </div>
                  </div>
                  {isCurrent && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
                      Current
                    </span>
                  )}
                </div>

                <div className="space-y-2 mt-4 text-xs text-slate-600 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      MD: <strong className="text-slate-800">{comp.managingDirector}</strong>
                    </span>
                  </div>
                  {comp.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{comp.phone}</span>
                    </div>
                  )}
                  {comp.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{comp.email}</span>
                    </div>
                  )}
                  {comp.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{comp.address}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => toggleCompanyStatus(comp.id)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5 transition ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                  }`}
                  title={isActive ? 'Click to deactivate' : 'Click to activate'}
                >
                  {isActive ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Active
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5" />
                      Suspended
                    </>
                  )}
                </button>

                {!isCurrent ? (
                  <button
                    onClick={() => switchCompany(comp.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-purple-700 transition"
                  >
                    Switch Tenant
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-lg">
                    Active Workspace
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Company Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Provision New Tenant</h3>
                  <p className="text-xs text-slate-500">Configure corporate engineering consultancy identity</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 text-xs bg-rose-50 text-rose-800 rounded-xl border border-rose-200">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Company / Firm Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hybrid Civil - Chattogram Branch"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Firm Slogan / Subtitle
                </label>
                <input
                  type="text"
                  placeholder="e.g. Engineering & Consultancy"
                  value={formData.slogan || ''}
                  onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Managing Director *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Engr. Ashraf"
                    value={formData.managingDirector || ''}
                    onChange={(e) => setFormData({ ...formData, managingDirector: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    MD Qualifications
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. B.Eng, M.Sc.Sc (Structural Eng)"
                    value={formData.managingDirectorQualifications || ''}
                    onChange={(e) => setFormData({ ...formData, managingDirectorQualifications: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Official Email
                  </label>
                  <input
                    type="email"
                    placeholder="contact@hybridcivil.com"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Primary Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="+880 1712-345678"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Office Address
                </label>
                <textarea
                  rows={2}
                  placeholder="Plot #, Road #, Sector, City"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm shadow-md transition"
                >
                  <Save className="w-4 h-4" />
                  Save &amp; Create Company
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
