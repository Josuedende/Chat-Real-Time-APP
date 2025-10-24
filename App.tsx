

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import type { Room, Message, User, Theme } from './types';
import { ROOMS, INITIAL_USERS, THEMES } from './constants';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import UsernameModal from './components/UsernameModal';
import SettingsModal from './components/SettingsModal';

type Conversation = { type: 'channel'; target: Room } | { type: 'dm'; target: User };

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeConversation, setActiveConversation] = useState<Conversation>({ type: 'channel', target: ROOMS[0] });
  const [messagesByConversationId, setMessagesByConversationId] = useState<{ [key: string]: Message[] }>({
    '1': [{ id: 'msg-1', content: 'Welcome to the General channel! Pin important messages using the menu that appears when you hover over a message. Try mentioning a user with @!', timestamp: new Date().toLocaleTimeString(), user: { id: 'system', username: 'System' }, type: 'system', status: 'read' }],
    '2': [{ id: 'msg-2', content: 'Welcome to the Technology channel!', timestamp: new Date().toLocaleTimeString(), user: { id: 'system', username: 'System' }, type: 'system', status: 'read' }],
    '3': [{ id: 'msg-3', content: 'Welcome to the Random channel!', timestamp: new Date().toLocaleTimeString(), user: { id: 'system', username: 'System' }, type: 'system', status: 'read' }],
  });
  const [usersByChannel, setUsersByChannel] = useState<{ [key: string]: User[] }>(INITIAL_USERS);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [unreadCounts, setUnreadCounts] = useState<{ [key: string]: number }>({});
  const [pinnedMessagesByConvId, setPinnedMessagesByConvId] = useState<{ [key: string]: Message[] }>({});
  const [smartReplies, setSmartReplies] = useState<string[]>([]);
  
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    const savedThemeId = localStorage.getItem('chat-theme-id');
    return THEMES.find(t => t.id === savedThemeId) || THEMES[0];
  });
  
  const chatSessions = useRef<{ [key: string]: Chat }>({});
  const aiRef = useRef<GoogleGenAI | null>(null);

  useEffect(() => {
    localStorage.setItem('chat-theme-id', currentTheme.id);
  }, [currentTheme]);
  
  const getConversationId = useCallback((conversation: Conversation): string => {
    if (!currentUser) return 'none';
    if (conversation.type === 'channel') {
      return conversation.target.id;
    }
    const userIds = [currentUser.id, conversation.target.id].sort();
    return `dm-${userIds[0]}-${userIds[1]}`;
  }, [currentUser]);

  useEffect(() => {
    const uniqueUsers = new Map<string, User>();
    // FIX: Refactored to use Object.keys to avoid type inference issues with Object.values.
    Object.keys(usersByChannel).forEach(channelName => {
      const usersInChannel = usersByChannel[channelName];
      usersInChannel.forEach(user => {
        uniqueUsers.set(user.id, user);
      });
    });
    if (currentUser) uniqueUsers.set(currentUser.id, currentUser);
    setAllUsers(Array.from(uniqueUsers.values()));
  }, [usersByChannel, currentUser]);
  
  if (!aiRef.current) {
      aiRef.current = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  
  const addMessage = useCallback((convId: string, message: Message) => {
    setMessagesByConversationId(prev => {
      const existingMessages = prev[convId] || [];
      // Simulate message status updates
      const updatedExisting = existingMessages.map(m => (m.user.id !== currentUser?.id && m.status !== 'read') ? { ...m, status: 'read' as const } : m);
      return { ...prev, [convId]: [...updatedExisting, message] };
    });
    
    // Update unread counts
    const activeConvId = getConversationId(activeConversation);
    if (convId !== activeConvId) {
      setUnreadCounts(prev => ({ ...prev, [convId]: (prev[convId] || 0) + 1 }));
    }
  }, [activeConversation, currentUser, getConversationId]);

  const getChat = useCallback((convId: string, conv: Conversation) => {
    if (!chatSessions.current[convId] && aiRef.current) {
      const systemInstruction = conv.type === 'channel'
        ? `You are a helpful and creative chat bot named AI Bot in a chat room called "${conv.target.name}". Keep your responses concise and conversational.`
        : `You are a helpful and creative chat bot named AI Bot in a private conversation. Keep your responses concise and conversational.`;
      
      chatSessions.current[convId] = aiRef.current.chats.create({ model: 'gemini-2.5-flash', config: { systemInstruction } });
    }
    return chatSessions.current[convId];
  }, []);

  const generateSmartReplies = async (lastMessage: Message) => {
    if (!aiRef.current || !currentUser || lastMessage.user.id === currentUser.id) {
        setSmartReplies([]);
        return;
    };
    try {
        const prompt = `Based on the last message, suggest three concise, relevant, and distinct smart replies for a user in a chat application. The last message is: "${lastMessage.content}". Return the suggestions as a JSON array of strings. For example: ["Got it!", "Thanks!", "I'll check it out."].`;
        const result = await aiRef.current.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
        const text = result.text.trim().replace(/```json|```/g, '');
        const replies = JSON.parse(text);
        setSmartReplies(Array.isArray(replies) ? replies.slice(0, 3) : []);
    } catch (error) {
        console.error("Error generating smart replies:", error);
        setSmartReplies([]);
    }
  };

  useEffect(() => {
    const convId = getConversationId(activeConversation);
    const messages = messagesByConversationId[convId] || [];
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.type === 'user') {
        generateSmartReplies(lastMessage);
    } else {
        setSmartReplies([]);
    }
  }, [messagesByConversationId, activeConversation, getConversationId]);
  
  const handleUsernameSubmit = (name: string) => {
    const user: User = { id: `user-${Date.now()}`, username: name, status: 'Online', lastSeen: 'now' };
    setCurrentUser(user);
    
    setUsersByChannel(prev => {
        const newUsersByChannel = { ...prev };
        ROOMS.forEach(room => {
          if (!newUsersByChannel[room.name]?.some(u => u.id === user.id)) {
            newUsersByChannel[room.name] = [...(newUsersByChannel[room.name] || []), user];
          }
        });
        return newUsersByChannel;
    });

    const currentConvId = getConversationId({ type: 'channel', target: ROOMS[0] });
    const joinMessage: Message = {
        id: `msg-${Date.now()}`,
        content: `${name} has joined the chat.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        user: { id: 'system', username: 'System' },
        type: 'system',
    };
    addMessage(currentConvId, joinMessage);
  };
  
  const handleSelectConversation = (target: Room | User, type: 'channel' | 'dm') => {
    if (!currentUser) return;
    
    let newConversation: Conversation;
    if (type === 'channel' && 'description' in target) {
      newConversation = { type: 'channel', target: target };
    } else if (type === 'dm' && 'username' in target) { 
      newConversation = { type: 'dm', target: target };
    } else {
      return;
    }

    const newConvId = getConversationId(newConversation);
    const oldConvId = getConversationId(activeConversation);
    if (newConvId === oldConvId) return;

    if (newConversation.type === 'dm' && !messagesByConversationId[newConvId]) {
      const welcomeMessage: Message = {
        id: `msg-${Date.now()}`,
        content: `This is the beginning of your direct message history with ${newConversation.target.username}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        user: { id: 'system', username: 'System' },
        type: 'system',
      };
      addMessage(newConvId, welcomeMessage);
    }
    
    setActiveConversation(newConversation);
    setUnreadCounts(prev => ({ ...prev, [newConvId]: 0 }));
  };

  const handleSendMessage = async (content: string, options?: { replyTo?: Message | null, imageUrl?: string, voiceNote?: { url: string; duration: number; } }) => {
    if (!currentUser || (isBotTyping && activeConversation.type === 'channel')) return;

    const convId = getConversationId(activeConversation);

    // Link preview simulation
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = content.match(urlRegex);
    let linkPreview: Message['linkPreview'] | undefined;
    if (urls && urls[0]) {
        linkPreview = {
            url: urls[0],
            title: `Preview for ${urls[0]}`,
            description: 'This is a simulated description for the link you shared. In a real app, this would be fetched from the website.',
            image: `https://via.placeholder.com/150/1a202c/FFFFFF?text=Preview`
        };
    }

    // Mention parsing
    const mentionRegex = /@(\w+)/g;
    let match;
    const mentions: string[] = [];
    while ((match = mentionRegex.exec(content)) !== null) {
        const username = match[1];
        const mentionedUser = allUsers.find(u => u.username === username);
        if (mentionedUser) {
            mentions.push(mentionedUser.id);
        }
    }

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      user: currentUser,
      type: 'user',
      status: 'sent',
      replyTo: options?.replyTo,
      imageUrl: options?.imageUrl,
      voiceNote: options?.voiceNote,
      linkPreview,
      mentions,
    };
    addMessage(convId, userMessage);
    setSmartReplies([]); // Clear smart replies after sending
    
    // Simulate delivered/read status
    setTimeout(() => {
        setMessagesByConversationId(prev => ({
            ...prev,
            [convId]: prev[convId].map(m => m.id === userMessage.id ? {...m, status: 'delivered'} : m)
        }));
    }, 500);
     if (activeConversation.type === 'dm') {
        setTimeout(() => {
            setMessagesByConversationId(prev => ({
                ...prev,
                [convId]: prev[convId].map(m => m.id === userMessage.id ? {...m, status: 'read'} : m)
            }));
        }, 1200);
    }
    
    if(activeConversation.type === 'channel' || (activeConversation.type === 'dm' && activeConversation.target.id === 'ai-bot')) {
      setIsBotTyping(true);
      const botMessageId = `msg-${Date.now()}-bot`;
      const botMessagePlaceholder: Message = {
        id: botMessageId, content: '', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        user: { id: 'ai-bot', username: 'AI Bot' }, type: 'user',
      };
      addMessage(convId, botMessagePlaceholder);
      
      try {
        const chat = getChat(convId, activeConversation);
        const stream = await chat.sendMessageStream({ message: content });
        let fullResponse = '';
        for await (const chunk of stream) {
          fullResponse += chunk.text;
          setMessagesByConversationId(prev => {
            const updatedMessages = (prev[convId] || []).map(msg => msg.id === botMessageId ? { ...msg, content: fullResponse } : msg);
            return { ...prev, [convId]: updatedMessages };
          });
        }
      } catch (error) {
        console.error("Error with AI API:", error);
        const errorMessage: Message = {
          id: `err-${Date.now()}`, content: "Sorry, I'm having trouble connecting right now.", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          user: { id: 'system', username: 'System' }, type: 'system',
        };
        setMessagesByConversationId(prev => ({...prev, [convId]: [...prev[convId].filter(m => m.id !== botMessageId), errorMessage]}));
      } finally {
        setIsBotTyping(false);
      }
    }
  };

  const handleUpdateProfile = (newName: string, newStatus: string, newAvatar?: string) => {
    if (!currentUser) return;
    const oldName = currentUser.username;
    const updatedUser = { ...currentUser, username: newName, status: newStatus, avatarUrl: newAvatar || currentUser.avatarUrl };
    setCurrentUser(updatedUser);

    setUsersByChannel(prev => {
      const newUsersByChannel = { ...prev };
      Object.keys(newUsersByChannel).forEach(channelName => {
        newUsersByChannel[channelName] = newUsersByChannel[channelName].map(user => user.id === updatedUser.id ? updatedUser : user);
      });
      return newUsersByChannel;
    });

    if (oldName !== newName) {
      const nameChangeMessage: Message = {
        id: `msg-${Date.now()}`, content: `${oldName} is now known as ${newName}.`, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        user: { id: 'system', username: 'System' }, type: 'system',
      };
      const convId = getConversationId(activeConversation);
      addMessage(convId, nameChangeMessage);
    }
    setIsSettingsOpen(false);
  };
  
  const handleEditMessage = (convId: string, messageId: string, newContent: string) => {
    setMessagesByConversationId(prev => ({
      ...prev,
      [convId]: (prev[convId] || []).map(msg => msg.id === messageId ? { ...msg, content: newContent, isEdited: true } : msg)
    }));
  };

  const handleDeleteMessage = (convId: string, messageId: string) => {
     setMessagesByConversationId(prev => ({
      ...prev,
      [convId]: (prev[convId] || []).filter(msg => msg.id !== messageId)
    }));
  };

  const handleAddReaction = (convId: string, messageId: string, emoji: string) => {
     if (!currentUser) return;
     setMessagesByConversationId(prev => {
        const messages = prev[convId] || [];
        const newMessages = messages.map(msg => {
          if (msg.id === messageId) {
            const reactions = { ...(msg.reactions || {}) };
            Object.keys(reactions).forEach(r => {
                reactions[r] = reactions[r].filter(id => id !== currentUser.id);
                if (reactions[r].length === 0) delete reactions[r];
            });
            const usersForEmoji = reactions[emoji] || [];
            if (!usersForEmoji.includes(currentUser.id)) {
              reactions[emoji] = [...usersForEmoji, currentUser.id];
            }
            return { ...msg, reactions };
          }
          return msg;
        });
        return { ...prev, [convId]: newMessages };
     });
  };

  const handlePinMessage = (convId: string, message: Message) => {
    setPinnedMessagesByConvId(prev => {
        const currentPins = prev[convId] || [];
        const isAlreadyPinned = currentPins.some(p => p.id === message.id);
        const newPins = isAlreadyPinned ? currentPins.filter(p => p.id !== message.id) : [message, ...currentPins];
        return { ...prev, [convId]: newPins };
    });
    setMessagesByConversationId(prev => ({
      ...prev,
      [convId]: prev[convId].map(m => m.id === message.id ? { ...m, isPinned: !m.isPinned } : m)
    }));
  };

  const handleLogout = () => {
    if (!currentUser) return;
    const convId = getConversationId(activeConversation);
    const logoutMessage: Message = {
      id: `msg-${Date.now()}`, content: `${currentUser.username} has left the chat.`, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      user: { id: 'system', username: 'System' }, type: 'system',
    };
    if (activeConversation.type === 'channel') addMessage(convId, logoutMessage);

    const userIdToRemove = currentUser.id;
    setUsersByChannel(prev => {
        const newUsersByChannel = { ...prev };
        Object.keys(newUsersByChannel).forEach(channelName => {
          newUsersByChannel[channelName] = newUsersByChannel[channelName].filter(user => user.id !== userIdToRemove);
        });
        return newUsersByChannel;
    });
    setCurrentUser(null);
    setActiveConversation({ type: 'channel', target: ROOMS[0] });
  };

  if (!currentUser) {
    return <UsernameModal onUsernameSubmit={handleUsernameSubmit} />;
  }
  
  const currentConvId = getConversationId(activeConversation);
  
  return (
    <div className={`flex h-screen w-full antialiased text-gray-200 bg-gradient-to-br ${currentTheme.class} overflow-hidden`}>
        <Sidebar 
            rooms={ROOMS} 
            users={allUsers}
            activeConversation={activeConversation}
            onSelectConversation={handleSelectConversation}
            currentUser={currentUser}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onLogout={handleLogout}
            unreadCounts={unreadCounts}
        />
        <ChatWindow 
            conversation={activeConversation}
            messages={messagesByConversationId[currentConvId] || []}
            onSendMessage={handleSendMessage}
            currentUser={currentUser}
            isBotTyping={isBotTyping}
            onEditMessage={(msgId, newContent) => handleEditMessage(currentConvId, msgId, newContent)}
            onDeleteMessage={(msgId) => handleDeleteMessage(currentConvId, msgId)}
            onAddReaction={(msgId, emoji) => handleAddReaction(currentConvId, msgId, emoji)}
            onPinMessage={(msg) => handlePinMessage(currentConvId, msg)}
            pinnedMessages={pinnedMessagesByConvId[currentConvId] || []}
            allUsers={allUsers}
            smartReplies={smartReplies}
        />
        {isSettingsOpen && (
          <SettingsModal 
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            currentUser={currentUser}
            onUpdateProfile={handleUpdateProfile}
            currentTheme={currentTheme}
            onSelectTheme={setCurrentTheme}
          />
        )}
    </div>
  );
};

export default App;