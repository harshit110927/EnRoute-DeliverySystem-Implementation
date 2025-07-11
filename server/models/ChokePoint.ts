import mongoose, { Schema, model, InferSchemaType } from "mongoose";

// ✅ Define and export TimeSlot type
export interface ITimeSlot {
  time: string;
  maxOrders: number;
  currentOrders: number;
}

// ✅ Coordinates type
interface Coordinates {
  lat: number;
  lng: number;
}

// ✅ ChokePoint interface for insertion
export interface IChokePoint {
  zone: string;
  name: string;
  coordinates: Coordinates;
  trafficScore: number;
  availableTimeSlots: ITimeSlot[];
}

// ✅ Define schema for timeslot
const TimeSlotSchema = new Schema<ITimeSlot>({
  time: { type: String, required: true },
  maxOrders: { type: Number, required: true },
  currentOrders: { type: Number, required: true },
});

// ✅ Create schema
const ChokePointSchema = new Schema<IChokePoint>({
  zone: { type: String, required: true },
  name: { type: String, required: true },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  trafficScore: { type: Number, required: true },
  availableTimeSlots: [TimeSlotSchema],
});

// ✅ Add this export to fix your error
export type ChokePointType = InferSchemaType<typeof ChokePointSchema>;

// ✅ Create and export model
const ChokePoint = model<IChokePoint>("ChokePoint", ChokePointSchema);
export default ChokePoint;
