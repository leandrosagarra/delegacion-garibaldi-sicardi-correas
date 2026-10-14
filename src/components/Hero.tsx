import React from 'react';
import { MapPin, Phone, Clock, ChevronRight, CheckCircle2 } from 'lucide-react';
import { OFFICIAL_PHONE, OFFICIAL_PHONE_PLAIN } from '../data/initialData';

interface HeroProps {
  onOpenBot?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBot }) => {
  return (
    <section id="inicio" className="relative overflow-hidden bg-white pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-200">
      {/* Decorative subtle civic pattern background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02]" 
        style={{
          backgroundImage: `radial-gradient(#0f382a 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Official Emblem Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-white border-2 border-emerald-500/30 shadow-md shadow-emerald-900/10 p-1 flex items-center justify-center hover:scale-105 transition-transform duration-300">
              <img
                src="/logo.jpg"
                alt="Logo Centro Comunal Villa Garibaldi - Sicardi - Correas"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
          </div>

          {/* Institutional Sub-badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-semibold mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>Municipalidad de La Plata · Secretaría de Coordinación Municipal</span>
          </div>

          {/* 1. Título Destacado en un solo renglón */}
          <div className="w-full overflow-hidden flex justify-center px-1">
            <h1 className="text-[13px] min-[360px]:text-[14px] min-[390px]:text-[16px] min-[430px]:text-[17.5px] sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight whitespace-nowrap text-center">
              Delegación Villa Garibaldi-Sicardi-Ignacio Correas
            </h1>
          </div>

          {/* 2. Slogan con comillas */}
          <p className="text-lg sm:text-xl md:text-2xl font-medium text-slate-700 mt-3 mb-6">
            "Tu delegación, más cerca"
          </p>

        </div>

        {/* 3 Quick Direct Answer Cards with White backgrounds and Green Highlights */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {/* Card 1: Ubicación */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-emerald-400 transition-colors flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 shrink-0 mt-0.5">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400">Ubicación física</h3>
              <p className="font-bold text-slate-900 text-sm mt-0.5">Calle 659 entre 12 y 13</p>
              <p className="text-xs text-slate-500">Parque Sicardi, La Plata</p>
              <a href="#contacto" className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold mt-2 hover:underline">
                Ver mapa y cómo llegar <ChevronRight className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Card 2: Horarios */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-emerald-400 transition-colors flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 shrink-0 mt-0.5">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400">Horarios de atención</h3>
              <p className="font-bold text-slate-900 text-sm mt-0.5">Lun a Vie: 8:00 a 17:00 hs</p>
              <p className="text-xs text-slate-500">Sábados: 8:00 a 13:00 hs (Dom. cerrado)</p>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Atención presencial y virtual</span>
              </div>
            </div>
          </div>

          {/* Card 3: Canales de contacto */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-emerald-400 transition-colors flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 shrink-0 mt-0.5">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400">Atención Telefónica</h3>
              <p className="font-bold text-slate-900 text-sm mt-0.5">Tel: (0221) 441-6910</p>
              <p className="text-xs text-slate-500">Conmutador central Delegación</p>
              <a 
                href={`tel:${OFFICIAL_PHONE_PLAIN}`}
                className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold mt-2 hover:underline"
              >
                Llamar a la Delegación ahora <ChevronRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
