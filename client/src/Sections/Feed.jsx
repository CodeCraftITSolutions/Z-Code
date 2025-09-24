import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../../config.js";
import ClipLoader from "react-spinners/ClipLoader";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "blue",
};

const Feed = () => {
  const [upcomingContests, setUpcomingContests] = useState([]);
  const [activeContest, setActiveContest] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState("");
  const [showContestDetails, setShowContestDetails] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcomingContests = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${backendUrl}/api/contest/upcoming`);
        setUpcomingContests(response.data.upcomingContests);
      } catch (error) {
        toast.error("Error fetching upcoming contests:");
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingContests();
  }, []);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      if (activeContest) {
        const contestStartDate = new Date(activeContest.startDate);
        const currentTime = new Date();
        const timeDiff = contestStartDate - currentTime;

        if (timeDiff > 0) {
          const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
          let hours = Math.floor(
            (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor(
            (timeDiff % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
          hours += days * 24;

          const timeRemainingStr = `${hours}h ${minutes}m ${seconds}s`;
          setTimeRemaining(timeRemainingStr);
        } else {
          setTimeRemaining("Contest has started");
        }
      }
    };

    const interval = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, [activeContest]);

  const handleClick = (contest) => {
    setActiveContest(contest);
    setShowContestDetails(true);
  };

  const handleCloseDetails = () => {
    setShowContestDetails(false);
    setActiveContest(null);
  };

  if (loading) {
    return (
      <section className="w-full min-h-screen flex justify-center items-center bg-gray-100">
        <div className="w-full flex justify-center items-center h-screen">
          <ClipLoader color="blue" loading={true} size={150} css={override} />
        </div>
      </section>
    );
  }

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section className="w-full min-h-screen flex justify-center items-center bg-white">
      <div className="w-11/12 sm:w-4/5 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 rounded-xl shadow-lg p-4 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-violet-900 mb-4 text-center">
          Dashboard
        </h1>
        <div className="mb-6 flex flex-col items-center justify-center text-gray-800">
          <p className="text-base sm:text-lg mb-4 text-center">
            Explore the available contests or start practicing to sharpen your
            skills.
          </p>
          <div className="flex justify-center items-center gap-4 flex-wrap">
            <Link to="/available">
              <button className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none">
                Available Contests
              </button>
            </Link>
            <Link to="/practice">
              <button className="bg-green-600 text-white px-4 sm:px-6 py-2 rounded-md hover:bg-green-700 focus:outline-none">
                Start Practice
              </button>
            </Link>
          </div>
        </div>
        {upcomingContests && upcomingContests.length > 0 && <div className="mt-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-violet-900 mb-4 text-center">
            Upcoming Contests
          </h2>
          <Slider {...sliderSettings}>
            {upcomingContests.map((contest) => (
              <div key={contest._id} className="p-4">
                <div className="bg-gradient-to-r from-white via-gray-100 to-gray-200 rounded-lg shadow-md p-4">
                  <h3 className="text-md sm:text-lg font-semibold text-blue-800 mb-2">
                    {contest.name}
                  </h3>
                  <p className="text-sm text-green-600 mb-2">
                    Starts: {new Date(contest.startDate).toLocaleString()}
                  </p>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
                    onClick={() => handleClick(contest)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </Slider>
        </div>}
      </div>

      {showContestDetails && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-blue-100 w-11/12 sm:w-96 p-8 rounded-lg shadow-md">
            <h1 className="text-2xl text-violet-800 sm:text-3xl font-semibold mb-4 text-center">
              {activeContest.name}
            </h1>
            <p className="text-base text-blue-600 sm:text-lg mb-4 text-center">
              Total Problems: {activeContest.problems.length}
            </p>
            <p className="text-base text-green-600 sm:text-lg mb-6 text-center">
              Starts in: {timeRemaining}
            </p>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none"
              onClick={handleCloseDetails}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Feed;