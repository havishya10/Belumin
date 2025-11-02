// BeLumin comprehensive skin profiling quiz

export type QuestionType = 
  | 'single_choice_text' 
  | 'multi_choice_text' 
  | 'multi_choice_icons' 
  | 'slider' 
  | 'long_text_input';

export interface QuizOption {
  value: string;
  text: string;
  icon?: string;
}

export interface QuizQuestion {
  id: string;
  section: string;
  title: string;
  type: QuestionType;
  options?: QuizOption[];
  min?: number;
  max?: number;
  labels?: string[];
  placeholder?: string;
  optional?: boolean;
}

export const beluminQuizQuestions: QuizQuestion[] = [
  // --- I. Core Skin Balance (Sebum & Hydration) ---

  {
    id: "q1_skin_feel_after_cleanse",
    section: "Core Skin Balance",
    title: "How does your skin typically *feel* within 30 minutes after cleansing, before applying any products?",
    type: "single_choice_text",
    options: [
      { value: "very_dry_tight_flaky", text: "Tight, dry, and sometimes flaky." },
      { value: "mildly_tight", text: "A little tight, but mostly comfortable." },
      { value: "comfortable_balanced", text: "Comfortable, neither tight nor oily." },
      { value: "slightly_oily_residue", text: "Slightly oily or still feels residue." }
    ]
  },
  {
    id: "q2_midday_oiliness",
    section: "Core Skin Balance",
    title: "By midday, which best describes the oiliness or shine on your face?",
    type: "single_choice_text",
    options: [
      { value: "tzone_noticeably_shiny", text: "My T-zone (forehead, nose, chin) is noticeably shiny." },
      { value: "tzone_subtle_shine", text: "A little shiny on my T-zone, but not everywhere." },
      { value: "rarely_balanced", text: "Rarely, my skin stays balanced." },
      { value: "never_feels_dry", text: "Never, my skin tends to feel dry." }
    ]
  },
  {
    id: "q3_dry_skin_sensation",
    section: "Core Skin Balance",
    title: "When your skin feels dry, what do you most commonly notice?",
    type: "single_choice_text",
    options: [
      { value: "flaky_rough_dull", text: "Flaky, rough patches, or general dullness." },
      { value: "fine_dehydration_lines", text: "Fine lines that appear more visible (like dehydration lines)." },
      { value: "persistent_tightness", text: "Persistent tightness and discomfort." },
      { value: "rarely_dry_dehydrated", text: "My skin rarely feels truly dry or dehydrated." }
    ]
  },

  // --- II. Skin Reactivity & Sensitivity ---

  {
    id: "q4_product_environmental_reaction",
    section: "Skin Reactivity & Sensitivity",
    title: "How often does your skin react with redness, itching, or stinging when trying new products or in response to environmental factors (e.g., wind, sun)?",
    type: "slider",
    min: 1,
    max: 5,
    labels: ["Never, very resilient", "Rarely", "Sometimes", "Often", "Almost always, extremely reactive"]
  },
  {
    id: "q5_redness_fading_time",
    section: "Skin Reactivity & Sensitivity",
    title: "When your skin gets red (from exercise, heat, etc.), how quickly does that redness typically fade?",
    type: "single_choice_text",
    options: [
      { value: "stays_red_hours", text: "Stays red for several hours or more." },
      { value: "fades_1_2_hours", text: "Takes about 1-2 hours to subside." },
      { value: "fades_30_minutes", text: "Subsides within 30 minutes." },
      { value: "rarely_gets_red", text: "My skin rarely gets noticeably red." }
    ]
  },
  {
    id: "q6_known_irritants",
    section: "Skin Reactivity & Sensitivity",
    title: "Are there any specific product types or ingredients you know your skin *doesn't* tolerate well?",
    type: "multi_choice_icons",
    options: [
      { value: "fragrance_perfume", text: "Fragrance / Perfume", icon: "🌸" },
      { value: "essential_oils", text: "Essential Oils", icon: "🌿" },
      { value: "drying_alcohols", text: "Drying Alcohols", icon: "💧" },
      { value: "strong_acids", text: "Strong Acids (e.g., Glycolic, Salicylic)", icon: "⚗️" },
      { value: "chemical_sunscreens", text: "Chemical Sunscreens", icon: "☀️" },
      { value: "no_specific_intolerance", text: "Nothing specific, generally tolerant.", icon: "✨" }
    ]
  },

  // --- III. Blemishes & Pigmentation Concerns ---

  {
    id: "q7_common_blemish_type",
    section: "Blemishes & Pigmentation Concerns",
    title: "What type of blemishes do you most commonly experience?",
    type: "multi_choice_text",
    options: [
      { value: "blackheads", text: "Blackheads (small dark dots)" },
      { value: "whiteheads", text: "Whiteheads (small flesh-colored bumps)" },
      { value: "red_bumps_pustules", text: "Red bumps or pus-filled pimples" },
      { value: "deep_cysts_nodules", text: "Deep, painful cysts or nodules" },
      { value: "rarely_blemishes", text: "I rarely get blemishes." }
    ]
  },
  {
    id: "q8_post_breakout_mark",
    section: "Blemishes & Pigmentation Concerns",
    title: "After a breakout or injury, what kind of mark does it usually leave on your skin?",
    type: "single_choice_text",
    options: [
      { value: "dark_brown_spots_pih", text: "Dark brown spots that linger for weeks/months." },
      { value: "red_pink_marks_pie", text: "Red or pink marks that linger for weeks/months." },
      { value: "minor_discoloration_fades_quick", text: "Minor discoloration that fades quickly." },
      { value: "no_noticeable_marks", text: "No noticeable marks, my skin heals cleanly." }
    ]
  },
  {
    id: "q9_overall_skin_tone",
    section: "Blemishes & Pigmentation Concerns",
    title: "Which statement best describes the overall tone and color evenness of your skin?",
    type: "single_choice_text",
    options: [
      { value: "sun_spots_freckles", text: "Noticeable sun spots, freckles, or general sun damage." },
      { value: "larger_melasma_patches", text: "Larger, sometimes symmetrical patches of discoloration (like melasma)." },
      { value: "dull_lacks_radiance", text: "My skin often looks dull and lacks radiance, but few distinct spots." },
      { value: "mostly_even_clear", text: "Mostly even and clear." }
    ]
  },

  // --- IV. Texture, Firmness & Protection ---

  {
    id: "q10_skin_texture_feel",
    section: "Texture, Firmness & Protection",
    title: "How would you describe the *texture* of your skin when you gently run your fingers across it?",
    type: "single_choice_text",
    options: [
      { value: "noticeably_rough_bumpy", text: "Noticeably rough, bumpy, or uneven." },
      { value: "minor_bumps_unevenness", text: "Some minor bumps or slight unevenness." },
      { value: "mostly_smooth_slight_texture", text: "Mostly smooth with occasional slight texture." },
      { value: "exceptionally_smooth_soft", text: "Exceptionally smooth and soft." }
    ]
  },
  {
    id: "q11_skin_snap_back",
    section: "Texture, Firmness & Protection",
    title: "If you gently pinch the skin on your cheek or jawline, how quickly does it spring back into place?",
    type: "single_choice_text",
    options: [
      { value: "very_slowly_loose", text: "Very slowly, it feels a bit loose or sags a little." },
      { value: "moderately_slow", text: "Moderately slow, takes a few seconds." },
      { value: "quickly_not_instantly", text: "Quickly, but not instantly." },
      { value: "instantly_rubber_band", text: "Instantly, like a rubber band!" }
    ]
  },
  {
    id: "q12_spf_consistency",
    section: "Texture, Firmness & Protection",
    title: "How consistently do you use a sunscreen (SPF 30+) as part of your daily routine?",
    type: "single_choice_text",
    options: [
      { value: "every_day_fail", text: "Every single day, without fail." },
      { value: "most_days_outside", text: "Most days, especially if I'm outside." },
      { value: "only_sunny_remember", text: "Only on sunny days or when I remember." },
      { value: "rarely_never", text: "Rarely or never." }
    ]
  },

  // --- V. Lifestyle & Preferences ---

  {
    id: "q13_lifestyle_impact",
    section: "Lifestyle & Preferences",
    title: "Which statement best describes your general lifestyle in terms of stress, sleep, and diet?",
    type: "single_choice_text",
    options: [
      { value: "often_stressed_sleep_deprived", text: "Often stressed, sleep-deprived, or inconsistent diet." },
      { value: "some_issues_try_balance", text: "Some stress/sleep issues, but I try to balance." },
      { value: "generally_balanced_healthy", text: "Generally balanced with good sleep and healthy diet." }
    ]
  },
  {
    id: "q14_preferred_product_textures",
    section: "Lifestyle & Preferences",
    title: "What kind of product *textures* do you generally prefer and enjoy using on your skin?",
    type: "single_choice_text",
    options: [
      { value: "lightweight_gels_essences", text: "Super lightweight gels, essences, or watery serums." },
      { value: "light_lotions_milks", text: "Light lotions, milky fluids, or serum-creams." },
      { value: "rich_comforting_creams", text: "Rich, comforting creams or nourishing balms." },
      { value: "luxurious_oils_thick_creams", text: "Luxurious facial oils or very thick, protective creams." }
    ]
  },
  {
    id: "q15_open_text_goals",
    section: "Lifestyle & Preferences",
    title: "Is there anything else crucial Lumin should know about your skin or skincare goals?",
    type: "long_text_input",
    placeholder: "e.g., specific allergies not listed, medical conditions, medications, pregnancy, or unique goals...",
    optional: true
  }
];
