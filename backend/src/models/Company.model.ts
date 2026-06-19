import mongoose, { Document, Schema } from "mongoose";

export interface ICompany extends Document {
  companyName: string;
  inviteCode: string;
  createdAt: Date;
}

const companySchema = new Schema<ICompany>({
  companyName: {
    type: String,
    required: [true, "Company name is required"],
    trim: true,
  },
  inviteCode: {
    type: String,
    required: [true, "Invite code is required"],
    unique: true,
    minlength: 6,
    maxlength: 6,
    uppercase: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Company = mongoose.model<ICompany>("Company", companySchema);
export default Company;
