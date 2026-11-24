import chatApis from "../chat.api";
function useChat() {
  const chat = async (message) => {
    const response = await chatApis.chatApi(message);
    if (response.status === 200 && response.data.success) {
      return response.data;
    }
    return response;
  };
  return {
    chat,
  };
}

export default useChat;
