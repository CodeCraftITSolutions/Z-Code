import React from 'react';

export default function Approval({ handleLogout }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-md shadow-lg text-center">
        <div className="bg-yellow-200 text-yellow-800 p-4 mb-4 rounded-md">
          Your account is awaiting approval from the admin. Please wait until you are approved to access your dashboard.
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 focus:outline-none"
        >
          Logout
        </button>
      </div>
    </div>
  );
}