// Profile and settings screen
import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { UserProfile } from '../types';
import { clearAllData } from '../lib/storage';
import { getSkinTypeEmoji } from '../lib/utils-helpers';
import { ArrowLeft, Edit, BarChart3, Settings, LogOut } from 'lucide-react';

interface ProfileScreenProps {
  profile: UserProfile;
  onBack: () => void;
  onEdit: () => void;
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile,
  onBack,
  onEdit,
  onLogout,
}) => {
  const handleLogout = () => {
    if (confirm('Are you sure you want to clear all data and start over?')) {
      clearAllData();
      onLogout();
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F1E8] pb-24">
      {/* Header */}
      <div className="bg-white border-b border-[#A8C5AC]/20 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-[#A8C5AC]/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#2C6E6D]" />
          </button>
          <h1 className="text-[#2C6E6D]">Profile</h1>
        </div>
      </div>

      <div className="px-6 py-8 space-y-6">
        {/* User Info */}
        <Card className="p-6 bg-white border-[#A8C5AC]/20">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#A8C5AC] to-[#C8E6D0] flex items-center justify-center text-2xl">
                {profile.name ? profile.name.charAt(0).toUpperCase() : '👤'}
              </div>
              <div>
                <h2 className="text-xl text-[#2C6E6D]">
                  {profile.name || 'User'}
                </h2>
                <p className="text-sm text-[#2C6E6D]/60 mt-1">
                  Member since {new Date(profile.createdAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            <button
              onClick={onEdit}
              className="p-2 hover:bg-[#A8C5AC]/10 rounded-full transition-colors"
            >
              <Edit className="w-4 h-4 text-[#2C6E6D]" />
            </button>
          </div>
        </Card>

        {/* Skin Profile */}
        <div className="space-y-3">
          <h3 className="text-sm text-[#2C6E6D]/70 px-1">Skin Profile</h3>
          
          <Card className="p-5 bg-white border-[#A8C5AC]/20">
            <div className="space-y-4">
              <div>
                <p className="text-xs text-[#2C6E6D]/60 mb-2">Skin Type</p>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{getSkinTypeEmoji(profile.skinType)}</span>
                  <span className="text-sm text-[#2C6E6D] capitalize">
                    {profile.skinType}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs text-[#2C6E6D]/60 mb-2">Main Concerns</p>
                <div className="flex flex-wrap gap-2">
                  {profile.concerns.map((concern) => (
                    <span
                      key={concern}
                      className="px-3 py-1 bg-[#C8E6D0]/30 text-xs text-[#2C6E6D] rounded-full capitalize"
                    >
                      {concern.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs text-[#2C6E6D]/60 mb-2">Budget Range</p>
                <span className="text-sm text-[#2C6E6D]">{profile.budget}</span>
              </div>

              {profile.allergies.length > 0 && (
                <div>
                  <p className="text-xs text-[#2C6E6D]/60 mb-2">Sensitivities</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.allergies.map((allergy) => (
                      <span
                        key={allergy}
                        className="px-3 py-1 bg-[#E8B4A4]/20 text-xs text-[#2C6E6D] rounded-full"
                      >
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Stats */}
        <div className="space-y-3">
          <h3 className="text-sm text-[#2C6E6D]/70 px-1">Activity</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4 bg-white border-[#A8C5AC]/20">
              <BarChart3 className="w-6 h-6 text-[#A8C5AC] mb-2" />
              <p className="text-2xl text-[#2C6E6D]">12</p>
              <p className="text-xs text-[#2C6E6D]/60">Products Analyzed</p>
            </Card>
            
            <Card className="p-4 bg-white border-[#A8C5AC]/20">
              <div className="text-2xl mb-2">🔥</div>
              <p className="text-2xl text-[#2C6E6D]">7</p>
              <p className="text-xs text-[#2C6E6D]/60">Day Streak</p>
            </Card>
          </div>
        </div>

        {/* Settings */}
        <div className="space-y-3">
          <h3 className="text-sm text-[#2C6E6D]/70 px-1">Settings</h3>
          
          <Card className="divide-y divide-[#A8C5AC]/10 bg-white border-[#A8C5AC]/20">
            <button className="w-full p-4 flex items-center justify-between hover:bg-[#A8C5AC]/5 transition-colors">
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-[#2C6E6D]" />
                <span className="text-sm text-[#2C6E6D]">App Settings</span>
              </div>
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full p-4 flex items-center justify-between hover:bg-red-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-5 h-5 text-red-500" />
                <span className="text-sm text-red-500">Clear Data & Restart</span>
              </div>
            </button>
          </Card>
        </div>

        {/* App Info */}
        <div className="text-center pt-6">
          <p className="text-xs text-[#2C6E6D]/40">
            BeLumin v1.0.0
          </p>
          <p className="text-xs text-[#2C6E6D]/40 mt-1">
            Made with 💚 for your skin
          </p>
        </div>
      </div>
    </div>
  );
};
