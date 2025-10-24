import React from 'react';
import type { Message } from '../types';
import { PinIcon, CloseIcon } from './Icons';

interface PinnedMessagesBarProps {
  pinnedMessages: Message[];
  onUnpin: (message: Message) => void;
}

const PinnedMessagesBar: React.FC<PinnedMessagesBarProps> = ({ pinnedMessages, onUnpin }) => {
  if (pinnedMessages.length === 0) {
    return null;
  }

  return (
    <div className="p-2 border-b border-white/10 bg-black/20 backdrop-blur-sm flex items-center gap-2 text-sm">
      <PinIcon className="w-4 h-4 text-yellow-400 flex-shrink-0 mx-2" />
      <div className="flex-1 overflow-x-auto whitespace-nowrap py-1">
        {pinnedMessages.map((msg, index) => (
          <div key={msg.id} className="inline-flex items-center bg-gray-700/50 rounded-full px-3 py-1 mr-2">
            <span className="font-semibold mr-1">{msg.user.username}:</span>
            <span className="truncate max-w-xs">{msg.content || 'Attachment'}</span>
            <button onClick={() => onUnpin(msg)} className="ml-2 text-gray-400 hover:text-white">
                <CloseIcon className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PinnedMessagesBar;