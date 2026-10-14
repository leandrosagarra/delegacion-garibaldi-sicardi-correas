import React from 'react';
import { UserCheck, Trees, Store, Compass } from 'lucide-react';
import { DELEGATE_NAME } from '../data/initialData';

export const AboutSection: React.FC = () => {
  return (
    <section id="sobre-nosotros" className="py-16 lg:py-24 bg-white relative border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider border border-emerald-200">
              Identidad y Compromiso
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Una Delegación cerca de cada vecino
            </h2>

            <div className="space-y-4 text-slate-600 text-base sm:text-lg leading-relaxed">
              <p>
                Somos un espacio de atención y gestión municipal para las comunidades de <strong>Villa Garibaldi</strong>, <strong>Parque Sicardi</strong> e <strong>Ignacio Correas</strong>.
              </p>
              <p>
                Trabajamos para acercar los servicios municipales a cada barrio, facilitar trámites y canalizar las necesidades de los vecinos.
              </p>
              <p>
                Escuchamos sus inquietudes y articulamos con las distintas áreas de la Municipalidad de La Plata para impulsar soluciones y mejorar la calidad de vida de nuestra comunidad.
              </p>
            </div>

            {/* Delegate Badge Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <UserCheck className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-slate-400 block">
                  Responsable de la Delegación
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {DELEGATE_NAME}
                </h3>
                <span className="text-xs font-semibold text-emerald-700">
                  Delegada Municipal · Municipalidad de La Plata
                </span>
              </div>
            </div>

          </div>

          {/* Right Neighborhoods Focus Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Nuestros Tres Barrios
            </div>

            {/* Villa Garibaldi */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-emerald-400 transition-colors">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 shrink-0 mt-0.5">
                  <Trees className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">Villa Garibaldi</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Identidad de barrio parque, gran patrimonio forestal y apego comunitario. Acompañamos su crecimiento cuidando su esencia tranquila y verde.
                  </p>
                </div>
              </div>
            </div>

            {/* Parque Sicardi */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-emerald-400 transition-colors">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 shrink-0 mt-0.5">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">Parque Sicardi</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Dinámico polo residencial y comercial en constante expansión. Aquí funciona la sede principal de nuestra Delegación (Calle 659 e/ 12 y 13).
                  </p>
                </div>
              </div>
            </div>

            {/* Ignacio Correas */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-emerald-400 transition-colors">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-800 shrink-0 mt-0.5">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">Ignacio Correas</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Comunidad de profunda tradición rural, estación de tren histórica y entorno natural privilegiado al sur del partido de La Plata.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
