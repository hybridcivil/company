import React from 'react';
import {
  X,
  FolderPlus,
  UserPlus,
  CreditCard,
  Compass,
  DollarSign,
  FileUp,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerAction: (actionKey: string) => void;
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({
  isOpen,
  onClose,
  onTriggerAction,
}) => {
  if (!isOpen) return null;

  const actions = [
    {
      key: 'new-project',
      label: 'Create Project',
      desc: 'Add new architectural/structural engineering project',
      icon: FolderPlus,
      color: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    },
    {
      key: 'new-client',
      label: 'Register Client',
      desc: 'Create new client profile with contact and NID details',
      icon: UserPlus,
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    },
    {
      key: 'new-payment',
      label: 'Record Payment Voucher',
      desc: 'Issue money receipt for client contract milestone',
      icon: CreditCard,
      color: 'bg-green-500/20 text-green-400 border-green-500/30',
    },
    {
      key: 'new-site-visit',
      label: 'Add Site Inspection',
      desc: 'Log site condition, progress, and engineer observations',
      icon: Compass,
      color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    },
    {
      key: 'new-expense',
      label: 'Record Expense / Boksis',
      desc: 'Log office, advertisement, or site gate boksis payment',
      icon: DollarSign,
      color: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    },
    {
      key: 'new-file',
      label: 'Upload Drawing / Document',
      desc: 'Upload structural, architectural, or MEP DWG/PDF',
      icon: FileUp,
      color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    },
    {
      key: 'new-soil-test',
      label: 'New Soil Investigation (SPT)',
      desc: 'Record borehole test with 5 ft interval SPT logs',
      icon: Layers,
      color: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-5 text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-600 text-white font-bold">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">Quick Operations</h3>
              <p className="text-xs text-slate-400">Select an engineering task to launch</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.key}
                onClick={() => {
                  onTriggerAction(act.key);
                  onClose();
                }}
                className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-800/50 p-3 text-left transition hover:border-slate-700 hover:bg-slate-800 active:scale-98"
              >
                <div className={`rounded-lg border p-2 shrink-0 ${act.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{act.label}</p>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{act.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
