
import React from 'react';
import Header from './Header';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout = ({ children, className }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className={cn("flex-grow pt-20 pb-8", className)}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
