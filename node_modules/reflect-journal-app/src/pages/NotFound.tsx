
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedContainer from "@/components/ui/AnimatedContainer";
import Layout from "@/components/layout/Layout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout className="flex items-center justify-center">
      <div className="max-w-md text-center px-4">
        <AnimatedContainer delay={100}>
          <div className="mb-8">
            <div className="text-9xl font-bold text-accent/20">404</div>
            <h1 className="text-3xl font-bold mt-4">Page not found</h1>
            <p className="text-muted-foreground mt-2">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
        </AnimatedContainer>
        
        <AnimatedContainer delay={300}>
          <div className="space-y-4">
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
                Back to Homepage
              </Link>
            </Button>
            
            <p className="text-sm text-muted-foreground pt-4">
              Looking for your journal? <Link to="/journal" className="text-accent hover:underline">Go to Journal</Link>
            </p>
          </div>
        </AnimatedContainer>
      </div>
    </Layout>
  );
};

export default NotFound;
