// Core type definitions for BeLumin

export type SkinType = 'oily' | 'dry' | 'combination' | 'sensitive' | 'normal';

export type SkinConcern = 
  | 'acne' 
  | 'hyperpigmentation' 
  | 'aging' 
  | 'dryness' 
  | 'oiliness' 
  | 'sensitivity'
  | 'dark_circles'
  | 'large_pores';

export type BudgetRange = '₹100-300' | '₹300-500' | '₹500-1000' | '₹1000+';

export interface UserProfile {
  name?: string;
  skinType: SkinType;
  concerns: SkinConcern[];
  budget: BudgetRange;
  allergies: string[];
  createdAt: string;
  quizAnswers?: Record<string, any>; // Store all quiz answers
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  imageUrl?: string;
  productAnalysis?: ProductAnalysis;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductAnalysis {
  productName: string;
  imageUrl?: string;
  compatibilityScore: number;
  pros: string[];
  cons: string[];
  ingredients?: string;
}

export interface RoutineStep {
  id: string;
  productName: string;
  category: 'cleanser' | 'toner' | 'serum' | 'moisturizer' | 'sunscreen' | 'treatment';
  timeOfDay: 'morning' | 'evening' | 'both';
  order: number;
  completed: boolean;
  compatibilityScore?: number;
}
