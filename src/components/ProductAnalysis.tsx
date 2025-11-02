// Product analysis upload screen
import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { UserProfile, ProductAnalysis as ProductAnalysisType } from '../types';
import { analyzeProductIngredients } from '../lib/openai';
import { ArrowLeft, Camera, Upload, Sparkles } from 'lucide-react';

interface ProductAnalysisProps {
  profile: UserProfile | null;
  onBack: () => void;
  onResults: (analysis: ProductAnalysisType) => void;
}

export const ProductAnalysis: React.FC<ProductAnalysisProps> = ({
  profile,
  onBack,
  onResults,
}) => {
  const [ingredients, setIngredients] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!ingredients.trim()) return;

    setIsAnalyzing(true);

    try {
      const analysis = await analyzeProductIngredients(ingredients, profile);
      onResults(analysis);
    } catch (error) {
      console.error('Error analyzing product:', error);
      alert('Unable to analyze product right now. Please check your connection and try again!');
      setIsAnalyzing(false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      {/* Header */}
      <div className="bg-white border-b border-[#A8C5AC]/20 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-[#A8C5AC]/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#2C6E6D]" />
          </button>
          <h1 className="text-[#2C6E6D]">Product Analysis</h1>
        </div>
      </div>

      <div className="px-6 py-8 space-y-6">
        {/* Upload Section */}
        <Card className="p-8 bg-white border-[#A8C5AC]/20">
          <div className="text-center space-y-4">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#A8C5AC]/20 to-[#C8E6D0]/20 flex items-center justify-center">
              <Camera className="w-12 h-12 text-[#A8C5AC]" />
            </div>
            <div>
              <h2 className="text-[#2C6E6D] mb-2">
                Scan or Upload
              </h2>
              <p className="text-sm text-[#2C6E6D]/70">
                Take a photo of the ingredient list or upload from your gallery
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                className="border-[#A8C5AC] text-[#2C6E6D] hover:bg-[#A8C5AC]/10"
              >
                <Camera className="w-4 h-4 mr-2" />
                Camera
              </Button>
              <Button
                variant="outline"
                className="border-[#A8C5AC] text-[#2C6E6D] hover:bg-[#A8C5AC]/10"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
            </div>
          </div>
        </Card>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-[#A8C5AC]/20" />
          <span className="text-sm text-[#2C6E6D]/60">or</span>
          <div className="flex-1 h-px bg-[#A8C5AC]/20" />
        </div>

        {/* Manual Input */}
        <div className="space-y-3">
          <label className="text-sm text-[#2C6E6D]">
            Enter ingredients manually
          </label>
          <Textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="Paste the ingredient list here... e.g., Aqua, Niacinamide, Salicylic Acid, Glycerin, etc."
            rows={8}
            className="bg-white border-[#A8C5AC]/30 focus:border-[#A8C5AC] resize-none"
          />
          <p className="text-xs text-[#2C6E6D]/60">
            💡 Tip: Copy the full ingredient list for best results
          </p>
        </div>

        {/* Analyze Button */}
        <Button
          onClick={handleAnalyze}
          disabled={!ingredients.trim() || isAnalyzing}
          className="w-full bg-[#2C6E6D] hover:bg-[#2C6E6D]/90 text-white h-12"
        >
          {isAnalyzing ? (
            <>
              <Sparkles className="w-4 h-4 mr-2 animate-spin" />
              Analyzing with AI...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Analyze with Lumin AI
            </>
          )}
        </Button>

        {/* Info Card */}
        <Card className="p-4 bg-gradient-to-br from-[#E8B4A4]/10 to-[#C8E6D0]/10 border-[#A8C5AC]/20">
          <div className="flex gap-3">
            <div className="text-xl">🔍</div>
            <div>
              <h3 className="text-sm text-[#2C6E6D] mb-1">
                What we analyze
              </h3>
              <ul className="text-xs text-[#2C6E6D]/70 space-y-1">
                <li>• Compatibility with your skin type</li>
                <li>• Ingredients that match your concerns</li>
                <li>• Potential allergens or irritants</li>
                <li>• Overall product effectiveness</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
