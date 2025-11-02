// LocalStorage utilities for BeLumin
import { UserProfile, Conversation, RoutineStep } from '../types';

const STORAGE_KEYS = {
  USER_PROFILE: 'belumin_user_profile',
  CONVERSATIONS: 'belumin_conversations',
  ROUTINE: 'belumin_routine',
  ONBOARDING_COMPLETE: 'belumin_onboarding_complete',
};

// User Profile
export const saveUserProfile = (profile: UserProfile): void => {
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');
};

export const getUserProfile = (): UserProfile | null => {
  const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
  return data ? JSON.parse(data) : null;
};

export const isOnboardingComplete = (): boolean => {
  return localStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE) === 'true';
};

// Conversations
export const saveConversation = (conversation: Conversation): void => {
  const conversations = getConversations();
  const existingIndex = conversations.findIndex(c => c.id === conversation.id);
  
  if (existingIndex >= 0) {
    conversations[existingIndex] = conversation;
  } else {
    conversations.push(conversation);
  }
  
  localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
};

export const getConversations = (): Conversation[] => {
  const data = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
  return data ? JSON.parse(data) : [];
};

export const getConversationById = (id: string): Conversation | null => {
  const conversations = getConversations();
  return conversations.find(c => c.id === id) || null;
};

// Routine
export const saveRoutine = (routine: RoutineStep[]): void => {
  localStorage.setItem(STORAGE_KEYS.ROUTINE, JSON.stringify(routine));
};

export const getRoutine = (): RoutineStep[] => {
  const data = localStorage.getItem(STORAGE_KEYS.ROUTINE);
  return data ? JSON.parse(data) : [];
};

// Clear all data
export const clearAllData = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};
