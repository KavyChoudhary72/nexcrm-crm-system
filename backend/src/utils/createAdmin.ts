import mongoose from "mongoose";
import User from "../models/User.model";
import Company from "../models/Company.model";
import dotenv from "dotenv";

dotenv.config();

const createAdminUser = async () => {
  try {
    const mongoUri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/crm_db";
    
    await mongoose.connect(mongoUri);

    const adminEmail = process.env.ADMIN_EMAIL || "admin@nexcrm.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "adminSecurePass2026!";
    const adminName = process.env.ADMIN_NAME || "NEXCRM Admin";
    const adminOrg = process.env.ADMIN_ORG || "NEXCRM";
    const adminInvite = "NEX123";

    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      // Find or create company
      let company = await Company.findOne({ inviteCode: adminInvite });
      if (!company) {
        company = await Company.create({
          companyName: adminOrg,
          inviteCode: adminInvite,
        });
      }

      await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: "Admin",
        companyId: company._id,
      });
      console.log(`✅ Admin user seeded successfully: ${adminEmail} / [PASSWORD REDACTED]`);
    } else {
      console.log(`⚠️ Admin user already exists: ${adminEmail}`);
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
};

createAdminUser();
