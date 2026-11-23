import Agent from "../models/agent.model.js";

const createAgent = async (req, res) => {
  try {
    const { name, knowledgeBase, instructions, tools } = req.body;
    const userId = req.user._id;
    if (!name || !knowledgeBase || !instructions || !tools) {
      return res.status(400).json({
        success: false,
        message: "All fields are required for creating new agent",
      });
    }
    const existAgent = await Agent.findOne({ userId, name });
    if (existAgent) {
      return res.status(422).json({
        success: false,
        message: `Agent with this name already exist - '${name}'`,
      });
    }
    const agent = await Agent.create({
      userId,
      name,
      knowledgeBase,
      instructions,
      tools,
    });

    return res.status(201).json({
      success: true,
      message: "Agent create successfully",
      agent,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "error in creating agent",
    });
  }
};

const getAllAgent = async (req, res) => {
  try {
    const userId = req.user._id;
    const agent = await Agent.find({
      userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "All agents fetched",
      agent,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "in fetching agents error",
    });
  }
};

const getAgentById = async (req, res) => {
  try {
    const userId = req.user._id;
    const agentId = req.params.id;
    const agent = await Agent.findById({ _id: agentId, _id: userId });

    return res.status(200).json({
      success: true,
      message: "get agent succedded",
      agent,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "error in get agent" });
  }
};

const deleteAgent = async (req, res) => {
  try {
    const agentId = req.params.id;
    const agent = await Agent.findByIdAndDelete({ _id: agentId });

    return res.status(200).json({
      success: true,
      message: "Delete agent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "error in delete agent",
    });
  }
};

export default { createAgent, getAllAgent, getAgentById, deleteAgent };
