import mongoose, {
  Document,
  Schema,
  CallbackWithoutResultAndOptionalError,
} from "mongoose";
import bcrypt from "bcryptjs";

// Define the User interface
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "Admin" | "Sales Executive";
  companyId: mongoose.Types.ObjectId;
  avatar?: string;
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Create the schema
const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
  },
  role: {
    type: String,
    enum: ["Admin", "Sales Executive"],
    default: "Sales Executive",
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index on companyId and email (unique)
userSchema.index({ companyId: 1, email: 1 }, { unique: true });
userSchema.index({ companyId: 1 });

// Hash password before saving
userSchema.pre("save", async function (this: IUser) {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Create and export the model
const User = mongoose.model<IUser>("User", userSchema);
export default User;
