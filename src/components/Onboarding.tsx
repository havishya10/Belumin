// Comprehensive multi-step onboarding flow with all question types
import React, { useState } from 'react';
import { StripedGradient } from './StripedGradient';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Slider } from './ui/slider';
import { UserProfile } from '../types';
import { saveUserProfile } from '../lib/storage';
import { beluminQuizQuestions, QuizQuestion } from '../data/quiz-questions';
import { deriveSkinType, deriveConcerns } from '../lib/quiz-analysis';
import { ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1); // -1 is welcome screen
  const [userName, setUserName] = useState('');
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const totalQuestions = beluminQuizQuestions.length;
  const currentQuestion = currentQuestionIndex >= 0 ? beluminQuizQuestions[currentQuestionIndex] : null;

  // Get current section for display
  const getCurrentSection = () => {
    if (currentQuestionIndex < 0) return null;
    return currentQuestion?.section;
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Complete onboarding - analyze answers and create profile
      const profile = createProfileFromAnswers();
      saveUserProfile(profile);
      onComplete(profile);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex >= 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const canProceed = () => {
    if (currentQuestionIndex < 0) return true; // Welcome screen
    if (!currentQuestion) return false;
    
    const answer = answers[currentQuestion.id];
    
    // Optional questions can be skipped
    if (currentQuestion.optional) return true;
    
    // Check if answer exists and is valid
    if (currentQuestion.type === 'multi_choice_text' || currentQuestion.type === 'multi_choice_icons') {
      return answer && Array.isArray(answer) && answer.length > 0;
    }
    
    return answer !== undefined && answer !== null && answer !== '';
  };

  const setAnswer = (questionId: string, value: any) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const toggleMultiChoice = (questionId: string, value: string) => {
    const current = answers[questionId] || [];
    if (current.includes(value)) {
      setAnswer(questionId, current.filter((v: string) => v !== value));
    } else {
      setAnswer(questionId, [...current, value]);
    }
  };

  // Analyze answers and create UserProfile
  const createProfileFromAnswers = (): UserProfile => {
    // Derive skin type from answers using quiz-analysis utility
    const skinType = deriveSkinType(answers);
    const concerns = deriveConcerns(answers);
    const budget = '₹300-500' as const; // Default budget
    const allergies = answers.q6_known_irritants || [];

    return {
      name: userName || undefined,
      skinType,
      concerns,
      budget,
      allergies: allergies.filter((a: string) => a !== 'no_specific_intolerance'),
      createdAt: new Date().toISOString(),
      quizAnswers: answers,
    };
  };

  const renderQuestion = (question: QuizQuestion) => {
    const answer = answers[question.id];

    switch (question.type) {
      case 'single_choice_text':
        return (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <Card
                key={option.value}
                className={`p-4 cursor-pointer transition-all border-2 ${
                  answer === option.value
                    ? 'border-[#A8C5AC] bg-[#A8C5AC]/10'
                    : 'border-transparent bg-white hover:border-[#A8C5AC]/30'
                }`}
                onClick={() => setAnswer(question.id, option.value)}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm text-[#2C6E6D] flex-1">{option.text}</p>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      answer === option.value
                        ? 'border-[#A8C5AC] bg-[#A8C5AC]'
                        : 'border-[#A8C5AC]/30'
                    }`}
                  >
                    {answer === option.value && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        );

      case 'multi_choice_text':
      case 'multi_choice_icons':
        const selectedValues = answer || [];
        return (
          <div className="grid grid-cols-1 gap-3">
            {question.options?.map((option) => {
              const isSelected = selectedValues.includes(option.value);
              return (
                <Card
                  key={option.value}
                  className={`p-4 cursor-pointer transition-all border-2 ${
                    isSelected
                      ? 'border-[#A8C5AC] bg-[#A8C5AC]/10'
                      : 'border-transparent bg-white hover:border-[#A8C5AC]/30'
                  }`}
                  onClick={() => toggleMultiChoice(question.id, option.value)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        isSelected
                          ? 'border-[#A8C5AC] bg-[#A8C5AC]'
                          : 'border-[#A8C5AC]/30'
                      }`}
                    >
                      {isSelected && (
                        <ChevronRight className="w-3 h-3 text-white rotate-90" />
                      )}
                    </div>
                    {question.type === 'multi_choice_icons' && option.icon && (
                      <span className="text-2xl">{option.icon}</span>
                    )}
                    <div className="flex-1">
                      <p className="text-sm text-[#2C6E6D]">{option.text}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        );

      case 'slider':
        const sliderValue = answer || question.min || 1;
        return (
          <div className="space-y-6">
            <Card className="p-6 bg-white border-[#A8C5AC]/20">
              <div className="space-y-4">
                <div className="text-center">
                  <span className="text-4xl text-[#2C6E6D]">{sliderValue}</span>
                  <p className="text-sm text-[#2C6E6D]/70 mt-2">
                    {question.labels?.[sliderValue - 1]}
                  </p>
                </div>
                <Slider
                  value={[sliderValue]}
                  onValueChange={(values) => setAnswer(question.id, values[0])}
                  min={question.min}
                  max={question.max}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-[#2C6E6D]/60">
                  <span>{question.labels?.[0]}</span>
                  <span>{question.labels?.[question.labels.length - 1]}</span>
                </div>
              </div>
            </Card>
          </div>
        );

      case 'long_text_input':
        return (
          <div className="space-y-3">
            <Textarea
              value={answer || ''}
              onChange={(e) => setAnswer(question.id, e.target.value)}
              placeholder={question.placeholder}
              rows={6}
              className="bg-white border-[#A8C5AC]/30 focus:border-[#A8C5AC] resize-none"
            />
            {question.optional && (
              <p className="text-xs text-[#2C6E6D]/60">
                ✨ Optional - You can skip this if you prefer
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      {/* Progress bar */}
      <div className="bg-white border-b border-[#A8C5AC]/20">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#2C6E6D]/60">
              {currentQuestionIndex < 0 
                ? 'Welcome' 
                : `Question ${currentQuestionIndex + 1} of ${totalQuestions}`}
            </span>
            {currentQuestionIndex >= 0 && (
              <button
                onClick={handleBack}
                className="text-sm text-[#2C6E6D] flex items-center gap-1 hover:text-[#A8C5AC] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            )}
          </div>
          <div className="h-2 bg-[#A8C5AC]/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#A8C5AC] transition-all duration-300"
              style={{
                width: `${((currentQuestionIndex + 1) / (totalQuestions + 1)) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Welcome Screen */}
        {currentQuestionIndex < 0 && (
          <div className="space-y-8">
            <StripedGradient className="rounded-3xl p-8 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-[#2C6E6D]" />
                </div>
                <h1 className="text-4xl text-[#2C6E6D]">
                  Welcome to BeLumin! 💚
                </h1>
                <p className="text-[#2C6E6D]/80">
                  Let's understand your skin better
                </p>
              </div>
            </StripedGradient>

            <Card className="p-6 bg-white border-[#A8C5AC]/20">
              <h2 className="text-[#2C6E6D] mb-3">
                Your Personalized Skin Journey
              </h2>
              <p className="text-[#2C6E6D]/70 mb-6">
                We'll ask you 15 questions about your skin to create a comprehensive profile. 
                This helps Lumin give you the most accurate recommendations.
              </p>

              <div className="space-y-3 text-sm text-[#2C6E6D]/70">
                <div className="flex items-start gap-2">
                  <span className="text-[#A8C5AC] mt-0.5">✓</span>
                  <span>Takes about 5 minutes</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#A8C5AC] mt-0.5">✓</span>
                  <span>All information is private and stored locally</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#A8C5AC] mt-0.5">✓</span>
                  <span>Answer honestly for best results</span>
                </div>
              </div>
            </Card>

            <div className="space-y-3">
              <label className="text-sm text-[#2C6E6D]">
                What's your name? (Optional)
              </label>
              <Input
                placeholder="Enter your name..."
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="bg-white border-[#A8C5AC]/30"
              />
            </div>
          </div>
        )}

        {/* Question Screens */}
        {currentQuestion && (
          <div className="space-y-6">
            {/* Section badge */}
            {getCurrentSection() && (
              <div className="inline-block px-3 py-1 bg-[#C8E6D0]/30 rounded-full">
                <span className="text-xs text-[#2C6E6D]">{getCurrentSection()}</span>
              </div>
            )}

            {/* Question title */}
            <div className="space-y-3">
              <h2 className="text-2xl text-[#2C6E6D] leading-snug">
                {currentQuestion.title}
              </h2>
              {currentQuestion.optional && (
                <p className="text-sm text-[#2C6E6D]/60">Optional question</p>
              )}
            </div>

            {/* Question content */}
            {renderQuestion(currentQuestion)}
          </div>
        )}

        {/* Navigation button */}
        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          className="w-full mt-8 bg-[#A8C5AC] hover:bg-[#A8C5AC]/90 text-white h-12 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentQuestionIndex === totalQuestions - 1 ? (
            <>
              Complete Profile
              <Sparkles className="w-4 h-4 ml-2" />
            </>
          ) : (
            <>
              Continue
              <ChevronRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>

        {/* Skip button for optional questions */}
        {currentQuestion?.optional && !answers[currentQuestion.id] && (
          <button
            onClick={handleNext}
            className="w-full mt-3 text-sm text-[#2C6E6D]/60 hover:text-[#2C6E6D] transition-colors"
          >
            Skip this question
          </button>
        )}
      </div>
    </div>
  );
};
