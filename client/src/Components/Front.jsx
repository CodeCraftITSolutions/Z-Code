import React from 'react';
import { useNavigate } from 'react-router-dom';

const Front = () => {
  const navigate = useNavigate();

  const gotoLogin = ()=>{
    navigate('/login');
  }

  return (
    <div className='bg-gray-200 w-full min-h-screen flex items-center justify-center'>
      <div className='w-100 p-6 bg-white rounded-xl shadow-lg flex flex-col items-center'>
        <h1 className="text-3xl font-bold text-violet-700 mb-4">Code Unlocks Infinite Possibilities</h1>
        <div className="mb-6 flex flex-col items-center justify-center">
          <p className="text-gray-600 text-lg mb-4">
            Empowering Students to Excel Through Code and Creativity
          </p>
          <button onClick={gotoLogin} className="w-40 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
            Get Started
          </button>
        </div>
        <p className="text-gray-600">
          Crafting Futures with <b className='text-violet-700'>Z-Code</b>: Empowering Minds, Fueling
          Innovations.
        </p>
      </div>
    </div>
  );
};

export default Front;