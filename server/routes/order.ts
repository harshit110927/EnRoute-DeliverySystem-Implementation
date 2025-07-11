import express, { Request, Response } from "express";
import ChokePoint from "../models/ChokePoint";
import EnrouteOrder from "../models/EnrouteOrder";
import assignSlot from "../utils/assignSlot";

const router = express.Router();

router.post("/enroute", async (req: Request, res: Response) => {
  const { userId, pointName, lat, lng, zone, timeSlot: preferredTime } = req.body;

  try {
    // Step 1: Fetch selected chokepoint
    const choke = await ChokePoint.findOne({ name: pointName, zone });
    if (!choke) return res.status(404).json({ message: "Choke point not found" });

    // Step 2: Try assigning preferred or alternate time slot
    const result = await assignSlot(choke._id, preferredTime);

    if (!result.success) {
      return res.status(400).json({
        message: result.message,
        alternatives: result.alternatives
      });
    }

    const assignedTime = result.time;
    const assignedPoint = result.point;

    // Step 3: Save confirmed enroute order
    const order = new EnrouteOrder({
      userId,
      pointName: assignedPoint,
      zone,
      coordinates: { lat, lng },
      timeSlot: assignedTime
    });

    await order.save();

    // Step 4: Return response
    res.status(201).json({
      message: "✅ Enroute delivery confirmed",
      orderDetails: {
        chokepoint: assignedPoint,
        zone,
        timeSlot: assignedTime
      }
    });

  } catch (err) {
    console.error("Order placement error:", err);
    res.status(500).json({ message: "Server error while placing enroute order" });
  }
});

export default router;
