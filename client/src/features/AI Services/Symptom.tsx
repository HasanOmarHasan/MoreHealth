import React from 'react';
import { Symptom_URL } from './config';

const Symptom: React.FC = () => {
//   const isServerAvailable = Symptom_URL && Symptom_URL?.trim() !== '';
  const isServerAvailable = Symptom_URL && Symptom_URL?.trim() !== '';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {isServerAvailable ? (
        <div className="w-full  h-[900px] bg-white rounded-lg shadow-lg overflow-hidden">
          <iframe 
            src={Symptom_URL}
            title="Symptom Checker Service"
            className="w-full h-full border-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      ) : (
        <div className="text-center max-w-md mx-auto">
          <div className="mx-auto w-48 h-48 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mt-6">Server is currently unavailable</h1>
          <p className="text-gray-600 mt-2">
            The symptom checker service is temporarily down for maintenance.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default Symptom;