
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import Editor from '@/components/journal/Editor';
import Calendar from '@/components/journal/Calendar';
import EntryCard from '@/components/journal/EntryCard';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getJournals, 
  createJournal, 
  updateJournal, 
  toggleJournalFavorite, 
  deleteJournal 
} from '@/api/journal.api';
import { Loader2 } from 'lucide-react';

const Journal = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [streak, setStreak] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch journals
  const { data: journalsData, isLoading: isLoadingJournals } = useQuery({
    queryKey: ['journals'],
    queryFn: () => getJournals({ limit: 30 }), // Get last 30 entries
  });

  const entries = journalsData?.data || [];

  // Calculate streak when entries change
  useEffect(() => {
    if (entries.length > 0) {
      calculateStreak(entries);
    }
  }, [entries]);

  // Calculate user's journal streak
  const calculateStreak = (journalEntries) => {
    if (!journalEntries.length) {
      setStreak(0);
      return;
    }

    // Sort entries by date (newest first)
    const sortedEntries = [...journalEntries].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Check if user has an entry for today
    const today = new Date();
    const todayFormatted = format(today, 'yyyy-MM-dd');
    const hasTodayEntry = sortedEntries.some(entry => 
      format(new Date(entry.createdAt), 'yyyy-MM-dd') === todayFormatted
    );

    if (!hasTodayEntry) {
      setStreak(0);
      return;
    }

    // Calculate streak by checking consecutive days
    let currentStreak = 1;
    let currentDate = today;

    for (let i = 0; i < 60; i++) { // Check up to 60 days back
      // Move to previous day
      currentDate = new Date(currentDate);
      currentDate.setDate(currentDate.getDate() - 1);
      
      const dateToCheck = format(currentDate, 'yyyy-MM-dd');
      
      // Check if there's an entry for this date
      const hasEntryForDate = sortedEntries.some(entry =>
        format(new Date(entry.createdAt), 'yyyy-MM-dd') === dateToCheck
      );

      if (hasEntryForDate) {
        currentStreak++;
      } else {
        break; // Break the streak if a day is missed
      }
    }

    setStreak(currentStreak);
  };

  // Find entry for selected date
  const selectedEntry = entries.find(entry => 
    format(new Date(entry.createdAt), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );

  // Create or update journal entry
  const journalMutation = useMutation({
    mutationFn: (content: string) => {
      if (selectedEntry) {
        // Update existing entry
        return updateJournal(selectedEntry.id, { content });
      } else {
        // Create new entry
        return createJournal({
          title: `Journal Entry for ${format(selectedDate, 'MMMM d, yyyy')}`,
          content,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journals'] });
      toast({
        title: selectedEntry ? "Entry updated" : "Entry created",
        description: "Your journal entry has been saved",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save journal entry",
        variant: "destructive",
      });
    }
  });

  // Toggle favorite status
  const favoriteMutation = useMutation({
    mutationFn: ({ id, isFavorite }: { id: string; isFavorite: boolean }) => 
      toggleJournalFavorite(id, isFavorite),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journals'] });
    }
  });

  // Delete journal entry
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteJournal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journals'] });
      toast({
        title: "Entry deleted",
        description: "Your journal entry has been removed",
      });
    }
  });

  const handleSaveEntry = (content: string) => {
    journalMutation.mutate(content);
  };

  const handleSelectEntry = (date: Date) => {
    setSelectedDate(date);
  };

  const handleFavoriteEntry = (id: string) => {
    const entry = entries.find(e => e.id === id);
    if (entry) {
      favoriteMutation.mutate({ id, isFavorite: !entry.isFavorite });
    }
  };

  const handleDeleteEntry = (id: string) => {
    deleteMutation.mutate(id);
  };

  if (isLoadingJournals) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
          <span className="ml-2 text-lg">Loading your journal entries...</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatedContainer delay={100}>
          <h1 className="text-3xl font-bold mb-2">Your Journal</h1>
          <p className="text-muted-foreground mb-6">Write your thoughts and reflect on your journey</p>
        </AnimatedContainer>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Editor 
              date={selectedDate}
              initialContent={selectedEntry?.content || ''}
              onSave={handleSaveEntry}
            />
            
            {streak > 0 && (
              <AnimatedContainer delay={150} className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium">
                  🔥 You've written {streak} days in a row!
                </div>
              </AnimatedContainer>
            )}
          </div>
          
          <div className="space-y-6">
            <AnimatedContainer delay={200}>
              <Calendar 
                entries={entries.map(entry => ({
                  ...entry,
                  date: new Date(entry.createdAt)
                }))}
                onSelectDate={handleSelectEntry}
                selectedDate={selectedDate}
              />
            </AnimatedContainer>
            
            <AnimatedContainer delay={300}>
              <Tabs defaultValue="recent" className="glass-card p-6">
                <TabsList className="mb-4">
                  <TabsTrigger value="recent">Recent Entries</TabsTrigger>
                  <TabsTrigger value="favorites">Favorites</TabsTrigger>
                </TabsList>
                
                <TabsContent value="recent" className="space-y-4">
                  {entries.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground">
                      You haven't written any entries yet. Start journaling today!
                    </p>
                  ) : (
                    entries
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .slice(0, 3)
                      .map(entry => (
                        <EntryCard 
                          key={entry.id}
                          id={entry.id}
                          date={new Date(entry.createdAt)}
                          content={entry.content}
                          mood={entry.mood || 'neutral'}
                          onClick={() => handleSelectEntry(new Date(entry.createdAt))}
                          onFavorite={() => handleFavoriteEntry(entry.id)}
                          onDelete={() => handleDeleteEntry(entry.id)}
                        />
                      ))
                  )}
                </TabsContent>
                
                <TabsContent value="favorites" className="space-y-4">
                  {entries.filter(entry => entry.isFavorite).length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground">
                      You haven't favorited any entries yet.
                    </p>
                  ) : (
                    entries
                      .filter(entry => entry.isFavorite)
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map(entry => (
                        <EntryCard 
                          key={entry.id}
                          id={entry.id}
                          date={new Date(entry.createdAt)}
                          content={entry.content}
                          mood={entry.mood || 'neutral'}
                          onClick={() => handleSelectEntry(new Date(entry.createdAt))}
                          onFavorite={() => handleFavoriteEntry(entry.id)}
                          onDelete={() => handleDeleteEntry(entry.id)}
                        />
                      ))
                  )}
                </TabsContent>
              </Tabs>
            </AnimatedContainer>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Journal;
