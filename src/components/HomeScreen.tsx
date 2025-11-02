// Home screen for returning users
import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { UserProfile } from '../types';
import { getTimeBasedGreeting, getSkinTypeEmoji } from '../lib/utils-helpers';
import { MessageCircle, Camera, ClipboardList, User, Sparkles } from 'lucide-react';

interface HomeScreenProps {
  profile: UserProfile;
  onNavigate: (screen: 'chat' | 'scan' | 'routine' | 'profile') => void;
}

// Generate personalized tip based on quiz answers
const getPersonalizedTip = (profile: UserProfile): string => {
  const quizAnswers = profile.quizAnswers || {};
  
  // SPF tip
  const spfUsage = quizAnswers.q12_spf_consistency;
  if (spfUsage === 'rarely_never' || spfUsage === 'only_sunny_remember') {
    return 'Daily SPF 30+ is crucial for preventing aging and dark spots. Make it a non-negotiable morning step!';
  }
  
  // Texture preference tip
  const texturePreference = quizAnswers.q14_preferred_product_textures;
  if (texturePreference === 'luxurious_oils_thick_creams' && profile.skinType === 'oily') {
    return 'While you love rich textures, your oily skin might prefer lightweight gel moisturizers to avoid excess shine.';
  }
  
  // Lifestyle tip
  const lifestyle = quizAnswers.q13_lifestyle_impact;
  if (lifestyle === 'often_stressed_sleep_deprived') {
    return 'Stress and poor sleep affect your skin! Try to get 7-8 hours of sleep and consider calming ingredients like niacinamide.';
  }
  
  // Redness tip
  const rednessTime = quizAnswers.q5_redness_fading_time;
  if (rednessTime === 'stays_red_hours') {
    return 'Your lingering redness suggests sensitivity. Look for soothing ingredients like centella asiatica and avoid hot water when cleansing.';
  }
  
  // Default tips based on concerns
  if (profile.concerns.includes('acne')) {
    return 'For acne-prone skin, remember: consistency matters more than product quantity. Stick to a simple routine for 8-12 weeks.';
  }
  
  if (profile.concerns.includes('hyperpigmentation')) {
    return 'Fading dark spots requires patience and SPF! Use vitamin C in the morning and a gentle exfoliant at night.';
  }
  
  // Default
  return 'Always apply sunscreen as the last step of your morning routine, even on cloudy days!';
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ profile, onNavigate }) => {
  const greeting = getTimeBasedGreeting();

  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      {/* Header with gradient */}
      <div 
        className="px-6 pt-12 pb-8 rounded-b-[2rem]"
        style={{
          background: 'linear-gradient(180deg, #A8C5AC 0%, #C8E6D0 100%)',
        }}
      >
        <div className="space-y-1">
          <p className="text-[#2C6E6D]/80">
            {greeting},
          </p>
          <h1 className="text-3xl text-[#2C6E6D]">
            {profile.name || 'Friend'}! ✨
          </h1>
          <p className="text-sm text-[#2C6E6D]/70 mt-3">
            {getSkinTypeEmoji(profile.skinType)} {profile.skinType.charAt(0).toUpperCase() + profile.skinType.slice(1)} skin
          </p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Primary CTA - Chat with Lumin */}
        <Card 
          className="p-6 bg-white border-[#A8C5AC]/20 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onNavigate('chat')}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#A8C5AC] to-[#C8E6D0] flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-[#2C6E6D] mb-1">
                Chat with Lumin
              </h2>
              <p className="text-xs text-[#2C6E6D]/50 mb-2">Powered by GPT-4</p>
              <p className="text-sm text-[#2C6E6D]/70 mb-4">
                Get personalized skincare advice based on your unique profile
              </p>
              <Button 
                className="bg-[#2C6E6D] hover:bg-[#2C6E6D]/90 text-white"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Start Chatting
              </Button>
            </div>
          </div>
        </Card>

        {/* Quick Actions Grid */}
        <div className="space-y-3">
          <h3 className="text-sm text-[#2C6E6D]/70 px-1">
            Quick Actions
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <Card
              className="p-4 bg-white border-[#A8C5AC]/20 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onNavigate('scan')}
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-full bg-[#E8B4A4]/20 flex items-center justify-center">
                  <Camera className="w-5 h-5 text-[#E8B4A4]" />
                </div>
                <div>
                  <h3 className="text-sm text-[#2C6E6D] mb-1">
                    AI Product Scan
                  </h3>
                  <p className="text-xs text-[#2C6E6D]/70">
                    Instant analysis
                  </p>
                </div>
              </div>
            </Card>

            <Card
              className="p-4 bg-white border-[#A8C5AC]/20 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onNavigate('routine')}
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-full bg-[#C8E6D0]/40 flex items-center justify-center">
                  <ClipboardList className="w-5 h-5 text-[#2C6E6D]" />
                </div>
                <div>
                  <h3 className="text-sm text-[#2C6E6D] mb-1">
                    My Routine
                  </h3>
                  <p className="text-xs text-[#2C6E6D]/70">
                    Track your steps
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Skin Profile Summary */}
        <Card className="p-5 bg-white border-[#A8C5AC]/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#2C6E6D]">
              Your Skin Profile
            </h3>
            <button
              onClick={() => onNavigate('profile')}
              className="text-sm text-[#A8C5AC]"
            >
              Edit
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-[#2C6E6D]/60 mb-1">Main Concerns</p>
              <div className="flex flex-wrap gap-2">
                {profile.concerns.slice(0, 3).map((concern) => (
                  <span
                    key={concern}
                    className="px-3 py-1 bg-[#C8E6D0]/30 text-xs text-[#2C6E6D] rounded-full"
                  >
                    {concern.replace('_', ' ')}
                  </span>
                ))}
                {profile.concerns.length > 3 && (
                  <span className="px-3 py-1 bg-[#C8E6D0]/30 text-xs text-[#2C6E6D] rounded-full">
                    +{profile.concerns.length - 3} more
                  </span>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs text-[#2C6E6D]/60 mb-1">Budget Range</p>
              <p className="text-sm text-[#2C6E6D]">{profile.budget}</p>
            </div>
          </div>
        </Card>

        {/* Personalized Tip Section */}
        <Card className="p-5 bg-gradient-to-br from-[#E8B4A4]/10 to-[#C8E6D0]/10 border-[#A8C5AC]/20">
          <div className="flex gap-3">
            <div className="text-2xl">💡</div>
            <div>
              <h3 className="text-sm text-[#2C6E6D] mb-2">
                Personalized Tip for You
              </h3>
              <p className="text-xs text-[#2C6E6D]/70">
                {getPersonalizedTip(profile)}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
