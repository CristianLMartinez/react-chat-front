import React, { useState } from 'react';

interface UsernameProps {
  onUsernameSubmit: (username: string) => void;
}

const Username: React.FC<UsernameProps> = ({ onUsernameSubmit }) => {
  const [name, setName] = useState<string>('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (name) {
      onUsernameSubmit(name);
    }
  };

  return (
    <div id="username-page" className="username-page-container">
      <h1 className="title">Type your username to enter the Chat</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-control"
            autoComplete="off"
          />
        </div>
        <div className="form-group">
          <button type="submit" className="accent username-submit">Chat</button>
        </div>
      </form>
    </div>
  );
};

export default Username;