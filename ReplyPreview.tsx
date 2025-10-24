import React from 'react';
import type { Message } from '../types';
import { CloseIcon } from './Icons';

interface ReplyPreviewProps {
  message: Message;
  onCancel: () => void;
}

const ReplyPreview: React.FC<ReplyPreviewProps> = ({ message, onCancel }) => {
  return (
    <div className="relative bg-black/30 p-2 pl-4 rounded-t-lg mb-2 border-l-4 border-blue-500">
      <div className="text-sm font-semibold text-blue-400">
        Replying to {message.user.username}
      </div>
      <p className="text-xs text-gray-300 truncate">
        {message.content || 'Image'}
      </p>
      <button onClick={onCancel} className="absolute top-2 right-2 text-gray-500 hover:text-white">
        <CloseIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ReplyPreview;