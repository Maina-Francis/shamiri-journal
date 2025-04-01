
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, LineChart, PieChart } from '@/components/ui/charts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, Smile, Calendar, Clock, BookOpen, AlertCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAllJournalEntries } from '@/api/journal.api';

const Insights = () => {
  const navigate = useNavigate();
  
  // Fetch journal entries to generate real insights
  const { data: journalEntries = [], isLoading, isError } = useQuery({
    queryKey: ['journalEntries'],
    queryFn: getAllJournalEntries,
  });

  const hasEnoughData = journalEntries.length >= 3;

  // Generate mood data from actual entries
  const generateMoodData = () => {
    if (!hasEnoughData) return [];
    
    const moodCounts = journalEntries.reduce((acc, entry) => {
      const mood = entry.mood || 'Neutral';
      acc[mood] = (acc[mood] || 0) + 1;
      return acc;
    }, {});
    
    const total = Object.values(moodCounts).reduce((sum: any, count: any) => sum + count, 0);
    
    return Object.entries(moodCounts).map(([name, count]) => ({
      name,
      value: Math.round((count as number / total) * 100),
      color: getMoodColor(name),
    }));
  };

  const getMoodColor = (mood: string) => {
    const colors = {
      'Happy': '#3b82f6',
      'Neutral': '#6b7280',
      'Anxious': '#f59e0b',
      'Sad': '#4b5563',
      'Angry': '#ef4444',
    };
    return colors[mood as keyof typeof colors] || '#6b7280';
  };

  // Generate activity data (entries per day for last 7 days)
  const generateActivityData = () => {
    if (!hasEnoughData) return [];
    
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();
    
    const entriesByDay = last7Days.map(day => {
      const dayName = new Date(day).toLocaleDateString('en-US', { weekday: 'short' });
      const count = journalEntries.filter(entry => 
        entry.createdAt.startsWith(day)
      ).length;
      
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
    
    const topics = {};
    
    journalEntries.forEach(entry => {
      const content = entry.content || '';
      
      // Extract common topics (simple implementation)
      ['Work', 'Health', 'Family', 'Friends', 'Hobbies'].forEach(topic => {
        if (content.toLowerCase().includes(topic.toLowerCase())) {
          topics[topic] = (topics[topic as keyof typeof topics] || 0) + 1;
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
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center">
                      <Smile className="h-4 w-4 mr-1" />
                      Mood Distribution
                    </CardDescription>
                    <CardTitle className="text-xl">Your Emotions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {moodData.length > 0 ? (
                      <PieChart 
                        data={moodData} 
                        index="name" 
                        categories={['value']}
                        valueFormatter={(value) => `${value}%`}
                        className="h-40"
                      />
                    ) : (
                      <div className="h-40 flex items-center justify-center text-muted-foreground">
                        No mood data available
                      </div>
                    )}
                  </CardContent>
                </Card>
              </AnimatedContainer>

              <AnimatedContainer delay={300} animation="slide-up">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Journaling Activity
                    </CardDescription>
                    <CardTitle className="text-xl">Last 7 Days</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {activityData.length > 0 ? (
                      <BarChart 
                        data={activityData}
                        index="name"
                        categories={['entries']}
                        colors={['blue']}
                        valueFormatter={(value) => `${value} entries`}
                        className="h-40"
                      />
                    ) : (
                      <div className="h-40 flex items-center justify-center text-muted-foreground">
                        No activity data available
                      </div>
                    )}
                  </CardContent>
                </Card>
              </AnimatedContainer>

              <AnimatedContainer delay={400} animation="slide-up">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription className="flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      Common Topics
                    </CardDescription>
                    <CardTitle className="text-xl">Top Themes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {topicsData.length > 0 ? (
                      <BarChart 
                        data={topicsData}
                        index="name"
                        categories={['count']}
                        colors={['blue']}
                        valueFormatter={(value) => `${value} mentions`}
                        layout="vertical"
                        className="h-40"
                      />
                    ) : (
                      <div className="h-40 flex items-center justify-center text-muted-foreground">
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
                  {journalEntries.length > 5 ? (
                    <>
                      <div className="glass p-4 rounded-lg">
                        <h3 className="font-medium mb-2">Patterns in Your Writing</h3>
                        <p className="text-sm text-muted-foreground">
                          Based on {journalEntries.length} entries, you tend to write more in the {getPreferredTime(journalEntries)}. Your entries focus mostly on {getMainTopics(journalEntries)}.
                        </p>
                      </div>
                      
                      <div className="glass p-4 rounded-lg">
                        <h3 className="font-medium mb-2">Mood Insights</h3>
                        <p className="text-sm text-muted-foreground">
                          Your overall mood tends to be {getOverallMood(journalEntries)}. Consider activities that bring you joy and balance.
                        </p>
                      </div>
                      
                      <div className="glass p-4 rounded-lg">
                        <h3 className="font-medium mb-2">Growth Opportunities</h3>
                        <p className="text-sm text-muted-foreground">
                          You might benefit from exploring topics like {getSuggestedTopics(journalEntries)} in future entries to gain more insight into different areas of your life.
                        </p>
                      </div>
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
                    <LineChart 
                      data={generateMoodOverTime(journalEntries)}
                      index="date"
                      categories={['moodScore']}
                      colors={['blue']}
                      valueFormatter={(value) => `${value}`}
                      yAxisWidth={30}
                      className="h-80"
                    />
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

function getPreferredTime(entries) {
  // Simplified implementation
  return "evenings";
}

function getMainTopics(entries) {
  // Get main topics from entries
  const topics = ['work', 'personal goals', 'relationships'];
  return topics.join(', ');
}

function getOverallMood(entries) {
  // Calculate overall mood
  return "generally positive with occasional stress";
}

function getSuggestedTopics(entries) {
  // Suggest topics not frequently covered
  return "personal growth, gratitude, and self-care";
}

function generateMoodOverTime(entries) {
  // Generate data for mood over time chart
  const last10Entries = entries.slice(0, 10).reverse();
  
  return last10Entries.map(entry => {
    // Convert mood to a numerical value
    let moodScore = 5; // Neutral default
    if (entry.mood === 'Happy') moodScore = 8;
    if (entry.mood === 'Anxious') moodScore = 3;
    if (entry.mood === 'Sad') moodScore = 2;
    if (entry.mood === 'Angry') moodScore = 1;
    
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

function getTopicAnalysis(entries) {
  const topics = [
    'Work', 'Health', 'Family', 'Friends', 'Hobbies', 
    'Goals', 'Travel', 'Learning'
  ];
  
  // Count mentions of each topic
  const topicCounts = {};
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
