import React from 'react';
import { Github } from 'lucide-react';

export const InitialStateAnimation = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <div className="relative">
        <Github className="h-24 w-24 text-primary animate-float" />
      </div>
      <p className="text-lg text-muted-foreground mt-2">
        Start with username to explore.
      </p>
    </div>
  );
};
