import mongoose from "mongoose";

const membershipSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  member_id: { type: Number, required: true },
  plan_id: { type: Number, required: true },
  assigned_trainer_id: { type: Number, default: null },
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
