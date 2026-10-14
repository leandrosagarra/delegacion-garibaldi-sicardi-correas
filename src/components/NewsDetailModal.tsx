import React from 'react';
import { X, Calendar, MapPin, Share2, Check } from 'lucide-react';
import { NewsArticle } from '../types';

interface NewsDetailModalProps {
  article: NewsArticle | null;
  onClose: () => void;
}

export const NewsDetailModal: React.FC<NewsDetailModalProps> = ({ article, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!article) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${article.title} - ${window.location.href}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header Image */}
        <div className="relative h-56 sm:h-72 w-full overflow-hidden bg-slate-100 shrink-0">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-xs transition-colors cursor-pointer"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-2 text-xs">
              <span className="px-2.5 py-1 rounded-full bg-emerald-600 font-bold uppercase tracking-wider text-[10px]">
                {article.tag}
              </span>
              <span className="flex items-center gap-1 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-xs">
                <MapPin className="w-3 h-3 text-emerald-300" />
                {article.neighborhood}
              </span>
              <span className="flex items-center gap-1 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-xs">
                <Calendar className="w-3 h-3 text-slate-300" />
                {article.date}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight drop-shadow-xs">
              {article.title}
            </h2>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-4 text-slate-700">
          <div className="p-4 rounded-2xl bg-emerald-50/70 border-l-4 border-emerald-600 text-emerald-950 font-medium text-sm leading-relaxed">
            {article.summary}
          </div>

          <div className="text-base leading-relaxed text-slate-700 whitespace-pre-line space-y-3">
            {article.content}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:px-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-slate-500" />}
            <span>{copied ? 'Enlace copiado' : 'Compartir noticia'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
