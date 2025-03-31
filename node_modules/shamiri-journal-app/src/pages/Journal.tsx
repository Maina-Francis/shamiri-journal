
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import Editor from '@/components/journal/Editor';
import Calendar from '@/components/journal/Calendar';
import EntryCard from '@/components/journal/EntryCard';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AnimatedContainer from '@/components/ui/AnimatedContainer';

// Mock data for demo purposes
const mockEntries = [
  {
    id: '1',
    date: new Date('2023-08-15'),
    content: 'Today was a productive day. I managed to finish most of my tasks and even had time for a short walk in the evening.',
    mood: 'happy',
  },
  {
    id: '2',
    date: new Date('2023-08-10'),
    content: 'Feeling a bit stressed about the upcoming project deadline. Need to focus more tomorrow.',
    mood: 'anxious',
  },
  {
    id: '3',
    date: new Date(new Date().setDate(new Date().getDate() - 2)),
    content: 'Had a great conversation with an old friend today. It reminded me of how important it is to maintain connections.',
    mood: 'happy',
  },
  {
    id: '4',
    date: new Date(),
    content: 'Just starting my journal today. I hope to make this a daily habit.',
    mood: 'neutral',
  },
];

const Journal = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [entries, setEntries] = useState(mockEntries);

  // Find entry for selected date
  const selectedEntry = entries.find(entry => 
    format(new Date(entry.date), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );

  const handleSaveEntry = (content: string) => {
    const existingEntryIndex = entries.findIndex(entry => 
      format(new Date(entry.date), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
    );

    if (existingEntryIndex >= 0) {
      // Update existing entry
      const updatedEntries = [...entries];
      updatedEntries[existingEntryIndex] = {
        ...updatedEntries[existingEntryIndex],
        content,
        // In a real app, we would send the content to an AI to analyze mood
        // For now, just randomly select a mood
        mood: ['happy', 'sad', 'anxious', 'neutral'][Math.floor(Math.random() * 4)]
      };
      setEntries(updatedEntries);
    } else {
      // Create new entry
      const newEntry = {
        id: Date.now().toString(),
        date: selectedDate,
        content,
        mood: ['happy', 'sad', 'anxious', 'neutral'][Math.floor(Math.random() * 4)]
      };
      setEntries([...entries, newEntry]);
    }
  };

  const handleSelectEntry = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatedContainer delay={100}>
          <h1 className="text-3xl font-bold mb-6">Your Journal</h1>
        </AnimatedContainer>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Editor 
              date={selectedDate}
              initialContent={selectedEntry?.content || ''}
              onSave={handleSaveEntry}
            />
          </div>
          
          <div className="space-y-6">
            <AnimatedContainer delay={200}>
              <Calendar 
                entries={entries}
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
                  {entries
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 3)
                    .map(entry => (
                      <EntryCard 
                        key={entry.id}
                        id={entry.id}
                        date={new Date(entry.date)}
                        content={entry.content}
                        mood={entry.mood}
                        onClick={() => handleSelectEntry(new Date(entry.date))}
                      />
                    ))
                  }
                </TabsContent>
                
                <TabsContent value="favorites" className="text-center py-8">
                  <p className="text-muted-foreground">
                    You haven't favorited any entries yet.
                  </p>
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
