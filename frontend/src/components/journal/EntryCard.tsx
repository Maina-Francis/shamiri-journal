
import React from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Trash, Star } from 'lucide-react';

interface EntryCardProps {
  id: string;
  date: Date;
  content: string;
  mood?: string;
  isFavorite?: boolean;
  onClick?: () => void;
  onFavorite?: (isFavorite: boolean) => void;
  onDelete?: () => void;
  className?: string;
}

const EntryCard = ({ 
  date, 
  content, 
  mood,
  isFavorite = false,
  onClick,
  onFavorite,
  onDelete,
  className
}: EntryCardProps) => {
  // Truncate content to ~100 characters and remove HTML tags
  const plainTextContent = content.replace(/<[^>]*>/g, '');
  const truncatedContent = plainTextContent.length > 100
    ? `${plainTextContent.substring(0, 100).trim()}...`
    : plainTextContent;
    
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

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFavorite) onFavorite(!isFavorite);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) onDelete();
  };

  return (
    <div 
      onClick={onClick}
      className={cn(
        "glass-card p-4 cursor-pointer transition-all hover:shadow-raised hover:translate-y-[-2px] shadow-sm",
        isFavorite && "border-l-4 border-l-yellow-400",
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
        <div className="flex items-center gap-2">
          {mood && (
            <span className="text-lg" aria-label={`Mood: ${mood}`}>
              {getMoodEmoji()}
            </span>
          )}
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground line-clamp-3 mt-2 mb-3">
        {truncatedContent}
      </p>

      <div className="flex justify-end items-center mt-2 space-x-2">
        <button 
          onClick={handleFavorite}
          className={cn(
            "p-1.5 rounded-full transition-colors",
            isFavorite ? "text-yellow-500 hover:text-yellow-600" : "text-gray-400 hover:text-yellow-500"
          )}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Star className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} />
        </button>
        
        <button 
          onClick={handleDelete}
          className="p-1.5 text-gray-400 hover:text-destructive rounded-full transition-colors"
          aria-label="Delete this entry"
        >
          <Trash className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default EntryCard;
