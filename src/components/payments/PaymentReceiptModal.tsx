import React from 'react';
import { X, Printer, CheckCircle, ShieldCheck } from 'lucide-react';
import { Payment } from '../../types';
import { useApp } from '../../context/AppContext';

interface PaymentReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: Payment | null;
}

// Convert numbers to words for Bangladeshi Taka vouchers
function numberToWords(num: number): string {
  if (num === 0) return 'Zero Taka Only';
  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function inWords(n: number): string {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
    if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + inWords(n % 100) : '');
    if (n < 100000) return inWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + inWords(n % 1000) : '');
    if (n < 10000000) return inWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + inWords(n % 100000) : '');
    return inWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 !== 0 ? ' ' + inWords(n % 10000000) : '');
  }

  return inWords(Math.floor(num)) + ' Taka Only';
}

export const PaymentReceiptModal: React.FC<PaymentReceiptModalProps> = ({
  isOpen,
  onClose,
  payment,
}) => {
  const { currentCompany } = useApp();

  if (!isOpen || !payment) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-white p-6 text-slate-900 shadow-2xl overflow-y-auto max-h-[95vh] print:p-0 print:border-none print:shadow-none print:max-h-none print:w-full">
        {/* Modal Controls (Hidden in Print) */}
        <div className="no-print flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="rounded bg-emerald-100 p-1 text-emerald-700">
              <CheckCircle className="h-4 w-4" />
            </span>
            <span className="text-sm font-bold text-slate-900">Official Money Receipt Voucher</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-orange-500 shadow-sm"
            >
              <Printer className="h-4 w-4" />
              Print Receipt
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE RECEIPT BODY */}
        <div className="print-page border-2 border-slate-900 p-6 sm:p-8 rounded-xl">
          {/* Header & Logo */}
          <div className="border-b-2 border-slate-900 pb-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 font-black text-white text-base">
                HC
              </div>
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-950">
                {currentCompany.name}
              </h1>
            </div>
            <p className="text-xs font-bold text-orange-600 tracking-wide uppercase">
              {currentCompany.slogan}
            </p>
            <p className="text-[11px] text-slate-600 mt-1 max-w-lg mx-auto">
              {currentCompany.address}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Phone: {currentCompany.phone} • Email: {currentCompany.email} • DAP Reg: {currentCompany.dapRegNo || 'RAJUK/ENG-2024'}
            </p>
          </div>

          {/* Receipt Title & Voucher No. */}
          <div className="my-4 flex items-center justify-between">
            <div className="rounded-lg border-2 border-slate-900 bg-slate-100 px-4 py-1 text-xs font-black uppercase tracking-wider text-slate-950">
              MONEY RECEIPT
            </div>
            <div className="text-right text-xs">
              <p><strong>Receipt No:</strong> <span className="font-mono font-bold text-slate-950">{payment.receiptNo}</span></p>
              <p className="text-slate-600"><strong>Date:</strong> {payment.date}</p>
            </div>
          </div>

          {/* Body Information Table */}
          <div className="space-y-3.5 text-xs text-slate-900">
            <div className="flex items-baseline border-b border-dotted border-slate-400 pb-1">
              <span className="w-36 font-bold text-slate-700">Received with thanks from:</span>
              <span className="flex-1 font-bold text-slate-950 text-sm">{payment.clientName}</span>
            </div>

            <div className="flex items-baseline border-b border-dotted border-slate-400 pb-1">
              <span className="w-36 font-bold text-slate-700">Project / Site:</span>
              <span className="flex-1 font-bold text-slate-950">{payment.projectName}</span>
            </div>

            <div className="flex items-baseline border-b border-dotted border-slate-400 pb-1">
              <span className="w-36 font-bold text-slate-700">The Sum of (In Words):</span>
              <span className="flex-1 font-semibold text-slate-900 italic">
                {numberToWords(payment.amount)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 border-b border-dotted border-slate-400 pb-1">
              <div className="flex items-baseline">
                <span className="w-36 font-bold text-slate-700">Payment Mode:</span>
                <span className="font-semibold text-slate-950">{payment.paymentMethod}</span>
              </div>
              <div className="flex items-baseline">
                <span className="w-24 font-bold text-slate-700">Trx / Cheque Ref:</span>
                <span className="font-mono text-slate-950">{payment.reference || 'N/A'}</span>
              </div>
            </div>

            <div className="flex items-baseline border-b border-dotted border-slate-400 pb-1">
              <span className="w-36 font-bold text-slate-700">Account of / Purpose:</span>
              <span className="flex-1 text-slate-800">{payment.notes || 'Engineering consultancy & design milestone clearance'}</span>
            </div>
          </div>

          {/* Amount Badge */}
          <div className="mt-6 flex items-center justify-between">
            <div className="rounded-xl border-2 border-slate-950 bg-slate-900 px-5 py-2.5 text-white">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">Total Amount Received</span>
              <span className="text-xl font-black">{currentCompany.currencySymbol || '৳'} {payment.amount.toLocaleString()}/-</span>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Electronically Authenticated</span>
            </div>
          </div>

          {/* Signatures */}
          <div className="mt-14 flex items-end justify-between text-xs pt-4">
            <div className="text-center">
              <div className="w-40 border-t border-slate-900 pt-1 font-semibold text-slate-800">
                Client / Depositor
              </div>
            </div>

            <div className="text-center">
              <p className="font-bold text-slate-950">{payment.receivedBy}</p>
              <div className="w-40 border-t border-slate-900 pt-1 font-semibold text-slate-800">
                Received By
              </div>
            </div>

            <div className="text-center">
              <p className="font-bold text-slate-950">{currentCompany.managingDirector}</p>
              <div className="w-44 border-t border-slate-900 pt-1 font-semibold text-slate-800">
                Managing Director / Authorized
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
