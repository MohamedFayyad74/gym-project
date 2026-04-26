import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  full_name: { type: String, required: true },
  phone_number: { type: String, required: true },
  age: { type: Number, required: true },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true
  },
  status: {
    type: String,
    enum: ["Active", "Expired"],
    required: true
  },
  joined_at: { type: Date, required: true },
  qr_code_id: { type: String, required: true }
});

export default mongoose.model("Members", memberSchema);
