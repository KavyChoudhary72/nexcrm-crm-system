import mongoose from "mongoose";
import User from "../models/User.model";
import Company from "../models/Company.model";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/crm_db",
    );
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Auto-seed default workspace/company and administrator if user collection is empty
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const adminEmail = process.env.ADMIN_EMAIL || "admin@nexcrm.com";
      const adminPassword = process.env.ADMIN_PASSWORD || "adminSecurePass2026!";
      const adminName = process.env.ADMIN_NAME || "NEXCRM Admin";
      const adminOrg = process.env.ADMIN_ORG || "NEXCRM";
      const adminInvite = "NEX123";

      console.log(`Seeding default company workspace: ${adminOrg} (Invite Code: ${adminInvite})...`);
      
      let company = await Company.findOne({ inviteCode: adminInvite });
      if (!company) {
        company = await Company.create({
          companyName: adminOrg,
          inviteCode: adminInvite,
        });
      }

      console.log(`Seeding default administrator user: ${adminEmail} for company: ${adminOrg}...`);
      await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword, // Will be hashed automatically by User schema pre-save hook
        role: "Admin",
        companyId: company._id,
      });
      console.log(`✅ Default administrator seeded successfully: ${adminEmail}`);
    }
    
    return conn;
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

export default connectDB;
