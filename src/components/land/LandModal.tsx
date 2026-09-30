import React, { useState, useEffect } from 'react';
import { X, MapPin, Save, Compass } from 'lucide-react';
import { LandInfo } from '../../types';
import { useApp } from '../../context/AppContext';

interface LandModalProps {
  isOpen: boolean;
  onClose: () => void;
  landToEdit?: LandInfo | null;
  projectId: string;
  clientId: string;
}

export const LandModal: React.FC<LandModalProps> = ({
  isOpen,
  onClose,
  landToEdit,
  projectId,
  clientId,
}) => {
  const { currentCompany, saveLand } = useApp();

  const [formData, setFormData] = useState({
    landArea: '',
    decimal: 0,
    lengthFeet: 0,
    widthFeet: 0,
    mouza: '',
    khatian: '',
    dagNumber: '',
    roadWidthFeet: 0,
    frontSetback: '',
    sideSetback: '',
    rearSetback: '',
    landUse: 'Residential',
    location: '',
    googleMapsLink: '',
    latitude: 0,
    longitude: 0,
    notes: '',
  });

  useEffect(() => {
    if (landToEdit) {
      setFormData({
        landArea: landToEdit.landArea || '',
        decimal: landToEdit.decimal || 0,
        lengthFeet: landToEdit.lengthFeet || 0,
        widthFeet: landToEdit.widthFeet || 0,
        mouza: landToEdit.mouza || '',
        khatian: landToEdit.khatian || '',
        dagNumber: landToEdit.dagNumber || '',
        roadWidthFeet: landToEdit.roadWidthFeet || 0,
        frontSetback: landToEdit.frontSetback || '',
        sideSetback: landToEdit.sideSetback || '',
        rearSetback: landToEdit.rearSetback || '',
        landUse: landToEdit.landUse || 'Residential',
        location: landToEdit.location || '',
        googleMapsLink: landToEdit.googleMapsLink || '',
        latitude: landToEdit.latitude || 0,
        longitude: landToEdit.longitude || 0,
        notes: landToEdit.notes || '',
      });
    } else {
      setFormData({
        landArea: '',
        decimal: 0,
        lengthFeet: 0,
        widthFeet: 0,
        mouza: '',
        khatian: '',
        dagNumber: '',
        roadWidthFeet: 25,
        frontSetback: '1.50 m (5.0 ft)',
        sideSetback: '1.25 m (4.1 ft)',
        rearSetback: '2.00 m (6.6 ft)',
        landUse: 'Residential',
        location: '',
        googleMapsLink: '',
        latitude: 0,
        longitude: 0,
        notes: '',
      });
    }
  }, [landToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: LandInfo = {
      id: landToEdit ? landToEdit.id : `lnd-${Date.now()}`,
      companyId: currentCompany.id,
      projectId,
      clientId,
      landArea: formData.landArea.trim() || `${formData.decimal} Decimal`,
      decimal: Number(formData.decimal) || 0,
      lengthFeet: Number(formData.lengthFeet) || 0,
      widthFeet: Number(formData.widthFeet) || 0,
      mouza: formData.mouza.trim(),
      khatian: formData.khatian.trim(),
      dagNumber: formData.dagNumber.trim(),
      roadWidthFeet: Number(formData.roadWidthFeet) || 0,
      frontSetback: formData.frontSetback.trim(),
      sideSetback: formData.sideSetback.trim(),
      rearSetback: formData.rearSetback.trim(),
      landUse: formData.landUse,
      location: formData.location.trim(),
      googleMapsLink: formData.googleMapsLink.trim() || undefined,
      latitude: Number(formData.latitude) || undefined,
      longitude: Number(formData.longitude) || undefined,
      notes: formData.notes.trim() || undefined,
      createdAt: landToEdit ? landToEdit.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveLand(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-xl rounded-2xl border border-slate-700 bg-slate-900 p-6 text-white shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600 text-white font-bold">
              <Compass className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                {landToEdit ? 'Edit Land Record' : 'Record Land & Boundary Details'}
              </h3>
              <p className="text-xs text-slate-400">
                Mouza, Khatian, Dag, Area &amp; RAJUK/Municipal Setbacks
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
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
            {/* Land Area Description */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Land Area (e.g. 5 Katha)
              </label>
              <input
                type="text"
                value={formData.landArea}
                onChange={(e) => setFormData({ ...formData, landArea: e.target.value })}
                placeholder="5 Katha / 8 Decimal"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>

            {/* Decimal Area */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Decimal (শতাংশ)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.decimal || ''}
                onChange={(e) => setFormData({ ...formData, decimal: parseFloat(e.target.value) || 0 })}
                placeholder="8.25"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>

            {/* Road Width */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Front Road Width (ft)
              </label>
              <input
                type="number"
                value={formData.roadWidthFeet || ''}
                onChange={(e) => setFormData({ ...formData, roadWidthFeet: parseFloat(e.target.value) || 0 })}
                placeholder="30"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>

            {/* Plot Dimensions */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Length (ft)
              </label>
              <input
                type="number"
                value={formData.lengthFeet || ''}
                onChange={(e) => setFormData({ ...formData, lengthFeet: parseFloat(e.target.value) || 0 })}
                placeholder="80"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Width (ft)
              </label>
              <input
                type="number"
                value={formData.widthFeet || ''}
                onChange={(e) => setFormData({ ...formData, widthFeet: parseFloat(e.target.value) || 0 })}
                placeholder="50"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Land Use Type
              </label>
              <select
                value={formData.landUse}
                onChange={(e) => setFormData({ ...formData, landUse: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
              >
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Mixed-Use">Mixed-Use</option>
                <option value="Industrial">Industrial</option>
                <option value="Institutional">Institutional</option>
              </select>
            </div>

            {/* Revenue / Cadastral Data */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Mouza (মৌজা)
              </label>
              <input
                type="text"
                value={formData.mouza}
                onChange={(e) => setFormData({ ...formData, mouza: e.target.value })}
                placeholder="Dhanmondi Mouza"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Khatian (খতিয়ান)
              </label>
              <input
                type="text"
                value={formData.khatian}
                onChange={(e) => setFormData({ ...formData, khatian: e.target.value })}
                placeholder="CS/SA/RS/BS Khatian"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Dag No (দাগ নম্বর)
              </label>
              <input
                type="text"
                value={formData.dagNumber}
                onChange={(e) => setFormData({ ...formData, dagNumber: e.target.value })}
                placeholder="CS/BS Dag"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>

            {/* Setbacks */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Front Setback
              </label>
              <input
                type="text"
                value={formData.frontSetback}
                onChange={(e) => setFormData({ ...formData, frontSetback: e.target.value })}
                placeholder="1.50 m (5.0 ft)"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Side Setback
              </label>
              <input
                type="text"
                value={formData.sideSetback}
                onChange={(e) => setFormData({ ...formData, sideSetback: e.target.value })}
                placeholder="1.25 m (4.1 ft)"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Rear Setback
              </label>
              <input
                type="text"
                value={formData.rearSetback}
                onChange={(e) => setFormData({ ...formData, rearSetback: e.target.value })}
                placeholder="2.00 m (6.6 ft)"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>

            {/* Map & Location */}
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Plot Location Description
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Plot 45, Road 8/A, Dhanmondi R/A"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Google Maps Link
              </label>
              <input
                type="url"
                value={formData.googleMapsLink}
                onChange={(e) => setFormData({ ...formData, googleMapsLink: e.target.value })}
                placeholder="https://maps.google.com/..."
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
              />
            </div>

            {/* Notes */}
            <div className="sm:col-span-3">
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Survey &amp; Boundary Remarks
              </label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Corner plot, drainage availability, high tension line clearance..."
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-white"
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
              Save Land Info
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
