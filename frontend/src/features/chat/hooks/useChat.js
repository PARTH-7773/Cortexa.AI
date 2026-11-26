import chatApis from "../chat.api";
function useChat() {
  const chat = async (message) => {
    const response = await chatApis.chatApi(message);
    if (response.status === 200 && response.data.success) {
      return response.data;
    }
    return response;
  };

  const agentChat = async (message, agent) => {
    const response = await chatApis.agentChatApi({ message, agent });
    if (response.status === 200 && response.data.success) {
      return response.data;
    }
    return response;
  };
  return {
    chat,
    agentChat,
  };
}

export default useChat;
