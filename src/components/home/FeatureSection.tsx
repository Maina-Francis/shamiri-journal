
import React from 'react';
import { PenLine, LayoutDashboard, Sparkles, CalendarDays, Brain, TrendingUp } from 'lucide-react';
import AnimatedContainer from '@/components/ui/AnimatedContainer';

const FeatureSection = () => {
  const features = [
    {
      icon: <PenLine className="h-6 w-6 text-accent" />,
      title: "Express Yourself",
      description: "Write freely in a beautiful, distraction-free environment designed for focus and reflection."
    },
    {
      icon: <CalendarDays className="h-6 w-6 text-accent" />,
      title: "Track Progress",
      description: "Revisit past entries with an intuitive calendar view and watch your journal grow over time."
    },
    {
      icon: <Sparkles className="h-6 w-6 text-accent" />,
      title: "AI-Powered Insights",
      description: "Let AI analyze your entries to reveal patterns, track mood changes, and offer personalized reflections."
    },
    {
      icon: <Brain className="h-6 w-6 text-accent" />,
      title: "Smart Suggestions",
      description: "Receive writing prompts and suggestions tailored to your journaling style and previous entries."
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-accent" />,
      title: "Visualize Growth",
      description: "See your personal growth through interactive charts and meaningful data visualizations."
    },
    {
      icon: <LayoutDashboard className="h-6 w-6 text-accent" />,
      title: "Organized Categories",
      description: "Keep your thoughts organized with customizable categories and AI-suggested tags."
    }
  ];
  
  return (
    <section className="py-20">
      <div className="container px-4 md:px-6">
        <AnimatedContainer animation="slide-up">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="inline-block rounded-lg bg-accent/10 px-3 py-1 text-sm">Features</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Everything you need</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our platform combines beautiful design with powerful AI to enhance your journaling experience.
            </p>
          </div>
        </AnimatedContainer>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <AnimatedContainer key={index} delay={index * 100} animation="slide-up" className="glass-card p-6">
              <div className="rounded-full bg-accent/10 w-12 h-12 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">
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
