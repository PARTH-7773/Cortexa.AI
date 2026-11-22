import mongoose from "mongoose";
import config from "./ENV.config.js";

const connetDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URL);
    console.log(`DB connected successfully`);
  } catch (error) {
    console.error(`Error in DB connection ${error.message}`);
    process.exit(1);
  }
};

export default connetDB;
