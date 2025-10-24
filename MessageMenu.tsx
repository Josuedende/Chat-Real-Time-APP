import React, { useState } from 'react';
import type { Message } from '../types';
import { REACTION_EMOJIS } from '../constants';
import { EmojiIcon, ReplyIcon, EditIcon, TrashIcon, MoreHorizontalIcon, PinIcon } from './Icons';

interface MessageMenuProps {
  message: Message;
  isCurrentUser: boolean;
  onReply: (message: Message) => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddReaction: (emoji: string) => void;
  onPinMessage: (message: Message) => void;
}

const MessageMenu: React.FC<MessageMenuProps> = (props) => {
  const { message, isCurrentUser, onReply, onEdit, onDelete, onAddReaction, onPinMessage } = props;
  const [showReactions, setShowReactions] = useState(false);

  const actionButtonClass = "p-1.5 rounded-full hover:bg-white/20 transition-colors";
  const menuPosition = isCurrentUser ? 'left-2' : 'right-2';

  return (
    <div className={`absolute top-0 ${menuPosition} transform -translate-y-1/2 flex items-center gap-1 bg-gray-800 border border-gray-700 p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10`}>
        <div className="relative">
            <button onClick={() => setShowReactions(prev => !prev)} className={actionButtonClass} aria-label="Add reaction">
                <EmojiIcon className="w-5 h-5" />
            </button>
            {showReactions && (
                <div className="absolute bottom-full mb-1 flex gap-1 bg-gray-900 p-1 rounded-full" onMouseLeave={() => setShowReactions(false)}>
                    {REACTION_EMOJIS.map(emoji => (
                        <button key={emoji} onClick={() => { onAddReaction(emoji); setShowReactions(false); }} className="p-1 text-xl rounded-full hover:bg-white/20">
                            {emoji}
                        </button>
                    ))}
                </div>
            )}
        </div>
        <button onClick={() => onReply(message)} className={actionButtonClass} aria-label="Reply">
            <ReplyIcon className="w-5 h-5" />
        </button>
        <button onClick={() => onPinMessage(message)} className={`${actionButtonClass} ${message.isPinned ? 'text-yellow-400' : ''}`} aria-label={message.isPinned ? 'Unpin message' : 'Pin message'}>
            <PinIcon className="w-5 h-5" />
        </button>
        {isCurrentUser && (
            <>
                <button onClick={onEdit} className={actionButtonClass} aria-label="Edit message">
                    <EditIcon className="w-5 h-5" />
                </button>
                <button onClick={onDelete} className={`${actionButtonClass} text-red-400 hover:bg-red-500/30`} aria-label="Delete message">
                    <TrashIcon className="w-5 h-5" />
                </button>
            </>
        )}
    </div>
  );
};

export default MessageMenu;