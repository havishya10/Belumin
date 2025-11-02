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
