
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import AnimatedContainer from '@/components/ui/AnimatedContainer';

const CallToAction = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-20 bg-accent/5">
      <div className="container px-4 md:px-6">
        <AnimatedContainer animation="slide-up">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to start your journaling journey?</h2>
              <p className="max-w-[600px] mx-auto text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of others who have discovered the power of AI-enhanced self-reflection.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 min-[400px]:flex-row justify-center pt-4">
              <Button size="lg" onClick={() => navigate('/journal')} className="w-full sm:w-auto">
                Start Writing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/insights')} className="w-full sm:w-auto">
                Explore Features
              </Button>
            </div>
          </div>
        </AnimatedContainer>
      </div>
    </section>
  );
};

export default CallToAction;
