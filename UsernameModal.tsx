
import React, { useState } from 'react';
import { UserIcon } from './Icons';

interface UsernameModalProps {
  onUsernameSubmit: (username: string) => void;
}

const UsernameModal: React.FC<UsernameModalProps> = ({ onUsernameSubmit }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onUsernameSubmit(username.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-90 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="w-full max-w-sm p-8 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome!</h1>
            <p className="text-gray-400 mb-8">Please enter a username to join the chat.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <UserIcon className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your Username"
              className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!username.trim()}
          >
            Join Chat
          </button>
        </form>
      </div>
    </div>
  );
};

export default UsernameModal;