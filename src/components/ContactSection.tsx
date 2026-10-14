import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Bot, 
  Navigation, 
  ExternalLink,
  ShieldAlert,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { 
  DELEGATION_ADDRESS, 
  OFFICIAL_PHONE, 
  OFFICIAL_PHONE_PLAIN,
  GOOGLE_MAPS_LINK,
  EMERGENCY_NUMBERS 
} from '../data/initialData';
import { getDelegationStatus } from '../utils/officeHours';

interface ContactSectionProps {
  onOpenBot?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenBot }) => {
  const [status, setStatus] = useState(getDelegationStatus());

  useEffect(() => {
    const timer = setInterval(() => {
      setStatus(getDelegationStatus());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="contacto" className="py-16 lg:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200">
            Atención al Vecino
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Encontranos y comunicate
          </h2>
          <p className="mt-3 text-slate-600 text-base sm:text-lg">
            Estamos para responder tus dudas, recibir tus trámites y coordinar soluciones en el barrio.
          </p>
        </div>

        {/* Contact Information & Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-14">
          
          {/* Contact Details Card (5 cols on lg) */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Live status badge */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <span className={`w-3 h-3 rounded-full ${status.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">{status.statusText}</span>
                    <span className="text-[11px] text-slate-500">{status.nextEventText}</span>
                  </div>
                </div>
                <Clock className="w-5 h-5 text-slate-400" />
              </div>

              {/* Address */}
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 shrink-0 mt-1">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Dirección Sede</h4>
                  <p className="text-base font-bold text-slate-900 mt-0.5">
                    {DELEGATION_ADDRESS}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Fácil acceso desde Av. 7 y Av. 137.
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 shrink-0 mt-1">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Teléfono Fijo</h4>
                  <a 
                    href={`tel:${OFFICIAL_PHONE_PLAIN}`}
                    className="text-base sm:text-lg font-bold text-emerald-800 hover:underline block mt-0.5"
                  >
                    {OFFICIAL_PHONE}
                  </a>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Línea directa con el conmutador de la Delegación.
                  </p>
                </div>
              </div>

              {/* Office Hours */}
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 shrink-0 mt-1">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="w-full">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Horarios de Atención</h4>
                  <div className="mt-2 space-y-1.5 text-xs sm:text-sm">
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="font-semibold text-slate-700">Lunes a viernes:</span>
                      <span className="font-bold text-slate-900">8:00 a 17:00 hs</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="font-semibold text-slate-700">Sábados:</span>
                      <span className="font-bold text-slate-900">8:00 a 13:00 hs</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="font-semibold text-slate-500">Domingos:</span>
                      <span className="font-medium text-rose-600">Cerrado</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Interactive Bot Card Button */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <span className="text-xs font-semibold text-slate-500 block mb-2 text-center">
                Atención virtual las 24 horas:
              </span>
              <button
                type="button"
                onClick={onOpenBot}
                className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-base shadow-lg shadow-emerald-700/20 hover:shadow-xl transition-all cursor-pointer"
              >
                <Bot className="w-5 h-5" />
                <span>Hacer reclamo o consulta con el Bot</span>
              </button>
            </div>

          </div>

          {/* Interactive Google Map (7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col rounded-3xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
            {/* Map Top Bar */}
            <div className="p-4 bg-[#0f382a] text-white flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold tracking-wide">
                  Calle 659 e/ 12 y 13 · Parque Sicardi, La Plata
                </span>
              </div>
              
              <a
                href={GOOGLE_MAPS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cómo llegar</span>
                <ExternalLink className="w-3 h-3 text-emerald-200" />
              </a>
            </div>

            {/* Real OpenStreetMap / Google Maps embed */}
            <div className="flex-1 min-h-[360px] relative bg-slate-200">
              <iframe
                title="Ubicación Delegación Municipal Sicardi Garibaldi Correas"
                width="100%"
                height="100%"
                className="w-full h-full border-0 absolute inset-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src="https://maps.google.com/maps?q=Calle+659+y+Calle+13+Parque+Sicardi+La+Plata&t=&z=15&ie=UTF8&iwloc=&output=embed"
              />
            </div>

            {/* Map Footer Bar */}
            <div className="p-3 bg-white border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
              <span>Sede Comunal Parque Sicardi</span>
              <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Atención vecinal en planta baja
              </span>
            </div>
          </div>

        </div>

        {/* Emergency & Municipal Direct Lines Banner */}
        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2.5 mb-4">
            <ShieldAlert className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
              Líneas de Asistencia y Emergencias de La Plata
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {EMERGENCY_NUMBERS.map((item) => (
              <div 
                key={item.number}
                className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-emerald-300 transition-colors"
              >
                <span className="text-xl font-extrabold text-emerald-800 font-mono block">
                  {item.number}
                </span>
                <span className="text-xs font-bold text-slate-800 block mt-0.5">
                  {item.name}
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5 leading-snug">
                  {item.desc}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
