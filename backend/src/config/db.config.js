import mongoose from "mongoose";
import config from "./ENV.config.js";

let cachedPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!cachedPromise) {
    cachedPromise = mongoose
      .connect(config.MONGO_URL)
      .then((conn) => {
        console.log("DB connected successfully");
        return conn;
      })
      .catch((error) => {
        cachedPromise = null;
        console.error(`Error in DB connection: ${error.message}`);
        throw error;
      });
  }

  return cachedPromise;
};

export default connectDB;
