import mongoose from "mongoose";
import dns from "node:dns";

dns.setServers(["8.8.8.8"]);
const connectDB = async () => {
  try {

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");
  } catch (error) {
    console.log("MongoDB Error:", error);
  }
};

export default connectDB;