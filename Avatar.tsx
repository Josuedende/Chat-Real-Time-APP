import React from 'react';
import { User } from '../types';

interface AvatarProps {
  user: User;
  size?: string; // e.g., '8', '10', '20'
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ user, size = '10', className = '' }) => {
  const sizeClasses = {
    '8': 'w-8 h-8 text-sm',
    '10': 'w-10 h-10 text-xl',
    '20': 'w-20 h-20 text-4xl',
  };

  if (user.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt={user.username}
        className={`rounded-full object-cover ${sizeClasses[size]} ${className}`}
      />
    );
  }

  const isBot = user.id === 'ai-bot';
  const avatarColor = isBot ? 'from-purple-500 to-pink-500' : 'from-blue-400 to-indigo-400';

  return (
    <div
      className={`rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center font-bold text-white ${sizeClasses[size]} ${className}`}
    >
      {user.username.charAt(0).toUpperCase()}
    </div>
  );
};

export default Avatar;