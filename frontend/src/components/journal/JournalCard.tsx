
import React from 'react';
import { format, parseISO } from 'date-fns';
import { MoreHorizontal, Calendar, Edit, Trash2 } from 'lucide-react';
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
  className?: string;
}

const JournalCard: React.FC<JournalCardProps> = ({ journal, onEdit, onDelete, className }) => {
  // Truncate content if it's too long
  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return `${content.substring(0, maxLength).trim()}...`;
  };

  return (
    <Card className={cn("hover:shadow-md transition-all", className)}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">{journal.title}</CardTitle>
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
        <div className="text-sm text-muted-foreground mb-2 flex items-center">
          <Calendar className="h-3 w-3 mr-1" />
          {format(parseISO(journal.createdAt), 'PPP')}
          {journal.category && (
            <span className="ml-2 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {journal.category}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground whitespace-pre-line line-clamp-4">
          {truncateContent(journal.content)}
        </p>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex justify-end gap-2 w-full">
          <Button variant="outline" size="sm" onClick={() => onEdit(journal)}>
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default JournalCard;
