import React, { useState, useEffect } from 'react';
import ChatHistory from '../../components/ChatHistory/ChatHistory';
import ChatWindow from '../../components/ChatWindow/ChatWindow';
import ChatService from '../../services/ChatService';

export default function ChatPage() {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load Initial Chat History
  useEffect(() => {
    async function loadInitialData() {
      try {
        const data = await ChatService.loadHistory();

        if (data.status === 'success') {
          const defaultChat = {
            id: '1',
            title: 'Main Chat Room',
            messages: data.history.map((msg) => ({
              sender: msg.sender,
              text: msg.message,
            })),
          };

          setChats([defaultChat]);
          setActiveChatId('1');
        }
      } catch (error) {
        console.error('Failed to load history in ChatPage:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialData();
  }, []);

  // Select Chat
  const handleSelectChat = (id) => {
    setActiveChatId(id);
  };

  // Create New Session Chat
  const handleNewChat = () => {
    const sessionId = Date.now().toString();

    const newChat = {
      id: sessionId,
      title: `Session ${chats.length + 1}`,
      messages: [],
    };

    setChats((prevChats) => [...prevChats, newChat]);
    setActiveChatId(sessionId);
  };

  // Send Message
  const handleSendMessage = (message) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              messages: [
                ...chat.messages,
                {
                  sender: 'user',
                  text: message,
                },
              ],
            }
          : chat
      )
    );
  };

  const activeChat = chats.find((c) => c.id === activeChatId);

  if (isLoading) {
    return (
      <div style={{ padding: '20px', color: '#fff' }}>
        Loading Your Chats...
      </div>
    );
  }

  return (
    <div
      className="app-container"
      style={{ display: 'flex', height: '100vh' }}
    >
      <ChatHistory
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
      />

      <ChatWindow
        activeChat={activeChat}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
