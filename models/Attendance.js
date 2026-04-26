import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  member_id: { type: Number, required: true },
  check_in_time: { type: Date, required: true },
  check_out_time: { type: Date },
  method: {
    type: String,
    enum: ["Manual", "QR"],
    required: true
  }
});

export default mongoose.model("Attendance", attendanceSchema);
