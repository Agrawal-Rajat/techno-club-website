'use client';

import { useState, useEffect } from 'react';

interface SuccessMessageProps {
  message: string;
  onHide: () => void;
}

export default function SuccessMessage({ message, onHide }: SuccessMessageProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide message after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      onHide();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onHide]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
      <div className="flex items-center space-x-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span>{message}</span>
      </div>
    </div>
  );
}
