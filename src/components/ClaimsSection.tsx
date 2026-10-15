import React, { useState, useEffect } from 'react';
import { 
  Send, 
  History, 
  MapPin, 
  Phone, 
  User, 
  ListFilter,
  ShieldAlert,
  AlertCircle
} from 'lucide-react';
import { ClaimSubmission, Neighborhood } from '../types';
import { CLAIM_TYPES, OFFICIAL_PHONE } from '../data/initialData';
import { generateTicketNumber } from '../utils/officeHours';
import { getStoredClaims, addStoredClaim } from '../utils/claimsStorage';
import { ClaimSuccessModal } from './ClaimSuccessModal';

interface ClaimsSectionProps {
  initialServiceCategory?: string;
  onOpenBot?: () => void;
}

export const ClaimsSection: React.FC<ClaimsSectionProps> = ({ 
  initialServiceCategory,
  onOpenBot 
}) => {
  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [neighborhood, setNeighborhood] = useState<Neighborhood>('Parque Sicardi');
  const [address, setAddress] = useState('');
  const [claimType, setClaimType] = useState(CLAIM_TYPES[0]);
  const [description, setDescription] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal State
  const [submittedClaim, setSubmittedClaim] = useState<ClaimSubmission | null>(null);

  // History State
  const [savedClaims, setSavedClaims] = useState<ClaimSubmission[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load existing claims from localStorage and listen to updates
  useEffect(() => {
    setSavedClaims(getStoredClaims());
    const handleUpdate = () => {
      setSavedClaims(getStoredClaims());
    };
    window.addEventListener('delegacion_reclamos_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('delegacion_reclamos_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Update claimType if user clicked from services
  useEffect(() => {
    if (initialServiceCategory) {
      const matchingType = CLAIM_TYPES.find(t => 
        t.toLowerCase().includes(initialServiceCategory.toLowerCase()) || 
        initialServiceCategory.toLowerCase().includes(t.toLowerCase())
      );
      if (matchingType) {
        setClaimType(matchingType);
      } else {
        setClaimType(CLAIM_TYPES[CLAIM_TYPES.length - 1]);
      }
    }
  }, [initialServiceCategory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validations
    if (!fullName.trim()) {
      setErrorMsg('Por favor, ingresá tu nombre y apellido.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 6) {
      setErrorMsg('Por favor, ingresá un teléfono de contacto válido (ej: 221 441-1234).');
      return;
    }
    if (!address.trim()) {
      setErrorMsg('Por favor, indicá la dirección del reclamo (calle, número o entrecalles).');
      return;
    }
    if (!description.trim() || description.trim().length < 10) {
      setErrorMsg('Por favor, ingresá una breve descripción del problema (al menos 10 caracteres).');
      return;
    }

    setIsSubmitting(true);

    const newClaim: ClaimSubmission = {
      id: Date.now().toString(),
      ticketNumber: generateTicketNumber(),
      fullName: fullName.trim(),
      phone: phone.trim(),
      neighborhood,
      address: address.trim(),
      claimType,
      description: description.trim(),
      status: 'Recibido',
      createdAt: new Date().toLocaleDateString('es-AR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    setTimeout(() => {
      // Save locally safely without overwriting previous claims
      const updated = addStoredClaim(newClaim);
      setSavedClaims(updated);

      setIsSubmitting(false);
      setSubmittedClaim(newClaim);

      // Reset form
      setFullName('');
      setPhone('');
      setAddress('');
      setDescription('');
    }, 400);
  };

  return (
    <section id="reclamos" className="py-16 lg:py-24 bg-white relative border-t border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200">
            Canal Oficial de Gestión Vecinal
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Estamos para escucharte
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            La Delegación es un espacio de atención y escucha para los vecinos. Recibimos consultas, reclamos, sugerencias y necesidades de nuestra comunidad para gestionarlas o derivarlas a las áreas municipales correspondientes.
          </p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          
          {/* Main Form (8 cols on lg) */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Formulario de Reclamos y Solicitudes</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Completá los datos y te generamos tu número de constancia
                </p>
              </div>
              {savedClaims.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowHistory(!showHistory)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <History className="w-4 h-4" />
                  <span>Mis gestiones ({savedClaims.length})</span>
                </button>
              )}
            </div>

            {/* If history requested */}
            {showHistory && savedClaims.length > 0 && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 animate-in fade-in">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                    Historial registrado en este navegador
                  </h4>
                  <button 
                    onClick={() => setShowHistory(false)}
                    className="text-xs text-emerald-700 hover:underline font-semibold"
                  >
                    Ocultar
                  </button>
                </div>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {savedClaims.map((item) => (
                    <div key={item.id} className="p-3 bg-white rounded-xl border border-emerald-100 text-xs flex justify-between items-center">
                      <div>
                        <span className="font-bold text-emerald-900 font-mono">{item.ticketNumber}</span> · <span className="font-semibold text-slate-700">{item.claimType}</span>
                        <div className="text-slate-500 text-[11px] mt-0.5">{item.neighborhood} · {item.address} ({item.createdAt})</div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Row 1: Nombre y Teléfono */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Nombre y Apellido <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ej: Martín Gómez"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm bg-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Teléfono de Contacto <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ej: 221 441-1234"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm bg-white"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Barrio (Pills) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Barrio o Localidad <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {(['Villa Garibaldi', 'Parque Sicardi', 'Ignacio Correas'] as Neighborhood[]).map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setNeighborhood(b)}
                      className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all text-center cursor-pointer ${
                        neighborhood === b
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 3: Dirección */}
              <div>
                <label htmlFor="address" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Dirección del reclamo o entrecalles <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ej: Calle 659 entre 12 y 13 / Calle 15 y 660"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm bg-white"
                    required
                  />
                </div>
              </div>

              {/* Row 4: Tipo de Reclamo */}
              <div>
                <label htmlFor="claimType" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Tipo de Reclamo <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <ListFilter className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <select
                    id="claimType"
                    value={claimType}
                    onChange={(e) => setClaimType(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm bg-white appearance-none cursor-pointer"
                  >
                    {CLAIM_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 5: Descripción breve */}
              <div>
                <label htmlFor="description" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Descripción breve del problema <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detallá la situación (ej: luminaria apagada frente a la casa, rama caída sobre vereda, necesidad de zanjeo por acumulación de agua...)"
                  className="w-full p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm bg-white resize-y"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-base shadow-lg shadow-emerald-700/20 hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  <Send className="w-5 h-5" />
                  <span>{isSubmitting ? 'Procesando registro...' : 'Enviar reclamo'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-5">


            {/* Telephone Callout */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-800">
                <Phone className="w-4 h-4 text-emerald-700" />
                <span>Atención telefónica directa</span>
              </div>
              <p className="text-slate-600">
                También podés llamar al conmutador de la Delegación: <strong>(0221) 441-6910</strong> de Lun a Vie de 8 a 17 hs y Sábados de 8 a 13 hs.
              </p>
            </div>

            {/* Emergency reminder */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>¿Urgencia inmediata o tormenta?</strong>
                <p className="mt-0.5 text-amber-800">
                  Comunicate directamente con la línea gratuita <strong>147 de La Plata</strong> o al <strong>103 (Defensa Civil)</strong> las 24 horas.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Success Modal */}
      {submittedClaim && (
        <ClaimSuccessModal
          claim={submittedClaim}
          onClose={() => setSubmittedClaim(null)}
          onOpenBot={onOpenBot}
        />
      )}
    </section>
  );
};
