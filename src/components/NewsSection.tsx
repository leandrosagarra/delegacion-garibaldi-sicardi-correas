import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  ArrowRight, 
  PlusCircle, 
  Filter
} from 'lucide-react';
import { NewsArticle } from '../types';
import { INITIAL_NEWS } from '../data/initialData';
import { NewsDetailModal } from './NewsDetailModal';
import { NewsManagerModal } from './NewsManagerModal';

interface NewsSectionProps {
  onOpenAdmin?: () => void;
  refreshKey?: number;
}

export const NewsSection: React.FC<NewsSectionProps> = ({ onOpenAdmin, refreshKey }) => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('Todos');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isManagerOpen, setIsManagerOpen] = useState(false);

  const loadNews = () => {
    try {
      const stored = localStorage.getItem('delegacion_noticias');
      if (stored) {
        const parsed: NewsArticle[] = JSON.parse(stored);
        const hasVacunacion = parsed.some((item) => item.id === 'noticia-vacunacion');
        if (!hasVacunacion) {
          const merged = [INITIAL_NEWS[0], ...parsed];
          setNews(merged);
          localStorage.setItem('delegacion_noticias', JSON.stringify(merged));
        } else {
          setNews(parsed);
        }
      } else {
        setNews(INITIAL_NEWS);
        localStorage.setItem('delegacion_noticias', JSON.stringify(INITIAL_NEWS));
      }
    } catch (e) {
      setNews(INITIAL_NEWS);
    }
  };

  // Load from localStorage or fallback to INITIAL_NEWS
  useEffect(() => {
    loadNews();
  }, [refreshKey]);

  const handleSaveNewArticle = (newArticle: NewsArticle) => {
    const updated = [newArticle, ...news];
    setNews(updated);
    try {
      localStorage.setItem('delegacion_noticias', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteArticle = (id: string) => {
    const updated = news.filter((n) => n.id !== id);
    setNews(updated);
    try {
      localStorage.setItem('delegacion_noticias', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetDefaults = () => {
    setNews(INITIAL_NEWS);
    try {
      localStorage.setItem('delegacion_noticias', JSON.stringify(INITIAL_NEWS));
    } catch (e) {
      console.error(e);
    }
  };

  // Filtered news
  const filteredNews = news.filter((item) => {
    if (selectedNeighborhood === 'Todos') return true;
    return item.neighborhood === selectedNeighborhood || item.neighborhood === 'Todas las localidades';
  });

  return (
    <section id="novedades" className="py-16 lg:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200">
              Información Barrial al Día
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Noticias de nuestra comunidad
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-2xl">
              Información sobre los trabajos urbanos continuos de luminarias, zanjeo, limpieza y recolección de ramas en Villa Garibaldi, Parque Sicardi e Ignacio Correas.
            </p>
          </div>

          {/* Action button to open manager (without touching code) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (onOpenAdmin) {
                  onOpenAdmin();
                } else {
                  setIsManagerOpen(true);
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 hover:border-emerald-600 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-2xs transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-emerald-600" />
              <span>Administrar noticias</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 text-xs sm:text-sm no-scrollbar">
          <span className="text-slate-400 font-semibold flex items-center gap-1.5 pl-1 pr-2">
            <Filter className="w-3.5 h-3.5" /> Filtrar:
          </span>
          {['Todos', 'Villa Garibaldi', 'Parque Sicardi', 'Ignacio Correas'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedNeighborhood(tab)}
              className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
                selectedNeighborhood === tab
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 4 Generic News Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredNews.map((article) => (
            <article
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 cursor-pointer"
            >
              {/* Image with fallback */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    // Fallback to logo or colored placeholder
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full bg-[#0f382a]/90 backdrop-blur-xs text-white text-[11px] font-bold uppercase tracking-wider shadow-xs">
                    {article.tag}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      {article.date}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 truncate max-w-[120px]">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {article.neighborhood}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug mb-2">
                    {article.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700 group-hover:text-emerald-800">
                  <span>Leer detalle completo</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>

      {/* Detail Modal */}
      {selectedArticle && (
        <NewsDetailModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}

      {/* Manager Modal */}
      {isManagerOpen && (
        <NewsManagerModal
          newsList={news}
          onSaveNewArticle={handleSaveNewArticle}
          onDeleteArticle={handleDeleteArticle}
          onResetDefaults={handleResetDefaults}
          onClose={() => setIsManagerOpen(false)}
        />
      )}
    </section>
  );
};
