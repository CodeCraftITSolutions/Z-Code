import React from 'react';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Error</h1>
      <p className="text-lg text-gray-600 mb-4">Oops! Something Went Wrong.</p>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Go Back to Home
      </button>
    </div>
  );
};

export default NotFoundPage;