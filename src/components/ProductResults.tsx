// Product analysis results screen
import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ProductAnalysis } from '../types';
import { ArrowLeft, MessageCircle, Plus, Search } from 'lucide-react';

interface ProductResultsProps {
  analysis: ProductAnalysis;
  onBack: () => void;
  onTalkToLumin: () => void;
}

export const ProductResults: React.FC<ProductResultsProps> = ({
  analysis,
  onBack,
  onTalkToLumin,
}) => {
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
          <div>
            <h1 className="text-[#2C6E6D]">Analysis Results</h1>
            <p className="text-xs text-[#2C6E6D]/50">Analyzed by Lumin AI</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Product Image Placeholder */}
        {analysis.imageUrl && (
          <Card className="p-6 bg-white border-[#A8C5AC]/20">
            <div className="aspect-square bg-[#C8E6D0]/20 rounded-lg flex items-center justify-center">
              <img
                src={analysis.imageUrl}
                alt={analysis.productName}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </Card>
        )}

        {/* Product Name */}
        <div className="text-center">
          <h2 className="text-2xl text-[#2C6E6D]">
            {analysis.productName}
          </h2>
        </div>

        {/* Compatibility Score */}
        <Card className="p-6 bg-white border-[#A8C5AC]/20">
          <div className="text-center space-y-4">
            <h3 className="text-sm text-[#2C6E6D]/70">
              Compatibility Score
            </h3>
            <div className="relative">
              <div className="text-5xl text-[#2C6E6D]">
                {analysis.compatibilityScore}%
              </div>
              <p className="text-sm text-[#2C6E6D]/60 mt-2">
                {analysis.compatibilityScore >= 80
                  ? 'Great match for your skin! ✨'
                  : analysis.compatibilityScore >= 60
                  ? 'Good option with some considerations'
                  : 'May not be ideal for your skin type'}
              </p>
            </div>
            
            {/* Progress bar */}
            <div className="w-full h-3 bg-[#A8C5AC]/20 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  analysis.compatibilityScore >= 80
                    ? 'bg-[#C8E6D0]'
                    : analysis.compatibilityScore >= 60
                    ? 'bg-[#E8B4A4]'
                    : 'bg-[#E8B4A4]/60'
                }`}
                style={{ width: `${analysis.compatibilityScore}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Analysis Details */}
        <div className="space-y-4">
          {/* Pros */}
          <Card className="p-5 bg-white border-[#A8C5AC]/20">
            <h3 className="text-[#2C6E6D] mb-3 flex items-center gap-2">
              <span className="text-lg">✓</span>
              Why this works for you
            </h3>
            <ul className="space-y-2">
              {analysis.pros.map((pro, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-[#2C6E6D]/80">
                  <span className="text-[#C8E6D0] mt-1">•</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Cons */}
          {analysis.cons.length > 0 && (
            <Card className="p-5 bg-white border-[#E8B4A4]/20">
              <h3 className="text-[#2C6E6D] mb-3 flex items-center gap-2">
                <span className="text-lg">⚠</span>
                Watch out for
              </h3>
              <ul className="space-y-2">
                {analysis.cons.map((con, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-[#2C6E6D]/80">
                    <span className="text-[#E8B4A4] mt-1">•</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        {/* Ingredients (if available) */}
        {analysis.ingredients && (
          <Card className="p-5 bg-white border-[#A8C5AC]/20">
            <h3 className="text-[#2C6E6D] mb-2">
              Full Ingredient List
            </h3>
            <p className="text-xs text-[#2C6E6D]/70 leading-relaxed">
              {analysis.ingredients}
            </p>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={onTalkToLumin}
            className="w-full bg-[#2C6E6D] hover:bg-[#2C6E6D]/90 text-white h-12"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Talk to Lumin about this
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="border-[#A8C5AC] text-[#2C6E6D] hover:bg-[#A8C5AC]/10"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add to Routine
            </Button>
            <Button
              variant="outline"
              className="border-[#A8C5AC] text-[#2C6E6D] hover:bg-[#A8C5AC]/10"
            >
              <Search className="w-4 h-4 mr-2" />
              Find Alternatives
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
