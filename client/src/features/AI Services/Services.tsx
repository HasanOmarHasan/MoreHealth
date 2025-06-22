import React from 'react';
import { ai_chat_URL, Symptom_URL } from './config';
import { useNavigate } from 'react-router-dom';

const Services: React.FC = () => {
  const navigate = useNavigate();
  
  const services = [
    {
      id: 'ai-chat',
      title: 'AI Chat Service',
      description: 'Interactive conversation with our AI assistant',
      available: ai_chat_URL ? ai_chat_URL.trim() !== '' : false,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      id: 'symptom-checker',
      title: 'Symptom Checker',
        description: 'Get preliminary health assessment based on symptoms',
      available: Symptom_URL ? Symptom_URL.trim() !== '' : false,
      
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Our AI Services
        </h1>
        <p className="mt-4 text-lg text-gray-500">
          Access our powerful AI tools to help with your needs
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
        {services.map((service) => (
          <div 
            key={service.id}
            className={`${service.bgColor} rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg`}
          >
            <div className="p-6">
              <div className={`${service.textColor} mb-4`}>
                {service.icon}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{service.title}</h3>
              <p className="text-gray-600 mb-6">{service.description}</p>
              
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  service.available 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {service.available ? 'Available' : 'Unavailable'}
                </span>
                
                <button
                  onClick={() => navigate(`/services/${service.id}`)}
                  disabled={!service.available}
                  className={`px-4 py-2 rounded-md font-medium ${
                    service.available
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  } transition-colors`}
                >
                  {service.available ? 'Access Service' : 'Service Down'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!services.some(s => s.available) && (
        <div className="mt-12 text-center p-6 bg-yellow-50 rounded-lg">
          <h3 className="text-lg font-medium text-yellow-800">
            Notice: All services are currently undergoing maintenance
          </h3>
          <p className="mt-2 text-yellow-600">
            We're working hard to restore all services. Please check back later.
          </p>
        </div>
      )}
    </div>
  );
};

export default Services;