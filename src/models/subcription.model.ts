import { ISubscriber } from "@/types/types.js";
import mongoose, { Schema } from "mongoose";

export const subscriptionSchema = new Schema(
  {
    subscriber: {
      type: Schema.Types.ObjectId, //the one who is subscribed
      ref: "User",
    },
    channel: {
      type: Schema.Types.ObjectId, //the one whom the subscriber is subscribed to
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const Subscription = mongoose.model<ISubscriber>("Subscription", subscriptionSchema);
