import ChokePoint, { IChokePoint, ITimeSlot } from "../models/ChokePoint";
import { Types } from "mongoose";

interface SlotAssignmentResult {
  success: boolean;
  message: string;
  time?: string;
  point?: string;
  alternatives?: {
    name: string;
    zone: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    availableTimeSlots: ITimeSlot[];
  }[];
}


const assignSlot = async (
  chokepointId: Types.ObjectId | string,
  preferredTime: string
): Promise<SlotAssignmentResult> => {
  const chokepoint = await ChokePoint.findById(chokepointId);
  if (!chokepoint) {
    return { success: false, message: "Choke point not found" };
  }

  // Step 1: Try preferred slot
  const slot = chokepoint.availableTimeSlots.find(
    (s: ITimeSlot) => s.time === preferredTime
  );
  if (slot && slot.currentOrders < slot.maxOrders) {
    slot.currentOrders += 1;
    await chokepoint.save();
    return {
      success: true,
      time: slot.time,
      point: chokepoint.name,
      message: "Preferred slot assigned"
    };
  }

  // Step 2: Try any alternate slot in same chokepoint
  const altSlot = chokepoint.availableTimeSlots.find(
    (s: ITimeSlot) => s.currentOrders < s.maxOrders
  );
  if (altSlot) {
    altSlot.currentOrders += 1;
    await chokepoint.save();
    return {
      success: true,
      time: altSlot.time,
      point: chokepoint.name,
      message: "Preferred full. Alternative slot assigned"
    };
  }

  // Step 3: Try nearby chokepoints in same zone
  const nearby = await ChokePoint.find({
    zone: chokepoint.zone,
    _id: { $ne: chokepoint._id }
  });

  for (const cp of nearby) {
    const cpSlot = cp.availableTimeSlots.find(
      (s: ITimeSlot) => s.currentOrders < s.maxOrders
    );
    if (cpSlot) {
      cpSlot.currentOrders += 1;
      await cp.save();
      return {
        success: true,
        time: cpSlot.time,
        point: cp.name,
        message: "Redirected to nearby chokepoint"
      };
    }
  }

  return {
  success: false,
  message: "All slots full in this zone",
  alternatives: nearby.map((cp) => ({
    name: cp.name,
    zone: cp.zone,
    coordinates: cp.coordinates,
    availableTimeSlots: cp.availableTimeSlots,
  })),
};

};

export default assignSlot;
