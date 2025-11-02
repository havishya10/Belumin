// Mock OpenAI responses for demo purposes
// Replace with actual OpenAI API calls when ready
import { UserProfile, ProductAnalysis } from '../types';

export const generateLuminResponse = async (
  message: string,
  userProfile: UserProfile | null
): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const lowerMessage = message.toLowerCase();
  const quizAnswers = userProfile?.quizAnswers || {};

  // Context-aware responses based on comprehensive user profile
  if (lowerMessage.includes('routine') || lowerMessage.includes('skincare')) {
    const texturePreference = quizAnswers.q14_preferred_product_textures;
    let textureRec = '';
    
    if (texturePreference === 'lightweight_gels_essences') {
      textureRec = ' I noticed you prefer lightweight textures, so I\'ll recommend gel-based and essence products.';
    } else if (texturePreference === 'rich_comforting_creams') {
      textureRec = ' Since you enjoy rich creams, I\'ll focus on nourishing, emollient formulas.';
    }

    return `Based on your ${userProfile?.skinType || 'skin'} type and concerns about ${userProfile?.concerns.join(' and ') || 'general skincare'}, I recommend a simple routine: gentle cleanser, targeted treatment, and moisturizer with SPF in the morning.${textureRec} Would you like specific product recommendations within your ${userProfile?.budget || 'budget'}?`;
  }

  if (lowerMessage.includes('acne') || lowerMessage.includes('pimple') || lowerMessage.includes('breakout')) {
    const blemishTypes = quizAnswers.q7_common_blemish_type || [];
    const allergies = userProfile?.allergies || [];
    
    let recommendation = 'For acne, I recommend ingredients like niacinamide, salicylic acid, or benzoyl peroxide. ';
    
    if (blemishTypes.includes('deep_cysts_nodules')) {
      recommendation += 'Since you experience deep cysts, consider consulting a dermatologist for prescription treatments alongside your routine. ';
    }
    
    if (allergies.includes('strong_acids')) {
      recommendation += 'I see you\'re sensitive to strong acids, so let\'s focus on gentle options like azelaic acid or tea tree oil instead.';
    }
    
    return recommendation;
  }

  if (lowerMessage.includes('sun') || lowerMessage.includes('spf') || lowerMessage.includes('sunscreen')) {
    const spfUsage = quizAnswers.q12_spf_consistency;
    const chemicalSensitive = userProfile?.allergies?.includes('chemical_sunscreens');
    
    if (spfUsage === 'every_day_fail') {
      return 'Amazing that you use SPF daily! That\'s the #1 anti-aging habit. ' + 
             (chemicalSensitive ? 'Since you\'re sensitive to chemical filters, stick with mineral sunscreens containing zinc oxide or titanium dioxide.' : 'Keep up the great work!');
    } else if (spfUsage === 'rarely_never') {
      return 'Sunscreen is crucial for preventing premature aging and hyperpigmentation. ' +
             (chemicalSensitive ? 'Try mineral sunscreens with zinc oxide - they\'re gentler and work immediately. ' : '') +
             'Apply it as the last step of your morning routine, even on cloudy days!';
    }
    
    return 'SPF 30+ should be used daily for optimal protection. ' + 
           (chemicalSensitive ? 'Look for mineral-based formulas since you\'re sensitive to chemical filters.' : 'Find a formula you enjoy to make it a consistent habit!');
  }

  if (lowerMessage.includes('product') || lowerMessage.includes('ingredient')) {
    return "I'd be happy to analyze any product for you! You can upload a photo of the ingredient list, or tell me the product name and I'll check if it's suitable for your skin type and concerns.";
  }

  if (lowerMessage.includes('sensitivity') || lowerMessage.includes('irritation') || lowerMessage.includes('reactive')) {
    const reactivity = quizAnswers.q4_product_environmental_reaction;
    const rednessTime = quizAnswers.q5_redness_fading_time;
    
    if (reactivity >= 4) {
      return 'Your skin is quite reactive, so it\'s important to: 1) Patch test new products, 2) Avoid fragrance and essential oils, 3) Use gentle, minimal ingredient formulas. ' +
             (rednessTime === 'stays_red_hours' ? 'Since redness lingers for you, look for soothing ingredients like centella, niacinamide, and ceramides.' : '');
    }
    
    return 'For sensitive skin, stick to fragrance-free formulas and introduce new products one at a time. Ingredients like niacinamide, ceramides, and colloidal oatmeal can help strengthen your skin barrier.';
  }

  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return `Hello ${userProfile?.name || 'there'}! I'm Lumin, your personal skincare companion. I've analyzed your comprehensive skin profile and I'm here to give you personalized advice. What would you like to know today?`;
  }

  // Default response
  return "That's a great question! Based on your detailed skin profile, I can provide personalized advice. Could you tell me more about what specific aspect of skincare you're curious about?";
};

