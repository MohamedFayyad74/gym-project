import mongoose from "mongoose";

const membershipSchema = new mongoose.Schema({
  member_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Members",
    required: true
  },
  plan_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plans",
    required: true
  },
  assigned_trainer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trainers",
    default: null
  },
  start_date: { type: Date, required: true },
  expiry_date: { type: Date, required: true },
  payment_status: {
    type: String,
    enum: ["Paid", "Pending"],
    required: true
  },
  created_at: { type: Date, required: true }
});

export default mongoose.model("Memberships", membershipSchema);
