import { MCPAdapter } from "@langchain/mcp-adapters";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const _fileName = fileURLToPath(import.meta.url);
const dirName = path.dirname(_fileName);
const serverPath = path.join(dirName, "servers/server.js");

const adapter = new MCPAdapter({
  servers: {
    cortexa: {
      transport: "stdio",
      command: process.execPath,
      args: serverPath,
    },
  },
});
