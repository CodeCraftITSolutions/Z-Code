import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../../../config";
import ClipLoader from "react-spinners/ClipLoader";
import { CSSProperties } from "react";
import { FaArrowLeft } from 'react-icons/fa';

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};
const difficultyOrder = {
  1 : 'Easy',
  2 : 'Medium',
  3 : 'Hard'
};


const ContestDetails = () => {


  const [loading,setLoading] = useState(true);
  const navigate = useNavigate();

  const formatDuration = (minutes) => {
    const days = Math.floor(minutes / (24 * 60));
    const hours = Math.floor((minutes % (24 * 60)) / 60);
    const mins = minutes % 60;

    let durationString = "";

    if (days > 0) {
      durationString += `${days}d `;
    }

    if (hours > 0 || days > 0) {
      durationString += `${hours}h `;
    }

    if (mins > 0 || (hours === 0 && days === 0)) {
      durationString += `${mins}m`;
    }

    return durationString.trim();
  };

  const [contest, setContest] = useState({}); // Initialize contest state with an empty object
  const [problems, setProblems] = useState([]); // Initialize problems state with an empty array
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchContestById(id);
    }
  }, [id]);

  const fetchContestById = async (contestId) => {
    try {
      const response = await axios.get(`${backendUrl}/api/contest/${id}`);
      setContest(response.data.contest);
      // Fetch problems using problem IDs
      fetchProblems(response.data.contest.problems);
    } catch (error) {
      toast.error("Error fetching contest details:", error);
    }
 
  };

  const fetchProblems = async (problemIds) => {
    try {
      const response = await axios.get(`${backendUrl}/api/problems`);
      const problemsData = response.data.problems;
      // Filter problems based on problem IDs
      const selectedProblems = problemsData.filter((problem) => problemIds.includes(problem._id));
      setProblems(selectedProblems);
    } catch (error) {
      toast.error("Error fetching problems:", error);
    }   finally{
      setLoading(false);
    }
  };

  if(loading){
    return  <div className="w-full flex justify-center items-center h-screen">
    <ClipLoader
      color="red"
      loading={true}
      size={150}
      css={override}
    />
  </div>
  }

  return (
    <div className="flex justify-center items-center min-h-screen  bg-gray-100">
    <div className="container mx-auto px-4 py-8 rounded-lg shadow-lg mt-20 bg-white">
    <button
    onClick={()=> navigate(-1)} // Replace with your actual back functionality
    className="flex items-center text-lg font-semibold mb-4 bg-gray-200 rounded-md px-4 py-2 hover:bg-gray-300 focus:bg-gray-300 border border-futuristic-color"
  >
    <FaArrowLeft className="mr-2 " /> Back
  </button>
  
    <div className="max-w-screen-lg mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">{contest.name}</h2>
  
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <svg className="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM8 5a5 5 0 017.5-4.34M6 21a5 5 0 007.5 4.34M10 18v-6l4 2-4 2z" />
          </svg>
          <span className="text-lg text-gray-700">Deadline: {new Date(contest.endDate).toLocaleString([], { month: 'short', day: '2-digit', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}</span>
        </div>
        <div className="flex items-center">
          <svg className="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4M8 16h8M8 8h8M16 20a4 4 0 100-8 4 4 0 000 8z" />
          </svg>
          <span className="text-lg text-gray-700">Duration: {formatDuration(contest.duration)}</span>
        </div>
      </div>
  
      {problems && problems.length > 0 &&
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Selected Problems:</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-6 text-left text-gray-700">Problem Name</th>
                  <th className="py-3 px-6 text-left text-gray-700">Difficulty</th>
                  <th className="py-3 px-6 text-left text-gray-700">Grade</th>
                  <th className="py-3 px-6 text-left text-gray-700">Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {problems.map((problem) => (
                  <tr key={problem._id} className="text-gray-800">
                    <td className="py-4 px-6">{problem.name}</td>
                    <td className="py-4 px-6">{difficultyOrder[problem.difficulty]}</td>
                    <td className="py-4 px-6">{problem.grade}</td>
                    <td className="py-4 px-6">{problem.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>
  </div>
  
    </div>

  
  );
};

export default ContestDetails;