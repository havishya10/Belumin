// Chat interface with Lumin AI
import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Message, UserProfile, Conversation } from '../types';
import { generateId } from '../lib/utils-helpers';
import { formatDate } from '../lib/utils-helpers';
import { generateLuminResponse } from '../lib/openai';
import { saveConversation, getConversations } from '../lib/storage';
import { chatSuggestions } from '../data/suggestions';
import { Send, Image, Paperclip, History, ArrowLeft, Sparkles } from 'lucide-react';

interface ChatInterfaceProps {
  profile: UserProfile | null;
  onBack: () => void;
  onShowHistory: () => void;
  initialContext?: string;
  conversationId?: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  profile,
  onBack,
  onShowHistory,
  initialContext,
  conversationId,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentConvId, setCurrentConvId] = useState(conversationId || generateId());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load existing conversation or start new one
    if (conversationId) {
      const conversations = getConversations();
      const existing = conversations.find(c => c.id === conversationId);
      if (existing) {
        setMessages(existing.messages);
      }
    } else {
      // Welcome message
      const welcomeMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: `Hello ${profile?.name || 'there'}! I'm Lumin, your personal skincare companion. 💚 I'm here to help you with product recommendations, routine building, and answering any skincare questions. What would you like to know today?`,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);

      // If there's initial context (from product analysis)
      if (initialContext) {
        setTimeout(() => {
          setInput(initialContext);
        }, 500);
      }
    }
  }, [conversationId, initialContext, profile]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Build conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await generateLuminResponse(input.trim(), profile, conversationHistory);

      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Save conversation
      const conversation: Conversation = {
        id: currentConvId,
        title: messages.length === 0 ? input.trim().slice(0, 50) : messages[1]?.content.slice(0, 50) || 'New Conversation',
        messages: [...messages, userMessage, assistantMessage],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      saveConversation(conversation);
    } catch (error) {
      console.error('Error generating response:', error);
      
      // Show error message to user
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please check your internet connection and try again! 💚",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <div className="flex flex-col h-screen bg-[#F5F1E8]">
      {/* Header */}
      <div className="bg-white border-b border-[#A8C5AC]/20 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-[#A8C5AC]/10 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#2C6E6D]" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#A8C5AC] to-[#C8E6D0] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-[#2C6E6D]">Lumin</span>
                <p className="text-xs text-[#2C6E6D]/50">Powered by GPT-4</p>
              </div>
            </div>
          </div>
          <button
            onClick={onShowHistory}
            className="p-2 hover:bg-[#A8C5AC]/10 rounded-full transition-colors"
          >
            <History className="w-5 h-5 text-[#2C6E6D]" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] ${
                message.role === 'user'
                  ? 'bg-[#2C6E6D] text-white rounded-2xl rounded-tr-sm'
                  : 'bg-white text-[#2C6E6D] rounded-2xl rounded-tl-sm border border-[#A8C5AC]/20'
              } px-4 py-3`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p
                className={`text-xs mt-2 ${
                  message.role === 'user' ? 'text-white/60' : 'text-[#2C6E6D]/50'
                }`}
              >
                {formatDate(message.timestamp)}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white text-[#2C6E6D] rounded-2xl rounded-tl-sm border border-[#A8C5AC]/20 px-4 py-3">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-[#A8C5AC]"
                    style={{
                      animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="px-4 py-3 border-t border-[#A8C5AC]/20 bg-white">
          <p className="text-xs text-[#2C6E6D]/60 mb-2">What people ask:</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {chatSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-2 bg-[#C8E6D0]/30 text-xs text-[#2C6E6D] rounded-full whitespace-nowrap hover:bg-[#C8E6D0]/50 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-white border-t border-[#A8C5AC]/20 px-4 py-3">
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-[#A8C5AC]/10 rounded-full transition-colors">
            <Paperclip className="w-5 h-5 text-[#2C6E6D]/60" />
          </button>
          <button className="p-2 hover:bg-[#A8C5AC]/10 rounded-full transition-colors">
            <Image className="w-5 h-5 text-[#2C6E6D]/60" />
          </button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Lumin anything..."
            className="flex-1 border-[#A8C5AC]/30 focus:border-[#A8C5AC]"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="p-2 bg-[#2C6E6D] rounded-full hover:bg-[#2C6E6D]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
