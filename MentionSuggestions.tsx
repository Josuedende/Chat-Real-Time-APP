import React from 'react';
import type { User } from '../types';
import Avatar from './Avatar';

interface MentionSuggestionsProps {
  query: string;
  users: User[];
  onSelect: (username: string) => void;
}

const MentionSuggestions: React.FC<MentionSuggestionsProps> = ({ query, users, onSelect }) => {
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().startsWith(query.toLowerCase()) && user.id !== 'ai-bot'
  );

  if (filteredUsers.length === 0) {
    return null;
  }

  return (
    <div className="absolute bottom-full mb-2 w-full sm:w-64 max-h-48 overflow-y-auto bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-lg shadow-xl z-10">
      <ul>
        {filteredUsers.map(user => (
          <li key={user.id}>
            <button
              onClick={() => onSelect(user.username)}
              className="w-full flex items-center p-2 text-left hover:bg-gray-700/50 transition-colors"
            >
              <Avatar user={user} size="8" className="mr-3" />
              <span className="font-semibold">{user.username}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MentionSuggestions;