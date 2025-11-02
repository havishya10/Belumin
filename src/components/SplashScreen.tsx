// Splash screen with striped gradient
import React, { useEffect } from 'react';
import { StripedGradient } from './StripedGradient';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <StripedGradient className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="text-center space-y-8 animate-fade-in">
        <div className="space-y-2">
          <h1 className="text-6xl text-[#2C6E6D] tracking-tight">
            BeLumin
          </h1>
          <p className="text-[#2C6E6D]/70 tracking-wide">
            Your Skin Journey Starts Here
          </p>
        </div>
        
        <div className="flex gap-1 justify-center">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-[#2C6E6D]/40"
              style={{
                animation: `pulse 1.5s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>
    </StripedGradient>
  );
};
