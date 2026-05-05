import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
  plan_name: { type: String, required: true },
  duration_days: { type: Number, required: true },
  price: { type: mongoose.Schema.Types.Decimal128, required: true }
});

export default mongoose.model("Plans", planSchema);
