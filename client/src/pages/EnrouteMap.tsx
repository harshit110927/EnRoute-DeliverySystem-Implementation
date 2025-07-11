import React, { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { geocodeAddress } from "../utils/geocodeAddress";
import { Marker as LeafletMarker } from "leaflet";


const EnrouteMap: React.FC = () => {
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [zone, setZone] = useState("");
  const [chokepoints, setChokepoints] = useState<any[]>([]);
  const [selectedChokepoint, setSelectedChokepoint] = useState<any | null>(null);
  const [assignmentResult, setAssignmentResult] = useState<any | null>(null);
  const [hasRescheduled, setHasRescheduled] = useState(false);

  const handleSearch = async () => {
    setAssignmentResult(null);
    setHasRescheduled(false);
    const location = await geocodeAddress(address);
    if (!location) {
      alert("Could not geocode the address.");
      return;
    }
    setCoords(location);

    const zoneRes = await fetch(`/api/location/zone?lat=${location.lat}&lng=${location.lng}`);
    const zoneData = await zoneRes.json();
    setZone(zoneData.zone);

    const cpRes = await fetch(`/api/chokepoints/${zoneData.zone}`);
    const cpData = await cpRes.json();
    setChokepoints(cpData);
  };

  const handleAssignSlot = async (isReschedule = false) => {
    if (!selectedChokepoint) return;

    const res = await fetch("/api/order/assign-slot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chokepointId: selectedChokepoint._id,
        preferredTime: isReschedule ? "" : "5–6 PM", // let backend pick best alternative if rescheduling
      }),
    });

    const result = await res.json();
    setAssignmentResult(result);
    if (isReschedule) setHasRescheduled(true);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Find EnRoute Delivery Points</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="border p-2 rounded w-96"
          placeholder="Enter your address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded">
          Locate
        </button>
      </div>

      {coords && (
        <MapContainer center={coords} zoom={13} style={{ height: "500px", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          />
          <Marker
  position={coords}
  draggable={true}
  eventHandlers={{
    dragend: async (e) => {
      const marker = e.target;
      const newPos = marker.getLatLng();
      const newCoords = { lat: newPos.lat, lng: newPos.lng };
      setCoords(newCoords);

      // Re-run zone detection
      const zoneRes = await fetch(`/api/location/zone?lat=${newCoords.lat}&lng=${newCoords.lng}`);
      const zoneData = await zoneRes.json();
      setZone(zoneData.zone);

      // Re-fetch chokepoints
      const cpRes = await fetch(`/api/chokepoints/${zoneData.zone}`);
      const cpData = await cpRes.json();
      setChokepoints(cpData);
    },
  }}
>
  <Popup>Drag me to refine your location</Popup>
</Marker>


          {chokepoints.map((cp, idx) => (
            <Marker key={idx} position={cp.coordinates}>
              <Popup>
                <strong>{cp.name}</strong>
                <br />
                Zone: {cp.zone}
                <br />
                Traffic: {cp.trafficScore}
                <br />
                <button
                  onClick={() => setSelectedChokepoint(cp)}
                  className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
                >
                  Select This Point
                </button>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}

      {selectedChokepoint && (
        <div className="mt-6 p-4 border rounded bg-gray-100">
          <h3 className="font-semibold text-lg mb-2">Selected Chokepoint:</h3>
          <p>Name: {selectedChokepoint.name}</p>
          <p>Zone: {selectedChokepoint.zone}</p>
          <p>Traffic Score: {selectedChokepoint.trafficScore}</p>
          <button
            onClick={() => handleAssignSlot(false)}
            className="mt-3 bg-blue-700 text-white px-4 py-2 rounded"
          >
            Confirm Slot
          </button>
        </div>
      )}

      {assignmentResult && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 rounded">
          <h3 className="font-semibold text-green-800">✅ Slot Assigned</h3>
          <p>{assignmentResult.message}</p>
          <p>
            <strong>{assignmentResult.time}</strong> at{" "}
            <strong>{assignmentResult.point}</strong>
          </p>

          {!hasRescheduled && (
            <button
              onClick={() => handleAssignSlot(true)}
              className="mt-3 bg-yellow-600 text-white px-4 py-2 rounded"
            >
              Reschedule Slot
            </button>
          )}

          {hasRescheduled && (
            <p className="text-sm text-gray-600 mt-2">
              You have already rescheduled once.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default EnrouteMap;
