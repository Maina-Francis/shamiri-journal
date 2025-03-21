
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const HeroImage = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="relative mx-auto w-full max-w-[550px] aspect-[4/3] overflow-hidden rounded-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-accent/10 rounded-2xl z-10"></div>
      <img 
        src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
        alt="Person journaling on a laptop" 
        className="h-full w-full object-cover rounded-2xl"
      />
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
    </div>
  );
};

export default HeroImage;
