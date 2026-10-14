import { NewsArticle, ServiceItem } from '../types';

export const OFFICIAL_PHONE = '+54 221 441-6910';
export const OFFICIAL_PHONE_PLAIN = '2214416910';
export const DELEGATION_ADDRESS = 'Calle 659 entre 12 y 13, Parque Sicardi, partido de La Plata, Buenos Aires';
export const GOOGLE_MAPS_LINK = 'https://www.google.com/maps/search/?api=1&query=Calle+659+y+13+Parque+Sicardi+La+Plata';
export const DELEGATE_NAME = 'Lorena Di Matteo';

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'urbanos',
    title: 'Servicios urbanos',
    description: 'Recolección de ramas, residuos y escombros, limpieza y barrido de calles y mantenimiento general de espacios públicos.',
    iconName: 'Trash2',
    category: 'Mantenimiento'
  },
  {
    id: 'alumbrado',
    title: 'Alumbrado público',
    description: 'Recepción y gestión de reclamos por luminarias apagadas, dañadas o con problemas de funcionamiento en los barrios.',
    iconName: 'Lightbulb',
    category: 'Infraestructura'
  },
  {
    id: 'calles-obras',
    title: 'Calles y obras',
    description: 'Gestión y seguimiento de trabajos de mantenimiento vial, mejoras de calles, entubados y obras pluviales comunitarias.',
    iconName: 'Construction',
    category: 'Vialidad'
  },
  {
    id: 'plazas',
    title: 'Plazas y espacios públicos',
    description: 'Limpieza, conservación y puesta en valor de plazas, bulevares y espacios verdes comunitarios.',
    iconName: 'Trees',
    category: 'Espacios Verdes'
  },
  {
    id: 'regularizacion',
    title: 'Regularización dominial',
    description: 'Jornadas de asesoramiento y orientación legal para vecinos que necesitan regularizar la situación de sus terrenos y escrituras.',
    iconName: 'FileCheck2',
    category: 'Asesoramiento'
  },
  {
    id: 'salud-animal',
    title: 'Salud y bienestar animal',
    description: 'Información y articulación sobre campañas barriales de vacunación antirrábica, castración gratuita y desparasitación.',
    iconName: 'HeartHandshake',
    category: 'Zoonosis y Salud'
  },
  {
    id: 'charlas',
    title: 'Charlas y capacitaciones',
    description: 'Difusión y organización de encuentros, talleres participativos, jornadas de prevención y actividades de interés vecinal.',
    iconName: 'Users',
    category: 'Comunidad'
  },
  {
    id: 'tramites-tasas',
    title: 'Trámites y tasas municipales',
    description: 'Orientación y recepción de consultas relacionadas con tasas, gestiones administrativas y servicios municipales.',
    iconName: 'ReceiptText',
    category: 'Gestión'
  }
];

