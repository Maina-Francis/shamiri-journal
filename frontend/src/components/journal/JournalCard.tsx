
import React from 'react';
import { format, parseISO } from 'date-fns';
import { MoreHorizontal, Calendar, Edit, Trash2, Star } from 'lucide-react';
import { JournalEntry } from '@/api/journal.api';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface JournalCardProps {
  journal: JournalEntry;
  onEdit: (journal: JournalEntry) => void;
  onDelete: (journal: JournalEntry) => void;
  onFavorite: (journal: JournalEntry, isFavorite: boolean) => void;
  className?: string;
}

const JournalCard: React.FC<JournalCardProps> = ({ 
  journal, 
  onEdit, 
  onDelete, 
  onFavorite,
  className 
}) => {
  // Truncate content if it's too long
  const truncateContent = (content: string, maxLength: number = 150) => {
    // Remove HTML tags
    const plainText = content.replace(/<[^>]*>/g, '');
    if (plainText.length <= maxLength) return plainText;
    return `${plainText.substring(0, maxLength).trim()}...`;
  };

  // Get emoji based on mood
  const getMoodEmoji = (mood?: string) => {
    if (!mood) return null;
    
    switch(mood.toLowerCase()) {
      case 'happy': return '😊';
      case 'sad': return '😔';
      case 'angry': return '😠';
      case 'anxious': return '😰';
      case 'neutral': return '😐';
      default: return null;
    }
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onFavorite(journal, !journal.isFavorite);
  };

  const moodEmoji = getMoodEmoji(journal.mood);

  return (
    <Card className={cn(
      "hover:shadow-md transition-all",
      journal.isFavorite && "border-l-4 border-l-yellow-400",
      className
    )}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg font-medium">{journal.title}</CardTitle>
          {moodEmoji && (
            <span className="text-lg" title={`Mood: ${journal.mood}`}>
              {moodEmoji}
            </span>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(journal)}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleFavoriteToggle}>
              <Star className="mr-2 h-4 w-4" fill={journal.isFavorite ? "currentColor" : "none"} />
              <span>{journal.isFavorite ? "Remove Favorite" : "Add to Favorites"}</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => onDelete(journal)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground mb-2 flex items-center flex-wrap gap-2">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {format(parseISO(journal.createdAt), 'PPP')}
          </div>
          {journal.category && (
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {journal.category}
            </span>
          )}
          {journal.tags && journal.tags.length > 0 && journal.tags.map(tag => (
            <span key={tag} className="inline-flex items-center rounded-full bg-secondary/80 px-2 py-0.5 text-xs font-medium text-secondary-foreground">
              {tag}
            </span>
          ))}
        </div>
        <p className="text-sm text-muted-foreground whitespace-pre-line line-clamp-4">
          {truncateContent(journal.content)}
        </p>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex justify-between items-center w-full">
          {journal.isFavorite && (
            <span className="text-xs flex items-center text-yellow-600">
              <Star className="h-3 w-3 mr-1 fill-current" />
              Favorite
            </span>
          )}
          <div className="flex justify-end gap-2 ml-auto">
            <Button variant="outline" size="sm" onClick={() => onEdit(journal)}>
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default JournalCard;
