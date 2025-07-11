// File: src/components/EnrouteSelector.tsx
import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { geocodeAddress } from "@/utils/geocodeAddress";
import L from "leaflet";

const chokepointIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const defaultZoom = 13;

interface EnrouteSelectorProps {
  address: string;
  onAddressChange: (val: string) => void;
  coords: { lat: number; lng: number } | null;
  setCoords: (val: { lat: number; lng: number }) => void;
  selectedChokepoint: any;
  setSelectedChokepoint: (val: any) => void;
  assignmentResult: any;
  setAssignmentResult: (val: any) => void;
  hasRescheduled: boolean;
  setHasRescheduled: (val: boolean) => void;
}

export function EnrouteSelector({
  address,
  onAddressChange,
  coords,
  setCoords,
  selectedChokepoint,
  setSelectedChokepoint,
  assignmentResult,
  setAssignmentResult,
  hasRescheduled,
  setHasRescheduled,
}: EnrouteSelectorProps) {
  const [zone, setZone] = useState("");
  const [chokepoints, setChokepoints] = useState<any[]>([]);

  const handleLocate = async () => {
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
    if (!selectedChokepoint || !coords || !zone) return;

    const res = await fetch("/api/order/enroute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "dummy-user", // replace with actual user context if needed
        pointName: selectedChokepoint.name,
        lat: coords.lat,
        lng: coords.lng,
        zone,
        timeSlot: isReschedule ? "" : "5–6 PM",
      }),
    });

    const contentType = res.headers.get("Content-Type");

    if (!res.ok) {
      const text = await res.text();
      console.error("Server error:", text);
      alert("Failed to assign slot. Please try again.");
      return;
    }

    if (!contentType?.includes("application/json")) {
      const text = await res.text();
      console.error("Unexpected content type:", text);
      alert("Unexpected server response.");
      return;
    }

    const result = await res.json();
    console.log("Assignment result:", result);
    setAssignmentResult({
      message: result.message,
      point: result.orderDetails.chokepoint,
      time: result.orderDetails.timeSlot,
    });
    if (isReschedule) setHasRescheduled(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          placeholder="Enter address"
          className="border p-2 rounded w-full"
        />
        <button onClick={handleLocate} className="bg-blue-600 text-white px-4 py-2 rounded">
          Locate
        </button>
      </div>

      {coords && (
        <MapContainer center={coords} zoom={defaultZoom} style={{ height: "400px", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={coords}>
            <Popup>Your Location</Popup>
          </Marker>

          {chokepoints.map((cp, idx) => (
            <Marker key={idx} position={cp.coordinates} icon={chokepointIcon}>

              <Popup>
                <strong>{cp.name}</strong>
                <br />Zone: {cp.zone}
                <br />Traffic: {cp.trafficScore}
                <br />
                <button
                  onClick={() => setSelectedChokepoint(cp)}
                  className="mt-1 bg-green-600 text-white px-2 py-1 rounded"
                >
                  Select
                </button>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}

      {selectedChokepoint && (
        <div className="p-3 bg-gray-100 rounded">
          <p>Selected: <strong>{selectedChokepoint.name}</strong></p>
          <button
            onClick={() => handleAssignSlot(false)}
            className="mt-2 bg-blue-700 text-white px-4 py-2 rounded"
          >
            Confirm Slot
          </button>
        </div>
      )}

      {assignmentResult && (
        <div className="mt-3 p-4 bg-green-100 border border-green-400 rounded">
          <h4 className="font-semibold text-green-800">Slot Assigned</h4>
          <p>{assignmentResult.message}</p>
          <p>
            <strong>{assignmentResult.time}</strong> at <strong>{assignmentResult.point}</strong>
          </p>

          {!hasRescheduled && (
            <button
              onClick={() => handleAssignSlot(true)}
              className="mt-2 bg-yellow-600 text-white px-3 py-1 rounded"
            >
              Reschedule
            </button>
          )}

          {hasRescheduled && (
            <p className="text-sm text-gray-600 mt-2">You have already rescheduled once.</p>
          )}
        </div>
      )}
    </div>
  );
}