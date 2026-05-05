import mongoose from "mongoose";

const trainerSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  phone_number: { type: String, required: true },
  schedule_json: { type: mongoose.Schema.Types.Mixed, required: true },
  bio: { type: String },
  created_at: { type: Date, required: true }
});

export default mongoose.model("Trainers", trainerSchema);
