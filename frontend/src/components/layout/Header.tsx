
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { PenLine, BarChart2, Settings, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/journal', label: 'Journal', icon: <PenLine className="h-4 w-4" /> },
    { path: '/insights', label: 'Insights', icon: <BarChart2 className="h-4 w-4" /> },
    { path: '/settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-2"
            >
              <span className="text-lg font-semibold bg-gradient-to-r from-accent to-blue-700 bg-clip-text text-transparent">Shamiri Journal</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <ul className="flex items-center space-x-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "px-4 py-2 rounded-md text-sm flex items-center space-x-1 transition-all focus-ring",
                      location.pathname === item.path
                        ? "bg-accent/10 text-accent"
                        : "text-foreground/70 hover:text-foreground hover:bg-accent/5"
                    )}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex items-center">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <LogIn className="h-4 w-4" />
              <span>Sign In</span>
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
