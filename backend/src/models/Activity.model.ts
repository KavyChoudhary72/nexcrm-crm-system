import mongoose, { Document, Schema } from "mongoose";

export interface IActivity extends Document {
  leadId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  type: "Call" | "Meeting" | "Email" | "Status Change" | "Note" | "System";
  content: string;
  companyId: mongoose.Types.ObjectId;
  timestamp: Date;
}

const activitySchema = new Schema<IActivity>({
  leadId: {
    type: Schema.Types.ObjectId,
    ref: "Lead",
    required: [true, "Lead ID is required for activity"],
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required for activity"],
  },
  type: {
    type: String,
    required: [true, "Activity type is required"],
    enum: ["Call", "Meeting", "Email", "Status Change", "Note", "System"],
  },
  content: {
    type: String,
    required: [true, "Activity content description is required"],
    trim: true,
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    required: [true, "Company ID is required"],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

activitySchema.index({ companyId: 1 });
activitySchema.index({ leadId: 1, timestamp: -1 });
activitySchema.index({ userId: 1, timestamp: -1 });

const Activity = mongoose.model<IActivity>("Activity", activitySchema);
export default Activity;
