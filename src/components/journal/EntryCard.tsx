import React from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface EntryCardProps {
  id: string;
  date: Date;
  content: string;
  mood?: string;
  onClick?: () => void;
  className?: string;
}

const EntryCard = ({ 
  date, 
  content, 
  mood,
  onClick,
  className
}: EntryCardProps) => {
  // Truncate content to ~100 characters
  const truncatedContent = content.length > 100
    ? `${content.substring(0, 100).trim()}...`
    : content;
    
  // Get emoji based on mood
  const getMoodEmoji = () => {
    switch(mood?.toLowerCase()) {
      case 'happy': return '😊';
      case 'sad': return '😔';
      case 'angry': return '😠';
      case 'anxious': return '😰';
      case 'neutral': return '😐';
      default: return '';
    }
  };

  return (
    <div 
      onClick={onClick}
      className={cn(
        "glass-card p-4 cursor-pointer transition-all hover:shadow-raised hover:translate-y-[-2px]",
        className
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-xs text-muted-foreground">
            {format(date, 'EEEE')}
          </p>
          <h3 className="font-medium">{format(date, 'MMMM d, yyyy')}</h3>
        </div>
        {mood && (
          <span className="text-lg" aria-label={`Mood: ${mood}`}>
            {getMoodEmoji()}
          </span>
        )}
      </div>
      
      <p className="text-sm text-muted-foreground line-clamp-3 mt-2">
        {truncatedContent}
      </p>
    </div>
  );
};

export default EntryCard;
