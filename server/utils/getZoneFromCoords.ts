import zones from './zones';

interface Bounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

interface Zone {
  name: string;
  bounds: Bounds;
}

/**
 * Returns zone name based on coordinates
 */
export function getZoneFromCoords(lat: number, lng: number): string | null {
  for (const z of zones as Zone[]) {
    const b = z.bounds;
    if (
      lat >= b.minLat && lat <= b.maxLat &&
      lng >= b.minLng && lng <= b.maxLng
    ) {
      return z.name;
    }
  }
  return null;
}
