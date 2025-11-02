// Real OpenAI API integration for BeLumin
import OpenAI from 'openai';
import { UserProfile, ProductAnalysis } from '../types';
import { config } from './config';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: config.openai.apiKey,
  dangerouslyAllowBrowser: true, // Allow client-side usage for demo
});

// Build system prompt from user profile
const buildSystemPrompt = (userProfile: UserProfile | null): string => {
  if (!userProfile) {
    return `You are Lumin, a friendly and knowledgeable AI skincare companion. You provide personalized skincare advice, product recommendations, and answer questions about skin health. Be warm, encouraging, and use emojis sparingly. Keep responses concise but informative.`;
  }

  const quizAnswers = userProfile.quizAnswers || {};
  
  let systemPrompt = `You are Lumin, a friendly and knowledgeable AI skincare companion for BeLumin. You provide personalized skincare advice based on the user's comprehensive skin profile.

USER PROFILE:
- Name: ${userProfile.name || 'User'}
- Skin Type: ${userProfile.skinType}
- Main Concerns: ${userProfile.concerns.join(', ')}
- Budget Range: ${userProfile.budget}
- Known Sensitivities: ${userProfile.allergies.length > 0 ? userProfile.allergies.join(', ') : 'None'}

DETAILED SKIN PROFILE FROM QUIZ:`;

  // Add relevant quiz insights
  if (quizAnswers.q1_skin_feel_after_cleanse) {
    systemPrompt += `\n- After cleansing: ${quizAnswers.q1_skin_feel_after_cleanse}`;
  }
  
  if (quizAnswers.q4_product_environmental_reaction) {
    systemPrompt += `\n- Skin reactivity level: ${quizAnswers.q4_product_environmental_reaction}/5`;
  }
  
  if (quizAnswers.q7_common_blemish_type) {
    systemPrompt += `\n- Common blemishes: ${quizAnswers.q7_common_blemish_type.join(', ')}`;
  }
  
  if (quizAnswers.q12_spf_consistency) {
    systemPrompt += `\n- SPF usage: ${quizAnswers.q12_spf_consistency}`;
  }
  
  if (quizAnswers.q14_preferred_product_textures) {
    systemPrompt += `\n- Texture preference: ${quizAnswers.q14_preferred_product_textures}`;
  }
  
  if (quizAnswers.q15_open_text_goals) {
    systemPrompt += `\n- Additional notes: ${quizAnswers.q15_open_text_goals}`;
  }

  systemPrompt += `\n\nBased on this profile, provide personalized, science-backed skincare advice. Be warm and encouraging. Keep responses concise (2-4 sentences unless asked for detail). Use emojis sparingly. Always consider their sensitivities and budget when recommending products.`;

  return systemPrompt;
};

// Generate Lumin's chat response
export const generateLuminResponse = async (
  message: string,
  userProfile: UserProfile | null,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
): Promise<string> => {
  try {
    const systemPrompt = buildSystemPrompt(userProfile);

    // Build messages array
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: systemPrompt,
      },
      // Add conversation history (last 6 messages for context)
      ...conversationHistory.slice(-6).map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      {
        role: 'user',
        content: message,
      },
    ];

    const completion = await openai.chat.completions.create({
      model: config.openai.model,
      messages,
      temperature: config.openai.temperature,
      max_tokens: config.openai.maxTokens,
    });

    return completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error('Error generating Lumin response:', error);
    return "I'm having trouble connecting right now. Please try again in a moment! 💚";
  }
};

// Analyze product ingredients
export const analyzeProductIngredients = async (
  ingredients: string,
  userProfile: UserProfile | null
): Promise<ProductAnalysis> => {
  try {
    const systemPrompt = `You are Lumin, an expert skincare ingredient analyst. Analyze product ingredients and provide compatibility scores based on the user's skin profile.

${userProfile ? `USER PROFILE:
- Skin Type: ${userProfile.skinType}
- Concerns: ${userProfile.concerns.join(', ')}
- Sensitivities: ${userProfile.allergies.length > 0 ? userProfile.allergies.join(', ') : 'None'}` : ''}

Analyze the ingredients and respond with a JSON object containing:
- compatibilityScore: number (0-100)
- pros: array of strings (positive points, 2-4 items)
- cons: array of strings (concerns or limitations, 1-3 items)

Be specific about how ingredients relate to their skin type and concerns.`;

    const completion = await openai.chat.completions.create({
      model: config.openai.model,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: `Analyze these ingredients:\n${ingredients}`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.5,
      max_tokens: 600,
    });

    const responseContent = completion.choices[0]?.message?.content || '{}';
    const analysis = JSON.parse(responseContent);

    // Validate and structure the response
    return {
      productName: 'Analyzed Product',
      compatibilityScore: Math.min(Math.max(analysis.compatibilityScore || 70, 0), 100),
      pros: Array.isArray(analysis.pros) ? analysis.pros : ['Suitable for general use'],
      cons: Array.isArray(analysis.cons) ? analysis.cons : ['Results may take 4-6 weeks'],
      ingredients,
    };
  } catch (error) {
    console.error('Error analyzing product:', error);
    
    // Fallback analysis
    return {
      productName: 'Analyzed Product',
      compatibilityScore: 70,
      pros: ['Ingredients list received', 'No immediate red flags detected'],
      cons: ['Analysis temporarily unavailable - please try again'],
      ingredients,
    };
  }
};

// Streaming response for better UX (optional enhancement)
export const generateLuminResponseStream = async (
  message: string,
  userProfile: UserProfile | null,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [],
  onChunk: (chunk: string) => void
): Promise<void> => {
  try {
    const systemPrompt = buildSystemPrompt(userProfile);

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: systemPrompt,
      },
      ...conversationHistory.slice(-6).map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      {
        role: 'user',
        content: message,
      },
    ];

    const stream = await openai.chat.completions.create({
      model: config.openai.model,
      messages,
      temperature: config.openai.temperature,
      max_tokens: config.openai.maxTokens,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        onChunk(content);
      }
    }
  } catch (error) {
    console.error('Error generating streaming response:', error);
    onChunk("I'm having trouble connecting right now. Please try again in a moment! 💚");
  }
};
