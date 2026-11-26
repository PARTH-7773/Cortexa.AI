import { McpServer } from "@modelcontextprotocol/server";
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import { z } from "zod";

const server = new McpServer({
  name: "cortexa-ai-mcp-server",
  version: "1.0.0",
});

server.registerTool(
  "web_search",
  {
    description: "Serach the web for current information, tutorials, and news.",
    inputSchema: z.object({
      query: z.string(),
    }),
  },
  async ({ query }) => {},
);

const main = async () => {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log("MCP server started successfully.");
};

main().catch((err) => {
  console.error("MCP server error", err);
  process.exit(1);
});
