import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PenLine, LayoutDashboard, Sparkles } from 'lucide-react';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import Layout from '@/components/layout/Layout';

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <Layout className="flex items-center justify-center">
      <div className="max-w-5xl w-full px-4 py-12 mx-auto">
        <div className="text-center mb-16">
          <AnimatedContainer delay={100}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-accent to-blue-700 bg-clip-text text-transparent">Reflect</span>
              <span className="block text-foreground mt-2">Your personal journaling companion</span>
            </h1>
          </AnimatedContainer>
          
          <AnimatedContainer delay={300} animation="slide-up">
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Document your thoughts, gain insights, and track your personal growth with AI-powered analysis and a beautiful minimalist interface.
            </p>
          </AnimatedContainer>
          
          <AnimatedContainer delay={500}>
            <div className="flex flex-wrap gap-4 justify-center">
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
          </AnimatedContainer>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <AnimatedContainer delay={700} animation="slide-up" className="glass-card p-6">
            <div className="rounded-full bg-accent/10 w-12 h-12 flex items-center justify-center mb-4">
              <PenLine className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-xl font-medium mb-2">Express Yourself</h3>
            <p className="text-muted-foreground">
              Write freely in a beautiful, distraction-free environment designed for focus and reflection.
            </p>
          </AnimatedContainer>
          
          <AnimatedContainer delay={800} animation="slide-up" className="glass-card p-6">
            <div className="rounded-full bg-accent/10 w-12 h-12 flex items-center justify-center mb-4">
              <LayoutDashboard className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-xl font-medium mb-2">Track Progress</h3>
            <p className="text-muted-foreground">
              Revisit past entries with an intuitive calendar view and watch your journal grow over time.
            </p>
          </AnimatedContainer>
          
          <AnimatedContainer delay={900} animation="slide-up" className="glass-card p-6">
            <div className="rounded-full bg-accent/10 w-12 h-12 flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-xl font-medium mb-2">Gain Insights</h3>
            <p className="text-muted-foreground">
              Let AI analyze your entries to reveal patterns, track mood changes, and offer personalized reflections.
            </p>
          </AnimatedContainer>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
