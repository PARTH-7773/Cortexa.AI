import { HumanMessage } from "@langchain/core/messages";
import Graph from "../services/chatGraph.js";

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

export default { chat };
