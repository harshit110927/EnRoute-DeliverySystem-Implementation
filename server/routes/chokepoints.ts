import express, { Request, Response } from "express";
import ChokePoint from "../models/ChokePoint";

const router = express.Router();

router.get("/:zone", async (req: Request, res: Response) => {
  try {
    console.log("Zone param received:", req.params.zone);
    const zone = req.params.zone;

    const points = await ChokePoint.find({
      zone: { $regex: zone, $options: "i" }
    });

    res.json(points);
  } catch (err) {
    console.error("Error fetching choke points:", err);
    res.status(500).json({ error: "Failed to fetch choke points" });
  }
});

export default router;
