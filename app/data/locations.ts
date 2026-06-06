import type { LocationData } from './locations/types';
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
import { vaalsLocation } from './locations/vaals';
import { genkLocation } from './locations/genk';
import { brunssumLocation } from './locations/brunssum';
import { valkenburgLocation } from './locations/valkenburg';

export const locations: LocationData[] = [
  maastrichtLocation,
  venloLocation,
  aachenLocation,
  brusselsLocation,
  roermondLocation,
  geleenLocation,
  sittardLocation,
  weertLocation,
  eijsdenLocation,
  meerssenLocation,
  vaalsLocation,
  genkLocation,
  brunssumLocation,
  valkenburgLocation,
];

export const getLocationsData = () => locations;
export const getLocationBySlug = (slug: string) => locations.find(l => l.slug === slug);
