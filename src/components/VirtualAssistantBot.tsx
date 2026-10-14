import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight, 
  RotateCcw,
  ClipboardList,
  MapPin,
  Clock,
  PhoneCall,
  Lightbulb,
  Trash2,
  Construction
} from 'lucide-react';
import { generateTicketNumber } from '../utils/officeHours';
import { DELEGATION_ADDRESS, OFFICIAL_PHONE } from '../data/initialData';
import { ClaimSubmission, Neighborhood } from '../types';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  options?: { label: string; action: () => void }[];
  isTicket?: boolean;
  ticketData?: ClaimSubmission;
}

export const VirtualAssistantBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [claimDraft, setClaimDraft] = useState<Partial<ClaimSubmission>>({});
  const [claimStep, setClaimStep] = useState<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Initial welcome message
  useEffect(() => {
    resetToWelcome();
  }, []);

  const resetToWelcome = () => {
    setClaimStep(0);
    setClaimDraft({});
    setMessages([
      {
        id: '1',
        sender: 'bot',
        text: '¡Hola! Soy el asistente virtual de la Delegación Villa Garibaldi, Parque Sicardi e Ignacio Correas. ¿En qué puedo ayudarte hoy?',
        options: [
          { label: '📝 Registrar un reclamo o solicitud', action: () => startClaimFlow() },
          { label: '💡 Reclamo de Luminarias', action: () => startQuickClaim('Luminarias y alumbrado público') },
          { label: '🚜 Reclamo de Zanjeo / Pluviales', action: () => startQuickClaim('Zanjeo y desagües pluviales') },
          { label: '🌿 Recolección de Ramas / Poda', action: () => startQuickClaim('Recolección de ramas y poda') },
          { label: '🕒 Horarios y Dirección', action: () => showInfo('horarios') },
          { label: '🚨 Teléfonos de Emergencia', action: () => showInfo('telefonos') }
        ]
      }
    ]);
  };

  const addBotMessage = (text: string, options?: { label: string; action: () => void }[]) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString() + Math.random(),
        sender: 'bot',
        text,
        options
      }
    ]);
  };

  const addUserMessage = (text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString() + Math.random(),
        sender: 'user',
        text
      }
    ]);
  };

  const showInfo = (type: 'horarios' | 'telefonos') => {
    if (type === 'horarios') {
      addUserMessage('¿Cuáles son los horarios y dónde queda la delegación?');
      setTimeout(() => {
        addBotMessage(
          `📍 Ubicación: ${DELEGATION_ADDRESS}.\n\n⏰ Horarios de Atención:\n• Lunes a viernes: 8:00 a 17:00 hs.\n• Sábados: 8:00 a 13:00 hs.\n• Domingos: Cerrado.\n\n📞 Teléfono: ${OFFICIAL_PHONE}`,
          [
            { label: '📝 Iniciar un reclamo ahora', action: () => startClaimFlow() },
            { label: '⬅️ Volver al menú principal', action: () => resetToWelcome() }
          ]
        );
      }, 300);
    } else {
      addUserMessage('¿Cuáles son las líneas de emergencia?');
      setTimeout(() => {
        addBotMessage(
          `🚨 Líneas gratuitas de emergencia en La Plata:\n• 147: Atención y Reclamos MLP (24 hs)\n• 107: SAME Emergencias Médicas\n• 103: Defensa Civil La Plata\n• 100: Bomberos de La Plata\n• 911: Policía Bonaerense`,
          [
            { label: '📝 Iniciar un reclamo en la Delegación', action: () => startClaimFlow() },
            { label: '⬅️ Volver al menú principal', action: () => resetToWelcome() }
          ]
        );
      }, 300);
    }
  };

  const startClaimFlow = () => {
    addUserMessage('Deseo iniciar un reclamo vecinal');
    setClaimStep(1);
    setTimeout(() => {
      addBotMessage(
        'Seleccioná el motivo principal de tu reclamo:',
        [
          { label: '💡 Alumbrado / Luminarias LED', action: () => handleSelectClaimType('Luminarias y alumbrado público') },
          { label: '🚜 Zanjeo y desagües pluviales', action: () => handleSelectClaimType('Zanjeo y desagües pluviales') },
          { label: '🌿 Recolección de ramas y restos de poda', action: () => handleSelectClaimType('Recolección de ramas y poda') },
          { label: '🧹 Limpieza urbana y barrido', action: () => handleSelectClaimType('Limpieza urbana y residuos') },
          { label: '🚧 Calles y bacheo', action: () => handleSelectClaimType('Calles, bacheo y mantenimiento vial') },
          { label: '📄 Otro requerimiento', action: () => handleSelectClaimType('Otro requerimiento comunal') }
        ]
      );
    }, 300);
  };

  const startQuickClaim = (type: string) => {
    addUserMessage(`Quiero reportar: ${type}`);
    handleSelectClaimType(type);
  };

  const handleSelectClaimType = (type: string) => {
    setClaimDraft((prev) => ({ ...prev, claimType: type }));
    setClaimStep(2);
    setTimeout(() => {
      addBotMessage(
        `Registrado: "${type}".\n¿En qué barrio o localidad se ubica?`,
        [
          { label: 'Villa Garibaldi', action: () => handleSelectNeighborhood('Villa Garibaldi') },
          { label: 'Parque Sicardi', action: () => handleSelectNeighborhood('Parque Sicardi') },
          { label: 'Ignacio Correas', action: () => handleSelectNeighborhood('Ignacio Correas') }
        ]
      );
    }, 250);
  };

  const handleSelectNeighborhood = (nh: Neighborhood) => {
    addUserMessage(nh);
    setClaimDraft((prev) => ({ ...prev, neighborhood: nh }));
    setClaimStep(3);
    setTimeout(() => {
      addBotMessage('Por favor, escribí en el chat la dirección del problema (calle y número o entrecalles):');
    }, 250);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    addUserMessage(userText);
    setInputText('');

    // Handle interactive claim flow states
    if (claimStep === 3) {
      // Address step
      setClaimDraft((prev) => ({ ...prev, address: userText }));
      setClaimStep(4);
      setTimeout(() => {
        addBotMessage('Perfecto. Ahora ingresá tu Nombre y Apellido:');
      }, 300);
      return;
    }

    if (claimStep === 4) {
      // Full Name step
      setClaimDraft((prev) => ({ ...prev, fullName: userText }));
      setClaimStep(5);
      setTimeout(() => {
        addBotMessage('Ingresá tu teléfono de contacto (ej: 221 441-1234):');
      }, 300);
      return;
    }

    if (claimStep === 5) {
      // Phone step
      setClaimDraft((prev) => ({ ...prev, phone: userText }));
      setClaimStep(6);
      setTimeout(() => {
        addBotMessage('Por último, escribí una breve descripción del problema (qué sucede exactamente):');
      }, 300);
      return;
    }

    if (claimStep === 6) {
      // Description step -> Finish claim
      const finalClaim: ClaimSubmission = {
        id: Date.now().toString(),
        ticketNumber: generateTicketNumber(),
        fullName: claimDraft.fullName || 'Vecino/a',
        phone: claimDraft.phone || '-',
        neighborhood: (claimDraft.neighborhood as Neighborhood) || 'Parque Sicardi',
        address: claimDraft.address || 'Sin especificar',
        claimType: claimDraft.claimType || 'Requerimiento barrial',
        description: userText,
        status: 'Recibido',
        createdAt: new Date().toLocaleDateString('es-AR', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      // Save to localStorage
      try {
        const stored = localStorage.getItem('delegacion_reclamos');
        const list = stored ? JSON.parse(stored) : [];
        const updated = [finalClaim, ...list];
        localStorage.setItem('delegacion_reclamos', JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }

      setClaimStep(0);
      setClaimDraft({});

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: 'bot',
            text: `✅ ¡Tu reclamo ha sido asentado exitosamente en el sistema de la Delegación!\n\n📋 N° de Ticket: ${finalClaim.ticketNumber}\n📍 Barrio: ${finalClaim.neighborhood}\n📌 Dirección: ${finalClaim.address}\n🛠️ Motivo: ${finalClaim.claimType}`,
            isTicket: true,
            ticketData: finalClaim,
            options: [
              { label: '📝 Hacer otro reclamo', action: () => startClaimFlow() },
              { label: '🏠 Menú principal', action: () => resetToWelcome() }
            ]
          }
        ]);
      }, 400);
      return;
    }

    // Free text handling
    const lower = userText.toLowerCase();
    setTimeout(() => {
      if (lower.includes('horario') || lower.includes('hora') || lower.includes('abierto') || lower.includes('cuando')) {
        addBotMessage(
          `La Delegación atiende de Lunes a Viernes de 8:00 a 17:00 hs y Sábados de 8:00 a 13:00 hs en ${DELEGATION_ADDRESS}.`,
          [{ label: '📝 Iniciar un reclamo', action: () => startClaimFlow() }]
        );
      } else if (lower.includes('donde') || lower.includes('direccion') || lower.includes('queda') || lower.includes('ubicacion')) {
        addBotMessage(
          `La sede de la Delegación está ubicada en Calle 659 entre 12 y 13, Parque Sicardi, La Plata.`,
          [{ label: '📝 Iniciar un reclamo', action: () => startClaimFlow() }]
        );
      } else if (lower.includes('telefono') || lower.includes('llamar') || lower.includes('numero')) {
        addBotMessage(
          `El conmutador telefónico de la Delegación es: (0221) 441-6910. Además, podés llamar al 147 las 24 horas para reclamos municipales directos.`,
          [{ label: '📝 Iniciar reclamo online', action: () => startClaimFlow() }]
        );
      } else if (lower.includes('reclamo') || lower.includes('solicitud') || lower.includes('denuncia') || lower.includes('queja') || lower.includes('luz') || lower.includes('rama') || lower.includes('zanja')) {
        addBotMessage(
          'Puedo ayudarte a registrar tu reclamo ahora mismo paso a paso para que tengas tu número de constancia.',
          [{ label: 'Comenzar registro ahora', action: () => startClaimFlow() }]
        );
      } else {
        addBotMessage(
          'Entendido. Para gestionar tu consulta o reclamo de la manera más rápida, podés elegir una de estas opciones:',
          [
            { label: '📝 Iniciar un reclamo guiado', action: () => startClaimFlow() },
            { label: '🕒 Consultar horarios y sede', action: () => showInfo('horarios') },
            { label: '🚨 Teléfonos de emergencia', action: () => showInfo('telefonos') }
          ]
        );
      }
    }, 400);
  };

  return (
    <aside aria-label="Asistente Virtual de Reclamos" className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Bot Chat Window */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[400px] h-[520px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col mb-3 animate-in slide-in-from-bottom duration-200">
          
          {/* Header */}
          <div className="bg-[#0f382a] text-white p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center">
                <Bot className="w-6 h-6 text-emerald-300" />
              </div>
              <div>
                <h3 className="text-sm font-bold leading-tight">Asistente de la Delegación</h3>
                <span className="text-[11px] text-emerald-300 flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Atención de Reclamos y Consultas
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={resetToWelcome}
                title="Reiniciar conversación"
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Cerrar chat"
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/60 text-xs sm:text-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-emerald-700 text-white rounded-br-xs shadow-xs'
                      : 'bg-white text-slate-800 rounded-bl-xs border border-slate-200/80 shadow-xs'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Optional Action Pills */}
                {msg.options && (
                  <div className="mt-2 flex flex-col gap-1.5 w-full max-w-[90%]">
                    {msg.options.map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={opt.action}
                        className="text-left px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-200 hover:border-emerald-400 text-xs font-semibold text-emerald-900 shadow-2xs transition-all cursor-pointer flex items-center justify-between group"
                      >
                        <span>{opt.label}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-emerald-600 transition-transform group-hover:translate-x-0.5" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Escribí tu consulta o mensaje..."
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-xs sm:text-sm bg-white"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white disabled:opacity-40 transition-colors cursor-pointer"
              aria-label="Enviar mensaje"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

      {/* Floating Action Button for Bot */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white shadow-xl shadow-emerald-950/25 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        aria-label="Abrir Asistente Virtual de Reclamos y Consultas"
      >
        <div className="relative">
          <Bot className="w-6 h-6 text-white" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-300 ring-2 ring-emerald-900 animate-pulse" />
        </div>
        <span className="font-bold text-sm tracking-wide">
          Bot de Reclamos y Consultas
        </span>
      </button>
    </aside>
  );
};
