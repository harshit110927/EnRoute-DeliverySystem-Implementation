export interface Bounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

export interface Zone {
  name: string;
  bounds: Bounds;
}

const zones: Zone[] = [
  {
    name: "South Dallas",
    bounds: {
      minLat: 32.67,
      maxLat: 32.72,
      minLng: -96.85,
      maxLng: -96.75
    }
  },
  // You can add more zones here
];

export default zones;
