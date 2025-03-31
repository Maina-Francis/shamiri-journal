
import React, { useState } from 'react';
import { Sparkles, Brain, PenLine, Lightbulb } from 'lucide-react';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { useIsMobile } from '@/hooks/use-mobile';

const HeroImage = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const isMobile = useIsMobile();

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    console.error("Failed to load hero image");
    setImageError(true);
  };

  return (
    <div className="relative flex items-center justify-center w-full max-w-xl mx-auto">
      {/* Main image container with animation */}
      <div className="relative w-full rounded-xl overflow-hidden shadow-xl border border-gray-100 bg-white/50 backdrop-blur-sm">
        {/* Hero image */}
        <div className="relative w-full overflow-hidden rounded-lg">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <span className="text-gray-400">Loading image...</span>
            </div>
          )}
          
          {imageError ? (
            <div className="w-full h-64 sm:h-80 md:h-96 bg-gradient-to-r from-blue-50 to-indigo-100 flex items-center justify-center">
              <div className="text-center p-6">
                <PenLine className="h-16 w-16 mx-auto mb-4 text-accent opacity-80" />
                <p className="text-accent/80 font-medium">Shamiri: Your AI Journaling Companion</p>
              </div>
            </div>
          ) : (
            <img 
              src="/heroImage.jpg"
              alt="Person journaling with AI assistance" 
              className={`w-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              loading="eager"
              onLoad={handleImageLoad}
              onError={handleImageError}
              style={{ height: isMobile ? '280px' : '360px', objectFit: 'cover', objectPosition: 'center' }}
            />
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>
        
        {/* Caption overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/90 to-white/0 p-4 text-center">
          <p className="text-sm font-medium text-accent">Your thoughts, enhanced by AI</p>
        </div>
      </div>
      
      {/* Mood detected bubble */}
      <AnimatedContainer delay={500} className="absolute -right-4 sm:-right-12 top-6 animate-float hidden md:block">
        <div className="glass-card p-3 shadow-lg rounded-lg max-w-[150px]">
          <div className="flex items-center mb-2">
            <Brain className="h-4 w-4 text-accent mr-1" />
            <span className="text-xs font-medium">Mood detected</span>
          </div>
          <p className="text-xs text-gray-600">Optimistic</p>
        </div>
      </AnimatedContainer>
      
      {/* Floating AI insights bubbles */}
      <AnimatedContainer delay={700} className="absolute -right-4 sm:-right-16 top-1/3 animate-float hidden md:block">
        <div className="glass-card p-3 shadow-lg rounded-lg max-w-[160px]">
          <div className="flex items-center mb-2">
            <Lightbulb className="h-4 w-4 text-accent mr-1" />
            <span className="text-xs font-medium">AI Insight</span>
          </div>
          <p className="text-xs text-gray-600">Your mood improves when you write in the morning</p>
        </div>
      </AnimatedContainer>
      
      <AnimatedContainer delay={900} className="absolute -left-4 sm:-left-16 bottom-1/4 animate-float-slow hidden md:block">
        <div className="glass-card p-3 shadow-lg rounded-lg max-w-[160px]">
          <div className="flex items-center mb-2">
            <Sparkles className="h-4 w-4 text-accent mr-1" />
            <span className="text-xs font-medium">AI Assistant</span>
          </div>
          <p className="text-xs text-gray-600">Try journaling about your achievements today</p>
        </div>
      </AnimatedContainer>
      
      {/* Mobile version of the floating bubbles (stacked vertically) */}
      <div className="md:hidden absolute -right-2 top-6 space-y-2">
        <AnimatedContainer delay={500} className="animate-float">
          <div className="glass-card p-2 shadow-lg rounded-lg max-w-[120px]">
            <div className="flex items-center mb-1">
              <Brain className="h-3 w-3 text-accent mr-1" />
              <span className="text-xs font-medium">Mood detected</span>
            </div>
            <p className="text-xs text-gray-600">Optimistic</p>
          </div>
        </AnimatedContainer>
        
        <AnimatedContainer delay={700} className="animate-float">
          <div className="glass-card p-2 shadow-lg rounded-lg max-w-[120px]">
            <div className="flex items-center mb-1">
              <Lightbulb className="h-3 w-3 text-accent mr-1" />
              <span className="text-xs font-medium">AI Insight</span>
            </div>
            <p className="text-xs text-gray-600">Morning writing improves mood</p>
          </div>
        </AnimatedContainer>
      </div>
      
      {/* Background blobs */}
      <div className="absolute -z-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl top-20 -left-20"></div>
      <div className="absolute -z-10 w-80 h-80 bg-blue-100/50 rounded-full blur-3xl -bottom-20 -right-20"></div>
    </div>
  );
};

export default HeroImage;
