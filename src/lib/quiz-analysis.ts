// Quiz analysis utilities for deriving insights from user answers

import { SkinType, SkinConcern } from '../types';

export const deriveSkinType = (answers: Record<string, any>): SkinType => {
  const afterCleanse = answers.q1_skin_feel_after_cleanse;
  const middayOil = answers.q2_midday_oiliness;
  const drySensation = answers.q3_dry_skin_sensation;
  const reactivity = answers.q4_product_environmental_reaction;

  // Oily skin indicators
  if (middayOil === 'tzone_noticeably_shiny' || afterCleanse === 'slightly_oily_residue') {
    return 'oily';
  }

  // Dry skin indicators
  if (
    afterCleanse === 'very_dry_tight_flaky' ||
    drySensation === 'flaky_rough_dull' ||
    drySensation === 'persistent_tightness'
  ) {
    return 'dry';
  }

  // Sensitive skin (check reactivity)
  if (reactivity >= 4) {
    return 'sensitive';
  }

  // Combination
  if (middayOil === 'tzone_subtle_shine' && afterCleanse === 'mildly_tight') {
    return 'combination';
  }

  // Default to normal
  return 'normal';
};

export const deriveConcerns = (answers: Record<string, any>): SkinConcern[] => {
  const concerns: SkinConcern[] = [];

  // Blemishes/Acne
  const blemishTypes = answers.q7_common_blemish_type || [];
  if (blemishTypes.length > 0 && !blemishTypes.includes('rarely_blemishes')) {
    concerns.push('acne');
  }

  // Hyperpigmentation
  const postMark = answers.q8_post_breakout_mark;
  const skinTone = answers.q9_overall_skin_tone;
  if (
    postMark === 'dark_brown_spots_pih' ||
    skinTone === 'sun_spots_freckles' ||
    skinTone === 'larger_melasma_patches'
  ) {
    concerns.push('hyperpigmentation');
  }

  // Aging/Firmness
  const snapBack = answers.q11_skin_snap_back;
  if (snapBack === 'very_slowly_loose' || snapBack === 'moderately_slow') {
    concerns.push('aging');
  }

  // Dryness
  const drySensation = answers.q3_dry_skin_sensation;
  const afterCleanse = answers.q1_skin_feel_after_cleanse;
  if (
    drySensation === 'flaky_rough_dull' ||
    drySensation === 'persistent_tightness' ||
    afterCleanse === 'very_dry_tight_flaky'
  ) {
    concerns.push('dryness');
  }

  // Oiliness
  const middayOil = answers.q2_midday_oiliness;
  if (middayOil === 'tzone_noticeably_shiny') {
    concerns.push('oiliness');
  }

  // Sensitivity
  const reactivity = answers.q4_product_environmental_reaction;
  const rednessTime = answers.q5_redness_fading_time;
  if (reactivity >= 4 || rednessTime === 'stays_red_hours') {
    concerns.push('sensitivity');
  }

  // Texture issues (large pores)
  const texture = answers.q10_skin_texture_feel;
  if (texture === 'noticeably_rough_bumpy' || texture === 'minor_bumps_unevenness') {
    concerns.push('large_pores');
  }

  // Dullness (if not already covered)
  if (skinTone === 'dull_lacks_radiance' && !concerns.includes('hyperpigmentation')) {
    // Add as general concern - could map to existing or create new
    if (!concerns.includes('dryness')) {
      concerns.push('dryness'); // Dullness often related to dehydration
    }
  }

  return concerns.length > 0 ? concerns : ['dryness']; // Default concern
};

// Get personalized skincare recommendations based on quiz
export const getSkincareRecommendations = (answers: Record<string, any>) => {
  const recommendations = {
    morningSteps: [] as string[],
    eveningSteps: [] as string[],
    keyIngredients: [] as string[],
    avoidIngredients: [] as string[],
  };

  // Texture preferences
  const texturePreference = answers.q14_preferred_product_textures;
  
  // SPF recommendations
  const spfUsage = answers.q12_spf_consistency;
  if (spfUsage !== 'every_day_fail') {
    recommendations.morningSteps.push('Daily SPF 30+ (non-negotiable!)');
  }

  // Blemish-specific recommendations
  const blemishTypes = answers.q7_common_blemish_type || [];
  if (blemishTypes.includes('blackheads')) {
    recommendations.keyIngredients.push('Salicylic Acid');
    recommendations.eveningSteps.push('BHA exfoliant 2-3x per week');
  }

  if (blemishTypes.includes('deep_cysts_nodules')) {
    recommendations.eveningSteps.push('Benzoyl peroxide spot treatment');
    recommendations.keyIngredients.push('Benzoyl Peroxide, Azelaic Acid');
  }

  // Pigmentation recommendations
  const postMark = answers.q8_post_breakout_mark;
  if (postMark === 'dark_brown_spots_pih') {
    recommendations.keyIngredients.push('Vitamin C, Niacinamide, Alpha Arbutin');
    recommendations.morningSteps.push('Vitamin C serum');
  }

  // Aging recommendations
  const snapBack = answers.q11_skin_snap_back;
  if (snapBack === 'very_slowly_loose' || snapBack === 'moderately_slow') {
    recommendations.keyIngredients.push('Retinol, Peptides');
    recommendations.eveningSteps.push('Retinol (start slow, build tolerance)');
  }

  // Known irritants to avoid
  const irritants = answers.q6_known_irritants || [];
  irritants.forEach((irritant: string) => {
    if (irritant === 'fragrance_perfume') {
      recommendations.avoidIngredients.push('Fragrance/Parfum');
    } else if (irritant === 'essential_oils') {
      recommendations.avoidIngredients.push('Essential Oils');
    } else if (irritant === 'drying_alcohols') {
      recommendations.avoidIngredients.push('Alcohol Denat, SD Alcohol');
    }
  });

  return recommendations;
};
