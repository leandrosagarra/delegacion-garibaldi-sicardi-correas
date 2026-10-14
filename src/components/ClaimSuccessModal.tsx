import React, { useState } from 'react';
import { CheckCircle2, Copy, Check, X, MapPin, Calendar, Hash, Bot, Phone } from 'lucide-react';
import { ClaimSubmission } from '../types';
import { OFFICIAL_PHONE } from '../data/initialData';

interface ClaimSuccessModalProps {
  claim: ClaimSubmission | null;
  onClose: () => void;
  onOpenBot?: () => void;
}

export const ClaimSuccessModal: React.FC<ClaimSuccessModalProps> = ({ claim, onClose, onOpenBot }) => {
  const [copied, setCopied] = useState(false);

  if (!claim) return null;

  const copyTicket = () => {
    navigator.clipboard.writeText(claim.ticketNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header with success badge */}
        <div className="bg-[#0f382a] text-white p-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400/40 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <h3 className="text-2xl font-bold">¡Reclamo Registrado con Éxito!</h3>
          <p className="text-emerald-100 text-sm mt-1">
            Tu solicitud ya fue asentada en el libro de gestión de la Delegación.
          </p>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-5">
          {/* Ticket highlight box */}
          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 flex items-center justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 block">
                Número de Constancia / Ticket
              </span>
              <span className="text-xl font-extrabold text-emerald-900 tracking-wide font-mono">
                {claim.ticketNumber}
              </span>
            </div>
            <button
              onClick={copyTicket}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-xs font-semibold text-slate-700 shadow-2xs transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>Copiar N°</span>
                </>
              )}
            </button>
          </div>

          {/* Claim summary */}
          <div className="space-y-2 text-sm text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Vecino:</span>
              <strong className="text-slate-800">{claim.fullName}</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Teléfono:</span>
              <span className="text-slate-800">{claim.phone}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Barrio:</span>
              <strong className="text-slate-800">{claim.neighborhood}</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Dirección:</span>
              <span className="text-slate-800 font-medium text-right max-w-[220px] truncate">{claim.address}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Motivo:</span>
              <span className="text-slate-800 font-medium text-right max-w-[220px] truncate">{claim.claimType}</span>
            </div>
          </div>

          {/* Bot Assist Info Box */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3">
            <Bot className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-900">
                Podés consultar el estado de tu constancia en cualquier momento
              </p>
              <p className="text-emerald-800 mt-0.5">
                Ingresá tu número <strong>{claim.ticketNumber}</strong> en el Bot de Atención Vecinal o consultá telefónicamente al conmutador de la Delegación ({OFFICIAL_PHONE}).
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-between gap-3">
            {onOpenBot && (
              <button
                onClick={() => {
                  onClose();
                  onOpenBot();
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <Bot className="w-4 h-4" />
                <span>Abrir Bot Vecinal</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="ml-auto px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cerrar y volver
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
