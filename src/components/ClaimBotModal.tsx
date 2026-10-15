import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Phone, 
  AlertCircle, 
  Copy, 
  Check, 
  RotateCcw, 
  ChevronRight,
  FileText,
  Lightbulb,
  Trees,
  Construction,
  Trash2,
  HelpCircle,
  Search
} from 'lucide-react';
import { CLAIM_TYPES, DELEGATION_ADDRESS, OFFICIAL_PHONE, EMERGENCY_NUMBERS } from '../data/initialData';
import { ClaimSubmission, Neighborhood } from '../types';
import { generateTicketNumber } from '../utils/officeHours';
import { addStoredClaim, getStoredClaims } from '../utils/claimsStorage';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  options?: Array<{ label: string; action: () => void; icon?: React.ReactNode }>;
  claimTicket?: string;
  timestamp: string;
}

interface ClaimBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimCreated?: (claim: ClaimSubmission) => void;
}

type WizardStep = 
  | 'idle' 
  | 'claim_type' 
  | 'neighborhood' 
  | 'address' 
  | 'description' 
  | 'fullName' 
  | 'phone' 
  | 'claim_created'
  | 'search_ticket';

export const ClaimBotModal: React.FC<ClaimBotModalProps> = ({
  isOpen,
  onClose,
  onClaimCreated
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [wizardStep, setWizardStep] = useState<WizardStep>('idle');
  const [copiedTicket, setCopiedTicket] = useState<string | null>(null);

  // Temporary claim draft state
  const [draftClaim, setDraftClaim] = useState<{
    claimType?: string;
    neighborhood?: Neighborhood;
    address?: string;
    description?: string;
    fullName?: string;
    phone?: string;
  }>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      if (messages.length === 0) {
        initWelcomeMessage();
      }
      setTimeout(() => {
        inputRef.current?.focus();
        scrollToBottom();
      }, 200);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initWelcomeMessage = () => {
    const welcomeMsg: Message = {
      id: 'welcome',
      sender: 'bot',
      text: '¡Hola! 👋 Soy el Bot de Atención Vecinal de la Delegación Municipal (Villa Garibaldi, Parque Sicardi e Ignacio Correas).\n\nEstoy acá para ayudarte a registrar reclamos, consultar información de servicios o conocer el estado de tus gestiones.',
      timestamp: getCurrentTime(),
      options: [
        {
          label: '📝 Hacer un nuevo reclamo',
          action: () => startClaimWizard()
        },
        {
          label: '🔍 Consultar estado de un ticket',
          action: () => startTicketLookup()
        },
        {
          label: '📍 Horarios y ubicación física',
          action: () => sendBotInfo('horarios_ubicacion')
        },
        {
          label: '💡 Luminarias y Alumbrado',
          action: () => sendBotInfo('luminarias')
        },
        {
          label: '🌿 Recolección de Ramas',
          action: () => sendBotInfo('ramas')
        },
        {
          label: '🚜 Zanjeo y Calles',
          action: () => sendBotInfo('zanjeo')
        },
        {
          label: '🚨 Teléfonos de Emergencia',
          action: () => sendBotInfo('emergencias')
        }
      ]
    };
    setMessages([welcomeMsg]);
    setWizardStep('idle');
  };

  // --- BOT INFORMATION RESPONSES ---
  const sendBotInfo = (topic: string) => {
    let replyText = '';
    switch (topic) {
      case 'horarios_ubicacion':
        replyText = `📍 **Sede de la Delegación:**\n${DELEGATION_ADDRESS}.\n\n🕒 **Horarios de atención presencial:**\n• Lunes a viernes: 8:00 a 17:00 hs.\n• Sábados: 8:00 a 13:00 hs.\n• Domingos: Cerrado.\n\n📞 Teléfono fijo conmutador: ${OFFICIAL_PHONE}`;
        break;
      case 'luminarias':
        replyText = `💡 **Alumbrado Público:**\nSe coordinan cuadrillas periódicas para el recambio de artefactos antiguos por luminarias LED y la reparación de cables y fotocélulas.\n\n¿Tenés una luminaria rota o apagada en tu cuadra?`;
        break;
      case 'ramas':
        replyText = `🌿 **Recolección de Ramas y Restos de Poda:**\nLa Delegación recorre con camiones volcadores y almejas los diferentes sectores de Villa Garibaldi, Sicardi y Correas.\n\n💡 **Recomendación vecinal:** Se solicita sacar las ramas atadas en atados manejables o en bolsas resistentes para no obstruir zanjas ni cruces de calles.`;
        break;
      case 'zanjeo':
        replyText = `🚜 **Zanjeo y Mantenimiento Vial:**\nSe trabaja de forma continua en apertura y limpieza de cunetas para garantizar el escurrimiento pluvial hacia canales principales, así como en perfilado y colocación de caños en cruces de calles.`;
        break;
      case 'emergencias':
        replyText = `🚨 **Teléfonos útiles de La Plata:**\n• 147: Atención al Vecino (Línea Única de reclamos)\n• 107: SAME Emergencias Médicas\n• 103: Defensa Civil (Alertas de tormenta)\n• 100: Bomberos\n• 911: Policía Bonaerense\n• (0221) 441-6910: Delegación Municipal`;
        break;
      default:
        replyText = '¿En qué más te puedo orientar? Podés ingresar un reclamo o consultarme lo que necesites.';
    }

    const infoMsg: Message = {
      id: Date.now().toString(),
      sender: 'bot',
      text: replyText,
      timestamp: getCurrentTime(),
      options: [
        {
          label: '📝 Registrar reclamo ahora',
          action: () => startClaimWizard()
        },
        {
          label: '↩️ Volver al menú principal',
          action: () => initWelcomeMessage()
        }
      ]
    };

    setMessages((prev) => [...prev, infoMsg]);
  };

  // --- CLAIM WIZARD STEPS ---
  const startClaimWizard = () => {
    setDraftClaim({});
    setWizardStep('claim_type');

    const promptMsg: Message = {
      id: Date.now().toString(),
      sender: 'bot',
      text: 'Paso 1 de 5: ¿Qué tipo de reclamo o requerimiento deseás realizar?',
      timestamp: getCurrentTime(),
      options: CLAIM_TYPES.slice(0, 6).map((type) => ({
        label: type,
        action: () => handleSelectClaimType(type)
      }))
    };

    setMessages((prev) => [...prev, promptMsg]);
  };

  const handleSelectClaimType = (type: string) => {
    setDraftClaim((prev) => ({ ...prev, claimType: type }));
    setWizardStep('neighborhood');

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: type,
      timestamp: getCurrentTime()
    };

    const nextMsg: Message = {
      id: `bot-${Date.now() + 1}`,
      sender: 'bot',
      text: `Paso 2 de 5: Seleccioná en qué barrio o localidad se ubica:`,
      timestamp: getCurrentTime(),
      options: (['Villa Garibaldi', 'Parque Sicardi', 'Ignacio Correas'] as Neighborhood[]).map((barrio) => ({
        label: barrio,
        action: () => handleSelectNeighborhood(barrio)
      }))
    };

    setMessages((prev) => [...prev, userMsg, nextMsg]);
  };

  const handleSelectNeighborhood = (barrio: Neighborhood) => {
    setDraftClaim((prev) => ({ ...prev, neighborhood: barrio }));
    setWizardStep('address');

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: barrio,
      timestamp: getCurrentTime()
    };

    const nextMsg: Message = {
      id: `bot-${Date.now() + 1}`,
      sender: 'bot',
      text: `Paso 3 de 5: Por favor, escribí la dirección exacta o entrecalles del reclamo (ej: Calle 659 e/ 12 y 13):`,
      timestamp: getCurrentTime()
    };

    setMessages((prev) => [...prev, userMsg, nextMsg]);
  };

  const startTicketLookup = () => {
    setWizardStep('search_ticket');
    const msg: Message = {
      id: Date.now().toString(),
      sender: 'bot',
      text: 'Por favor, ingresá el número de ticket que querés consultar (ej: REC-2026-4821):',
      timestamp: getCurrentTime()
    };
    setMessages((prev) => [...prev, msg]);
  };

  // --- FREE FORM / TEXT INPUT SUBMISSION ---
  const handleSendInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const text = inputText.trim();
    setInputText('');

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: getCurrentTime()
    };

    setMessages((prev) => [...prev, userMsg]);

    // Handle wizard steps driven by user typing
    if (wizardStep === 'address') {
      setDraftClaim((prev) => ({ ...prev, address: text }));
      setWizardStep('description');
      setTimeout(() => {
        const nextMsg: Message = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: 'Paso 4 de 5: Describí brevemente cuál es el problema (ej: luminaria parpadea hace dos semanas, rama de gran porte caída sobre calzada):',
          timestamp: getCurrentTime()
        };
        setMessages((prev) => [...prev, nextMsg]);
      }, 300);
      return;
    }

    if (wizardStep === 'description') {
      setDraftClaim((prev) => ({ ...prev, description: text }));
      setWizardStep('fullName');
      setTimeout(() => {
        const nextMsg: Message = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: 'Paso 5 de 5: Ingresá tu nombre y apellido para asentar la solicitud:',
          timestamp: getCurrentTime()
        };
        setMessages((prev) => [...prev, nextMsg]);
      }, 300);
      return;
    }

    if (wizardStep === 'fullName') {
      setDraftClaim((prev) => ({ ...prev, fullName: text }));
      setWizardStep('phone');
      setTimeout(() => {
        const nextMsg: Message = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: 'Por último, ingresá un teléfono de contacto (ej: 221 441-1234) por si la cuadrilla necesita comunicarse:',
          timestamp: getCurrentTime()
        };
        setMessages((prev) => [...prev, nextMsg]);
      }, 300);
      return;
    }

    if (wizardStep === 'phone') {
      const finalClaim: ClaimSubmission = {
        id: Date.now().toString(),
        ticketNumber: generateTicketNumber(),
        fullName: draftClaim.fullName || 'Vecino',
        phone: text,
        neighborhood: draftClaim.neighborhood || 'Parque Sicardi',
        address: draftClaim.address || 'Sin especificar',
        claimType: draftClaim.claimType || 'Otro requerimiento comunal',
        description: draftClaim.description || 'Sin detalle',
        status: 'Recibido',
        createdAt: new Date().toLocaleDateString('es-AR', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      // Save safely to storage
      addStoredClaim(finalClaim);

      if (onClaimCreated) {
        onClaimCreated(finalClaim);
      }

      setWizardStep('claim_created');

      setTimeout(() => {
        const successMsg: Message = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          claimTicket: finalClaim.ticketNumber,
          text: `✅ **¡Reclamo registrado exitosamente!**\n\n🎫 **N° de Constancia:** ${finalClaim.ticketNumber}\n• Barrio: ${finalClaim.neighborhood}\n• Dirección: ${finalClaim.address}\n• Tipo: ${finalClaim.claimType}\n• Estado inicial: Recibido\n\nTu solicitud quedó registrada en el libro oficial de reclamos de la Delegación y será asignada a la cuadrilla correspondiente.`,
          timestamp: getCurrentTime(),
          options: [
            {
              label: 'Copiar número de constancia',
              action: () => copyTicket(finalClaim.ticketNumber)
            },
            {
              label: '📝 Hacer otro reclamo',
              action: () => startClaimWizard()
            },
            {
              label: '🏠 Volver al inicio del Bot',
              action: () => initWelcomeMessage()
            }
          ]
        };
        setMessages((prev) => [...prev, successMsg]);
      }, 400);
      return;
    }

    if (wizardStep === 'search_ticket') {
      try {
        const list = getStoredClaims();
        const found = list.find((item) => 
          item.ticketNumber.toUpperCase() === text.toUpperCase() ||
          item.ticketNumber.replace(/-/g, '').toUpperCase() === text.replace(/-/g, '').toUpperCase()
        );

        setTimeout(() => {
          if (found) {
            const foundMsg: Message = {
              id: `bot-${Date.now()}`,
              sender: 'bot',
              text: `🔍 **Resultado encontrado:**\n\n🎫 **Ticket:** ${found.ticketNumber}\n• **Estado:** ${found.status}\n• **Vecino:** ${found.fullName}\n• **Tipo:** ${found.claimType}\n• **Barrio:** ${found.neighborhood} (${found.address})\n• **Fecha de ingreso:** ${found.createdAt}\n\nLa cuadrilla municipal tiene el ticket en seguimiento.`,
              timestamp: getCurrentTime(),
              options: [
                {
                  label: '🔍 Buscar otro ticket',
                  action: () => startTicketLookup()
                },
                {
                  label: '🏠 Volver al inicio',
                  action: () => initWelcomeMessage()
                }
              ]
            };
            setMessages((prev) => [...prev, foundMsg]);
          } else {
            const notFoundMsg: Message = {
              id: `bot-${Date.now()}`,
              sender: 'bot',
              text: `No se encontró un reclamo con el ticket "${text}" en este dispositivo.\n\nVerificá que el número esté bien escrito (ej: REC-2026-4821) o podés registrar tu solicitud directamente.`,
              timestamp: getCurrentTime(),
              options: [
                {
                  label: '📝 Registrar nuevo reclamo',
                  action: () => startClaimWizard()
                },
                {
                  label: '🏠 Volver al inicio',
                  action: () => initWelcomeMessage()
                }
              ]
            };
            setMessages((prev) => [...prev, notFoundMsg]);
          }
          setWizardStep('idle');
        }, 300);
      } catch (e) {
        setWizardStep('idle');
      }
      return;
    }

    // Natural Language Keyword Matching
    const lower = text.toLowerCase();
    setTimeout(() => {
      let reply = '';
      if (lower.includes('luz') || lower.includes('luminaria') || lower.includes('foco') || lower.includes('farol')) {
        reply = `💡 Para problemas de luminarias o focos apagados, podés registrar un reclamo ahora mismo con la dirección y entrecalles para que la cuadrilla de alumbrado lo programe.`;
      } else if (lower.includes('rama') || lower.includes('poda') || lower.includes('arbol') || lower.includes('árbol')) {
        reply = `🌿 Para recolección de ramas y restos de poda, disponemos de camiones volcadores. Te sugerimos colocarlas atadas en la vereda.`;
      } else if (lower.includes('zanja') || lower.includes('agua') || lower.includes('tubo') || lower.includes('caño') || lower.includes('inund')) {
        reply = `🚜 En cuanto al zanjeo y obras pluviales, la Delegación realiza perfilados y limpieza continua de zanjas.`;
      } else if (lower.includes('horario') || lower.includes('cuando') || lower.includes('abierto') || lower.includes('abre')) {
        reply = `🕒 La Delegación atiende de Lunes a Viernes de 8:00 a 17:00 hs y Sábados de 8:00 a 13:00 hs en Calle 659 e/ 12 y 13.`;
      } else if (lower.includes('donde') || lower.includes('direcci') || lower.includes('queda') || lower.includes('ubicac')) {
        reply = `📍 Estamos en Calle 659 entre 12 y 13, Parque Sicardi, partido de La Plata.`;
      } else if (lower.includes('tel') || lower.includes('llama') || lower.includes('numero') || lower.includes('número')) {
        reply = `📞 El teléfono de la Delegación es ${OFFICIAL_PHONE}. Para reclamos centrales del Municipio podés marcar la línea gratuita 147.`;
      } else {
        reply = `Entendido. Para avanzar de la manera más rápida, ¿deseás registrar un reclamo oficial para que la Delegación lo atienda o preferís consultar información?`;
      }

      const botReply: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: reply,
        timestamp: getCurrentTime(),
        options: [
          {
            label: '📝 Iniciar un Reclamo',
            action: () => startClaimWizard()
          },
          {
            label: '📍 Horarios y Dirección',
            action: () => sendBotInfo('horarios_ubicacion')
          },
          {
            label: '🏠 Menú Principal',
            action: () => initWelcomeMessage()
          }
        ]
      };
      setMessages((prev) => [...prev, botReply]);
    }, 400);
  };

  const copyTicket = (ticket: string) => {
    navigator.clipboard.writeText(ticket);
    setCopiedTicket(ticket);
    setTimeout(() => setCopiedTicket(null), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col h-[90vh] sm:h-[680px] overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#0f382a] text-white p-4 sm:p-5 flex items-center justify-between shadow-md shrink-0 border-b border-emerald-900">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-emerald-600 border border-emerald-400 flex items-center justify-center text-white shadow-inner">
                <Bot className="w-6 h-6" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-[#0f382a] rounded-full animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-base leading-tight">
                  Bot de Reclamos y Consultas
                </h3>
              </div>
              <p className="text-xs text-emerald-200 font-medium">
                Delegación Villa Garibaldi · Sicardi · Correas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={initWelcomeMessage}
              title="Reiniciar conversación"
              className="p-2 rounded-xl text-emerald-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              title="Cerrar Bot"
              className="p-2 rounded-xl text-emerald-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-slate-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-in fade-in duration-200`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-emerald-700 text-white rounded-br-xs shadow-xs'
                    : 'bg-white text-slate-800 rounded-bl-xs border border-slate-200 shadow-xs'
                }`}
              >
                <div className="whitespace-pre-line space-y-2">{msg.text}</div>

                {/* Optional Ticket Copy Pill */}
                {msg.claimTicket && (
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="font-mono font-bold text-emerald-800 text-xs bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      {msg.claimTicket}
                    </span>
                    <button
                      onClick={() => copyTicket(msg.claimTicket!)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
                    >
                      {copiedTicket === msg.claimTicket ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Timestamp */}
              <span className="text-[10px] text-slate-400 mt-1 px-1">
                {msg.timestamp}
              </span>

              {/* Interactive Quick Options / Buttons */}
              {msg.options && msg.options.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[90%]">
                  {msg.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={opt.action}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 hover:border-emerald-400 shadow-2xs transition-all text-left cursor-pointer active:scale-98"
                    >
                      {opt.icon}
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSendInput}
          className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              wizardStep === 'address'
                ? 'Ingresá tu calle o entrecalles...'
                : wizardStep === 'description'
                ? 'Describí brevemente el inconveniente...'
                : wizardStep === 'fullName'
                ? 'Ingresá tu nombre y apellido...'
                : wizardStep === 'phone'
                ? 'Ingresá tu teléfono de contacto...'
                : wizardStep === 'search_ticket'
                ? 'Ingresá el N° de ticket (REC-2026-...)'
                : 'Escribí tu consulta o reclamo aquí...'
            }
            className="flex-1 px-4 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm bg-slate-50 focus:bg-white transition-colors"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-semibold transition-all cursor-pointer shadow-sm shadow-emerald-700/20"
            aria-label="Enviar mensaje"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

      </div>
    </div>
  );
};
