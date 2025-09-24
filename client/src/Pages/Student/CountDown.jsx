import React, { useState, useEffect } from 'react';

const CountDown = ({ contestDuration, enrollmentCreatedAt }) => {
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    if (enrollmentCreatedAt) {
      const interval = setInterval(() => {
        setTimeRemaining(calculateTimeRemaining());
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [enrollmentCreatedAt]);

  function calculateTimeRemaining() {
    if (!enrollmentCreatedAt) return '';

    const enrollmentTime = new Date(enrollmentCreatedAt).getTime();
    const now = new Date().getTime();
    const durationMillis = contestDuration * 60000;

    const remainingMillis = enrollmentTime + durationMillis - now;

    if (remainingMillis <= 0) {
      return null;
    }

    const days = Math.floor(remainingMillis / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remainingMillis % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) + days * 24;
    const minutes = Math.floor((remainingMillis % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingMillis % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  }

  return (
    <div className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 bg-blue-700 flex items-center justify-center m-2 p-6 rounded-lg shadow-lg">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full">
        {enrollmentCreatedAt && (
          <p className="text-xl text-red-500 text-center">
            {timeRemaining === null ? 'Contest Ended' : `Time Remaining: ${timeRemaining}`}
          </p>
        )}
      </div>
    </div>
  );
};

export default CountDown;