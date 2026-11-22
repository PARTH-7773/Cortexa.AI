import { ChatGroq } from "@langchain/groq";
import config from "./ENV.config.js";

const llm = new ChatGroq({
  apiKey: config.GROQ_API_KEY,
  model: "qwen/qwen3.8-27b",
  temperature: 0.7,
});

export default llm;
