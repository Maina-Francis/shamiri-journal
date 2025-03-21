
import React from 'react';
import { PenLine, LayoutDashboard, Sparkles, CalendarDays, Brain, TrendingUp, Lock, Moon, Bookmark } from 'lucide-react';
import AnimatedContainer from '@/components/ui/AnimatedContainer';

const FeatureSection = () => {
  const features = [
    {
      icon: <PenLine className="h-5 w-5 text-accent" />,
      title: "Beautiful Editor",
      description: "Write freely in a clean, distraction-free environment designed for focus and reflection."
    },
    {
      icon: <CalendarDays className="h-5 w-5 text-accent" />,
      title: "Daily Streaks",
      description: "Build a journaling habit with visual progress tracking and gentle reminders."
    },
    {
      icon: <Sparkles className="h-5 w-5 text-accent" />,
      title: "Smart Prompts",
      description: "Never face writer's block with AI-generated prompts tailored to your journaling style."
    },
    {
      icon: <Brain className="h-5 w-5 text-accent" />,
      title: "Mood Analysis",
      description: "Our AI detects emotional patterns and helps you understand your feelings over time."
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-accent" />,
      title: "Personal Insights",
      description: "Discover patterns in your thoughts and behaviors with smart AI analysis."
    },
    {
      icon: <Bookmark className="h-5 w-5 text-accent" />,
      title: "Easy Organization",
      description: "Auto-tagging and smart categorization keeps your entries organized effortlessly."
    },
    {
      icon: <Moon className="h-5 w-5 text-accent" />,
      title: "Dark Mode",
      description: "Journal comfortably day or night with a beautiful dark theme that's easy on the eyes."
    },
    {
      icon: <Lock className="h-5 w-5 text-accent" />,
      title: "Private & Secure",
      description: "Your journal entries are encrypted and only accessible to you."
    }
  ];
  
  return (
    <section className="py-20 bg-gray-50">
      <div className="container px-4 md:px-6">
        <AnimatedContainer animation="slide-up">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              <span>Features</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Everything you need</h2>
            <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-lg/relaxed">
              Our platform combines beautiful design with powerful AI to enhance your journaling experience.
            </p>
          </div>
        </AnimatedContainer>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <AnimatedContainer 
              key={index} 
              delay={index * 100} 
              animation="slide-up" 
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="rounded-full bg-accent/10 w-10 h-10 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm">
                {feature.description}
              </p>
            </AnimatedContainer>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
