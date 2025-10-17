
import React from 'react';

interface LoadingIndicatorProps {
  message: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message }) => {
  return (
    <div className="text-center">
      <div className="relative inline-flex">
        <div className="w-16 h-16 bg-purple-500 rounded-full"></div>
        <div className="w-16 h-16 bg-purple-500 rounded-full absolute top-0 left-0 animate-ping"></div>
        <div className="w-16 h-16 bg-purple-500 rounded-full absolute top-0 left-0 animate-pulse"></div>
      </div>
      <h3 className="text-xl font-semibold mt-6 text-purple-300">Generating Your Anime...</h3>
      <p className="text-gray-400 mt-2">{message}</p>
    </div>
  );
};

export default LoadingIndicator;
