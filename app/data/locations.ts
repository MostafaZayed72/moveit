import type { LocationData } from './locations/types';
import { generateGenericLocation } from './locations/generic';
import { maastrichtLocation } from './locations/maastricht';
import { venloLocation } from './locations/venlo';
import { aachenLocation } from './locations/aachen';
import { brusselsLocation } from './locations/brussels';
import { roermondLocation } from './locations/roermond';
import { geleenLocation } from './locations/geleen';
import { sittardLocation } from './locations/sittard';
import { weertLocation } from './locations/weert';
import { eijsdenLocation } from './locations/eijsden';
import { meerssenLocation } from './locations/meerssen';

export const locations: LocationData[] = [
  maastrichtLocation, // 100% Unique
  venloLocation,      // 100% Unique
  aachenLocation,     // 100% Unique
  brusselsLocation,   // 100% Unique
  roermondLocation,   // 100% Unique
  geleenLocation,     // 100% Unique
  sittardLocation,    // 100% Unique
  weertLocation,      // 100% Unique
  eijsdenLocation,    // 100% Unique
  meerssenLocation,   // 100% Unique
  generateGenericLocation('Vaals', 'vaals', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=400'),
  generateGenericLocation('Genk', 'genk', 'https://images.unsplash.com/photo-1491557345352-5929e343eb89?auto=format&fit=crop&q=80&w=400', '🇧🇪 Belgium'),
  generateGenericLocation('Brunssum', 'brunssum', 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&q=80&w=400'),
  generateGenericLocation('Valkenburg', 'valkenburg', 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?auto=format&fit=crop&q=80&w=400'),
];

export const getLocationsData = () => locations;
export const getLocationBySlug = (slug: string) => locations.find(l => l.slug === slug);
