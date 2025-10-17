
import React, { useState, useEffect, useCallback } from 'react';
import type { GenerateVideoOptions } from './types';
import { generateAnimeVideo } from './services/geminiService';
import ApiKeySelector from './components/ApiKeySelector';
import VideoGeneratorForm from './components/VideoGeneratorForm';
import LoadingIndicator from './components/LoadingIndicator';
import VideoPlayer from './components/VideoPlayer';

// Extend the Window interface to include aistudio property
declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}


const App: React.FC = () => {
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkApiKey = useCallback(async () => {
    if (window.aistudio) {
      const keyStatus = await window.aistudio.hasSelectedApiKey();
      setHasApiKey(keyStatus);
    } else {
      // Fallback for environments where aistudio is not available
      console.warn('aistudio is not available. Assuming API key is set via environment variable.');
      setHasApiKey(true);
    }
  }, []);

  useEffect(() => {
    checkApiKey();
  }, [checkApiKey]);

  const handleSelectKey = async () => {
    if (window.aistudio) {
      try {
        await window.aistudio.openSelectKey();
        // Optimistically set to true to handle race condition.
        // The actual verification will happen on the first API call.
        setHasApiKey(true);
      } catch (e) {
        console.error('Error opening API key selection:', e);
        setError('Failed to open API key selection. Please try again.');
      }
    }
  };

  const handleGenerateVideo = async (options: GenerateVideoOptions) => {
    setIsLoading(true);
    setGeneratedVideoUrl(null);
    setError(null);

    try {
      const videoBlob = await generateAnimeVideo(options, setLoadingMessage);
      const url = URL.createObjectURL(videoBlob);
      setGeneratedVideoUrl(url);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      console.error('Video generation failed:', errorMessage);
      
      // Specific check for API key error as per Gemini docs
      if (errorMessage.includes('Requested entity was not found')) {
        setError('API Key is invalid or not found. Please select a valid API key.');
        setHasApiKey(false); // Reset to force key selection again
      } else {
        setError(`Generation failed: ${errorMessage}`);
      }
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const Header: React.FC = () => (
    <div className="text-center p-6 border-b border-gray-700/50 bg-gray-900/50 backdrop-blur-sm">
      <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
        Anime Maker AI
      </h1>
      <p className="mt-2 text-lg text-gray-400">
        Powered by Google's Veo Models
      </p>
    </div>
  );

  if (hasApiKey === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="w-8 h-8 border-4 border-t-purple-500 border-gray-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        {!hasApiKey ? (
          <ApiKeySelector onSelectKey={handleSelectKey} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700/50">
              <VideoGeneratorForm onGenerate={handleGenerateVideo} isLoading={isLoading} />
            </div>
            <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700/50 min-h-[400px] flex items-center justify-center">
              {isLoading ? (
                <LoadingIndicator message={loadingMessage} />
              ) : error ? (
                <div className="text-center text-red-400">
                  <h3 className="text-xl font-bold mb-2">Error</h3>
                  <p>{error}</p>
                   {error.includes('API Key') && (
                      <button 
                        onClick={handleSelectKey}
                        className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold transition-colors"
                      >
                        Select New API Key
                      </button>
                    )}
                </div>
              ) : generatedVideoUrl ? (
                <VideoPlayer src={generatedVideoUrl} />
              ) : (
                <div className="text-center text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-4 text-lg">Your generated anime will appear here.</p>
                  <p className="text-sm">Fill out the form and click "Animate!" to begin.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
