// Chat history modal/screen
import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { getConversations } from '../lib/storage';
import { formatDate } from '../lib/utils-helpers';
import { ArrowLeft, MessageCircle } from 'lucide-react';

interface ChatHistoryProps {
  onBack: () => void;
  onSelectConversation: (id: string) => void;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({
  onBack,
  onSelectConversation,
}) => {
  const conversations = getConversations().sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      {/* Header */}
      <div className="bg-white border-b border-[#A8C5AC]/20 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-[#A8C5AC]/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#2C6E6D]" />
          </button>
          <h1 className="text-[#2C6E6D]">Chat History</h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-3">
        {conversations.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-12 h-12 text-[#A8C5AC]/40 mx-auto mb-3" />
            <p className="text-[#2C6E6D]/60">No conversations yet</p>
            <p className="text-sm text-[#2C6E6D]/40 mt-1">
              Start chatting with Lumin to see your history here
            </p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <Card
              key={conversation.id}
              className="p-4 bg-white border-[#A8C5AC]/20 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onSelectConversation(conversation.id)}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#A8C5AC] to-[#C8E6D0] flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm text-[#2C6E6D] mb-1 truncate">
                    {conversation.title}
                  </h3>
                  <p className="text-xs text-[#2C6E6D]/60 truncate">
                    {conversation.messages[conversation.messages.length - 1]?.content}
                  </p>
                  <p className="text-xs text-[#2C6E6D]/40 mt-1">
                    {formatDate(conversation.updatedAt)}
                  </p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
