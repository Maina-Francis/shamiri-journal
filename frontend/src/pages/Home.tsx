import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PenLine, Sparkles } from 'lucide-react';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import Layout from '@/components/layout/Layout';
import HeroImage from '@/components/home/HeroImage';
import FeatureSection from '@/components/home/FeatureSection';
import TestimonialSection from '@/components/home/TestimonialSection';
import CallToAction from '@/components/home/CallToAction';
import { useAuth } from '@/contexts/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  return (
    <Layout className="flex flex-col items-center">
      <div className="w-full max-w-7xl px-4 py-8 md:py-12 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center mb-16 md:mb-20">
          <AnimatedContainer delay={100} className="text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 md:mb-6">
              <span className="bg-gradient-to-r from-accent to-blue-700 bg-clip-text text-transparent">Shamiri</span>
              <span className="block text-foreground mt-2">Your personal journaling companion</span>
            </h1>
            
            <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 max-w-xl">
              Document your thoughts, gain insights, and track your personal growth with AI-powered analysis and a beautiful minimalist interface.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                onClick={() => navigate(isAuthenticated ? '/journal' : '/auth')}
                className="group"
              >
                <PenLine className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                Start Writing
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate(isAuthenticated ? '/insights' : '/auth')}
                className="group"
              >
                <Sparkles className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                View Insights
              </Button>
            </div>
          </AnimatedContainer>
          
          <AnimatedContainer delay={300} animation="slide-up" className="order-first lg:order-last">
            <HeroImage />
          </AnimatedContainer>
        </div>
        
        <FeatureSection />
        <TestimonialSection />
        <CallToAction />
      </div>
    </Layout>
  );
};

export default Home;
