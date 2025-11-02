// My Routine screen
import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Checkbox } from './ui/checkbox';
import { RoutineStep } from '../types';
import { getRoutine, saveRoutine } from '../lib/storage';
import { ArrowLeft, Plus, MessageCircle, Sparkles } from 'lucide-react';

interface MyRoutineProps {
  onBack: () => void;
  onChatWithLumin: () => void;
}

// Mock routine data
const defaultRoutine: RoutineStep[] = [
  {
    id: '1',
    productName: 'Gentle Cleanser',
    category: 'cleanser',
    timeOfDay: 'both',
    order: 1,
    completed: false,
    compatibilityScore: 92,
  },
  {
    id: '2',
    productName: 'Vitamin C Serum',
    category: 'serum',
    timeOfDay: 'morning',
    order: 2,
    completed: false,
    compatibilityScore: 88,
  },
  {
    id: '3',
    productName: 'Moisturizer with SPF 50',
    category: 'sunscreen',
    timeOfDay: 'morning',
    order: 3,
    completed: false,
    compatibilityScore: 95,
  },
  {
    id: '4',
    productName: 'Niacinamide Serum',
    category: 'serum',
    timeOfDay: 'evening',
    order: 2,
    completed: false,
    compatibilityScore: 90,
  },
  {
    id: '5',
    productName: 'Night Cream',
    category: 'moisturizer',
    timeOfDay: 'evening',
    order: 3,
    completed: false,
    compatibilityScore: 87,
  },
];

export const MyRoutine: React.FC<MyRoutineProps> = ({ onBack, onChatWithLumin }) => {
  const [routine, setRoutine] = useState<RoutineStep[]>(() => {
    const saved = getRoutine();
    return saved.length > 0 ? saved : defaultRoutine;
  });

  const toggleComplete = (id: string) => {
    const updated = routine.map((step) =>
      step.id === id ? { ...step, completed: !step.completed } : step
    );
    setRoutine(updated);
    saveRoutine(updated);
  };

  const morningSteps = routine
    .filter((step) => step.timeOfDay === 'morning' || step.timeOfDay === 'both')
    .sort((a, b) => a.order - b.order);

  const eveningSteps = routine
    .filter((step) => step.timeOfDay === 'evening' || step.timeOfDay === 'both')
    .sort((a, b) => a.order - b.order);

  const getCompletionPercentage = (steps: RoutineStep[]) => {
    if (steps.length === 0) return 0;
    const completed = steps.filter((s) => s.completed).length;
    return Math.round((completed / steps.length) * 100);
  };

  const renderRoutineSteps = (steps: RoutineStep[]) => (
    <div className="space-y-3">
      {steps.map((step) => (
        <Card
          key={step.id}
          className={`p-4 border-[#A8C5AC]/20 transition-all ${
            step.completed ? 'bg-[#C8E6D0]/10' : 'bg-white'
          }`}
        >
          <div className="flex items-start gap-3">
            <Checkbox
              checked={step.completed}
              onCheckedChange={() => toggleComplete(step.id)}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3
                    className={`text-sm text-[#2C6E6D] ${
                      step.completed ? 'line-through opacity-60' : ''
                    }`}
                  >
                    {step.productName}
                  </h3>
                  <p className="text-xs text-[#2C6E6D]/60 mt-1 capitalize">
                    {step.category}
                  </p>
                </div>
                {step.compatibilityScore && (
                  <div className="text-right">
                    <div
                      className={`text-xs px-2 py-1 rounded-full ${
                        step.compatibilityScore >= 85
                          ? 'bg-[#C8E6D0]/30 text-[#2C6E6D]'
                          : 'bg-[#E8B4A4]/30 text-[#2C6E6D]'
                      }`}
                    >
                      {step.compatibilityScore}%
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

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
          <h1 className="text-[#2C6E6D]">My Routine</h1>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Tabs */}
        <Tabs defaultValue="morning" className="w-full">
          <TabsList className="w-full grid grid-cols-2 bg-white border border-[#A8C5AC]/20">
            <TabsTrigger value="morning" className="data-[state=active]:bg-[#A8C5AC] data-[state=active]:text-white">
              ☀️ Morning
            </TabsTrigger>
            <TabsTrigger value="evening" className="data-[state=active]:bg-[#2C6E6D] data-[state=active]:text-white">
              🌙 Evening
            </TabsTrigger>
          </TabsList>

          <TabsContent value="morning" className="mt-6 space-y-4">
            {/* Progress */}
            <Card className="p-4 bg-white border-[#A8C5AC]/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#2C6E6D]">Today's Progress</span>
                <span className="text-sm text-[#2C6E6D]">
                  {getCompletionPercentage(morningSteps)}%
                </span>
              </div>
              <div className="h-2 bg-[#A8C5AC]/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#A8C5AC] transition-all duration-300"
                  style={{ width: `${getCompletionPercentage(morningSteps)}%` }}
                />
              </div>
            </Card>

            {renderRoutineSteps(morningSteps)}
          </TabsContent>

          <TabsContent value="evening" className="mt-6 space-y-4">
            {/* Progress */}
            <Card className="p-4 bg-white border-[#A8C5AC]/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#2C6E6D]">Today's Progress</span>
                <span className="text-sm text-[#2C6E6D]">
                  {getCompletionPercentage(eveningSteps)}%
                </span>
              </div>
              <div className="h-2 bg-[#2C6E6D]/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#2C6E6D] transition-all duration-300"
                  style={{ width: `${getCompletionPercentage(eveningSteps)}%` }}
                />
              </div>
            </Card>

            {renderRoutineSteps(eveningSteps)}
          </TabsContent>
        </Tabs>

        {/* Ask Lumin */}
        <Card className="p-5 bg-gradient-to-br from-[#A8C5AC]/10 to-[#C8E6D0]/10 border-[#A8C5AC]/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#A8C5AC] to-[#C8E6D0] flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm text-[#2C6E6D] mb-1">
                Need help optimizing?
              </h3>
              <p className="text-xs text-[#2C6E6D]/70 mb-3">
                Ask Lumin for personalized routine suggestions
              </p>
              <Button
                onClick={onChatWithLumin}
                size="sm"
                className="bg-[#2C6E6D] hover:bg-[#2C6E6D]/90 text-white"
              >
                <MessageCircle className="w-3 h-3 mr-2" />
                Ask Lumin
              </Button>
            </div>
          </div>
        </Card>

        {/* Add Step Button */}
        <Button
          variant="outline"
          className="w-full border-[#A8C5AC] text-[#2C6E6D] hover:bg-[#A8C5AC]/10 border-dashed"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Step
        </Button>
      </div>
    </div>
  );
};
