// src/components/Message.tsx
import React from 'react';

interface MessageProps {
  message: {
    sender: string;
    content: string;
    type: string;
  };
}

const Message: React.FC<MessageProps> = ({ message }) => {
  return (
    <div>
      <strong>{message.sender}</strong>: {message.content}
    </div>
  );
};

export default Message;