export const analyzeProductIngredients = async (
  ingredients: string,
  userProfile: UserProfile | null
): Promise<ProductAnalysis> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const ingredientsLower = ingredients.toLowerCase();
  const quizAnswers = userProfile?.quizAnswers || {};
  
  // Check for key ingredients
  const hasNiacinamide = ingredientsLower.includes('niacinamide');
  const hasSalicylicAcid = ingredientsLower.includes('salicylic');
  const hasRetinol = ingredientsLower.includes('retinol');
  const hasVitaminC = ingredientsLower.includes('vitamin c') || ingredientsLower.includes('ascorbic acid');
  const hasHyaluronicAcid = ingredientsLower.includes('hyaluronic');
  const hasFragrance = ingredientsLower.includes('fragrance') || ingredientsLower.includes('parfum');
  const hasEssentialOils = ingredientsLower.includes('essential oil') || ingredientsLower.includes('lavender oil') || ingredientsLower.includes('tea tree oil');
  const hasAlcohol = ingredientsLower.includes('alcohol denat') || ingredientsLower.includes('sd alcohol');

  const pros: string[] = [];
  const cons: string[] = [];
  let score = 70;

  // Check against user's known irritants
  const allergies = userProfile?.allergies || [];
  const reactivity = quizAnswers.q4_product_environmental_reaction || 1;

  // Positive matches
  if (hasNiacinamide) {
    pros.push('Niacinamide helps with pore refinement, brightening, and oil control');
    score += 12;
  }

  if (hasSalicylicAcid && userProfile?.concerns.includes('acne')) {
    pros.push('Salicylic acid is excellent for treating acne and preventing breakouts');
    score += 15;
  }

  if (hasVitaminC && userProfile?.concerns.includes('hyperpigmentation')) {
    pros.push('Vitamin C brightens skin tone and fades dark spots effectively');
    score += 12;
  }

  if (hasHyaluronicAcid && userProfile?.concerns.includes('dryness')) {
    pros.push('Hyaluronic acid provides deep hydration and plumps the skin');
    score += 10;
  }

  if (hasRetinol && userProfile?.concerns.includes('aging')) {
    pros.push('Retinol stimulates collagen production and reduces fine lines');
    score += 15;
  }

  // Check for allergens and irritants
  if (hasFragrance) {
    if (allergies.includes('fragrance_perfume') || reactivity >= 4) {
      cons.push('Contains fragrance - may cause irritation or sensitivity reactions');
      score -= 25;
    } else {
      cons.push('Contains fragrance - patch test recommended');
      score -= 5;
    }
  } else {
    pros.push('Fragrance-free formula reduces risk of irritation');
    score += 5;
  }

  if (hasEssentialOils && allergies.includes('essential_oils')) {
    cons.push('Contains essential oils which you\'re sensitive to - avoid this product');
    score -= 30;
  }

  if (hasAlcohol && allergies.includes('drying_alcohols')) {
    cons.push('Contains drying alcohol which may cause irritation for you');
    score -= 20;
  }

  if ((hasSalicylicAcid || hasRetinol) && allergies.includes('strong_acids')) {
    cons.push('Contains active acids that may be too strong for your sensitive skin');
    score -= 25;
  }

  // Skin type specific feedback
  if (userProfile?.skinType === 'dry' && hasAlcohol) {
    cons.push('Alcohol can be extra drying for your skin type');
    score -= 10;
  }

  if (userProfile?.skinType === 'oily' && hasNiacinamide) {
    pros.push('Perfect for oily skin - helps regulate sebum production');
    score += 5;
  }

  // Default messages
  if (pros.length === 0) {
    pros.push('Basic formulation suitable for general use');
    pros.push('No standout beneficial ingredients detected');
  }

  if (cons.length === 0) {
    cons.push('Results may take 4-6 weeks of consistent use');
  }

  return {
    productName: 'Analyzed Product',
    compatibilityScore: Math.max(Math.min(score, 98), 20), // Cap between 20-98
    pros,
    cons,
    ingredients,
  };
};
