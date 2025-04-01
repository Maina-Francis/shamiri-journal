import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, LineChart, PieChart } from '@/components/ui/charts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, Smile, Calendar, Clock, BookOpen, AlertCircle, ArrowRight, Hash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAllJournalEntries, JournalEntry, getJournalStats } from '@/api/journal.api';

interface MoodData {
  name: string;
  value: number;
  color: string;
}

interface TopicData {
  name: string;
  count: number;
  percentage: number;
}

const Insights = () => {
  const navigate = useNavigate();
  
  // Fetch journal entries to generate real insights
  const { data: journalEntries = [], isLoading: isLoadingEntries } = useQuery({
    queryKey: ['journalEntries'],
    queryFn: getAllJournalEntries,
  });

  // Fetch stats including AI insights
  const { data: statsData, isLoading: isLoadingStats } = useQuery({
    queryKey: ['journalStats'],
    queryFn: getJournalStats,
  });

  const hasEnoughData = journalEntries.length >= 3;
  const isLoading = isLoadingEntries || isLoadingStats;

  const getMoodColor = (mood: string): string => {
    const normalizedMood = mood.toLowerCase();
    const colors: Record<string, string> = {
      'happy': '#4ade80', // vibrant green
      'neutral': '#94a3b8', // cool gray
      'anxious': '#facc15', // vibrant yellow
      'sad': '#60a5fa', // bright blue
      'angry': '#f87171', // bright red
    };
    return colors[normalizedMood] || '#8b5cf6'; // fallback to purple
  };

  // Generate mood data from actual entries
  const generateMoodData = (): MoodData[] => {
    if (!hasEnoughData) return [];
    
    const moodCounts: Record<string, number> = journalEntries.reduce((acc: Record<string, number>, entry) => {
      const mood = entry.mood?.toLowerCase() || 'neutral';
      acc[mood] = (acc[mood] || 0) + 1;
      return acc;
    }, {});
    
    const total = Object.values(moodCounts).reduce((sum, count) => sum + count, 0);
    
    return Object.entries(moodCounts).map(([name, count]) => {
      // First letter uppercase for display
      const displayName = name.charAt(0).toUpperCase() + name.slice(1);
      return {
        name: displayName,
        value: Math.round((count / total) * 100),
        color: getMoodColor(name),
      };
    });
  };

  // Generate activity data (entries per day for last 7 days)
  const generateActivityData = () => {
    if (!hasEnoughData) return [];
    
    // Get the last 7 days in reverse order (oldest to newest)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i)); // Start with 6 days ago
      return date;
    });
    
    const entriesByDay = last7Days.map(dayDate => {
      // Format as short day name (e.g., "Mon")
      const dayName = dayDate.toLocaleDateString('en-US', { weekday: 'short' });
      
      // Count entries that have the same date (ignoring time)
      const count = journalEntries.filter(entry => {
        const entryDate = new Date(entry.createdAt);
        return entryDate.getFullYear() === dayDate.getFullYear() && 
               entryDate.getMonth() === dayDate.getMonth() && 
               entryDate.getDate() === dayDate.getDate();
      }).length;
      
      return {
        name: dayName,
        entries: count
      };
    });
    
    return entriesByDay;
  };

  // Generate topics data
  const generateTopicsData = () => {
    if (!hasEnoughData) return [];
    
    const topics: Record<string, number> = {};
    
    journalEntries.forEach(entry => {
      const content = entry.content || '';
      
      // Extract common topics (simple implementation)
      ['Work', 'Health', 'Family', 'Friends', 'Hobbies'].forEach(topic => {
        if (content.toLowerCase().includes(topic.toLowerCase())) {
          topics[topic] = (topics[topic] || 0) + 1;
        }
      });
    });
    
    return Object.entries(topics)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const moodData = generateMoodData();
  const activityData = generateActivityData();
  const topicsData = generateTopicsData();

  // Empty state view
  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your journal insights...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!hasEnoughData) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <AnimatedContainer>
            <Card className="shadow-lg border-accent/20">
              <CardHeader>
                <div className="flex items-center mb-2">
                  <Sparkles className="h-6 w-6 mr-2 text-accent" />
                  <CardTitle className="text-2xl">AI Insights</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Discover patterns and trends in your journal entries
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center justify-center text-center p-6 rounded-lg bg-accent/5">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Not enough journal entries</h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    Add at least 3 journal entries to start generating AI-powered insights about your moods, patterns, and topics.
                  </p>
                  <Button 
                    onClick={() => navigate('/journal')}
                    className="gap-2"
                  >
                    <BookOpen className="h-4 w-4" />
                    Start Journaling
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </AnimatedContainer>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatedContainer delay={100}>
          <div className="flex items-center mb-6">
            <Sparkles className="h-6 w-6 mr-2 text-accent" />
            <h1 className="text-3xl font-bold">AI Insights</h1>
          </div>
          <p className="text-muted-foreground mb-8">
            Discover patterns and trends from your journal entries, analyzed by AI to help you understand yourself better.
          </p>
        </AnimatedContainer>

        <Tabs defaultValue="overview" className="mb-8">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="moods">Mood Tracking</TabsTrigger>
            <TabsTrigger value="topics">Topics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-8 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <AnimatedContainer delay={200} animation="slide-up">
                <Card className="h-full">
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center">
                      <Smile className="h-4 w-4 mr-1" />
                      Mood Distribution
                    </CardDescription>
                    <CardTitle className="text-xl">Your Emotions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {moodData.length > 0 ? (
                      <div className="pt-2 flex flex-col items-center">
                        <PieChart 
                          data={moodData} 
                          index="name" 
                          categories={['value']}
                          valueFormatter={(value) => `${value}%`}
                          className="h-[250px]"
                        />
                        <p className="text-xs text-center text-muted-foreground mt-2">
                          Percentage distribution of your moods across journal entries
                        </p>
                      </div>
                    ) : (
                      <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                        No mood data available
                      </div>
                    )}
                  </CardContent>
                </Card>
              </AnimatedContainer>

              <AnimatedContainer delay={300} animation="slide-up">
                <Card className="h-full">
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Journaling Activity
                    </CardDescription>
                    <CardTitle className="text-xl">Last 7 Days</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {activityData.length > 0 ? (
                      <div className="h-[250px] overflow-hidden">
                        <BarChart 
                          data={activityData}
                          index="name"
                          categories={['entries']}
                          colors={['blue']}
                          valueFormatter={(value) => `${value} entries`}
                          className="h-[250px] w-full"
                          yAxisWidth={30}
                        />
                      </div>
                    ) : (
                      <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                        No activity data available
                      </div>
                    )}
                  </CardContent>
                </Card>
              </AnimatedContainer>

              <AnimatedContainer delay={400} animation="slide-up">
                <Card className="h-full">
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center">
                      <Hash className="h-4 w-4 mr-1" />
                      Top Topics
                    </CardDescription>
                    <CardTitle className="text-xl">Common Themes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {topicsData.length > 0 ? (
                      <div className="h-[250px] flex flex-col justify-center">
                        <div className="space-y-4">
                          {topicsData.map((topic, index) => (
                            <div key={topic.name}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm">{topic.name}</span>
                                <span className="text-sm text-muted-foreground">
                                  {topic.count} {topic.count === 1 ? 'entry' : 'entries'}
                                </span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div 
                                  className="bg-primary rounded-full h-2" 
                                  style={{ 
                                    width: `${Math.min(100, (topic.count / journalEntries.length) * 100)}%`,
                                    backgroundColor: index === 0 ? '#3b82f6' : 
                                                      index === 1 ? '#4ade80' : 
                                                      index === 2 ? '#facc15' : 
                                                      index === 3 ? '#f87171' : '#60a5fa'
                                  }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                        No topic data available
                      </div>
                    )}
                  </CardContent>
                </Card>
              </AnimatedContainer>
            </div>

            <AnimatedContainer delay={500}>
              <Card>
                <CardHeader>
                  <div className="flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-accent" />
                    <CardTitle>AI Reflections</CardTitle>
                  </div>
                  <CardDescription>
                    Insights generated from analyzing your journal entries
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {journalEntries.length > 5 && statsData?.insights ? (
                    <>
                      <div className="glass p-4 rounded-lg">
                        <h3 className="font-medium mb-2">Summary</h3>
                        <p className="text-sm text-muted-foreground">
                          {statsData.insights.summary}
                        </p>
                      </div>
                      
                      {statsData.insights.topTopics.length > 0 && (
                        <div className="glass p-4 rounded-lg">
                          <h3 className="font-medium mb-2">Your Top Themes</h3>
                          <p className="text-sm text-muted-foreground">
                            You frequently write about: {statsData.insights.topTopics.join(', ')}
                          </p>
                        </div>
                      )}
                      
                      <div className="glass p-4 rounded-lg">
                        <h3 className="font-medium mb-2">Mood Trends</h3>
                        <p className="text-sm text-muted-foreground">
                          {statsData.insights.moodTrend}
                        </p>
                      </div>
                      
                      {statsData.insights.suggestions.length > 0 && (
                        <div className="glass p-4 rounded-lg">
                          <h3 className="font-medium mb-2">Suggestions</h3>
                          <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                            {statsData.insights.suggestions.map((suggestion, index) => (
                              <li key={index}>{suggestion}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="p-6 text-center">
                      <p className="text-muted-foreground">
                        Continue adding journal entries to receive more detailed AI reflections.
                      </p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => navigate('/journal')}
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        Add Journal Entry
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </AnimatedContainer>
          </TabsContent>
          
          <TabsContent value="moods" className="space-y-8 mt-6">
            <AnimatedContainer>
              <Card>
                <CardHeader>
                  <CardTitle>Mood Tracking</CardTitle>
                  <CardDescription>
                    How your mood has fluctuated over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {journalEntries.length > 7 ? (
                    <div className="h-80 overflow-hidden">
                      <LineChart 
                        data={generateMoodOverTime(journalEntries)}
                        index="date"
                        categories={['moodScore']}
                        colors={['blue']}
                        valueFormatter={(value) => `${value}`}
                        yAxisWidth={30}
                        className="h-80 w-full"
                      />
                    </div>
                  ) : (
                    <div className="h-80 flex flex-col items-center justify-center text-center p-6">
                      <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Not enough data for mood tracking</h3>
                      <p className="text-muted-foreground mb-2">
                        Add more journal entries over time to see your mood patterns.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/journal')}
                        className="mt-2"
                      >
                        Start Journaling
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </AnimatedContainer>
          </TabsContent>
          
          <TabsContent value="topics" className="space-y-8 mt-6">
            <AnimatedContainer>
              <Card>
                <CardHeader>
                  <CardTitle>Topic Analysis</CardTitle>
                  <CardDescription>
                    Key themes and topics from your journal entries
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {topicsData.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {getTopicAnalysis(journalEntries).map((topic) => (
                        <div key={topic.name} className="glass p-4 rounded-lg">
                          <h3 className="font-medium mb-1">{topic.name}</h3>
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-accent rounded-full"
                              style={{ width: `${topic.percentage}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {topic.count} mentions ({topic.percentage}%)
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No topic data available</h3>
                      <p className="text-muted-foreground mb-4">
                        Continue journaling to generate topic insights.
                      </p>
                      <Button 
                        onClick={() => navigate('/journal')}
                        variant="outline"
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        Add Journal Entry
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </AnimatedContainer>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

// Helper functions to process journal entries

function generateMoodOverTime(entries: JournalEntry[]) {
  if (entries.length < 7) return [];
  
  // Get up to 10 most recent entries but display them in chronological order
  const recentEntries = entries.slice(0, 10).sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  
  return recentEntries.map(entry => {
    // Convert mood to a numerical value
    const normalizedMood = entry.mood?.toLowerCase() || 'neutral';
    let moodScore = 5; // Neutral default
    if (normalizedMood === 'happy') moodScore = 8;
    if (normalizedMood === 'anxious') moodScore = 3;
    if (normalizedMood === 'sad') moodScore = 2;
    if (normalizedMood === 'angry') moodScore = 1;
    
    // Format date for display (e.g., "Mar 15")
    const date = new Date(entry.createdAt).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
    
    return {
      date,
      moodScore
    };
  });
}

function getTopicAnalysis(entries: JournalEntry[]): TopicData[] {
  const topics = [
    'Work', 'Health', 'Family', 'Friends', 'Hobbies', 
    'Goals', 'Travel', 'Learning'
  ];
  
  // Count mentions of each topic
  const topicCounts: Record<string, number> = {};
  let totalMentions = 0;
  
  topics.forEach(topic => {
    const count = entries.filter(entry => 
      (entry.content || '').toLowerCase().includes(topic.toLowerCase())
    ).length;
    
    if (count > 0) {
      topicCounts[topic] = count;
      totalMentions += count;
    }
  });
  
  // Convert to array with percentages
  return Object.entries(topicCounts).map(([name, count]) => ({
    name,
    count,
    percentage: Math.round((count / totalMentions) * 100)
  })).sort((a, b) => b.count - a.count);
}

export default Insights;
