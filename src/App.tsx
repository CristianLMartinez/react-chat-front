import React, { useState } from 'react';
import Chat from './Chat';

const App: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [isRegistered, setIsRegistered] = useState<boolean>(false);

  const handleRegister = () => {
    if (username.trim()) {
      setIsRegistered(true);
    }
  };

  return (
    <div>
      {!isRegistered ? (
        <div>
          <h2>Register</h2>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={handleRegister}>Join Chat</button>
        </div>
      ) : (
        <Chat username={username} />
      )}
    </div>
  );
};

export default App;