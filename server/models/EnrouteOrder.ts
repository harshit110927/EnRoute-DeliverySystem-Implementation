import mongoose, { Schema, Document } from "mongoose";

// Interface for TypeScript typing
export interface IEnrouteOrder extends Document {
  userId: string;
  pointName: string;
  zone: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  timeSlot: string;
  createdAt: Date;
}

// Mongoose schema
const EnrouteOrderSchema = new Schema<IEnrouteOrder>({
  userId: { type: String, required: true },
  pointName: { type: String, required: true },
  zone: { type: String, required: true },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  timeSlot: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export model
export default mongoose.model<IEnrouteOrder>("EnrouteOrder", EnrouteOrderSchema);
