import React from 'react';
import { 
  Trash2, 
  Lightbulb, 
  Construction, 
  Trees, 
  FileCheck2, 
  HeartHandshake, 
  Users, 
  ReceiptText, 
  HelpCircle
} from 'lucide-react';
import { SERVICES_DATA } from '../data/initialData';

export const ServicesSection: React.FC = () => {
  // Map icon names to Lucide icon components
  const renderIcon = (iconName: string) => {
    const props = { className: "w-6 h-6" };
    switch (iconName) {
      case 'Trash2':
        return <Trash2 {...props} />;
      case 'Lightbulb':
        return <Lightbulb {...props} />;
      case 'Construction':
        return <Construction {...props} />;
      case 'Trees':
        return <Trees {...props} />;
      case 'FileCheck2':
        return <FileCheck2 {...props} />;
      case 'HeartHandshake':
        return <HeartHandshake {...props} />;
      case 'Users':
        return <Users {...props} />;
      case 'ReceiptText':
        return <ReceiptText {...props} />;
      default:
        return <HelpCircle {...props} />;
    }
  };

  return (
    <section id="servicios" className="py-16 lg:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header Section */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200">
            Atención y Servicios a la Comunidad
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            ¿Qué hacemos en la Delegación?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Brindamos atención personalizada en el barrio, canalizamos las inquietudes de los vecinos y coordinamos el mantenimiento urbano cotidiano.
          </p>
        </div>

        {/* Services Grid (8 official cards without 'gestionar solicitud') */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES_DATA.map((service, index) => (
            <div
              key={service.id}
              className="group relative flex flex-col justify-between p-6 rounded-2xl bg-white hover:bg-emerald-50/20 border border-slate-200 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-900/5 transition-all duration-200"
            >
              <div>
                {/* Category & Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-200">
                    {renderIcon(service.iconName)}
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    0{index + 1}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mb-2">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-600 leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Category indicator pill */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end">
                <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full">
                  {service.category}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
