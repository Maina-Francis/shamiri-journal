
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PenLine, Sparkles, ArrowRight, Brain, Calendar, BarChart2, CheckCircle } from 'lucide-react';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import HeroImage from '@/components/home/HeroImage';
import FeatureSection from '@/components/home/FeatureSection';
import TestimonialSection from '@/components/home/TestimonialSection';
import CallToAction from '@/components/home/CallToAction';

const Home = () => {
  const navigate = useNavigate();
  
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24 bg-gradient-to-b from-white to-accent/5">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <AnimatedContainer delay={100}>
              <div className="space-y-6">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
                  <Sparkles className="mr-1 h-3.5 w-3.5" />
                  <span>AI-Powered Journaling</span>
                </div>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl">
                  <span className="text-accent">Shamiri Journal</span>
                  <span className="block mt-1">Reflect, Grow, and Thrive</span>
                </h1>
                <p className="max-w-[600px] text-gray-600 md:text-xl/relaxed lg:text-xl/relaxed">
                  Transform your self-reflection with our AI-enhanced journaling companion that helps you document thoughts, gain deep insights, and track your personal growth.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                  <Button 
                    size="lg" 
                    onClick={() => navigate('/journal')}
                    className="group bg-accent hover:bg-accent/90"
                  >
                    <PenLine className="mr-2 h-4 w-4" />
                    Start Writing
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => navigate('/insights')}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Explore Features
                  </Button>
                </div>
                <div className="flex items-center space-x-4 pt-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-accent/10 flex items-center justify-center text-accent text-xs">
                        {i}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">Trusted by thousands of users worldwide</p>
                </div>
              </div>
            </AnimatedContainer>
            <AnimatedContainer delay={300}>
              <HeroImage />
            </AnimatedContainer>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="container px-4 md:px-6 mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                icon: <PenLine className="h-5 w-5 text-accent" />, 
                title: "Intuitive Writing", 
                description: "Distraction-free environment with smart suggestions"
              },
              { 
                icon: <Brain className="h-5 w-5 text-accent" />, 
                title: "AI-Powered Insights", 
                description: "Understand patterns and trends in your thoughts"
              },
              { 
                icon: <Calendar className="h-5 w-5 text-accent" />, 
                title: "Progress Tracking", 
                description: "Visualize your growth journey over time"
              },
            ].map((feature, i) => (
              <AnimatedContainer 
                key={i} 
                delay={400 + (i * 100)} 
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="rounded-full bg-accent/10 w-10 h-10 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm">{feature.description}</p>
              </AnimatedContainer>
            ))}
          </div>
        </div>
        
        {/* Floating element */}
        <div className="hidden lg:block absolute -right-16 top-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="hidden lg:block absolute -left-24 bottom-1/4 w-72 h-72 bg-accent/5 rounded-full blur-3xl"></div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <AnimatedContainer animation="slide-up">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
                <CheckCircle className="mr-1 h-3.5 w-3.5" />
                <span>How It Works</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">The Shamiri Experience</h2>
              <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-lg/relaxed">
                Our AI-powered platform makes journaling more insightful and rewarding than ever before.
              </p>
            </div>
          </AnimatedContainer>
          
          <div className="grid gap-8 lg:grid-cols-3">
            <AnimatedContainer delay={100} animation="slide-up">
              <Card className="border-none shadow-md hover:shadow-lg transition-shadow bg-white h-full">
                <CardContent className="pt-6 p-6 flex flex-col h-full">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                    <PenLine className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Write & Reflect</h3>
                  <div className="border-t border-gray-100 my-4"></div>
                  <p className="text-gray-600 flex-grow">
                    Journal your thoughts in our distraction-free editor with AI-powered suggestions and personalized prompts.
                  </p>
                  <div className="mt-6">
                    <Button variant="ghost" onClick={() => navigate('/journal')} className="group text-accent hover:text-accent p-0">
                      Try it now
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </AnimatedContainer>
            
            <AnimatedContainer delay={200} animation="slide-up">
              <Card className="border-none shadow-md hover:shadow-lg transition-shadow bg-white h-full">
                <CardContent className="pt-6 p-6 flex flex-col h-full">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                    <Brain className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">AI-Powered Insights</h3>
                  <div className="border-t border-gray-100 my-4"></div>
                  <p className="text-gray-600 flex-grow">
                    Our advanced AI analyzes your entries to reveal patterns, track emotional trends, and offer personalized insights.
                  </p>
                  <div className="mt-6">
                    <Button variant="ghost" onClick={() => navigate('/insights')} className="group text-accent hover:text-accent p-0">
                      Explore insights
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </AnimatedContainer>
            
            <AnimatedContainer delay={300} animation="slide-up">
              <Card className="border-none shadow-md hover:shadow-lg transition-shadow bg-white h-full">
                <CardContent className="pt-6 p-6 flex flex-col h-full">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                    <BarChart2 className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Track Your Progress</h3>
                  <div className="border-t border-gray-100 my-4"></div>
                  <p className="text-gray-600 flex-grow">
                    Visualize your personal growth journey with interactive charts and meaningful metrics that showcase progress.
                  </p>
                  <div className="mt-6">
                    <Button variant="ghost" onClick={() => navigate('/insights')} className="group text-accent hover:text-accent p-0">
                      View analytics
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </AnimatedContainer>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <FeatureSection />
      
      {/* Testimonials */}
      <TestimonialSection />
      
      {/* Call to Action */}
      <CallToAction />
    </Layout>
  );
};

export default Home;
