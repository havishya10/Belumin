# OpenAI Integration in BeLumin

## Overview
BeLumin uses OpenAI's GPT-4o-mini model to power Lumin, the AI skincare companion.

## Features

### 1. Personalized Chat Responses
- **File**: `/lib/openai.ts` - `generateLuminResponse()`
- Uses user's comprehensive skin profile from the 15-question quiz
- Maintains conversation context (last 6 messages)
- Provides skincare advice tailored to:
  - Skin type
  - Concerns
  - Known sensitivities
  - SPF usage habits
  - Texture preferences
  - Lifestyle factors

### 2. Product Ingredient Analysis
- **File**: `/lib/openai.ts` - `analyzeProductIngredients()`
- Analyzes ingredient lists against user profile
- Returns structured JSON with:
  - Compatibility score (0-100)
  - Pros (positive aspects for user's skin)
  - Cons (concerns or limitations)
- Uses JSON mode for consistent output format

### 3. Streaming Support (Optional)
- **File**: `/lib/openai.ts` - `generateLuminResponseStream()`
- Ready for implementation to show responses as they're generated
- Better UX for longer responses

## Configuration

### API Key & Model Settings
**File**: `/lib/config.ts`

```typescript
export const config = {
  openai: {
    apiKey: 'sk-proj-...',
    model: 'gpt-4o-mini', // Fast, cost-effective
    // model: 'gpt-4o', // Better quality, higher cost
    temperature: 0.7,
    maxTokens: 500,
  },
};
```

### Changing the Model
To use GPT-4o instead of GPT-4o-mini:
1. Open `/lib/config.ts`
2. Change `model: 'gpt-4o-mini'` to `model: 'gpt-4o'`
3. Note: GPT-4o provides better responses but costs more

## System Prompt Strategy

Lumin's system prompt includes:
- User's skin type and concerns
- Quiz-derived insights (reactivity level, blemish types, SPF habits, etc.)
- Known sensitivities and allergies
- Texture preferences
- Additional user notes

This ensures every response is highly personalized.

## Error Handling

Both functions include:
- Try-catch blocks for API errors
- Fallback responses if API fails
- User-friendly error messages
- Console logging for debugging

## Security Note

⚠️ **Important**: The API key is currently stored client-side for demo purposes (`dangerouslyAllowBrowser: true`).

For production:
1. Move API calls to a backend server
2. Store API key in environment variables
3. Implement rate limiting
4. Add authentication

## Cost Optimization

Current settings are optimized for cost:
- Using `gpt-4o-mini` (10-15x cheaper than GPT-4)
- Max tokens: 500 (limits response length)
- Only keeps last 6 messages in context
- Temperature: 0.7 (balanced between creativity and consistency)

## Testing

To test the integration:
1. Complete onboarding with different skin profiles
2. Ask Lumin questions in the chat
3. Analyze a product with ingredients list
4. Check console for any API errors

## Future Enhancements

1. **Image Recognition**: Use GPT-4 Vision to scan product labels directly
2. **Streaming Responses**: Implement real-time response streaming
3. **Function Calling**: Let GPT trigger actions (add to routine, find products, etc.)
4. **Embeddings**: Build a knowledge base of skincare ingredients and products
5. **Fine-tuning**: Train a custom model on skincare Q&A data
