'use client';

import Loader from './Loader';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  backdrop?: boolean;
}

export default function LoadingOverlay({ 
  isVisible, 
  message = 'Loading...',
  backdrop = true 
}: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${backdrop ? 'bg-black bg-opacity-50' : ''}`}>
      <div className="bg-white rounded-xl p-6 shadow-xl flex flex-col items-center min-w-[200px]">
        <Loader size="lg" color="red" text={message} />
      </div>
    </div>
  );
} 