import React from 'react';
import { Briefcase, Target } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export default function Logo({ size = 'md', showText = true }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <div className="flex items-center justify-center space-x-3">
      <div className="relative">
        {/* Main briefcase icon */}
        <Briefcase className={`${sizeClasses[size]} text-blue-600`} />
        {/* Target overlay for "tracking" concept */}
        <Target className="w-4 h-4 text-green-500 absolute -top-1 -right-1" />
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <h1 className={`${textSizeClasses[size]} font-bold text-gray-900 leading-tight`}>
            JobTracker
          </h1>
          <p className="text-xs text-gray-500 font-medium tracking-wide">
            CAREER MANAGEMENT
          </p>
        </div>
      )}
    </div>
  );
}
