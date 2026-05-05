import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  member_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Members",
    required: true
  },
  check_in_time: { type: Date, required: true },
  check_out_time: { type: Date },
  method: {
    type: String,
    enum: ["Manual", "QR"],
    required: true
  }
});

export default mongoose.model("Attendance", attendanceSchema);
