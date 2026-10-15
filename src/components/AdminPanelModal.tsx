import React, { useState, useEffect } from 'react';
import { 
  X, 
  Lock, 
  Unlock, 
  KeyRound, 
  ClipboardList, 
  Newspaper, 
  Search, 
  Filter, 
  CheckCircle, 
  Clock, 
  Trash2, 
  Plus, 
  Eye, 
  Phone, 
  MapPin, 
  Download, 
  RotateCcw, 
  AlertCircle,
  Tag,
  Check,
  Calendar,
  User,
  Shield
} from 'lucide-react';
import { ClaimSubmission, NewsArticle, Neighborhood, ClaimStatus } from '../types';
import { INITIAL_NEWS } from '../data/initialData';
import { getStoredClaims, deleteStoredClaim, updateStoredClaimStatus } from '../utils/claimsStorage';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewsUpdated?: () => void;
}

const ACCESS_PIN = '1422';

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  onNewsUpdated
}) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Active tab: 'claims' | 'news'
  const [activeTab, setActiveTab] = useState<'claims' | 'news'>('claims');

  // Delete confirmations (no window.confirm in iframe)
  const [confirmDeleteNewsId, setConfirmDeleteNewsId] = useState<string | null>(null);
  const [confirmDeleteClaimId, setConfirmDeleteClaimId] = useState<string | null>(null);

  // Claims state
  const [claims, setClaims] = useState<ClaimSubmission[]>([]);
  const [claimSearch, setClaimSearch] = useState('');
  const [claimBarrioFilter, setClaimBarrioFilter] = useState('Todos');
  const [claimStatusFilter, setClaimStatusFilter] = useState('Todos');
  const [selectedClaim, setSelectedClaim] = useState<ClaimSubmission | null>(null);

  // News state
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isAddingNews, setIsAddingNews] = useState(false);
  const [newsTitle, setNewsTitle] = useState('');
  const [newsSummary, setNewsSummary] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsNeighborhood, setNewsNeighborhood] = useState<Neighborhood | 'Todas las localidades'>('Todas las localidades');
  const [newsTag, setNewsTag] = useState('Servicios Urbanos');
  const [newsImageUrl, setNewsImageUrl] = useState('/luminarias led.jpg');
  const [newsErrorMsg, setNewsErrorMsg] = useState('');

  // Municipal preset images available in the project
  const municipalImages = [
    { label: 'Vacunación y Salud', url: '/vacunacion.jpg' },
    { label: 'Luminarias LED', url: '/luminarias led.jpg' },
    { label: 'Zanjeo y Cunetas', url: '/zanqueo.jpg' },
    { label: 'Limpieza Urbana', url: '/limpieza.jpg' },
    { label: 'Recolección de Ramas', url: '/ramas2.jpg' },
    { label: 'Obras y Bacheo', url: '/bacheo5.jpg' },
    { label: 'Tubos y Desagües', url: '/tubos.jpeg' },
    { label: 'Institucional', url: '/logo.jpg' }
  ];

  // Load claims and news, and sync automatically on updates
  useEffect(() => {
    if (isOpen) {
      loadData();
    }
    const handleClaimsUpdated = () => {
      setClaims(getStoredClaims());
    };
    window.addEventListener('delegacion_reclamos_updated', handleClaimsUpdated);
    window.addEventListener('storage', handleClaimsUpdated);
    return () => {
      window.removeEventListener('delegacion_reclamos_updated', handleClaimsUpdated);
      window.removeEventListener('storage', handleClaimsUpdated);
    };
  }, [isOpen]);

  const loadData = () => {
    try {
      const currentClaims = getStoredClaims();
      setClaims(currentClaims);
    } catch (e) {
      console.error(e);
      setClaims([]);
    }

    try {
      const storedNews = localStorage.getItem('delegacion_noticias');
      if (storedNews) {
        setNews(JSON.parse(storedNews));
      } else {
        setNews(INITIAL_NEWS);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === ACCESS_PIN) {
      setIsAuthenticated(true);
      setPinError('');
      setPinInput('');
      loadData();
    } else {
      setPinError('Código incorrecto. Verificá los 4 dígitos ingresados.');
    }
  };

  // Claim status update
  const handleUpdateClaimStatus = (id: string, newStatus: ClaimStatus) => {
    const updated = updateStoredClaimStatus(id, newStatus);
    setClaims(updated);
    if (selectedClaim && selectedClaim.id === id) {
      setSelectedClaim({ ...selectedClaim, status: newStatus });
    }
  };

  // Claim delete: only disappears when deleted by the admin (no window.confirm, inline confirmation)
  const handleDeleteClaim = (id: string) => {
    const updated = deleteStoredClaim(id);
    setClaims(updated);
    setConfirmDeleteClaimId(null);
    if (selectedClaim && selectedClaim.id === id) {
      setSelectedClaim(null);
    }
  };

  // Export claims to CSV
  const handleExportCSV = () => {
    if (claims.length === 0) return;
    const headers = ['Ticket', 'Fecha', 'Vecino', 'Telefono', 'Barrio', 'Direccion', 'Tipo', 'Estado', 'Descripcion'];
    const rows = claims.map(c => [
      c.ticketNumber,
      `"${c.createdAt}"`,
      `"${c.fullName.replace(/"/g, '""')}"`,
      `"${c.phone}"`,
      `"${c.neighborhood}"`,
      `"${c.address.replace(/"/g, '""')}"`,
      `"${c.claimType}"`,
      `"${c.status}"`,
      `"${c.description.replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reclamos_delegacion_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // News save
  const handleSaveNews = (e: React.FormEvent) => {
    e.preventDefault();
    setNewsErrorMsg('');

    if (!newsTitle.trim() || !newsSummary.trim() || !newsContent.trim()) {
      setNewsErrorMsg('Por favor completá el título, resumen y desarrollo de la noticia.');
      return;
    }

    const today = new Date().toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const newArticle: NewsArticle = {
      id: `noticia-${Date.now()}`,
      title: newsTitle.trim(),
      summary: newsSummary.trim(),
      content: newsContent.trim(),
      date: today,
      neighborhood: newsNeighborhood,
      tag: newsTag.trim() || 'Servicios Urbanos',
      imageUrl: newsImageUrl.trim() || '/luminarias led.jpg'
    };

    const updated = [newArticle, ...news];
    setNews(updated);
    try {
      localStorage.setItem('delegacion_noticias', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    // Reset form
    setNewsTitle('');
    setNewsSummary('');
    setNewsContent('');
    setIsAddingNews(false);

    if (onNewsUpdated) {
      onNewsUpdated();
    }
  };

  // News delete (no window.confirm, uses inline confirmation)
  const handleDeleteNews = (id: string) => {
    const updated = news.filter((n) => n.id !== id);
    setNews(updated);
    try {
      localStorage.setItem('delegacion_noticias', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    setConfirmDeleteNewsId(null);
    if (onNewsUpdated) {
      onNewsUpdated();
    }
  };

  // Reset defaults
  const handleResetDefaultNews = () => {
    setNews(INITIAL_NEWS);
    try {
      localStorage.setItem('delegacion_noticias', JSON.stringify(INITIAL_NEWS));
    } catch (e) {
      console.error(e);
    }
    if (onNewsUpdated) {
      onNewsUpdated();
    }
  };

  // Filtered claims
  const filteredClaims = claims.filter((c) => {
    const matchesSearch = 
      c.ticketNumber.toLowerCase().includes(claimSearch.toLowerCase()) ||
      c.fullName.toLowerCase().includes(claimSearch.toLowerCase()) ||
      c.address.toLowerCase().includes(claimSearch.toLowerCase()) ||
      c.phone.toLowerCase().includes(claimSearch.toLowerCase()) ||
      c.claimType.toLowerCase().includes(claimSearch.toLowerCase());

    const matchesBarrio = claimBarrioFilter === 'Todos' || c.neighborhood === claimBarrioFilter;
    const matchesStatus = claimStatusFilter === 'Todos' || c.status === claimStatusFilter;

    return matchesSearch && matchesBarrio && matchesStatus;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Top Header */}
        <div className="bg-[#0f382a] text-white p-4 sm:p-5 flex items-center justify-between shrink-0 border-b border-emerald-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 border border-emerald-400 flex items-center justify-center text-white shadow-inner">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-base sm:text-lg leading-tight">
                  Panel de Gestión Comunal
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-700 text-emerald-200 font-mono text-xs font-semibold">
                  Sede Sicardi · Garibaldi · Correas
                </span>
              </div>
              <p className="text-xs text-emerald-300">
                Administración de reclamos vecinales y noticias del sitio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={() => setIsAuthenticated(false)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-emerald-200 hover:text-white transition-colors cursor-pointer"
                title="Bloquear panel"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Bloquear</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-emerald-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Cerrar panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Lock Screen if NOT authenticated */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-14 flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 border-2 border-emerald-200 text-emerald-700 flex items-center justify-center shadow-sm">
              <KeyRound className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-2xl font-extrabold text-slate-900">
                Código de Ingreso
              </h4>
              <p className="text-sm text-slate-500 mt-1">
                Ingresá el código de seguridad de 4 dígitos para acceder al panel de la Delegación.
              </p>
            </div>

            {pinError && (
              <div className="w-full p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

            <form onSubmit={handlePinSubmit} className="w-full space-y-4">
              <input
                type="password"
                maxLength={4}
                autoFocus
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError('');
                }}
                placeholder="••••"
                className="w-full text-center text-3xl font-mono tracking-widest py-3.5 px-4 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent bg-slate-50 font-bold"
              />

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                <span>Ingresar al Panel</span>
              </button>
            </form>
          </div>
        ) : (
          /* Unlocked Admin Panel Body */
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
            {/* Tabs Header */}
            <div className="flex items-center justify-between px-6 pt-4 bg-white border-b border-slate-200 shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab('claims')}
                  className={`flex items-center gap-2 py-3 px-4 font-bold text-sm border-b-2 transition-all cursor-pointer ${
                    activeTab === 'claims'
                      ? 'border-emerald-600 text-emerald-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <ClipboardList className="w-4 h-4" />
                  <span>Reclamos y Pedidos ({claims.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('news')}
                  className={`flex items-center gap-2 py-3 px-4 font-bold text-sm border-b-2 transition-all cursor-pointer ${
                    activeTab === 'news'
                      ? 'border-emerald-600 text-emerald-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Newspaper className="w-4 h-4" />
                  <span>Noticias y Novedades ({news.length})</span>
                </button>
              </div>

              {activeTab === 'claims' && claims.length > 0 && (
                <button
                  onClick={handleExportCSV}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                  title="Descargar listado en Excel / CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Exportar CSV</span>
                </button>
              )}
            </div>

            {/* TAB 1: CLAIMS & REQUESTS */}
            {activeTab === 'claims' && (
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
                {/* Search & Filter Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white p-3.5 rounded-2xl border border-slate-200">
                  <div className="sm:col-span-6 relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Buscar por vecino, ticket, calle, teléfono..."
                      value={claimSearch}
                      onChange={(e) => setClaimSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-slate-50"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <select
                      value={claimBarrioFilter}
                      onChange={(e) => setClaimBarrioFilter(e.target.value)}
                      className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 cursor-pointer"
                    >
                      <option value="Todos">Todos los Barrios</option>
                      <option value="Villa Garibaldi">Villa Garibaldi</option>
                      <option value="Parque Sicardi">Parque Sicardi</option>
                      <option value="Ignacio Correas">Ignacio Correas</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <select
                      value={claimStatusFilter}
                      onChange={(e) => setClaimStatusFilter(e.target.value)}
                      className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700 cursor-pointer"
                    >
                      <option value="Todos">Todos los Estados</option>
                      <option value="Recibido">Recibido</option>
                      <option value="En Inspección">En Inspección</option>
                      <option value="En Cuadrilla">En Cuadrilla</option>
                      <option value="Solucionado">Solucionado</option>
                    </select>
                  </div>
                </div>

                {/* Claims Grid / List Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-1">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <span>Pedidos y Solicitudes Registradas</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                        {claims.length} {claims.length === 1 ? 'pedido' : 'pedidos'}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Listados verticalmente uno abajo del otro. Permanecen guardados hasta que decidas eliminarlos.
                    </p>
                  </div>
                  {(claimSearch || claimBarrioFilter !== 'Todos' || claimStatusFilter !== 'Todos') && (
                    <button
                      onClick={() => {
                        setClaimSearch('');
                        setClaimBarrioFilter('Todos');
                        setClaimStatusFilter('Todos');
                      }}
                      className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold hover:underline"
                    >
                      Limpiar filtros
                    </button>
                  )}
                </div>

                {/* Claims List - Vertical Stack */}
                {filteredClaims.length === 0 ? (
                  <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500">
                    <ClipboardList className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700">No se encontraron reclamos</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {claims.length === 0 
                        ? 'Aún no se registraron reclamos desde la web o el bot.' 
                        : 'No hay coincidencias con los filtros de búsqueda aplicados.'}
                    </p>
                    {claims.length > 0 && (
                      <button
                        onClick={() => {
                          setClaimSearch('');
                          setClaimBarrioFilter('Todos');
                          setClaimStatusFilter('Todos');
                        }}
                        className="mt-3 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                      >
                        Ver todos los {claims.length} pedidos
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredClaims.map((c, index) => (
                      <div
                        key={c.id}
                        className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-sm transition-all flex flex-col gap-3.5"
                      >
                        {/* Header Row: Index, Ticket, Category, Date */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                              #{index + 1}
                            </span>
                            <span className="font-mono font-extrabold text-emerald-900 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200 text-xs tracking-wider">
                              {c.ticketNumber}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-800">
                              {c.claimType}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-400 flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {c.createdAt}
                            </span>
                          </div>
                        </div>

                        {/* Neighbor & Location Info */}
                        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs">
                          <div className="flex items-center gap-1.5 font-bold text-slate-900">
                            <User className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{c.fullName}</span>
                          </div>
                          <a
                            href={`tel:${c.phone}`}
                            className="flex items-center gap-1.5 text-emerald-700 font-semibold hover:underline bg-emerald-50/60 px-2 py-0.5 rounded-lg border border-emerald-100"
                            title="Llamar al vecino"
                          >
                            <Phone className="w-3 h-3" />
                            <span>{c.phone}</span>
                          </a>
                          <div className="flex items-center gap-1.5 text-slate-700">
                            <MapPin className="w-3.5 h-3.5 text-rose-500" />
                            <span><strong className="text-slate-900">{c.neighborhood}</strong> · {c.address}</span>
                          </div>
                        </div>

                        {/* Description Box */}
                        <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200/80 leading-relaxed">
                          <span className="font-semibold text-slate-800 block text-[11px] uppercase tracking-wider mb-1 text-slate-500">
                            Detalle del pedido:
                          </span>
                          {c.description}
                        </div>

                        {/* Status Change & Actions Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                              Estado de gestión:
                            </span>
                            <select
                              value={c.status}
                              onChange={(e) => handleUpdateClaimStatus(c.id, e.target.value as ClaimStatus)}
                              className={`py-1 px-3 rounded-xl text-xs font-bold border cursor-pointer transition-colors ${
                                c.status === 'Solucionado'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : c.status === 'En Cuadrilla'
                                  ? 'bg-blue-50 text-blue-800 border-blue-300'
                                  : c.status === 'En Inspección'
                                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                                  : 'bg-slate-50 text-slate-700 border-slate-300'
                              }`}
                            >
                              <option value="Recibido">Recibido</option>
                              <option value="En Inspección">En Inspección</option>
                              <option value="En Cuadrilla">En Cuadrilla</option>
                              <option value="Solucionado">Solucionado</option>
                            </select>
                          </div>

                          <div className="flex items-center gap-2">
                            {confirmDeleteClaimId === c.id ? (
                              <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-xl animate-in fade-in">
                                <span className="text-[11px] font-bold text-rose-800 mr-1">¿Eliminar este pedido?</span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteClaim(c.id)}
                                  className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                                >
                                  Sí, borrar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteClaimId(null)}
                                  className="px-2 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
                                >
                                  Cancelar
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteClaimId(c.id)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                                title="Eliminar pedido permanentemente"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                <span>Borrar</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: NEWS MANAGEMENT */}
            {activeTab === 'news' && (
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
                {/* Header Action: Add News Button */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">
                      Noticias y Comunicados de la Delegación
                    </h4>
                    <p className="text-xs text-slate-500">
                      Publicá novedades en la portada o modificá las existentes sin editar código.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleResetDefaultNews}
                      className="px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-600 transition-colors cursor-pointer"
                      title="Volver a las noticias originales"
                    >
                      <RotateCcw className="w-3.5 h-3.5 inline mr-1" />
                      <span>Restablecer</span>
                    </button>

                    <button
                      onClick={() => setIsAddingNews(!isAddingNews)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      {isAddingNews ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      <span>{isAddingNews ? 'Cerrar formulario' : 'Subir Nueva Noticia'}</span>
                    </button>
                  </div>
                </div>

                {/* Add News Form Card */}
                {isAddingNews && (
                  <form onSubmit={handleSaveNews} className="bg-white p-6 rounded-3xl border border-emerald-300 shadow-md space-y-4 animate-in fade-in">
                    <h5 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2">
                      Nueva Publicación Comunitaria
                    </h5>

                    {newsErrorMsg && (
                      <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-medium flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{newsErrorMsg}</span>
                      </div>
                    )}

                    {/* Title */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Título de la noticia *
                      </label>
                      <input
                        type="text"
                        value={newsTitle}
                        onChange={(e) => setNewsTitle(e.target.value)}
                        placeholder="Ej: Operativo de vacunación y castración en Parque Sicardi"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs bg-slate-50 focus:bg-white"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Category / Tag */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Categoría / Etiqueta *
                        </label>
                        <select
                          value={newsTag}
                          onChange={(e) => setNewsTag(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50 cursor-pointer"
                        >
                          <option value="Salud Animal">Salud Animal / Zoonosis</option>
                          <option value="Luminarias">Luminarias LED</option>
                          <option value="Zanjas">Zanjeo y Pluviales</option>
                          <option value="Limpieza">Limpieza Urbana</option>
                          <option value="Ramas">Recolección de Ramas</option>
                          <option value="Calles y Obras">Calles y Obras</option>
                          <option value="Plazas">Plazas y Espacios Verdes</option>
                          <option value="Trámites">Trámites Municipales</option>
                        </select>
                      </div>

                      {/* Neighborhood */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Barrio o alcance
                        </label>
                        <select
                          value={newsNeighborhood}
                          onChange={(e) => setNewsNeighborhood(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50 cursor-pointer"
                        >
                          <option value="Todas las localidades">Todas las localidades</option>
                          <option value="Villa Garibaldi">Villa Garibaldi</option>
                          <option value="Parque Sicardi">Parque Sicardi</option>
                          <option value="Ignacio Correas">Ignacio Correas</option>
                        </select>
                      </div>
                    </div>

                    {/* Image Selector */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Seleccionar fotografía comunal
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                        {municipalImages.map((img) => (
                          <button
                            key={img.url}
                            type="button"
                            onClick={() => setNewsImageUrl(img.url)}
                            className={`p-2 rounded-xl border text-left flex items-center gap-2 cursor-pointer transition-all ${
                              newsImageUrl === img.url
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <img src={img.url} alt={img.label} className="w-7 h-7 rounded-lg object-cover" />
                            <span className="text-[11px] truncate">{img.label}</span>
                          </button>
                        ))}
                      </div>

                      <input
                        type="text"
                        value={newsImageUrl}
                        onChange={(e) => setNewsImageUrl(e.target.value)}
                        placeholder="O ingresá una URL directa de imagen..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50"
                      />
                    </div>

                    {/* Summary */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Resumen breve (se muestra en la tarjeta) *
                      </label>
                      <textarea
                        rows={2}
                        value={newsSummary}
                        onChange={(e) => setNewsSummary(e.target.value)}
                        placeholder="Breve introducción de 1 o 2 renglones..."
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:bg-white"
                        required
                      />
                    </div>

                    {/* Content */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Contenido y detalle completo *
                      </label>
                      <textarea
                        rows={4}
                        value={newsContent}
                        onChange={(e) => setNewsContent(e.target.value)}
                        placeholder="Describí los detalles, horarios, recomendaciones para el vecino..."
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:bg-white"
                        required
                      />
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingNews(false)}
                        className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>Publicar Noticia</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* Published News Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {news.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white p-4 rounded-2xl border border-slate-200 flex gap-3.5 items-start hover:border-slate-300 transition-colors"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-20 h-20 rounded-xl object-cover shrink-0 bg-slate-100"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                            {item.tag}
                          </span>
                          {confirmDeleteNewsId === item.id ? (
                            <div className="flex items-center gap-1 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded-lg">
                              <span className="text-[10px] font-bold text-rose-700">¿Borrar?</span>
                              <button
                                type="button"
                                onClick={() => handleDeleteNews(item.id)}
                                className="px-1.5 py-0.5 rounded bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold transition-colors cursor-pointer"
                              >
                                Sí
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteNewsId(null)}
                                className="px-1 py-0.5 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] font-medium transition-colors cursor-pointer"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteNewsId(item.id)}
                              className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Eliminar noticia"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <h6 className="font-bold text-slate-900 text-xs line-clamp-1">
                          {item.title}
                        </h6>
                        <p className="text-[11px] text-slate-500 line-clamp-2">
                          {item.summary}
                        </p>
                        <span className="text-[10px] text-slate-400 block">
                          {item.date} · {item.neighborhood}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
