import React, { useState, useEffect } from 'react';
import {
  Building,
  Save,
  CheckCircle2,
  ShieldCheck,
  Globe,
  Phone,
  Mail,
  MapPin,
  FileBadge,
  CreditCard,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CompanySettingsModal: React.FC = () => {
  const { currentCompany, updateCompanyProfile } = useApp();

  const [formData, setFormData] = useState({
    name: currentCompany.name,
    slogan: currentCompany.slogan,
    managingDirector: currentCompany.managingDirector,
    managingDirectorQualifications: currentCompany.managingDirectorQualifications,
    email: currentCompany.email,
    phone: currentCompany.phone,
    alternativePhone: currentCompany.alternativePhone || '',
    address: currentCompany.address,
    dapRegNo: currentCompany.dapRegNo || '',
    tradeLicense: currentCompany.tradeLicense || '',
    bankDetails: currentCompany.bankDetails || '',
    currencySymbol: currentCompany.currencySymbol || '৳',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setFormData({
      name: currentCompany.name,
      slogan: currentCompany.slogan,
      managingDirector: currentCompany.managingDirector,
      managingDirectorQualifications: currentCompany.managingDirectorQualifications,
      email: currentCompany.email,
      phone: currentCompany.phone,
      alternativePhone: currentCompany.alternativePhone || '',
      address: currentCompany.address,
      dapRegNo: currentCompany.dapRegNo || '',
      tradeLicense: currentCompany.tradeLicense || '',
      bankDetails: currentCompany.bankDetails || '',
      currencySymbol: currentCompany.currencySymbol || '৳',
    });
  }, [currentCompany]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateCompanyProfile({
      ...currentCompany,
      name: formData.name.trim(),
      slogan: formData.slogan.trim(),
      managingDirector: formData.managingDirector.trim(),
      managingDirectorQualifications: formData.managingDirectorQualifications.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      alternativePhone: formData.alternativePhone.trim() || undefined,
      address: formData.address.trim(),
      dapRegNo: formData.dapRegNo.trim() || undefined,
      tradeLicense: formData.tradeLicense.trim() || undefined,
      bankDetails: formData.bankDetails.trim() || undefined,
      currencySymbol: formData.currencySymbol.trim() || '৳',
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Building className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl dark:text-white">
            Company Information &amp; Official Letterhead Branding
          </h1>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Custom edit company name, Managing Director qualifications, DAP registration, bank accounts, and print vouchers
        </p>
      </div>

      {savedSuccess && (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <span>Company profile updated successfully! All receipts, transmittals, and soil reports now reflect the new information.</span>
        </div>
      )}

      {/* Main Form */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Company Name */}
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                Company Legal Name <span className="text-orange-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Hybrid Civil Engineering & Consultancy"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-sm font-bold text-slate-900 focus:border-orange-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Slogan */}
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Corporate Tagline / Slogan
              </label>
              <input
                type="text"
                value={formData.slogan}
                onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                placeholder="Precision Engineering, Structural Integrity & Sustainable Architecture"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Managing Director */}
            <div>
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                Managing Director Name <span className="text-orange-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.managingDirector}
                onChange={(e) => setFormData({ ...formData, managingDirector: e.target.value })}
                placeholder="Engr. Ashraf"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-sm font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* MD Qualifications */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Managing Director Degrees &amp; Qualifications
              </label>
              <input
                type="text"
                value={formData.managingDirectorQualifications}
                onChange={(e) => setFormData({ ...formData, managingDirectorQualifications: e.target.value })}
                placeholder="B.Eng, M.Sc.Sc (Structural Engineering)"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Official Contact Phone
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+880 1712-345678"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Official Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="info@hybridcivil.com"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* DAP & Trade License */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                RAJUK / Municipal DAP Reg. No.
              </label>
              <input
                type="text"
                value={formData.dapRegNo}
                onChange={(e) => setFormData({ ...formData, dapRegNo: e.target.value })}
                placeholder="RAJUK/DAP/ENG-2024/098"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Trade License Number
              </label>
              <input
                type="text"
                value={formData.tradeLicense}
                onChange={(e) => setFormData({ ...formData, tradeLicense: e.target.value })}
                placeholder="TRAD/DSCC/019284"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Currency Symbol */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Billing Currency Symbol
              </label>
              <input
                type="text"
                value={formData.currencySymbol}
                onChange={(e) => setFormData({ ...formData, currencySymbol: e.target.value })}
                placeholder="৳ or BDT"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white font-bold"
              />
            </div>

            {/* Address */}
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Office Headquarter Address
              </label>
              <textarea
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Suite 402, Royal Engineering Tower, Green Road, Dhanmondi, Dhaka"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Bank Accounts */}
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Bank &amp; Payment Routing Information (Printed on Money Receipts)
              </label>
              <input
                type="text"
                value={formData.bankDetails}
                onChange={(e) => setFormData({ ...formData, bankDetails: e.target.value })}
                placeholder="Dutch-Bangla Bank Ltd | A/C: 115.120.98451 | Dhanmondi Branch"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-orange-500 active:scale-95"
            >
              <Save className="h-4 w-4" />
              <span>Save Company Configuration</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
