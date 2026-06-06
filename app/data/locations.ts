import type { LocationData } from './locations/types';
import { generateGenericLocation } from './locations/generic';
import { maastrichtLocation } from './locations/maastricht';
import { venloLocation } from './locations/venlo';
import { aachenLocation } from './locations/aachen';
import { brusselsLocation } from './locations/brussels';
import { roermondLocation } from './locations/roermond';

export const locations: LocationData[] = [
  maastrichtLocation, // 100% Unique
  venloLocation,      // 100% Unique
  aachenLocation,     // 100% Unique
  brusselsLocation,   // 100% Unique
  roermondLocation,   // 100% Unique
  generateGenericLocation('Geleen', 'geleen', 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&q=80&w=400'),
  generateGenericLocation('Sittard', 'sittard', 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=400'),
  generateGenericLocation('Weert', 'weert', 'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?auto=format&fit=crop&q=80&w=400'),
  generateGenericLocation('Eijsden', 'eijsden', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=400'),
  generateGenericLocation('Meerssen', 'meerssen', 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=400'),
  generateGenericLocation('Vaals', 'vaals', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=400'),
  generateGenericLocation('Genk', 'genk', 'https://images.unsplash.com/photo-1491557345352-5929e343eb89?auto=format&fit=crop&q=80&w=400', '🇧🇪 Belgium'),
  generateGenericLocation('Brunssum', 'brunssum', 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&q=80&w=400'),
  generateGenericLocation('Valkenburg', 'valkenburg', 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?auto=format&fit=crop&q=80&w=400'),
];

export const getLocationsData = () => locations;
export const getLocationBySlug = (slug: string) => locations.find(l => l.slug === slug);
