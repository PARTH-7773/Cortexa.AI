import dotenv from "dotenv";
dotenv.config();

const requiredKeys = ["MONGO_URL", "JWT_SECRET", "GROQ_API_KEY"];
for (const key of requiredKeys) {
  if (!process.env[key]) {
    throw new Error(`${key} is missing in environment variables.`);
  }
}

const config = {
  PORT: process.env.PORT || 5000,
  MONGO_URL: process.env.MONGO_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  GROQ_API_KEY: process.env.GROQ_API_KEY,
};

export default config;