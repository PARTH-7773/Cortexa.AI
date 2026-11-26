import { MongoClient } from "mongodb";
import { MongoDBSaver } from "@langchain/langgraph-checkpoint-mongodb";
import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { SystemMessage } from "@langchain/core/messages";

import llm from "../../config/llm.config.js";
import config from "../../config/ENV.config.js";
import { getMcpTools } from "../mcp/mcp-adapter.js";

const mongoClient = new MongoClient(config.MONGO_URL);
const checkpointer = new MongoDBSaver({
  client: mongoClient,
});

const SENSITIVE_TOOLS = new Set([
  "send_email",
  "publish_instagram_image",
  "web_search",
]);

const normalizeToolName = (name = "") =>
  String(name).replace(/^cortexa[_:.-]?/i, "");

const createAgentGraph = async (agent = {}, userId) => {
  const mcpTools = await getMcpTools();
  const llmWithTools =
    mcpTools.length > 0 && typeof llm.bindTools === "function"
      ? llm.bindTools(mcpTools)
      : llm;

  const currentDateTime = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "long",
  }).format(new Date());

  const systemPrompt = `
${agent.instruction || "You are Cortexa AI, a helpful personal assistant."}

CURRENT DATE AND TIME:
- Current date and time (Asia/Kolkata): ${currentDateTime}
- Resolve today, tomorrow, and weekday references using this timestamp.
- Do not ask the user to confirm a date that can be resolved.

DEFAULT SETTINGS:
- Timezone: Asia/Kolkata.
- Default calendar event duration: 30 minutes.
- Infer meaningful event titles.
- Ask only for essential missing information.
- Never fabricate tool results.

IMPORTANT ACTION RULES:
- When the user directly requests an action, call the relevant tool.
- The application handles approval through an approval card.
- Do not ask for approval in your chat response.
- Never claim an action succeeded unless the tool confirms success.

EMAIL SENDING RULES:
1. Call send_email when the required details are available.
2. Ask for the recipient only when it is missing and cannot be inferred.
3. Never ask for passwords, tokens, API keys, or user IDs.
4. The application requests approval before sending.
5. Never claim an email was sent without tool confirmation.

CALENDAR RULES:
1. Call create_calendar_event when sufficient details are available.
2. Do not ask "Would you like me to create it?".
3. Resolve relative dates using the current date above.
4. Default duration is 30 minutes.
5. Use ISO 8601 date-time strings with an explicit timezone offset.
6. Set timezone to "Asia/Kolkata".
7. Ask a follow-up only when essential event details conflict or are missing.
8. Use list_calendar_events to retrieve existing events.
9. Never claim an event was created without tool confirmation.

GMAIL EMAIL READING RULES:
1. Use list_email when the user asks to see or search emails.
2. Use "in:inbox" for the latest inbox emails.
3. Use "in:unread" for unread emails.
4. Use Gmail search syntax for sender and subject searches.
5. Use read_email to retrieve a specific email's content.
6. If its message ID is unknown, call list_emails first.
7. Summarize actual retrieved email content.
8. Never invent email content.
9. Reading and searching emails are read-only.
10. Use list_emails and read_email, not their raw MCP tool names.

INSTAGRAM PUBLISHING RULES:
1. Call publish_instagram_image ONLY when the latest user message explicitly requests publishing, posting, sharing, or uploading an image to Instagram.
2. Uploading an image to chat is NOT permission to publish it.
3. Asking for image analysis, a description, or an Instagram caption is NOT permission to publish.
4. Never trigger publishing from an image upload alone.
5. Never infer publishing intent from an image URL, filename, image description, or unrelated previous conversation.
6. If the user only uploads an image, analyze it and describe it.
7. If the user asks for a caption, generate the caption without publishing.
8. If publishing intent is explicit but the image URL is missing, ask the user to upload the image first.
9. The application must obtain explicit approval before publishing.
10. Never claim a post was published without tool confirmation.

IMAGE ANALYSIS RULES:
1. If the user uploads an image or asks a question about an image, use analyze_image when the image URL is available.
2. If the user uploads the image without a question, analyze it and provide a useful description.
3. Answer image-related questions using the actual analysis.
4. Never call publish_instagram_image for image analysis or description.
5. Never suggest publishing solely because an image was uploaded.
6. Keep image analysis and Instagram publishing as separate actions.
7. If image analysis fails, explain the failure honestly.
8. Never claim to have viewed an image if analysis failed.

GENERAL RULES:
- Be concise and helpful.
- Infer parameters when sufficient content is available.
- Never substitute a natural-language promise for a tool call.
- Ask questions only when essential information is missing.
`.trim();

  const toolnode = new ToolNode(mcpTools);

  const chatNode = async (state) => {
    const response = await llmWithTools.invoke([
      new SystemMessage(systemPrompt),
      ...(state.messages || []),
    ]);
    return {
      messages: [response],
    };
  };

  const routeAfterChat = (state) => {
    console.log("State messages: ", state.messages);
    const messages = state.messages || [];
    const lastMessage = messages[messages.length - 1];
    const toolCalls = lastMessage?.tool_calls || [];

    if (!toolCalls.length) {
      return "__end__";
    }

    const requiresApproval = toolCalls.some((tc) =>
      SENSITIVE_TOOLS.has(normalizeToolName(tc.name)),
    );

    return requiresApproval ? "ActionApprovalNode" : "toolNode";
  };

  const actionApprovalNode = async (state) => {
    // Wire HITL interrupt() / approval handling here when ready;
    // for now, pass through to toolNode so the graph compiles and runs.
    return {};
  };

  const routeAfterApproval = () => {
    return "toolNode";
  };

  const workFlow = new StateGraph(MessagesAnnotation)
    .addNode("chatNode", chatNode)
    .addNode("toolNode", toolnode)
    .addNode("ActionApprovalNode", actionApprovalNode)
    .addEdge("__start__", "chatNode")
    .addConditionalEdges("chatNode", routeAfterChat, {
      ActionApprovalNode: "ActionApprovalNode",
      toolNode: "toolNode",
      __end__: "__end__",
    })
    .addEdge("toolNode", "chatNode")
    .addConditionalEdges("ActionApprovalNode", routeAfterApproval, {
      toolNode: "toolNode",
      __end__: "__end__",
    });

  return workFlow.compile({ checkpointer });
};

export default createAgentGraph;
