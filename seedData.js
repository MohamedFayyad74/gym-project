import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Define simple schemas
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  joinDate: { type: Date, default: Date.now }
});

const workoutSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  exerciseName: String,
  sets: Number,
  reps: Number,
  date: { type: Date, default: Date.now }
});

const membershipSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  type: String,
  price: Number,
  startDate: Date,
  endDate: Date
});

// Create models
const User = mongoose.model("User", userSchema);
const Workout = mongoose.model("Workout", workoutSchema);
const Membership = mongoose.model("Membership", membershipSchema);

// Insert sample data
const insertData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB ✅");

    // Clear existing data
    await User.deleteMany({});
    await Workout.deleteMany({});
    await Membership.deleteMany({});

    // Create sample users
    const users = await User.insertMany([
      { name: "أحمد محمد", email: "ahmed@gym.com", phone: "0123456789" },
      { name: "فاطمة علي", email: "fatima@gym.com", phone: "0987654321" },
      { name: "محمود سالم", email: "mahmoud@gym.com", phone: "0111222333" }
    ]);

    console.log("✅ Users inserted:", users.length);

    // Create sample workouts
    const workouts = await Workout.insertMany([
      { userId: users[0]._id, exerciseName: "Bench Press", sets: 4, reps: 8 },
      { userId: users[0]._id, exerciseName: "Squats", sets: 4, reps: 10 },
      { userId: users[1]._id, exerciseName: "Deadlift", sets: 3, reps: 5 },
    ]);

    console.log("✅ Workouts inserted:", workouts.length);

    // Create sample memberships
    const memberships = await Membership.insertMany([
      {
        userId: users[0]._id,
        type: "Premium",
        price: 500,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        userId: users[1]._id,
        type: "Basic",
        price: 300,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    ]);

    console.log("✅ Memberships inserted:", memberships.length);
    console.log("\n🔥 All collections created automatically in MongoDB Atlas!");

    process.exit();
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

insertData();
