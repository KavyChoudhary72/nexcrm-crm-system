import mongoose, { Document, Schema } from "mongoose";

export interface ILead extends Document {
  name: string;
  company?: string;
  email?: string;
  mobile: string;
  source: "Website Forms" | "WhatsApp" | "Facebook Ads" | "Instagram Ads" | "Referral Sources" | "Other";
  requirement?: string;
  budget?: number;
  status: "New" | "Contacted" | "Qualified" | "Proposal Sent" | "Negotiation" | "Won" | "Lost";
  assignedTo?: mongoose.Types.ObjectId;
  followUpDate?: Date;
  notes?: string[];
  aiScore?: number;
  avatar?: string;
  companyId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: [true, "Lead name is required"],
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
    },
    source: {
      type: String,
      required: [true, "Lead source is required"],
      enum: ["Website Forms", "WhatsApp", "Facebook Ads", "Instagram Ads", "Referral Sources", "Other"],
      default: "Other",
    },
    requirement: {
      type: String,
      trim: true,
    },
    budget: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Qualified", "Proposal Sent", "Negotiation", "Won", "Lost"],
      default: "New",
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    followUpDate: {
      type: Date,
    },
    notes: {
      type: [String],
      default: [],
    },
    aiScore: {
      type: Number,
      min: 1,
      max: 100,
    },
    avatar: {
      type: String,
      default: "",
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

// Indexes for common search and filter queries
leadSchema.index({ companyId: 1 });
leadSchema.index({ email: 1 });
leadSchema.index({ mobile: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ assignedTo: 1 });
leadSchema.index({ createdAt: -1 });

const Lead = mongoose.model<ILead>("Lead", leadSchema);
export default Lead;
