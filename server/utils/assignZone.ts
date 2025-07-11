import geolib from "geolib";
import ChokePoint, { IChokePoint } from "../models/ChokePoint";

interface Coordinates {
  lat: number;
  lng: number;
}

const getNearestZone = async (userCoords: Coordinates): Promise<string | null> => {
  const chokepoints: IChokePoint[] = await ChokePoint.find();

  let nearestZone: string | null = null;
  let minDistance = Infinity;

  chokepoints.forEach((point) => {
    const distance = geolib.getDistance(
      { latitude: userCoords.lat, longitude: userCoords.lng },
      { latitude: point.coordinates.lat, longitude: point.coordinates.lng }
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearestZone = point.zone;
    }
  });

  return nearestZone;
};

export default getNearestZone;
