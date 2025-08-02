'use client';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'red' | 'white' | 'gray';
  text?: string;
  className?: string;
}

export default function Loader({ 
  size = 'md', 
  color = 'red', 
  text = 'Loading...',
  className = ''
}: LoaderProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const colorClasses = {
    red: 'text-red-500',
    white: 'text-white',
    gray: 'text-gray-500'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
      <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-current ${sizeClasses[size]} ${colorClasses[color]}`}></div>
      {text && (
        <p className={`text-sm ${colorClasses[color]} animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );
} 