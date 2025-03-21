
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import AnimatedContainer from '@/components/ui/AnimatedContainer';

const CallToAction = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-20 bg-gradient-to-b from-white to-accent/5">
      <div className="container px-4 md:px-6">
        <AnimatedContainer animation="slide-up">
          <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Start your journaling journey today</h2>
              <p className="text-gray-600 md:text-xl/relaxed lg:text-xl/relaxed">
                Join thousands who have transformed their self-reflection practice with Shamiri Journal.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 min-[400px]:flex-row justify-center pt-6 w-full max-w-md mx-auto">
              <Button size="lg" onClick={() => navigate('/journal')} className="w-full group bg-accent hover:bg-accent/90">
                Get Started for Free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/insights')} className="w-full">
                <Sparkles className="mr-2 h-4 w-4" />
                See Features
              </Button>
            </div>
          </div>
        </AnimatedContainer>
      </div>
    </section>
  );
};

export default CallToAction;
