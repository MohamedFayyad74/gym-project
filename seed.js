import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";
import Member from "./models/Member.js";
import Trainer from "./models/Trainer.js";
import Plan from "./models/Plan.js";
import Membership from "./models/Membership.js";
import Attendance from "./models/Attendance.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB ✅\n");

    // Clear existing data
    await Admin.deleteMany({});
    await Member.deleteMany({});
    await Trainer.deleteMany({});
    await Plan.deleteMany({});
    await Membership.deleteMany({});
    await Attendance.deleteMany({});
    console.log("Cleared old data ✨\n");

    // Seed Admins
    const admins = await Admin.insertMany([
      {
        email: "admin@gym.com",
        password_hash: "hashed_password_123",
        full_name: "Ahmed Admin",
        last_login: new Date(),
        created_at: new Date()
      },
      {
        email: "admin2@gym.com",
        password_hash: "hashed_password_456",
        full_name: "Fatima Admin",
        created_at: new Date()
      }
    ]);
    console.log(`✅ ${admins.length} Admins inserted`);

    // Seed Plans
    const plans = await Plan.insertMany([
      {
        plan_name: "Basic Plan",
        duration_days: 30,
        price: mongoose.Types.Decimal128.fromString("300")
      },
      {
        plan_name: "Premium Plan",
        duration_days: 30,
        price: mongoose.Types.Decimal128.fromString("500")
      },
      {
        plan_name: "Pro Plan",
        duration_days: 90,
        price: mongoose.Types.Decimal128.fromString("1200")
      }
    ]);
    console.log(`✅ ${plans.length} Plans inserted`);

    // Seed Trainers
    const trainers = await Trainer.insertMany([
      {
        full_name: "محمود الفتاح",
        phone_number: "0123456789",
        schedule_json: {
          monday: "10:00-18:00",
          wednesday: "10:00-18:00",
          friday: "14:00-20:00"
        },
        bio: "خبرة 5 سنوات في التدريب الشخصي",
        created_at: new Date()
      },
      {
        full_name: "أسماء محمد",
        phone_number: "0987654321",
        schedule_json: {
          tuesday: "08:00-16:00",
          thursday: "08:00-16:00",
          saturday: "10:00-18:00"
        },
        bio: "متخصصة في تدريب اليوجا والفيتنس",
        created_at: new Date()
      }
    ]);
    console.log(`✅ ${trainers.length} Trainers inserted`);

    // Seed Members
    const members = await Member.insertMany([
      {
        full_name: "علي محمد",
        phone_number: "0111222333",
        age: 25,
        gender: "Male",
        status: "Active",
        joined_at: new Date(),
        qr_code_id: "QR_001"
      },
      {
        full_name: "نور السيد",
        phone_number: "0222333444",
        age: 22,
        gender: "Female",
        status: "Active",
        joined_at: new Date(),
        qr_code_id: "QR_002"
      },
      {
        full_name: "خالد أحمد",
        phone_number: "0333444555",
        age: 30,
        gender: "Male",
        status: "Expired",
        joined_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        qr_code_id: "QR_003"
      }
    ]);
    console.log(`✅ ${members.length} Members inserted`);

    // Seed Memberships
    const memberships = await Membership.insertMany([
      {
        member_id: members[0]._id,
        plan_id: 2,
        assigned_trainer_id: 1,
        start_date: new Date(),
        expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        payment_status: "Paid",
        created_at: new Date()
      },
      {
        member_id: members[1]._id,
        plan_id: 1,
        assigned_trainer_id: 2,
        start_date: new Date(),
        expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        payment_status: "Paid",
        created_at: new Date()
      },
      {
        member_id: members[2]._id,
        plan_id: 3,
        assigned_trainer_id: null,
        start_date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        expiry_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        payment_status: "Pending",
        created_at: new Date()
      }
    ]);
    console.log(`✅ ${memberships.length} Memberships inserted`);

    // Seed Attendance
    const attendance = await Attendance.insertMany([
      {
        member_id: 1,
        check_in_time: new Date(),
        check_out_time: new Date(Date.now() + 60 * 60 * 1000),
        method: "QR"
      },
      {
        member_id: 2,
        check_in_time: new Date(Date.now() - 2 * 60 * 60 * 1000),
        check_out_time: new Date(Date.now() - 60 * 60 * 1000),
        method: "Manual"
      },
      {
        member_id: 1,
        check_in_time: new Date(Date.now() - 24 * 60 * 60 * 1000),
        check_out_time: new Date(Date.now() - 23 * 60 * 60 * 1000),
        method: "QR"
      }
    ]);
    console.log(`✅ ${attendance.length} Attendance records inserted`);

    console.log("\n🔥 All collections created and seeded successfully on MongoDB Atlas!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

seedDatabase();
