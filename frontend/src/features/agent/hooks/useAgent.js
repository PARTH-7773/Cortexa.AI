import agentApis from "@/features/agent/agents.api";

function useAgent() {
  const createAgent = async (credentials) => {
    const response = await agentApis.createAgentApi(credentials);
    if (response.status === 201 && response.data.success) {
      return response.data;
    }
    return response;
  };

  const getAllAgent = async () => {
    const response = await agentApis.getAllAgentApi();
    if (response.status === 200 && response.data.success) {
      return response.data;
    }
    return response;
  };

  const getAgentById = async (id) => {
    const response = await agentApis.getAgentByIdApi(id);
    if (response.status === 200 && response.data.success) {
      return response.data;
    }
    return response;
  };

  const deleteAgent = async (id) => {
    const respose = await agentApis.deleteAgentApi(id);
    if (respose.status === 200 && respose.data.success) {
      return respose.data;
    }
    return respose;
  };

  return {
    createAgent,
    getAllAgent,
    getAgentById,
    deleteAgent,
  };
}

export default useAgent;
