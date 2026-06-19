import dns from "node:dns";
dns.setServers(["1.1.1.1", "1.0.0.1"]);

import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.model";
import Company from "./models/Company.model";

dotenv.config();

async function run() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/crm_db");
    console.log("Connected.");

    // Clean up test user if it exists
    await User.deleteOne({ email: "test_auth_user@example.com" });
    await Company.deleteOne({ inviteCode: "TST123" });

    // Create test company
    const company = await Company.create({
      companyName: "Test Company",
      inviteCode: "TST123",
    });

    console.log("Creating test user...");
    const user = await User.create({
      name: "Test User",
      email: "test_auth_user@example.com",
      password: "password123",
      role: "Sales Executive",
      companyId: company._id,
    });
    console.log("User created successfully:", user);

    console.log("Testing comparePassword...");
    if (user) {
      const isMatch = await user.comparePassword("password123");
      console.log("Password match result:", isMatch);

      const isFail = await user.comparePassword("wrong_password");
      console.log("Password wrong match result (expected false):", isFail);
    }

    // Clean up
    await User.deleteOne({ email: "test_auth_user@example.com" });
    await Company.deleteOne({ inviteCode: "TST123" });
    console.log("Cleanup done.");

    await mongoose.disconnect();
    console.log("Disconnected from DB.");
  } catch (err) {
    console.error("Error during test:", err);
  }
}

run();
