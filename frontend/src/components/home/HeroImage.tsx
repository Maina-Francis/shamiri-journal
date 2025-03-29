
import React from 'react';
import { Sparkles, Brain, PenLine } from 'lucide-react';
import AnimatedContainer from '@/components/ui/AnimatedContainer';

const HeroImage = () => {
  return (
    <div className="relative flex items-center justify-center">
      {/* Main image container with animation */}
      <div className="relative rounded-xl overflow-hidden shadow-xl border border-gray-100 bg-white/50 backdrop-blur-sm p-4">
        {/* Stylized journal and AI elements */}
        <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg overflow-hidden flex items-center justify-center">
          {/* Animated journal */}
          <div className="relative w-3/4 h-3/4 animate-float">
            {/* Journal cover */}
            <div className="absolute inset-0 bg-accent/10 rounded-lg transform rotate-3 shadow-md"></div>
            
            {/* Journal pages */}
            <div className="absolute inset-0 bg-white rounded-lg transform -rotate-2 shadow-sm flex flex-col p-6">
              <div className="w-full h-4 bg-gray-100 rounded mb-3"></div>
              <div className="w-3/4 h-4 bg-gray-100 rounded mb-3"></div>
              <div className="w-5/6 h-4 bg-gray-100 rounded mb-3"></div>
              <div className="w-2/3 h-4 bg-gray-100 rounded mb-3"></div>
              
              {/* Animated pen */}
              <div className="absolute right-4 bottom-8 w-12 h-2 bg-accent/40 rounded-full transform -rotate-45 animate-write-slow origin-right"></div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-10 right-10 text-accent/70 animate-pulse">
            <Sparkles className="h-10 w-10" />
          </div>
          
          <div className="absolute bottom-12 left-10 text-accent/70 animate-bounce-slow">
            <Brain className="h-8 w-8" />
          </div>
        </div>
        
        {/* Caption overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/90 to-white/0 p-4 text-center">
          <p className="text-sm font-medium text-accent">Your thoughts, enhanced by AI</p>
        </div>
      </div>
      
      {/* Floating AI insights bubbles */}
      <AnimatedContainer delay={700} className="absolute -right-12 top-1/4 animate-float">
        <div className="glass-card p-3 shadow-lg rounded-lg max-w-[150px]">
          <div className="flex items-center mb-2">
            <Brain className="h-4 w-4 text-accent mr-1" />
            <span className="text-xs font-medium">AI Insight</span>
          </div>
          <p className="text-xs text-gray-600">Your mood improves when you write in the morning</p>
        </div>
      </AnimatedContainer>
      
      <AnimatedContainer delay={900} className="absolute -left-16 bottom-1/4 animate-float-slow">
        <div className="glass-card p-3 shadow-lg rounded-lg max-w-[150px]">
          <div className="flex items-center mb-2">
            <PenLine className="h-4 w-4 text-accent mr-1" />
            <span className="text-xs font-medium">Pattern Found</span>
          </div>
          <p className="text-xs text-gray-600">You mention exercise more on positive days</p>
        </div>
      </AnimatedContainer>
      
      {/* Background blobs */}
      <div className="absolute -z-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl top-20 -left-20"></div>
      <div className="absolute -z-10 w-80 h-80 bg-blue-100/50 rounded-full blur-3xl -bottom-20 -right-20"></div>
    </div>
  );
};

export default HeroImage;
