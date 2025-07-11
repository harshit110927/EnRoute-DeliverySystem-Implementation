import express, { Request, Response } from "express";
import { getZoneFromCoords } from "../utils/getZoneFromCoords";

const router = express.Router();

// POST /api/location/detect-zone
router.post("/detect-zone", (req: Request, res: Response) => {
  const { lat, lng } = req.body;

  if (typeof lat !== "number" || typeof lng !== "number") {
    return res.status(400).json({ message: "Invalid coordinates" });
  }

  const zone = getZoneFromCoords(lat, lng);
  if (!zone) {
    return res.status(404).json({ message: "Zone not found" });
  }

  res.json({ zone });
});

// ✅ NEW: GET /api/location/zone?lat=xx&lng=yy
router.get("/zone", (req: Request, res: Response) => {
  const lat = parseFloat(req.query.lat as string);
  const lng = parseFloat(req.query.lng as string);

  if (isNaN(lat) || isNaN(lng)) {
    return res.status(400).json({ message: "Invalid lat/lng query params" });
  }

  const zone = getZoneFromCoords(lat, lng);
  if (!zone) {
    return res.status(404).json({ message: "Zone not found" });
  }

  res.json({ zone });
});

export default router;
