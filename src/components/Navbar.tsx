import React from 'react';
import { HomeIcon } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <a href="/" className="flex items-center">
            <HomeIcon className="h-8 w-8 text-foreground" />
            <h1 className="text-xl font-bold text-foreground ml-1">Home</h1>
          </a>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
