// ErrorComponent.js
import React from 'react';

const ErrorComponent = ({ message }) => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="bg-white p-10 rounded-lg shadow-2xl text-center transform transition-all hover:scale-105 duration-300">
        <h1 className="text-4xl font-extrabold text-red-600 mb-4">OOPS!</h1>
        <p className="text-xl text-gray-700 mb-6">Server is down. Please come back later.</p>
        <button
          onClick={handleRefresh}
          className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition-all duration-300"
        >
          Refresh
        </button>
      </div>
    </div>
  );
};

export default ErrorComponent;