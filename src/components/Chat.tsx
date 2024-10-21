import React, { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import Message from './Message';

// Definir global si no está definido
if (typeof global === 'undefined') {
  (window as any).global = window;
}

interface ChatMessage {
  sender: string;
  content: string;
  type: string;
}

const Chat: React.FC = () => {
  const [client, setClient] = useState<Client | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [username, setUsername] = useState('');
  const [messageContent, setMessageContent] = useState('');

  useEffect(() => {
    const newClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      onConnect: () => {
        console.log('Connected to WebSocket');
        newClient.subscribe('/topic/public', (message) => {
          if (message.body) {
            const chatMessage: ChatMessage = JSON.parse(message.body);
            setMessages((prev) => [...prev, chatMessage]);
          }
        });
      },
    });
    setClient(newClient);
    newClient.activate();

    return () => {
      newClient.deactivate();
    };
  }, []);

  const handleSendMessage = () => {
    if (messageContent && username && client) {
      const chatMessage: ChatMessage = {
        sender: username,
        content: messageContent,
        type: 'CHAT',
      };
      client.publish({ destination: '/app/chat.sendMessage', body: JSON.stringify(chatMessage) });
      setMessageContent('');
    }
  };

  const handleAddUser = () => {
    if (username && client) {
      const chatMessage: ChatMessage = {
        sender: username,
        content: '',
        type: 'JOIN',
      };
      client.publish({ destination: '/app/chat.addUser', body: JSON.stringify(chatMessage) });
    }
  };

  return (
    <div>
      <h2>Chat Application</h2>
      <input
        type="text"
        placeholder="Enter your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onBlur={handleAddUser}
      />
      <div>
        {messages.map((msg, index) => (
          <Message key={index} message={msg} />
        ))}
      </div>
      <input
        type="text"
        placeholder="Type a message..."
        value={messageContent}
        onChange={(e) => setMessageContent(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default Chat;