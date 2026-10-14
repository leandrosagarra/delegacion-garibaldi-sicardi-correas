export type Neighborhood = 'Villa Garibaldi' | 'Parque Sicardi' | 'Ignacio Correas';

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: string;
}

export type ClaimStatus = 'Recibido' | 'En revisión' | 'En Inspección' | 'En Cuadrilla' | 'Derivado' | 'Resuelto' | 'Solucionado';

export interface ClaimSubmission {
  id: string;
  ticketNumber: string;
  fullName: string;
  phone: string;
  neighborhood: Neighborhood;
  address: string;
  claimType: string;
  description: string;
  status: ClaimStatus;
  createdAt: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  neighborhood: Neighborhood | 'Todas las localidades';
  imageUrl: string;
  tag: string;
}
