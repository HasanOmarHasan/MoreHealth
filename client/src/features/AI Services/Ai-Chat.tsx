import React from 'react';
import { ai_chat_URL } from './config';

const AiChat: React.FC = () => {
  const isServerAvailable = ai_chat_URL && ai_chat_URL?.trim() !== '';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {isServerAvailable ? (
        <div className="w-full max-w-4xl h-[600px] bg-white rounded-lg shadow-lg overflow-hidden">
          <iframe 
            src={ai_chat_URL}
            title="AI Chat Service"
            className="w-full h-full border-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      ) : (
        <div className="text-center max-w-md mx-auto">
          <div className="mx-auto w-48 h-48 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mt-6">Server is currently unavailable</h1>
          <p className="text-gray-600 mt-2">
            We're working to restore the AI chat service. Please try again later.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      )}
    </div>
  );
};

export default AiChat;