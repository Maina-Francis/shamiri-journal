
import React from 'react';
import Layout from '@/components/layout/Layout';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, LineChart, PieChart } from '@/components/ui/charts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, TrendingUp, Smile, Calendar, Clock } from 'lucide-react';

const Insights = () => {
  // Mock data for the charts
  const moodData = [
    { name: 'Happy', value: 45, color: '#3b82f6' },
    { name: 'Neutral', value: 25, color: '#6b7280' },
    { name: 'Anxious', value: 15, color: '#f59e0b' },
    { name: 'Sad', value: 10, color: '#4b5563' },
    { name: 'Angry', value: 5, color: '#ef4444' },
  ];

  const activityData = [
    { name: 'Mon', entries: 1 },
    { name: 'Tue', entries: 2 },
    { name: 'Wed', entries: 0 },
    { name: 'Thu', entries: 1 },
    { name: 'Fri', entries: 3 },
    { name: 'Sat', entries: 2 },
    { name: 'Sun', entries: 1 },
  ];

  const topicsData = [
    { name: 'Work', count: 16 },
    { name: 'Health', count: 12 },
    { name: 'Family', count: 10 },
    { name: 'Friends', count: 8 },
    { name: 'Hobbies', count: 6 },
  ];

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
                    <CardTitle className="text-xl">Mostly Positive</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PieChart 
                      data={moodData} 
                      index="name" 
                      categories={['value']}
                      valueFormatter={(value) => `${value}%`}
                      className="h-40"
                    />
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
                    <BarChart 
                      data={activityData}
                      index="name"
                      categories={['entries']}
                      colors={['blue']}
                      valueFormatter={(value) => `${value} entries`}
                      className="h-40"
                    />
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
                    <CardTitle className="text-xl">Top 5 Themes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <BarChart 
                      data={topicsData}
                      index="name"
                      categories={['count']}
                      colors={['blue']}
                      valueFormatter={(value) => `${value} mentions`}
                      layout="vertical"
                      className="h-40"
                    />
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
                  <div className="glass p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Patterns in Your Writing</h3>
                    <p className="text-sm text-muted-foreground">
                      You tend to write more detailed entries in the evening, with a focus on work-related topics. Your morning entries are shorter but more optimistic.
                    </p>
                  </div>
                  
                  <div className="glass p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Mood Insights</h3>
                    <p className="text-sm text-muted-foreground">
                      Your mood is generally more positive on days when you mention exercise or outdoor activities. Consider incorporating more physical activity into your routine.
                    </p>
                  </div>
                  
                  <div className="glass p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Growth Opportunities</h3>
                    <p className="text-sm text-muted-foreground">
                      You've expressed interest in learning new skills but haven't mentioned specific actions. Consider setting concrete goals for personal development.
                    </p>
                  </div>
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
                  <LineChart 
                    data={[
                      { date: '2023-08-01', happiness: 7, anxiety: 3 },
                      { date: '2023-08-02', happiness: 6, anxiety: 4 },
                      { date: '2023-08-03', happiness: 8, anxiety: 2 },
                      { date: '2023-08-04', happiness: 7, anxiety: 3 },
                      { date: '2023-08-05', happiness: 5, anxiety: 6 },
                      { date: '2023-08-06', happiness: 6, anxiety: 4 },
                      { date: '2023-08-07', happiness: 8, anxiety: 2 },
                      { date: '2023-08-08', happiness: 9, anxiety: 1 },
                      { date: '2023-08-09', happiness: 7, anxiety: 3 },
                      { date: '2023-08-10', happiness: 6, anxiety: 5 },
                    ]}
                    index="date"
                    categories={['happiness', 'anxiety']}
                    colors={['blue', 'orange']}
                    valueFormatter={(value) => `${value}`}
                    yAxisWidth={30}
                    className="h-80"
                  />
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {['Work', 'Health', 'Family', 'Friends', 'Hobbies', 'Goals', 'Travel', 'Learning'].map((topic) => (
                      <div key={topic} className="glass p-4 rounded-lg">
                        <h3 className="font-medium mb-1">{topic}</h3>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-accent rounded-full"
                            style={{ width: `${Math.floor(Math.random() * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </AnimatedContainer>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Insights;
