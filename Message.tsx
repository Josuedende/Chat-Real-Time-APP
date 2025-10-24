import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Message, User } from '../types';
import MessageMenu from './MessageMenu';
import Avatar from './Avatar';
import MessageStatus from './MessageStatus';
import LinkPreview from './LinkPreview';
import VoiceNotePlayer from './VoiceNotePlayer';

interface MessageProps {
  message: Message;
  isCurrentUser: boolean;
  currentUser: User;
  onReply: (message: Message) => void;
  onEditMessage: (messageId: string, newContent: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onAddReaction: (messageId: string, emoji: string) => void;
  onPinMessage: (message: Message) => void;
  isMentioned: boolean;
}

const MessageComponent: React.FC<MessageProps> = (props) => {
  const { message, isCurrentUser, currentUser, onReply, isMentioned, ...actions } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
  
  if (message.type === 'system') {
    return (
      <div className="text-center my-2">
        <span className="text-xs text-gray-500 italic px-2">{message.content}</span>
      </div>
    );
  }

  const handleEditSave = () => {
    if (editedContent.trim() !== message.content) {
      actions.onEditMessage(message.id, editedContent.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEditSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditedContent(message.content);
    }
  }

  const renderContentWithMentions = (content: string) => {
    const mentionRegex = /@(\w+)/g;
    const parts = content.split(mentionRegex);
    return parts.map((part, index) => {
        if (index % 2 === 1) { // It's a username
            return <span key={index} className="bg-blue-500/50 text-blue-200 rounded px-1 py-0.5 font-semibold">@{part}</span>;
        }
        return part;
    });
  }

  const messageBubbleColor = isCurrentUser ? 'bg-blue-600' : 'bg-gray-700';
  const messageGroupClass = `group relative flex items-start gap-3 my-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`;
  const mentionedClass = isMentioned ? 'border-l-2 border-yellow-400 bg-yellow-400/10' : '';

  const renderMessageContent = () => {
    if (isEditing) {
      return (
        <div className="w-full">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-white resize-none text-sm"
            rows={Math.max(2, editedContent.split('\n').length)}
            autoFocus
          />
          <div className="text-right mt-1 text-xs text-gray-400">
            <button onClick={handleEditSave} className="font-semibold text-blue-400 hover:underline">Save</button>
            <span className="mx-1">·</span>
            <button onClick={() => setIsEditing(false)} className="hover:underline">Cancel</button>
          </div>
        </div>
      );
    }
    return (
      <>
        {message.imageUrl && <img src={message.imageUrl} alt="User upload" className="rounded-lg max-w-xs max-h-64 mb-2 object-cover" />}
        {message.voiceNote && <VoiceNotePlayer src={message.voiceNote.url} duration={message.voiceNote.duration} />}
        {message.content && (
           <div className="prose prose-sm prose-invert max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-2 prose-ol:my-2 prose-code:text-xs prose-code:bg-black/20 prose-code:p-1 prose-code:rounded">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                p: ({node, ...props}) => <p {...props} className="whitespace-pre-wrap">{renderContentWithMentions(props.children as string)}</p>
              }}>{message.content}</ReactMarkdown>
           </div>
        )}
         {message.linkPreview && <LinkPreview {...message.linkPreview} />}
      </>
    )
  }

  return (
    <div className={`${messageGroupClass} ${mentionedClass}`}>
      {!isCurrentUser && <Avatar user={message.user} size="10" className="flex-shrink-0" />}
      
      <div className={`flex flex-col max-w-lg ${isCurrentUser ? 'items-end' : 'items-start'}`}>
        <div className="flex items-center gap-2">
          {!isCurrentUser && <span className="font-bold text-sm">{message.user.username}</span>}
          <span className="text-xs text-gray-500">{message.timestamp}</span>
          {isCurrentUser && message.status && <MessageStatus status={message.status} />}
          {message.isEdited && !isEditing && <span className="text-xs text-gray-500">(edited)</span>}
        </div>
        
        {message.replyTo && (
            <div className={`pl-2 border-l-2 border-gray-500 text-xs text-gray-400 mt-1 mb-1 p-1 rounded-r-md bg-black/20 w-full truncate`}>
                Replying to <span className="font-semibold">{message.replyTo.user.username}</span>: "{message.replyTo.content}"
            </div>
        )}
        
        <div className={`relative mt-1 p-3 rounded-lg ${messageBubbleColor} text-white`}>
          {renderMessageContent()}
        </div>
        
        {message.reactions && Object.keys(message.reactions).length > 0 && (
          <div className="flex gap-1 mt-1.5">
            {Object.entries(message.reactions).map(([emoji, userIds]) => {
                const users = userIds as string[];
                return users.length > 0 && (
                <button key={emoji} onClick={() => actions.onAddReaction(message.id, emoji)} className={`px-2 py-0.5 rounded-full text-xs flex items-center gap-1 transition-colors ${users.includes(currentUser.id) ? 'bg-blue-500/50' : 'bg-gray-600/50 hover:bg-gray-600'}`}>
                  <span>{emoji}</span>
                  <span>{users.length}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {isCurrentUser && <Avatar user={currentUser} size="10" className="flex-shrink-0" />}
      
      {!isEditing && <MessageMenu message={message} isCurrentUser={isCurrentUser} onReply={onReply} onEdit={() => setIsEditing(true)} onDelete={() => actions.onDeleteMessage(message.id)} onAddReaction={(emoji) => actions.onAddReaction(message.id, emoji)} onPinMessage={() => actions.onPinMessage(message)} />}
    </div>
  );
};

export default MessageComponent;