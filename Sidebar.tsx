import React from 'react';
import type { Room, User } from '../types';
import { HashtagIcon, UsersIcon, WifiIcon, SettingsIcon, LogOutIcon } from './Icons';
import Avatar from './Avatar';

type Conversation = { type: 'channel'; target: Room } | { type: 'dm'; target: User };

interface SidebarProps {
  rooms: Room[];
  users: User[];
  activeConversation: Conversation;
  currentUser: User;
  onSelectConversation: (target: Room | User, type: 'channel' | 'dm') => void;
  onOpenSettings: () => void;
  onLogout: () => void;
  unreadCounts: { [key: string]: number };
}

const Sidebar: React.FC<SidebarProps> = (props) => {
  const { rooms, users, activeConversation, onSelectConversation, currentUser, onOpenSettings, onLogout, unreadCounts } = props;
  const onlineUsers = users.filter(u => u.id !== currentUser.id);

  const getConversationId = (target: Room | User, type: 'channel' | 'dm'): string => {
    if (type === 'channel') return target.id;
    const userIds = [currentUser.id, target.id].sort();
    return `dm-${userIds[0]}-${userIds[1]}`;
  }

  return (
    <div className="flex flex-col w-64 bg-black bg-opacity-30 border-r border-white/10 backdrop-blur-sm p-4 flex-shrink-0">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
            <Avatar user={currentUser} size="10" />
            <div className="ml-3">
                <h2 className="text-lg font-semibold text-white">{currentUser.username}</h2>
                <div className="flex items-center text-xs text-green-400">
                    <WifiIcon className="w-3 h-3 mr-1" />
                    <span className="truncate">{currentUser.status || 'Online'}</span>
                </div>
            </div>
        </div>
        <div className="flex items-center gap-1">
            <button onClick={onOpenSettings} className="p-2 rounded-full text-gray-400 hover:bg-gray-700/50 hover:text-white transition-colors" aria-label="Open settings">
                <SettingsIcon className="w-5 h-5" />
            </button>
            <button onClick={onLogout} className="p-2 rounded-full text-gray-400 hover:bg-red-500/50 hover:text-white transition-colors" aria-label="Log out">
                <LogOutIcon className="w-5 h-5" />
            </button>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto -mr-4 pr-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">Channels</h3>
        <ul>
          {rooms.map((room) => {
            const convId = getConversationId(room, 'channel');
            const unreadCount = unreadCounts[convId] || 0;
            return (
                <li key={room.id}>
                <button
                    onClick={() => onSelectConversation(room, 'channel')}
                    className={`w-full flex items-center justify-between p-2 rounded-md text-left transition-colors duration-200 ${
                    activeConversation.type === 'channel' && activeConversation.target.id === room.id
                        ? 'bg-blue-600 bg-opacity-50 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:bg-opacity-50'
                    }`}
                >
                    <div className="flex items-center truncate">
                        <HashtagIcon className="w-5 h-5 mr-2 text-gray-400" />
                        <span className="truncate">{room.name}</span>
                    </div>
                    {unreadCount > 0 && <span className="text-xs font-bold bg-red-500 text-white rounded-full px-2 py-0.5">{unreadCount}</span>}
                </button>
                </li>
            )
          })}
        </ul>

        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-2 px-2">
          Online ({onlineUsers.length})
        </h3>
        <ul>
          {onlineUsers.map((user) => {
            const convId = getConversationId(user, 'dm');
            const unreadCount = unreadCounts[convId] || 0;
            return (
            <li key={user.id}>
               <button
                onClick={() => onSelectConversation(user, 'dm')}
                className={`w-full flex items-center p-2 rounded-md text-left transition-colors duration-200 ${
                  activeConversation.type === 'dm' && activeConversation.target.id === user.id
                    ? 'bg-blue-600 bg-opacity-50 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:bg-opacity-50'
                }`}
              >
                <div className="relative mr-3">
                    <Avatar user={user} size="8" />
                    <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ${user.id === 'ai-bot' ? 'bg-purple-400' : 'bg-green-400'} ring-2 ring-gray-800`}></span>
                </div>
                <div className="flex-1 truncate">
                  <span className='block truncate text-sm'>{user.username}</span>
                  <span className='block truncate text-xs text-gray-400'>{user.status}</span>
                </div>
                 {unreadCount > 0 && <span className="text-xs font-bold bg-red-500 text-white rounded-full px-2 py-0.5">{unreadCount}</span>}
              </button>
            </li>
          )})}
        </ul>
      </div>

       <div className="mt-auto text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Real-Time Chat</p>
          <p>Frontend Simulation</p>
        </div>
    </div>
  );
};

export default Sidebar;