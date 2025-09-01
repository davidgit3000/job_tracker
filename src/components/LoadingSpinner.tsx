import React from 'react';
import { Briefcase } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  variant?: 'default' | 'overlay' | 'inline';
}

export default function LoadingSpinner({ 
  size = 'md', 
  text = 'Loading...', 
  variant = 'default' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const containerClasses = {
    default: 'flex flex-col items-center justify-center space-y-3',
    overlay: 'fixed inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center space-y-3 z-50',
    inline: 'flex items-center space-x-2'
  };

  return (
    <div className={containerClasses[variant]}>
      <div className="relative">
        {/* Outer rotating ring */}
        <div className={`${sizeClasses[size]} border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin`}></div>
        
        {/* Inner pulsing briefcase */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Briefcase className={`${size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-6 h-6'} text-blue-600 animate-pulse`} />
        </div>
        
        {/* Orbiting dots */}
        <div className={`absolute inset-0 ${sizeClasses[size]} animate-spin`} style={{ animationDuration: '2s' }}>
          <div className="absolute top-0 left-1/2 w-1 h-1 bg-green-500 rounded-full transform -translate-x-1/2"></div>
          <div className="absolute bottom-0 left-1/2 w-1 h-1 bg-green-500 rounded-full transform -translate-x-1/2"></div>
        </div>
      </div>
      
      {variant !== 'inline' && (
        <div className="text-center">
          <p className={`${textSizeClasses[size]} text-gray-600 font-medium`}>
            {text}
          </p>
          <div className="flex justify-center mt-2 space-x-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      )}
      
      {variant === 'inline' && (
        <span className={`${textSizeClasses[size]} text-gray-600 font-medium`}>
          {text}
        </span>
      )}
    </div>
  );
}

// Additional utility component for button loading states
export function ButtonSpinner({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  const spinnerSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  
  return (
    <div className={`${spinnerSize} border-2 border-white/30 border-t-white rounded-full animate-spin`}></div>
  );
}
