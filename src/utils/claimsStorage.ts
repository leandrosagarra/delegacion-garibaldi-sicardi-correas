import { ClaimSubmission, ClaimStatus } from '../types';

const STORAGE_KEY = 'delegacion_reclamos';
const INIT_KEY = 'delegacion_reclamos_seed_done';

export const INITIAL_SAMPLE_CLAIMS: ClaimSubmission[] = [
  {
    id: 'claim-init-1',
    ticketNumber: 'DEL-2026-4821',
    fullName: 'Mariana Benítez',
    phone: '221 560-8832',
    neighborhood: 'Villa Garibaldi',
    address: 'Calle 659 entre 16 y 17',
    claimType: 'Luminarias y alumbrado público',
    description: 'Lámpara de alumbrado público intermitente y dos quemadas sobre la cuadra de 659. Zona muy oscura por la noche.',
    status: 'En Cuadrilla',
    createdAt: '14 de oct. de 2026, 09:15'
  },
  {
    id: 'claim-init-2',
    ticketNumber: 'DEL-2026-3109',
    fullName: 'Carlos Eduardo Rossi',
    phone: '221 489-1204',
    neighborhood: 'Parque Sicardi',
    address: 'Calle 11 y 650',
    claimType: 'Zanjeo y desagües pluviales',
    description: 'Acumulación de agua y sedimentos en la zanja del cruce de calle. Se necesita desobstrucción antes de las próximas lluvias.',
    status: 'En Inspección',
    createdAt: '13 de oct. de 2026, 14:40'
  },
  {
    id: 'claim-init-3',
    ticketNumber: 'DEL-2026-7244',
    fullName: 'Silvia Morales',
    phone: '221 612-4409',
    neighborhood: 'Ignacio Correas',
    address: 'Calle 18 y 662',
    claimType: 'Recolección de ramas y poda',
    description: 'Restos de poda embolsados y ramas sobre la vereda tras la tormenta del fin de semana.',
    status: 'Recibido',
    createdAt: '12 de oct. de 2026, 11:20'
  }
];

export function getStoredClaims(): ClaimSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
    // If never initialized before, seed with initial sample claims
    const wasSeeded = localStorage.getItem(INIT_KEY);
    if (!wasSeeded) {
      localStorage.setItem(INIT_KEY, 'true');
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_CLAIMS));
      return INITIAL_SAMPLE_CLAIMS;
    }
  } catch (err) {
    console.error('Error al leer reclamos de localStorage:', err);
  }
  return [];
}

export function saveStoredClaims(claims: ClaimSubmission[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(claims));
    window.dispatchEvent(new CustomEvent('delegacion_reclamos_updated', { detail: claims }));
  } catch (err) {
    console.error('Error al guardar reclamos en localStorage:', err);
  }
}

export function addStoredClaim(newClaim: ClaimSubmission): ClaimSubmission[] {
  const current = getStoredClaims();
  // Filter out any potential duplicate ID or ticketNumber
  const filtered = current.filter(
    (c) => c.id !== newClaim.id && c.ticketNumber !== newClaim.ticketNumber
  );
  // Add new claim at the top
  const updated = [newClaim, ...filtered];
  saveStoredClaims(updated);
  return updated;
}

export function deleteStoredClaim(id: string): ClaimSubmission[] {
  const current = getStoredClaims();
  const updated = current.filter((c) => c.id !== id);
  saveStoredClaims(updated);
  return updated;
}

export function updateStoredClaimStatus(id: string, newStatus: ClaimStatus): ClaimSubmission[] {
  const current = getStoredClaims();
  const updated = current.map((c) => (c.id === id ? { ...c, status: newStatus } : c));
  saveStoredClaims(updated);
  return updated;
}
