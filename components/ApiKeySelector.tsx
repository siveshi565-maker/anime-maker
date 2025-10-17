
import React from 'react';

interface ApiKeySelectorProps {
  onSelectKey: () => void;
}

const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onSelectKey }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto text-center p-8 bg-gray-800/50 rounded-2xl shadow-lg border border-gray-700/50">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-purple-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H5v-2H3v-2H1v-4a6 6 0 017.743-5.743z" />
      </svg>
      <h2 className="text-2xl font-bold mb-2">API Key Required</h2>
      <p className="text-gray-400 mb-4">
        To use the Veo video generation models, you need to select your own Google AI API key. This ensures your requests are properly authenticated.
      </p>
      <p className="text-sm text-gray-500 mb-6">
        Please note that charges may apply for using the API. For more information, please see the{" "}
        <a 
          href="https://ai.google.dev/gemini-api/docs/billing" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-indigo-400 hover:underline"
        >
          billing documentation
        </a>.
      </p>
      <button
        onClick={onSelectKey}
        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
      >
        Select Your API Key
      </button>
    </div>
  );
};

export default ApiKeySelector;
