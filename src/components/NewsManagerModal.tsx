import React, { useState } from 'react';
import { X, Plus, Trash2, Image, AlertCircle, Check } from 'lucide-react';
import { NewsArticle, Neighborhood } from '../types';

interface NewsManagerModalProps {
  newsList: NewsArticle[];
  onSaveNewArticle: (article: NewsArticle) => void;
  onDeleteArticle: (id: string) => void;
  onResetDefaults: () => void;
  onClose: () => void;
}

export const NewsManagerModal: React.FC<NewsManagerModalProps> = ({
  newsList,
  onSaveNewArticle,
  onDeleteArticle,
  onResetDefaults,
  onClose
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [neighborhood, setNeighborhood] = useState<Neighborhood | 'Todas las localidades'>('Todas las localidades');
  const [tag, setTag] = useState('Aviso Comunitario');
  const [imageUrl, setImageUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const imagePresets = [
    { label: 'Obras y Vialidad', url: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=800&q=80' },
    { label: 'Zoonosis y Animales', url: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80' },
    { label: 'Servicios Urbanos', url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80' },
    { label: 'Trámites y Dominial', url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80' },
    { label: 'Plazas y Parques', url: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=800&q=80' }
  ];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim() || !summary.trim() || !content.trim()) {
      setErrorMsg('Por favor completá el título, resumen y desarrollo de la noticia.');
      return;
    }

    const today = new Date().toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const newArticle: NewsArticle = {
      id: `custom-news-${Date.now()}`,
      title: title.trim(),
      summary: summary.trim(),
      content: content.trim(),
      date: today,
      neighborhood,
      tag: tag.trim() || 'Comunidad',
      imageUrl: imageUrl.trim() || imagePresets[0].url
    };

    onSaveNewArticle(newArticle);
    setIsAdding(false);
    setTitle('');
    setSummary('');
    setContent('');
    setImageUrl('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">Gestión de Noticias de la Delegación</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Agregá o remové comunicados fácilmente sin necesidad de tocar el código.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {!isAdding ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-700">
                  Noticias publicadas actualmente ({newsList.length})
                </span>
                <button
                  onClick={() => setIsAdding(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publicar nueva noticia</span>
                </button>
              </div>

              <div className="space-y-3">
                {newsList.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover shrink-0 bg-slate-200"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600 block">
                          {item.neighborhood} · {item.tag}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 truncate">
                          {item.title}
                        </h4>
                        <span className="text-xs text-slate-500">{item.date}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onDeleteArticle(item.id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer shrink-0"
                      title="Eliminar noticia"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Los cambios se guardan automáticamente en tu navegador.</span>
                <button
                  type="button"
                  onClick={onResetDefaults}
                  className="text-blue-700 hover:underline cursor-pointer font-medium"
                >
                  Restaurar noticias oficiales por defecto
                </button>
              </div>
            </div>
          ) : (
            /* Form to add a new article */
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="text-base font-bold text-slate-900">Nueva Noticia / Comunicado</h4>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Volver al listado
                </button>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Título de la Noticia *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Nuevo operativo de desmalezado en Ignacio Correas"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Barrio
                  </label>
                  <select
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                  >
                    <option value="Todas las localidades">Todas las localidades</option>
                    <option value="Villa Garibaldi">Villa Garibaldi</option>
                    <option value="Parque Sicardi">Parque Sicardi</option>
                    <option value="Ignacio Correas">Ignacio Correas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Etiqueta / Rubro
                  </label>
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    placeholder="Ej: Vialidad / Obras / Salud"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Resumen corto (visible en la tarjeta) *
                </label>
                <textarea
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Breve anticipo del comunicado..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Texto completo de la noticia *
                </label>
                <textarea
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Detalles, recomendaciones para los vecinos, lugares y horarios..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Imagen de cabecera
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Pegar URL de imagen o elegir una sugerida abajo"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  <span className="text-slate-500 font-semibold py-1">Sugeridas:</span>
                  {imagePresets.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setImageUrl(preset.url)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  Guardar y publicar
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Cerrar panel
          </button>
        </div>

      </div>
    </div>
  );
};
