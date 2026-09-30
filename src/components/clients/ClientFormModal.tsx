import React, { useState, useEffect } from 'react';
import { X, User, Phone, Mail, MapPin, FileBadge, Save } from 'lucide-react';
import { Client } from '../../types';
import { useApp } from '../../context/AppContext';

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientToEdit?: Client | null;
}

export const ClientFormModal: React.FC<ClientFormModalProps> = ({
  isOpen,
  onClose,
  clientToEdit,
}) => {
  const { currentCompany, saveClient, clients } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    fatherHusbandName: '',
    mobile: '',
    alternativeMobile: '',
    email: '',
    address: '',
    nid: '',
    referenceInfo: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (clientToEdit) {
      setFormData({
        name: clientToEdit.name || '',
        fatherHusbandName: clientToEdit.fatherHusbandName || '',
        mobile: clientToEdit.mobile || '',
        alternativeMobile: clientToEdit.alternativeMobile || '',
        email: clientToEdit.email || '',
        address: clientToEdit.address || '',
        nid: clientToEdit.nid || '',
        referenceInfo: clientToEdit.referenceInfo || '',
        notes: clientToEdit.notes || '',
      });
    } else {
      setFormData({
        name: '',
        fatherHusbandName: '',
        mobile: '',
        alternativeMobile: '',
        email: '',
        address: '',
        nid: '',
        referenceInfo: '',
        notes: '',
      });
    }
    setErrors({});
  }, [clientToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Client full name is required';
    if (!formData.mobile.trim()) errs.mobile = 'Primary mobile number is required';
    if (!formData.address.trim()) errs.address = 'Client address is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const nextCodeNumber = clients.length + 101;
    const clientPayload: Client = {
      id: clientToEdit ? clientToEdit.id : `cli-${Date.now()}`,
      companyId: currentCompany.id,
      clientCode: clientToEdit ? clientToEdit.clientCode : `HC-CLI-${nextCodeNumber}`,
      name: formData.name.trim(),
      fatherHusbandName: formData.fatherHusbandName.trim(),
      mobile: formData.mobile.trim(),
      alternativeMobile: formData.alternativeMobile.trim() || undefined,
      email: formData.email.trim() || undefined,
      address: formData.address.trim(),
      nid: formData.nid.trim() || undefined,
      referenceInfo: formData.referenceInfo.trim() || undefined,
      notes: formData.notes.trim() || undefined,
      createdAt: clientToEdit ? clientToEdit.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveClient(clientPayload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-xl rounded-2xl border border-slate-700 bg-slate-900 p-6 text-white shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600 text-white font-bold">
              <User className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                {clientToEdit ? 'Edit Client Profile' : 'Register New Client'}
              </h3>
              <p className="text-xs text-slate-400">
                Hybrid Civil Client &amp; Landowner Registration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            {/* Client Name */}
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Client Full Name <span className="text-orange-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Alhajj Mofizur Rahman"
                className={`w-full rounded-xl border bg-slate-800 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500 ${
                  errors.name ? 'border-rose-500' : 'border-slate-700'
                }`}
              />
              {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
            </div>

            {/* Father / Husband Name */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Father / Husband Name
              </label>
              <input
                type="text"
                value={formData.fatherHusbandName}
                onChange={(e) => setFormData({ ...formData, fatherHusbandName: e.target.value })}
                placeholder="e.g. Late Abdul Gafur"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>

            {/* Primary Mobile */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Primary Mobile Number <span className="text-orange-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  placeholder="+880 1711-234567"
                  className={`w-full rounded-xl border bg-slate-800 pl-9 pr-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500 ${
                    errors.mobile ? 'border-rose-500' : 'border-slate-700'
                  }`}
                />
              </div>
              {errors.mobile && <p className="text-[11px] text-rose-500 mt-1">{errors.mobile}</p>}
            </div>

            {/* Alternative Mobile */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Alternative Mobile (Optional)
              </label>
              <input
                type="text"
                value={formData.alternativeMobile}
                onChange={(e) => setFormData({ ...formData, alternativeMobile: e.target.value })}
                placeholder="+880 1812-345678"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Email Address (Optional)
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="client@example.com"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 pl-9 pr-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* NID / Smart Card */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                National ID / Passport No.
              </label>
              <div className="relative">
                <FileBadge className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={formData.nid}
                  onChange={(e) => setFormData({ ...formData, nid: e.target.value })}
                  placeholder="NID 10/17 digit number"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 pl-9 pr-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Reference Information */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Referrer / Middleman Info
              </label>
              <input
                type="text"
                value={formData.referenceInfo}
                onChange={(e) => setFormData({ ...formData, referenceInfo: e.target.value })}
                placeholder="Referred by Engr. / Middleman name"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>

            {/* Address */}
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Present / Permanent Address <span className="text-orange-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="House/Plot, Road, Thana/Upazila, District"
                  className={`w-full rounded-xl border bg-slate-800 pl-9 pr-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500 ${
                    errors.address ? 'border-rose-500' : 'border-slate-700'
                  }`}
                />
              </div>
              {errors.address && <p className="text-[11px] text-rose-500 mt-1">{errors.address}</p>}
            </div>

            {/* Special Notes */}
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Internal Remarks &amp; Notes
              </label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Important client preferences, requirements, or communication history"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-orange-500 active:scale-95"
            >
              <Save className="h-4 w-4" />
              {clientToEdit ? 'Save Changes' : 'Register Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
