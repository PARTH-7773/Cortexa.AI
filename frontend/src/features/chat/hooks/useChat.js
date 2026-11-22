import chatApis from "../chat.api";
function useChat() {
  const chat = async (message) => {
    const response = await chatApis.chatApi(message);
    console.log(response);
    if (response.status === 200 && response.data.success) {
      return response.aiMessage;
    }
    return response;
  };
  return {
    chat,
  };
}

export default useChat;
