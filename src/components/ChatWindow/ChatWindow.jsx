import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import ChatService from './../../services/ChatService'; // Adjust path if necessary
import './ChatWindow.css';

export default function ChatWindow({ activeChat, onSendMessage }) {
  const [input, setInput] = useState('');
  const [localMessages, setLocalMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Fetch history when an active chat is selected
  useEffect(() => {
    if (!activeChat) return;

    async function fetchChatHistory() {
      setIsLoading(true);
      try {
        const data = await ChatService.loadHistory();
        if (data.status === 'success') {
          // Here we adapt "message" from backend to your "text" key
          const formattedMessages = data.history.map((msg) => ({
            sender: msg.sender,
            text: msg.message,
          }));
          setLocalMessages(formattedMessages);
        }
      } catch (error) {
        console.error('Failed to load chat history:', error);
        // Fallback to default activeChat messages if backend fails
        setLocalMessages(activeChat.messages || []);
      } finally {
        setIsLoading(false);
      }
    }

    fetchChatHistory();
  }, [activeChat]);

  // 2. Handle sending a message to the backend proxy
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userTextInput = input;
    setInput(''); // Clear input immediately for a snappy UI

    // Optimistically add user message to the UI screen
    const newUserMessage = { sender: 'user', text: userTextInput };
    setLocalMessages((prev) => [...prev, newUserMessage]);

    // Optional: Notify parent component if your sidebar/state needs updating
    if (onSendMessage) {
      onSendMessage(userTextInput);
    }

    try {
      // Send to FastAPI via Vite proxy
      const data = await ChatService.sendMessage(userTextInput);

      if (data.status === 'success') {
        // Append the bot response returned from the backend
        const botReply = { sender: 'bot', text: data.reply };
        setLocalMessages((prev) => [...prev, botReply]);
      }
    } catch (error) {
      console.error('Failed to send message to backend:', error);
      // Optional: Add an error message indicator to the chat UI here
    }
  };

  if (!activeChat) {
    return (
      <div className="chat-window empty">Select or create a chat to begin!</div>
    );
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h2>{activeChat.title}</h2>
      </div>

      <div className="messages-container">
        {isLoading ? (
          <div className="loading-indicator">Loading history...</div>
        ) : (
          localMessages.map((msg, index) => (
            <div key={index} className={`message-row ${msg.sender}`}>
              <div className="message-bubble">{msg.text}</div>
            </div>
          ))
        )}
      </div>

      <form className="input-container" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}