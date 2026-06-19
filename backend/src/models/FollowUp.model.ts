import mongoose, { Document, Schema } from "mongoose";

export interface IFollowUp extends Document {
  leadId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  date: Date;
  status: "Pending" | "Completed";
  notes?: string;
  companyId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const followUpSchema = new Schema<IFollowUp>(
  {
    leadId: {
      type: Schema.Types.ObjectId,
      ref: "Lead",
      required: [true, "Lead ID is required for follow-up"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required for follow-up (assignee)"],
    },
    title: {
      type: String,
      required: [true, "Follow-up title/requirement is required"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Follow-up date/time is required"],
    },
    status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },
    notes: {
      type: String,
      trim: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company ID is required"],
    },
  },
  {
    timestamps: true,
  }
);

followUpSchema.index({ companyId: 1 });
followUpSchema.index({ leadId: 1, status: 1 });
followUpSchema.index({ userId: 1, date: 1, status: 1 });

const FollowUp = mongoose.model<IFollowUp>("FollowUp", followUpSchema);
export default FollowUp;
