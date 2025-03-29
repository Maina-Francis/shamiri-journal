
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const HeroImage = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="relative mx-auto w-full max-w-[550px] aspect-[4/3] overflow-hidden rounded-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-accent/10 rounded-2xl z-10"></div>
      <img 
        src="https://images.unsplash.com/photo-1517842645767-c639042777db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
        alt="Journal and coffee on a table" 
        className="h-full w-full object-cover rounded-2xl"
      />
      {/* Floating UI elements to show AI features */}
      <div className="absolute bottom-0 right-0 m-4 lg:m-6 z-20">
        <div className="glass p-3 rounded-xl max-w-[250px]">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <div>
              <h4 className="text-sm font-medium">AI Assistant</h4>
              <p className="text-xs text-gray-500">Analyzing your entry...</p>
            </div>
          </div>
        </div>
      </div>
      <div className={`absolute top-0 left-0 ${isMobile ? 'm-4' : 'm-6'} z-20`}>
        <div className="glass p-3 rounded-xl max-w-[250px]">
          <div className="text-sm">
            <span className="text-accent font-medium">Mood detected: </span>
            <span>Optimistic 😊</span>
          </div>
        </div>
      </div>
      
      {/* AI-themed floating element */}
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20">
        <div className="glass p-3 rounded-xl max-w-[200px]">
          <div className="text-xs">
            <span className="font-medium block mb-1">AI Insights:</span>
            <span className="text-gray-600 block">Your writing shows growth in positive thinking compared to last week.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroImage;
