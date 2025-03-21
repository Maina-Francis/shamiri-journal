
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PenLine, LayoutDashboard, Sparkles, ArrowRight, Book, Calendar, BarChart2 } from 'lucide-react';
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
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <AnimatedContainer delay={100}>
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                  <span className="bg-gradient-to-r from-accent to-blue-700 bg-clip-text text-transparent">Reflect</span>
                  <span className="block mt-1">Your AI-powered journaling companion</span>
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Document your thoughts, gain insights, and track your personal growth with AI-powered analysis and a beautiful minimalist interface.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button 
                    size="lg" 
                    onClick={() => navigate('/journal')}
                    className="group"
                  >
                    <PenLine className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                    Start Writing
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => navigate('/insights')}
                    className="group"
                  >
                    <Sparkles className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                    View Insights
                  </Button>
                </div>
              </div>
            </AnimatedContainer>
            <AnimatedContainer delay={300}>
              <HeroImage />
            </AnimatedContainer>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <FeatureSection />
      
      {/* How It Works Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container px-4 md:px-6">
          <AnimatedContainer animation="slide-up">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">How It Works</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Simple, powerful journaling</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our AI-powered journaling platform helps you reflect, analyze, and grow with intuitive tools and meaningful insights.
              </p>
            </div>
          </AnimatedContainer>
          
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
            <AnimatedContainer delay={100} animation="slide-up">
              <Card className="glass-card border-none">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                    <PenLine className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold">Write & Reflect</h3>
                  <p className="text-gray-500 mt-2">
                    Journal your thoughts in our distraction-free editor with AI-powered suggestions and prompts.
                  </p>
                </CardContent>
              </Card>
            </AnimatedContainer>
            
            <AnimatedContainer delay={200} animation="slide-up">
              <Card className="glass-card border-none">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                    <Book className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold">Organize</h3>
                  <p className="text-gray-500 mt-2">
                    Categorize entries and use AI to automatically tag and organize your journal content.
                  </p>
                </CardContent>
              </Card>
            </AnimatedContainer>
            
            <AnimatedContainer delay={300} animation="slide-up">
              <Card className="glass-card border-none">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                    <BarChart2 className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold">Gain Insights</h3>
                  <p className="text-gray-500 mt-2">
                    Discover patterns and growth opportunities with AI-powered analytics and personalized insights.
                  </p>
                </CardContent>
              </Card>
            </AnimatedContainer>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <TestimonialSection />
      
      {/* Call to Action */}
      <CallToAction />
    </Layout>
  );
};

export default Home;
