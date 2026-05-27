import React from 'react';
import { MessageSquare, Plus } from 'lucide-react';
import './ChatHistory.css';

export default function ChatHistory({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
}) {
  return (
    <div className="sidebar">
      <button className="new-chat-btn" onClick={onNewChat}>
        <Plus size={18} /> New Chat
      </button>
      <div className="history-list">
        <h3>Sessions</h3>
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`history-item ${
              chat.id === activeChatId ? 'active' : ''
            }`}
            onClick={() => onSelectChat(chat.id)}
          >
            <MessageSquare size={16} />
            <span className="truncate">{chat.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}