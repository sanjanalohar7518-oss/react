const BASE_URL = '/api';

const ChatService = {

  // GET chat history by session
  async loadHistory(sessionId) {
    try {

      const response = await fetch(
        `${BASE_URL}/chat/load-history/${sessionId}`
      );

      if (!response.ok) {
        throw new Error('Failed to load history');
      }

      return await response.json();

    } catch (error) {
      console.error('Error loading chat history:', error);
      throw error;
    }
  },

  // POST message with session_id
  async sendMessage(sessionId, messageText) {
    try {

      const response = await fetch(
        `${BASE_URL}/chat/message`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            session_id: sessionId,
            message: messageText,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      return await response.json();

    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },
};

export default ChatService;