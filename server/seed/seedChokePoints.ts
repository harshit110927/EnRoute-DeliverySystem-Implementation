import mongoose from "mongoose";
import dotenv from "dotenv";
import ChokePoint, { IChokePoint } from "../models/ChokePoint";

dotenv.config();

const data: IChokePoint[] = [
  {
    zone: "South Dallas",
    name: "DART Ledbetter Station",
    coordinates: { lat: 32.6766, lng: -96.8236 },
    trafficScore: 90,
    availableTimeSlots: [
      { time: "5–6 PM", maxOrders: 10, currentOrders: 2 },
      { time: "6–7 PM", maxOrders: 10, currentOrders: 1 },
    ],
  },
  {
    zone: "South Dallas",
    name: "Loop 12 & I-35",
    coordinates: { lat: 32.6889, lng: -96.8207 },
    trafficScore: 80,
    availableTimeSlots: [
      { time: "5–6 PM", maxOrders: 8, currentOrders: 3 },
    ],
  },
];

async function seed(): Promise<void> {
  try {
    console.log("🚀 Starting seed script...");

    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("❌ MONGO_URI not defined in .env");

    console.log("🔌 Connecting to MongoDB:", uri);
    await mongoose.connect(uri);
    console.log("✅ MongoDB connection successful");

    console.log("🧹 Clearing existing ChokePoint data...");
    const deleted = await ChokePoint.deleteMany({});
    console.log(`🗑️ Deleted ${deleted.deletedCount} existing documents.`);

    console.log("📥 Inserting new ChokePoint data...");
    const inserted = await ChokePoint.insertMany(data);
    console.log(`✅ Inserted ${inserted.length} documents.`);

    console.log("🎉 ✅ Choke points seeded successfully!");
  } catch (err) {
    console.error("❌ Error during seeding:", err);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

seed();
