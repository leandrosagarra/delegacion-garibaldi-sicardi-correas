import React, { useState } from 'react';
import { Bot, Sparkles, X } from 'lucide-react';

interface FloatingBotButtonProps {
  onOpenBot: () => void;
}

export const FloatingBotButton: React.FC<FloatingBotButtonProps> = ({ onOpenBot }) => {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <aside aria-label="Bot de atención vecinal" className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
      {/* Friendly Tooltip / Callout */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 p-3 pr-2.5 rounded-2xl bg-white border border-slate-200 shadow-xl text-xs text-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-xs">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
          <p className="font-medium text-slate-700 leading-tight">
            ¿Tenés un <strong>reclamo</strong> o <strong>consulta</strong>? ¡Hablá con nuestro Bot!
          </p>
          <button
            onClick={() => setShowTooltip(false)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Cerrar sugerencia"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={onOpenBot}
        className="group relative flex items-center gap-3 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-xl shadow-emerald-900/30 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        aria-label="Abrir Bot de Reclamos y Consultas"
      >
        {/* Animated pulse ring */}
        <span className="absolute -inset-1 rounded-full bg-emerald-500/30 animate-pulse pointer-events-none" />

        <div className="relative flex items-center justify-center">
          <Bot className="w-6 h-6 sm:w-7 sm:h-7" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-300 rounded-full border-2 border-emerald-700" />
        </div>

        <div className="text-left hidden xs:block sm:block">
          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-200 block leading-none">
            Asistente Virtual
          </span>
          <span className="font-extrabold text-sm text-white leading-tight">
            Bot de Reclamos
          </span>
        </div>
      </button>
    </aside>
  );
};
