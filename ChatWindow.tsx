import React, { useState, useRef, useEffect } from 'react';
import type { Room, Message, User } from '../types';
import MessageComponent from './Message';
import TypingIndicator from './TypingIndicator';
import EmojiPicker from './EmojiPicker';
import ReplyPreview from './ReplyPreview';
import { SendIcon, HashtagIcon, EmojiIcon, PaperclipIcon, UserIcon, MicIcon, ChevronDownIcon } from './Icons';
import PinnedMessagesBar from './PinnedMessagesBar';
import SearchBar from './SearchBar';
import MentionSuggestions from './MentionSuggestions';
import SmartReplies from './SmartReplies';

type Conversation = { type: 'channel'; target: Room } | { type: 'dm'; target: User };

interface ChatWindowProps {
  conversation: Conversation;
  messages: Message[];
  currentUser: User;
  onSendMessage: (content: string, options?: { replyTo?: Message | null, imageUrl?: string, voiceNote?: { url: string, duration: number } }) => void;
  isBotTyping: boolean;
  onEditMessage: (messageId: string, newContent: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onAddReaction: (messageId: string, emoji: string) => void;
  onPinMessage: (message: Message) => void;
  pinnedMessages: Message[];
  allUsers: User[];
  smartReplies: string[];
}

const ChatWindow: React.FC<ChatWindowProps> = (props) => {
  const { conversation, messages, onSendMessage, currentUser, isBotTyping, pinnedMessages, allUsers, smartReplies, ...messageActions } = props;
  const [inputMessage, setInputMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [showMentions, setShowMentions] = useState(false);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = (behavior: 'smooth' | 'auto' = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };
  
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (container) {
      const isScrolledUp = container.scrollHeight - container.scrollTop > container.clientHeight + 100;
      setShowScrollDown(isScrolledUp);
    }
  };

  useEffect(() => {
    const container = messagesContainerRef.current;
    container?.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if(!showScrollDown) scrollToBottom('auto');
  }, [messages, isBotTyping]);

  useEffect(() => {
    setReplyingTo(null);
    setSearchQuery('');
  }, [conversation]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      onSendMessage(inputMessage.trim(), { replyTo: replyingTo });
      setInputMessage('');
      setShowEmojiPicker(false);
      setReplyingTo(null);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const imageUrl = loadEvent.target?.result as string;
        onSendMessage('', { imageUrl });
      };
      reader.readAsDataURL(file);
    }
    if(fileInputRef.current) fileInputRef.current.value = "";
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputMessage(value);

    const mentionMatch = value.match(/@(\w*)$/);
    if (mentionMatch) {
      setShowMentions(true);
      setMentionQuery(mentionMatch[1]);
    } else {
      setShowMentions(false);
    }
  };

  const handleSelectMention = (username: string) => {
    setInputMessage(prev => prev.replace(/@\w*$/, `@${username} `));
    setShowMentions(false);
  };

  const handleSelectEmoji = (emoji: string) => setInputMessage(prev => prev + emoji);
  const handleSelectSmartReply = (reply: string) => {
    onSendMessage(reply);
  };

  const handleVoiceRecording = () => {
    if (isRecording) {
      // Simulate finishing recording and sending
      onSendMessage('', { voiceNote: { url: 'simulated_audio.mp3', duration: Math.floor(Math.random() * 50) + 5 } });
      setIsRecording(false);
    } else {
      setIsRecording(true);
      setTimeout(() => { // Auto-stop recording simulation
          if(isRecording) {
            onSendMessage('', { voiceNote: { url: 'simulated_audio.mp3', duration: 15 }});
            setIsRecording(false);
          }
      }, 15000);
    }
  }
  
  const filteredMessages = messages.filter(msg => msg.content.toLowerCase().includes(searchQuery.toLowerCase()));
  const headerName = conversation.type === 'channel' ? conversation.target.name : conversation.target.username;
  const headerDescription = conversation.type === 'channel' ? (conversation.target as Room).description : (conversation.target as User).status || 'Direct Message';
  const HeaderIcon = conversation.type === 'channel' ? HashtagIcon : UserIcon;

  return (
    <div className="flex flex-col flex-1 h-full">
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center">
            <HeaderIcon className="w-6 h-6 mr-2 text-gray-400" />
            <div>
              <h2 className="text-xl font-bold text-white">{headerName}</h2>
              <p className="text-xs text-gray-400 truncate">{headerDescription}</p>
            </div>
        </div>
        <SearchBar query={searchQuery} onQueryChange={setSearchQuery} />
      </div>
      
      <PinnedMessagesBar pinnedMessages={pinnedMessages} onUnpin={props.onPinMessage} />

      <div className="relative flex-1 p-4 overflow-y-auto" ref={messagesContainerRef}>
        {filteredMessages.map((msg) => (
          <MessageComponent 
            key={msg.id} 
            message={msg} 
            isCurrentUser={msg.user.id === currentUser.id}
            currentUser={currentUser}
            onReply={setReplyingTo}
            isMentioned={msg.mentions?.includes(currentUser.id) ?? false}
            {...messageActions}
           />
        ))}
        {isBotTyping && messages.at(-1)?.user.id !== 'ai-bot' && <TypingIndicator />}
        <div ref={messagesEndRef} />
        {showScrollDown && (
          <button onClick={() => scrollToBottom()} className="absolute bottom-6 right-6 w-10 h-10 bg-blue-600/80 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-500 transition-transform hover:scale-110">
            <ChevronDownIcon className="w-6 h-6 text-white"/>
          </button>
        )}
      </div>

      <div className="p-4 bg-black/20 border-t border-white/10 backdrop-blur-sm">
        {replyingTo && <ReplyPreview message={replyingTo} onCancel={() => setReplyingTo(null)} />}
        <SmartReplies replies={smartReplies} onSelect={handleSelectSmartReply} />
        <div className="relative">
          {showEmojiPicker && <EmojiPicker onSelectEmoji={handleSelectEmoji} onClose={() => setShowEmojiPicker(false)} />}
          {showMentions && <MentionSuggestions query={mentionQuery} users={allUsers} onSelect={handleSelectMention} />}
          <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
             <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
             <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-400 hover:text-white hover:bg-gray-600/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
              <PaperclipIcon className="w-6 h-6" />
            </button>
            <div className="flex-1 relative">
                <input
                type="text"
                value={inputMessage}
                onChange={handleInputChange}
                placeholder={`Message ${conversation.type === 'channel' ? '#' : ''}${headerName}`}
                className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 disabled:opacity-50"
                autoComplete="off"
                disabled={isBotTyping || isRecording}
                />
                <button type="button" onClick={() => setShowEmojiPicker(prev => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-white">
                    <EmojiIcon className="w-6 h-6" />
                </button>
            </div>
            
            {inputMessage.trim() === '' ? (
                 <button type="button" onClick={handleVoiceRecording} className={`p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors duration-200 ${isRecording ? 'bg-red-600 hover:bg-red-500 focus:ring-red-500 animate-pulse' : 'bg-blue-600 hover:bg-blue-500 focus:ring-blue-500'}`}>
                    <MicIcon className="w-6 h-6 text-white" />
                </button>
            ) : (
                <button type="submit" className="p-3 bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed" disabled={isBotTyping}>
                    <SendIcon className="w-6 h-6 text-white" />
                </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;