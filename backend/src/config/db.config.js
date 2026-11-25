import mongoose from "mongoose";
import config from "./ENV.config.js";

let cached = globalThis._mongooseCache;
if (!cached) {
  cached = globalThis._mongooseCache = { conn: null, promise: null }
}


async function connectDB() {
  console.log(mongoose.connection.readyState)
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(config.MONGO_URL, {
      maxPoolSize: 5,
      minPoolSize: 0,
      maxIdleTimeMS: 30000,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })
      .then((mongooseInstance) => {
        console.log("DB Connected.")
        return mongooseInstance.connection
      })
      .catch((err) => {
        cached.promise = null;
        throw err;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn
}



export default connectDB;


// import mongoose from "mongoose";
// import config from "./ENV.config.js";

// let cachedPromise = null;

// const cached = globalThis._mongooseCache;
// console.log(mongoose.connection.readyState)

// const connectDB = async () => {
//   if (mongoose.connection.readyState === 1) {
//     return mongoose.connection;
//   }

//   if (!cachedPromise) {
//     cachedPromise = mongoose
//       .connect(config.MONGO_URL)
//       .then((conn) => {
//         console.log("DB connected successfully");
//         return conn;
//       })
//       .catch((error) => {
//         cachedPromise = null;
//         console.error(`Error in DB connection: ${error.message}`);
//         throw error;
//       });
//   }

//   return cachedPromise;
// };

// export default connectDB;
