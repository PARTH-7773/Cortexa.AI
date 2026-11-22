import dotenv from "dotenv";
dotenv.config();

if (!process.env.PORT) {
  throw new Error("PORT is missing on ENV veriables.");
}

if (!process.env.MONGO_URL) {
  throw new Error("MONGO URL is missing ENV veriables.");
}
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is missing ENV veriables.");
}
if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is missing ENV veriables.");
}

const config = {
  PORT: process.env.PORT,
  MONGO_URL: process.env.MONGO_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  GROQ_API_KEY: process.env.GROQ_API_KEY,
};

export default config;
