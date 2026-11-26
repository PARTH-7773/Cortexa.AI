import { MCPAdapter } from "@langchain/mcp-adapters";
import path from "node:path";
import { fileURLToPath } from "node:url";
import config from "../../config/ENV.config.js";

const _fileName = fileURLToPath(import.meta.url);
const dirName = path.dirname(_fileName);
const serverPath = path.join(dirName, "./servers/server.js");

const adapter = new MCPAdapter({
  servers: {
    cortexa: {
      transport: "stdio",
      command: process.execPath,
      args: [serverPath],
      // env: { ...process.env, TAVILY_API_KEY: config.TAVILY_API_KEY },
    },
  },
});

export const getMcpTools = async () => {
  const tools = await adapter.listTools();
  return tools
};
