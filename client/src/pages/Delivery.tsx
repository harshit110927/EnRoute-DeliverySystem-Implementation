// client/src/pages/Delivery.tsx

import { useState } from "react";
import EnrouteMap from "@/pages/EnrouteMap";
import { geocodeAddress } from "@/utils/geocodeAddress";

export default function DeliveryPage() {
  const [address, setAddress] = useState("");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [zone, setZone] = useState<string | null>(null);
  const [chokePoints, setChokePoints] = useState<any[]>([]);

  const handleDetect = async () => {
    const coords = await geocodeAddress(address);
    if (!coords) return alert("Address not found!");

    setUserLocation(coords);

    // Step 2: Get zone from backend
    const zoneRes = await fetch(`/api/location/zone?lat=${coords.lat}&lng=${coords.lng}`);
    const { zone } = await zoneRes.json();
    setZone(zone);

    // Step 3: Fetch chokepoints for that zone
    const cpRes = await fetch(`/api/chokepoints/${zone}`);
    const points = await cpRes.json();
    setChokePoints(points);
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">📍 EnRoute Delivery</h2>

      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Enter your address"
          className="border p-2 rounded w-full"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <button
          onClick={handleDetect}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Detect Zone
        </button>
      </div>

      {userLocation && chokePoints.length > 0 && (
        <div className="mt-6">
          <EnrouteMap />
        </div>
      )}
    </div>
  );
}
