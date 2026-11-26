import { HumanMessage } from "@langchain/core/messages";
import Graph from "../services/chatGraph.js";
import Agent from "../models/agent.model.js";
import createAgentGraph from "../services/graph/agent.graph.js";
import { success } from "zod";

const chat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }
    const treadId = String(req.user._id);
    const data = await Graph.invoke(
      {
        messages: [new HumanMessage(message)],
      },
      {
        configurable: {
          thread_id: treadId,
        },
      },
    );

    const lastMessages = data.messages[data.messages.length - 1].content;

    return res.status(200).json({
      success: true,
      message: "Ai chat success",
      aiMessage: lastMessages,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Error in chat agent",
    });
  }
};

const agentChat = async (req, res) => {
  try {
    const { message, agent } = req.body;
    if (!message || !agent) {
      return res.status(400).json({
        success: false,
        message: "Message or Agent fields is required",
      });
    }

    const threadId = String(req.user._id);
    const existingAgent = await Agent.findOne({ name: agent });
    if (!existingAgent) {
      return res.status(400).json({
        success: false,
        message: "Agent not found.",
      });
    }
    const graph = await createAgentGraph(existingAgent, req.user._id);
    const result = await graph.invoke(
      {
        messages: [new HumanMessage(message)],
      },
      {
        configurable: { thread_id: threadId },
      },
    );

    const response = result.messages[result.messages.length - 1].content;
    return res.status(200).json({
      success: true,
      messgae: "Agent graph run's succedded.",
      aiMessage: response,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: "Error in agent graph controller.",
    });
  }
};

export default { chat, agentChat };
