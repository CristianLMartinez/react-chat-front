import React, { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';

interface ChatProps {
  username: string;
}

interface ChatMessage {
  sender: string;
  content: string;
  type: string;
}

const Chat: React.FC<ChatProps> = ({ username }) => {
  const [client, setClient] = useState<Client | null>(null);
  const [messageContent, setMessageContent] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const newClient = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      onConnect: () => {
        newClient.subscribe('/topic/public', (message) => {
          if (message.body) {
            setMessages((prevMessages) => [...prevMessages, JSON.parse(message.body)]);
          }
        });

        const chatMessage: ChatMessage = {
          sender: username,
          content: '',
          type: 'JOIN',
        };
        newClient.publish({ destination: '/app/chat.addUser', body: JSON.stringify(chatMessage) });
      },
    });
    setClient(newClient);
    newClient.activate();

    return () => newClient.deactivate();
  }, [username]);

  const handleSendMessage = () => {
    if (messageContent && client) {
      const chatMessage: ChatMessage = {
        sender: username,
        content: messageContent,
        type: 'CHAT',
      };
      client.publish({ destination: '/app/chat.sendMessage', body: JSON.stringify(chatMessage) });
      setMessageContent('');
    }
  };

  return (
    <div>
      <h2>Chat Room</h2>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender}: </strong> {msg.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Enter your message"
        value={messageContent}
        onChange={(e) => setMessageContent(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default Chat;