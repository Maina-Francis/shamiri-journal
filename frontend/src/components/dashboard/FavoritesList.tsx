
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getJournals, JournalEntry } from '@/api/journal.api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { StarIcon, ArrowRightIcon } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const FavoritesList: React.FC = () => {
  const navigate = useNavigate();
  
  const { data, isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => getJournals({ favorite: true, limit: 5 }),
  });

  const handleViewEntry = (journal: JournalEntry) => {
    navigate(`/journal/${journal.id}`);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center">
          <StarIcon className="h-4 w-4 mr-2 text-yellow-500" />
          Favorite Entries
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          Array(3).fill(null).map((_, i) => (
            <div key={i} className="mb-3">
              <Skeleton className="h-6 w-3/4 mb-1" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))
        ) : data && data.data.length > 0 ? (
          <div className="space-y-3">
            {data.data.map(journal => (
              <div 
                key={journal.id} 
                className="p-3 hover:bg-muted/50 rounded-md cursor-pointer"
                onClick={() => handleViewEntry(journal)}
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-sm line-clamp-1">{journal.title}</h4>
                  <span className="text-xs text-muted-foreground">
                    {format(parseISO(journal.createdAt), 'MMM d')}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                  {journal.content.replace(/<[^>]*>/g, '')}
                </p>
              </div>
            ))}
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full mt-2 flex items-center justify-center"
              onClick={() => navigate('/journal?favorite=true')}
            >
              View all favorites
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground">No favorite entries yet</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => navigate('/journal/new')}
            >
              Create a journal entry
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FavoritesList;
