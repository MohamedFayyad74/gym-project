import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  email: { type: String, required: true },
  password_hash: { type: String, required: true },
  full_name: { type: String, required: true },
  last_login: { type: Date },
  created_at: { type: Date, required: true }
});

export default mongoose.model("Admins", adminSchema);
