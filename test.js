import mongoose from "mongoose";

mongoose.connect("mongodb+srv://fyadmhmd403_db_user:142536@gym.t43tevf.mongodb.net/?appName=GYM")
  .then(() => {
    console.log("Connected ✅");
    process.exit();
  })
  .catch(err => console.log(err));