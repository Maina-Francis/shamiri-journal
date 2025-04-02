import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';

const TestimonialSection = () => {
  const testimonials = [
    {
      content: "This app has transformed my journaling practice. The AI insights have helped me recognize patterns in my thinking I never noticed before.",
      author: "Sarah L.",
      role: "Daily Journaler",
      avatar: "https://i.pravatar.cc/150?img=32"
    },
    {
      content: "I've tried many journaling apps, but this one stands out. The UI is beautiful and the AI suggestions are actually helpful without being intrusive.",
      author: "Mark T.",
      role: "Creative Writer",
      avatar: "https://i.pravatar.cc/150?img=68"
    },
    {
      content: "The mood tracking and sentiment analysis features have been invaluable for managing my mental health. I can literally see my progress over time.",
      author: "Jamie C.",
      role: "Mental Health Advocate",
      avatar: "https://i.pravatar.cc/150?img=47"
    }
  ];
  
  return (
    <section className="py-20">
      <div className="container px-4 md:px-6">
        <AnimatedContainer animation="slide-up">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="inline-block rounded-lg bg-accent/10 px-3 py-1 text-sm">Testimonials</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">What our users say</h2>
            <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Join thousands of journalers who have transformed their reflection practice.
            </p>
          </div>
        </AnimatedContainer>
        
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <AnimatedContainer key={index} delay={index * 100} animation="slide-up">
              <Card className="glass-card h-full border-none">
                <CardContent className="p-6">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-10 w-10 border-2 border-white">
                        <img src={testimonial.avatar} alt={testimonial.author} />
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{testimonial.author}</p>
                        <p className="text-xs text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 italic">&ldquo;{testimonial.content}&rdquo;</p>
                  </div>
                </CardContent>
              </Card>
            </AnimatedContainer>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
