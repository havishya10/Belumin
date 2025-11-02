// Configuration for BeLumin app

export const config = {
  openai: {
    apiKey: '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',
    model: 'gpt-4o-mini', // Fast, cost-effective model
    // model: 'gpt-4o', // Use this for even better responses (higher cost)
    temperature: 0.7,
    maxTokens: 500,
  },
  app: {
    name: 'BeLumin',
    version: '1.0.0',
  },
};
