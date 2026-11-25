import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { MongoClient } from "mongodb";
import { MongoDBSaver } from "@langchain/langgraph-checkpoint-mongodb";

import llm from "../config/llm.config.js";
import config from "../config/ENV.config.js";

const mongoClient = new MongoClient(config.MONGO_URL);
const checkpointer = new MongoDBSaver({
  client: mongoClient,
  dbName: "langgraph",
});

const chatNode = async (state) => {
  const response = await llm.invoke(state.messages);

  return {
    messages: [response],
  };
};

const workflow = new StateGraph(MessagesAnnotation)
  .addNode("chatNode", chatNode)
  .addEdge("__start__", "chatNode")
  .addEdge("chatNode", "__end__");

const Graph = workflow.compile({ checkpointer });

export default Graph;
