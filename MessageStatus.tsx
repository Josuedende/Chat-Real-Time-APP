import React from 'react';
import { CheckIcon, CheckCheckIcon } from './Icons';
import type { Message } from '../types';

interface MessageStatusProps {
  status: Message['status'];
}

const MessageStatus: React.FC<MessageStatusProps> = ({ status }) => {
  if (status === 'sent') {
    return <CheckIcon className="w-4 h-4 text-gray-500" />;
  }
  if (status === 'delivered') {
    return <CheckCheckIcon className="w-4 h-4 text-gray-500" />;
  }
  if (status === 'read') {
    return <CheckCheckIcon className="w-4 h-4 text-blue-400" />;
  }
  return null;
};

export default MessageStatus;