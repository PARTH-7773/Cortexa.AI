import { McpServer } from "@modelcontextprotocol/server";
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import { z } from "zod";
import { TavilySearch } from "@langchain/tavily";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import path from "node:path";

const _dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(_dirname, "../../../../.env") });

const server = new McpServer({
  name: "cortexa_ai_mcp_server",
  version: "1.0.0",
});

const tavilySearch = new TavilySearch({
  maxResults: 5,
  topic: "general",
});

server.registerTool(
  "web_search",
  {
    description: "Serach the web for current information, tutorials, and news.",
    inputSchema: z.object({
      query: z.string(),
    }),
  },
  async ({ query }) => {
    try {
      const result = await tavilySearch.invoke({ query });

      return {
        content: [
          {
            type: "text",
            text: result,
          },
        ],
      };
    } catch (err) {
      console.log(err);
      return {
        content: [
          {
            type: "text",
            text: "web search failed",
          },
        ],
      };
    }
  },
);

const main = async () => {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log("MCP server started successfully.");
};

main().catch((err) => {
  console.error("MCP server error", err);
});
