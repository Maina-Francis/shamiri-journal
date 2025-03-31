
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedContainerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  animation?: 'fade-in' | 'slide-up' | 'slide-in';
}

const AnimatedContainer = ({ 
  children, 
  className, 
  delay = 0, 
  animation = 'fade-in' 
}: AnimatedContainerProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const getAnimationClass = () => {
    switch(animation) {
      case 'slide-up':
        return 'animate-slide-up';
      case 'slide-in':
        return 'animate-slide-in';
      case 'fade-in':
      default:
        return 'animate-fade-in';
    }
  };

  return (
    <div 
      className={cn(
        'opacity-0',
        isVisible && getAnimationClass(),
        className
      )}
      style={{ 
        animationDelay: `${delay}ms`, 
        animationFillMode: 'forwards' 
      }}
    >
      {children}
    </div>
  );
};

export default AnimatedContainer;
