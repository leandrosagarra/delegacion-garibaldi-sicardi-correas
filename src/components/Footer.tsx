import { 
  Shield, 
  MapPin, 
  Phone, 
  Clock, 
  Bot, 
  ArrowUp, 
  ChevronRight,
  KeyRound
} from 'lucide-react';
import { 
  DELEGATION_ADDRESS, 
  OFFICIAL_PHONE, 
  OFFICIAL_PHONE_PLAIN
} from '../data/initialData';

interface FooterProps {
  onOpenBot?: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBot, onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0f281e] text-slate-300 pt-16 pb-12 border-t border-emerald-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-emerald-900/40">
          
          {/* Institutional Branding (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-emerald-700/40 p-0.5 shadow-md flex items-center justify-center">
                <img
                  src="/logo.jpg"
                  alt="Centro Comunal Villa Garibaldi - Sicardi - Correas"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 block">
                  Municipalidad de La Plata
                </span>
                <span className="font-extrabold text-white text-base leading-tight">
                  Delegación Municipal
                </span>
              </div>
            </div>

            <h3 className="text-lg font-bold text-white tracking-wide">
              Villa Garibaldi, Parque Sicardi e Ignacio Correas
            </h3>

            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              Organismo municipal de cercanía dedicado a canalizar las solicitudes vecinales, coordinar los servicios urbanos y articular con la Municipalidad de La Plata.
            </p>

            <div className="pt-2 text-xs text-slate-400 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Atención activa en el sur del partido de La Plata</span>
            </div>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 border-b border-emerald-900/60 pb-2">
              Accesos Rápidos
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#servicios" className="hover:text-white flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Servicios urbanos y áreas</span>
                </a>
              </li>
              <li>
                <a href="#reclamos" className="hover:text-white flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Consultas y Reclamos</span>
                </a>
              </li>
              <li>
                <a href="#novedades" className="hover:text-white flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Noticias de la comunidad</span>
                </a>
              </li>
              <li>
                <a href="#sobre-nosotros" className="hover:text-white flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sobre la Delegación</span>
                </a>
              </li>
              <li>
                <a href="#contacto" className="hover:text-white flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Ubicación y horarios</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Communication Channels & Direct Bot Link (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 border-b border-emerald-900/60 pb-2">
              Canales Municipales
            </h4>
            
            <div className="space-y-3 text-xs sm:text-sm">
              <button
                type="button"
                onClick={onOpenBot}
                className="w-full flex items-center gap-2.5 p-3 rounded-xl bg-white/5 hover:bg-emerald-600/30 hover:border-emerald-500 border border-white/10 transition-colors group cursor-pointer text-left"
              >
                <Bot className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-semibold text-white block">Bot de Atención Vecinal</span>
                  <span className="text-xs text-slate-400">Reclamos y consultas virtuales 24 hs</span>
                </div>
              </button>

              <button
                type="button"
                onClick={onOpenAdmin}
                className="w-full flex items-center gap-2.5 p-3 rounded-xl bg-white/5 hover:bg-emerald-600/30 hover:border-emerald-500 border border-white/10 transition-colors group cursor-pointer text-left"
              >
                <KeyRound className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-semibold text-white block">Panel de Gestión Comunal</span>
                  <span className="text-xs text-slate-400">Reclamos y noticias (Código: 1422)</span>
                </div>
              </button>

              <a
                href={`tel:${OFFICIAL_PHONE_PLAIN}`}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 hover:bg-emerald-600/20 hover:border-emerald-500 border border-white/10 transition-colors group"
              >
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="text-left">
                  <span className="font-semibold text-white block">Conmutador Telefónico</span>
                  <span className="text-xs text-slate-400">{OFFICIAL_PHONE}</span>
                </div>
              </a>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1">
                <div className="flex items-center gap-2 text-slate-200">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{DELEGATION_ADDRESS}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Lun a Vie: 8 a 17 hs · Sáb: 8 a 13 hs</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Micro Footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
            <span>&copy; {new Date().getFullYear()} <strong>Delegación Municipal de Villa Garibaldi, Parque Sicardi e Ignacio Correas</strong>.</span>
            <span className="hidden sm:inline">·</span>
            <span>Municipalidad de La Plata – Provincia de Buenos Aires, Argentina.</span>
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 transition-colors cursor-pointer"
            aria-label="Volver arriba"
          >
            <span>Volver arriba</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
