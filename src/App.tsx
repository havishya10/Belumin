import React, { useState, useEffect } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { Onboarding } from './components/Onboarding';
import { HomeScreen } from './components/HomeScreen';
import { ChatInterface } from './components/ChatInterface';
import { ChatHistory } from './components/ChatHistory';
import { ProductAnalysis } from './components/ProductAnalysis';
import { ProductResults } from './components/ProductResults';
import { MyRoutine } from './components/MyRoutine';
import { ProfileScreen } from './components/ProfileScreen';
import { getUserProfile, isOnboardingComplete } from './lib/storage';
import { UserProfile, ProductAnalysis as ProductAnalysisType } from './types';
import { Toaster } from './components/ui/sonner';

type Screen =
  | 'splash'
  | 'onboarding'
  | 'home'
  | 'chat'
  | 'chat-history'
  | 'scan'
  | 'results'
  | 'routine'
  | 'profile';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [productAnalysisResult, setProductAnalysisResult] =
    useState<ProductAnalysisType | null>(null);
  const [chatContext, setChatContext] = useState<string | undefined>(undefined);
  const [chatConversationId, setChatConversationId] = useState<string | undefined>(
    undefined
  );

  const handleSplashComplete = () => {
    if (isOnboardingComplete()) {
      const profile = getUserProfile();
      setUserProfile(profile);
      setCurrentScreen('home');
    } else {
      setCurrentScreen('onboarding');
    }
  };

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setCurrentScreen('home');
  };

  const handleNavigation = (screen: 'chat' | 'scan' | 'routine' | 'profile') => {
    setChatContext(undefined);
    setChatConversationId(undefined);
    setCurrentScreen(screen);
  };

  const handleProductAnalysis = (analysis: ProductAnalysisType) => {
    setProductAnalysisResult(analysis);
    setCurrentScreen('results');
  };

  const handleTalkToLumin = () => {
    if (productAnalysisResult) {
      setChatContext(
        `I just analyzed a product: ${productAnalysisResult.productName}. It has a ${productAnalysisResult.compatibilityScore}% compatibility score. Can you tell me more about it?`
      );
    }
    setCurrentScreen('chat');
  };

  const handleSelectConversation = (id: string) => {
    setChatConversationId(id);
    setChatContext(undefined);
    setCurrentScreen('chat');
  };

  const handleLogout = () => {
    setUserProfile(null);
    setCurrentScreen('onboarding');
  };

  return (
    <div className="min-h-screen">
      {currentScreen === 'splash' && (
        <SplashScreen onComplete={handleSplashComplete} />
      )}

      {currentScreen === 'onboarding' && (
        <Onboarding onComplete={handleOnboardingComplete} />
      )}

      {currentScreen === 'home' && userProfile && (
        <HomeScreen profile={userProfile} onNavigate={handleNavigation} />
      )}

      {currentScreen === 'chat' && (
        <ChatInterface
          profile={userProfile}
          onBack={() => setCurrentScreen('home')}
          onShowHistory={() => setCurrentScreen('chat-history')}
          initialContext={chatContext}
          conversationId={chatConversationId}
        />
      )}

      {currentScreen === 'chat-history' && (
        <ChatHistory
          onBack={() => setCurrentScreen('chat')}
          onSelectConversation={handleSelectConversation}
        />
      )}

      {currentScreen === 'scan' && (
        <ProductAnalysis
          profile={userProfile}
          onBack={() => setCurrentScreen('home')}
          onResults={handleProductAnalysis}
        />
      )}

      {currentScreen === 'results' && productAnalysisResult && (
        <ProductResults
          analysis={productAnalysisResult}
          onBack={() => setCurrentScreen('scan')}
          onTalkToLumin={handleTalkToLumin}
        />
      )}

      {currentScreen === 'routine' && (
        <MyRoutine
          onBack={() => setCurrentScreen('home')}
          onChatWithLumin={() => {
            setChatContext('Can you help me optimize my skincare routine?');
            setCurrentScreen('chat');
          }}
        />
      )}

      {currentScreen === 'profile' && userProfile && (
        <ProfileScreen
          profile={userProfile}
          onBack={() => setCurrentScreen('home')}
          onEdit={() => setCurrentScreen('onboarding')}
          onLogout={handleLogout}
        />
      )}

      <Toaster />
    </div>
  );
}

export default App;
