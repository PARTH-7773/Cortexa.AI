import { MongoClient } from "mongodb";
import { MongoDBSaver } from "@langchain/langgraph-checkpoint-mongodb";
import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";

import llm from "../../config/llm.config.js";
import config from "../../config/ENV.config.js";
import { SystemMessage } from "@langchain/core/messages";

const mongoClient = new MongoClient(config.MONGO_URL);
const checkpointer = new MongoDBSaver({
  client: mongoClient,
});

const currentDateTime = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  dateStyle: "full",
  timeStyle: "long",
}).format(new Date());
const systemPrompt = `
    ${agent.instruction || "You are cortexa AI, a helpful personal assistant "}

    CURRENT DATE AND TIME:
    - Current date and time asia/Kolkata: ${currentDateTime}
    - Resolve today, tomorrow , and weekday references using this timestamp.
    - Do not ask the user to confirm a date that can be resolved.

    DEFAULT SETTINGS:
    - Timezone: Asia/Kolkata.
    - Default calender event duration: 30 minutes.
    - Infer meaningful event title.
    - Ask only for essential missing informations.
    - Never fabricate tool results.

    IMPORTANT ACTION RULES:
    - When the user directly requests an action, call the relevant tool.
    - The application handles approval through an approval card.
    - Do not ask for approval in your chat response
    - Never claim an  email was send without tool confirmation.
    
`;

const chatNode = async (state) => {
  const response = await llm.invoke([new SystemMessage()]);
  return {
    messages: [response],
  };
};
const actionApprovalNode = async (state) => {};
const routeAfterChat = async (state) => {};
const routeAfterApproval = async (state) => {};

const toolNode = new ToolNode();

const workFlow = new StateGraph(MessagesAnnotation)
  .addNode("chatNode", chatNode)
  .addNode("tooNode", toolNode)
  .addNode("ActinApprovalNode", actionApprovalNode)
  .addEdge("__start__", "chatNode")
  .addEdge("chatNode", routeAfterChat)
  .addEdge("toolNode", "chatNode")
  .addConditionalEdges("ActinApprovalNode", routeAfterApproval)
  .addEdge("chatNode", "__end__");

const ChatAgentGraph = workFlow.compile({ checkpointer });

export default ChatAgentGraph;
