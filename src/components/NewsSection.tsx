import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  ArrowRight, 
  Filter
} from 'lucide-react';
import { NewsArticle } from '../types';
import { INITIAL_NEWS } from '../data/initialData';
import { NewsDetailModal } from './NewsDetailModal';

interface NewsSectionProps {
  onOpenAdmin?: () => void;
  refreshKey?: number;
}

export const NewsSection: React.FC<NewsSectionProps> = ({ refreshKey }) => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('Todos');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  const loadNews = () => {
    try {
      const stored = localStorage.getItem('delegacion_noticias');
      if (stored !== null) {
        setNews(JSON.parse(stored));
      } else {
        setNews(INITIAL_NEWS);
        localStorage.setItem('delegacion_noticias', JSON.stringify(INITIAL_NEWS));
      }
    } catch (e) {
      setNews(INITIAL_NEWS);
    }
  };

  // Load from localStorage or fallback to INITIAL_NEWS on mount and when admin updates news
  useEffect(() => {
    loadNews();
  }, [refreshKey]);

  // Filtered news
  const filteredNews = news.filter((item) => {
    if (selectedNeighborhood === 'Todos') return true;
    return item.neighborhood === selectedNeighborhood || item.neighborhood === 'Todas las localidades';
  });

  return (
    <section id="novedades" className="py-16 lg:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header Section */}
        <div className="mb-10">
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

        {/* Generic News Cards Grid */}
        {filteredNews.length === 0 ? (
          <div className="py-12 text-center bg-slate-50 rounded-3xl border border-slate-200 text-slate-500 text-sm">
            No hay noticias publicadas para el filtro seleccionado en este momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredNews.map((article) => (
              <article 
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="group bg-white rounded-3xl border border-slate-200 hover:border-emerald-500/50 shadow-xs hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
              >
                {/* Image Container */}
                <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                  <img 
                    src={article.imageUrl} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/95 text-emerald-900 shadow-2xs backdrop-blur-xs border border-emerald-100">
                      {article.tag}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Meta Header */}
                    <div className="flex items-center gap-3 text-xs text-slate-600 mb-2.5 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                        {article.date}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        {article.neighborhood}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-slate-900 group-hover:text-emerald-800 transition-colors text-base line-clamp-2 leading-snug mb-2">
                      {article.title}
                    </h3>

                    {/* Summary */}
                    <p className="text-slate-600 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>

                  {/* Read More Link */}
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-900">
                    <span>Leer información completa</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>

      {/* Detail Modal */}
      {selectedArticle && (
        <NewsDetailModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </section>
  );
};