export const INITIAL_NEWS: NewsArticle[] = [
  {
    id: 'noticia-vacunacion',
    title: 'Suspensión de vacunación por cuestiones climáticas',
    summary: 'Debido a las condiciones meteorológicas desfavorables y alerta por lluvias, la jornada de vacunación antirrábica y salud animal queda temporalmente suspendida y será reprogramada.',
    content: 'La Delegación Municipal informa a los vecinos de Villa Garibaldi, Parque Sicardi e Ignacio Correas que, debido a las condiciones climáticas adversas y con el fin de preservar la seguridad y bienestar de los animales y sus familias, la jornada de vacunación antirrábica comunitaria prevista queda suspendida.\n\nA la brevedad informaremos a través de nuestros canales habituales la nueva fecha y lugar de realización para que todos puedan concurrir. Agradecemos la comprensión de los vecinos.',
    date: '14 de Octubre, 2026',
    neighborhood: 'Todas las localidades',
    tag: 'Salud Animal',
    imageUrl: '/vacunacion.jpg'
  },
  {
    id: 'noticia-luminarias',
    title: 'Luminarias: Mantenimiento y reconversión de alumbrado público a tecnología LED',
    summary: 'Operativos de reparación de luminarias dañadas y colocación de nuevos artefactos LED para optimizar la visibilidad y seguridad en arterias clave.',
    content: 'Las cuadrillas de alumbrado público continúan desarrollando tareas diarias de reemplazo de lámparas de vapor de sodio por tecnología LED de alta eficiencia, así como la reparación de equipos fuera de servicio reportados por los vecinos. Estas intervenciones permiten mejorar la iluminación en esquinas estratégicas, paradas de micros y accesos barriales.',
    date: '14 de Octubre, 2026',
    neighborhood: 'Todas las localidades',
    tag: 'Luminarias',
    imageUrl: '/luminarias led.jpg'
  },
  {
    id: 'noticia-zanjas',
    title: 'Zanjas: Trabajos continuos de zanjeo, cruces de calle y limpieza pluvial',
    summary: 'Tareas con maquinaria pesada y personal comunal para asegurar el libre escurrimiento del agua y prevenir anegamientos en días de lluvia.',
    content: 'Se llevan adelante intensas tareas de apertura, rectificación y desobstrucción de zanjas en puntos neurálgicos de Villa Garibaldi, Parque Sicardi e Ignacio Correas. Asimismo, se colocan caños de hormigón en cruces de calles vecinales para favorecer el drenaje pluvial hacia los canales receptores principales.',
    date: '11 de Octubre, 2026',
    neighborhood: 'Todas las localidades',
    tag: 'Zanjas',
    imageUrl: '/zanqueo.jpg'
  },
  {
    id: 'noticia-limpieza',
    title: 'Limpieza: Operativos integrales de barrido, higiene y mantenimiento urbano',
    summary: 'Cuadrillas comunales avanzan con tareas continuas de saneamiento en calzadas, banquinas, veredas y espacios comunitarios.',
    content: 'Equipos de servicios urbanos de la Delegación ejecutan operativos de corte de pasto, desmalezado, retiro de sedimentos y barrido sobre las principales trazas de circulación. El objetivo es preservar la higiene pública y mantener despejadas las sendas peatonales y áreas de recreación.',
    date: '08 de Octubre, 2026',
    neighborhood: 'Todas las localidades',
    tag: 'Limpieza',
    imageUrl: '/limpieza.jpg'
  },
  {
    id: 'noticia-ramas',
    title: 'Ramas: Recorrido especial de recolección de restos de poda y no habituales',
    summary: 'Camiones con grúa y volquetes retiran montículos de poda coordinadamente en los distintos sectores barriales.',
    content: 'La Delegación dispone de un cronograma regular con camiones volcadores y almejas hidráulicas para el levantamiento de ramas y restos vegetales dispuestos por los vecinos. Se solicita sacar la poda atada o en bolsas resistentes para agilizar el paso del servicio y evitar taponamientos en zanjas.',
    date: '04 de Octubre, 2026',
    neighborhood: 'Todas las localidades',
    tag: 'Ramas',
    imageUrl: '/ramas2.jpg'
  }
];

export const CLAIM_TYPES = [
  'Luminarias y alumbrado público',
  'Zanjeo y desagües pluviales',
  'Limpieza urbana y residuos',
  'Recolección de ramas y poda',
  'Calles, bacheo y mantenimiento vial',
  'Plazas y espacios verdes',
  'Zoonosis / Vacunación / Castraciones',
  'Regularización dominial / Tierras',
  'Trámites de tasas municipales',
  'Otro requerimiento comunal'
];

export const EMERGENCY_NUMBERS = [
  { number: '147', name: 'Atención al Vecino La Plata', desc: 'Línea única de reclamos municipal' },
  { number: '107', name: 'SAME Emergencias Médicas', desc: 'Atención de emergencias en salud' },
  { number: '103', name: 'Defensa Civil La Plata', desc: 'Alertas meteorológicas y emergencias' },
  { number: '100', name: 'Bomberos de La Plata', desc: 'Incendios y rescate' },
  { number: '911', name: 'Policía Bonaerense', desc: 'Emergencias policiales y seguridad' }
];
