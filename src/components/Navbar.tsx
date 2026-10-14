import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Clock, MapPin, Shield } from 'lucide-react';
import { getDelegationStatus } from '../utils/officeHours';
import { OFFICIAL_PHONE_PLAIN } from '../data/initialData';

interface NavbarProps {
  onOpenBot?: () => void;
  onOpenAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [status, setStatus] = useState(getDelegationStatus());

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    const interval = setInterval(() => {
      setStatus(getDelegationStatus());
    }, 60000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '#inicio' },
    { name: '¿Qué hacemos?', href: '#servicios' },
    { name: 'Consultas y Reclamos', href: '#reclamos' },
    { name: 'Novedades', href: '#novedades' },
    { name: 'Sobre la Delegación', href: '#sobre-nosotros' },
    { name: 'Contacto', href: '#contacto' },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md transition-all duration-200 border-b border-slate-200">
      {/* Top micro-bar for institutional identity and live status */}
      <div className="bg-[#0f382a] text-slate-200 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white tracking-wide flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              MUNICIPALIDAD DE LA PLATA
            </span>
            <span className="text-emerald-300/40 hidden sm:inline">|</span>
            <span className="text-slate-300 hidden sm:inline">
              Secretaría de Coordinación Municipal
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-medium">
              <span
                className={`w-2 h-2 rounded-full ${
                  status.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span className="text-slate-200">{status.statusText}</span>
              <span className="text-slate-400 hidden md:inline">({status.nextEventText})</span>
            </div>
            <a
              href={`tel:${OFFICIAL_PHONE_PLAIN}`}
              className="hidden lg:flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-emerald-300" />
              <span>(0221) 441-6910</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Official Crest from logo.jpg */}
          <a href="#inicio" className="flex items-center gap-3.5 group focus:outline-none">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-slate-200 shadow-xs flex items-center justify-center p-0.5 group-hover:scale-105 transition-transform">
              <img
                src="/logo.jpg"
                alt="Logo Centro Comunal Villa Garibaldi - Sicardi - Correas"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-700">
                Delegación Municipal
              </span>
              <span className="font-extrabold text-slate-900 text-xs sm:text-base leading-tight group-hover:text-emerald-700 transition-colors">
                Villa Garibaldi-Sicardi-Ignacio Correas
              </span>
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                Municipalidad de La Plata
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/70 rounded-lg transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Phone quick contact button */}
          <div className="hidden sm:flex items-center gap-2">
            <a
              href={`tel:${OFFICIAL_PHONE_PLAIN}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-emerald-500 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-xs font-semibold shadow-2xs transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>(0221) 441-6910</span>
            </a>
          </div>

          {/* Mobile hamburger menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
              aria-label="Abrir menú"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 animate-in fade-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={handleLinkClick}
                className="px-3 py-2.5 text-base font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <a
              href={`tel:${OFFICIAL_PHONE_PLAIN}`}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              <Phone className="w-4 h-4 text-emerald-700" />
              <span>Llamar al (0221) 441-6910</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
