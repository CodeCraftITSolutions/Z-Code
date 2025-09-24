import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { backendUrl } from '../../../config';
import ClipLoader from "react-spinners/ClipLoader";
import { CSSProperties } from "react";
import { FaArrowLeft } from 'react-icons/fa';


const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

  const difficultyMap = {
    1: 'Easy',
    2: 'Medium',
    3: 'Hard'

  }

const ViewProblem = (props) => {
  const { id,onClose } = props
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchProblemDetails = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/problems/${id}`);
        setProblem(response.data.problem);
        setLoading(false);
      } catch (error) {
        setError('Error fetching problem details');
        setLoading(false);
      }
    };
    fetchProblemDetails();
  }, [id]);

  if (loading) return   <div className="w-full flex justify-center items-center h-screen">
  <ClipLoader
    color="red"
    loading={true}
    size={150}
    css={override}
  />
</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="w-full max-w-3xl lg:max-w-full mx-auto p-8 bg-white rounded-xl shadow-xl text-xs md:text-sm lg:text-base">
      <button
        onClick={onClose}
        className="flex items-center font-semibold mb-6 bg-gray-200 rounded-md px-4 py-2 hover:bg-gray-300 focus:bg-gray-300 focus:outline-none border border-gray-300 transition-all duration-300 text-md md:text-lg lg:text-xl"
      >
        <FaArrowLeft className="mr-2 text-md md:text-lg lg:text-xl" /> Back
      </button>

      <h2 className="text-xl md:text-2xl l:text-3xl font-extrabold mb-8 text-center text-gray-800">{problem.name}</h2>

      <div className="mb-8">
        <p className=" mb-2"><strong>Difficulty:</strong> {difficultyMap[problem.difficulty]}</p>
        <p className=" mb-2"><strong>Category:</strong> {problem.category}</p>
        <p className=" mb-2"><strong>Description:</strong> {problem.description}</p>
        <p className=" mb-2"><strong>Added By:</strong> {problem.addedBy}</p>
      </div>

      <div className="mb-8">
        <h3 className="text-2xl font-semibold mb-4">Initial Codes:</h3>
        {problem.initialCode.map((code, index) => (
          <div key={index} className="bg-gray-50 rounded-md p-4 my-2 border border-gray-200">
            <h4 className="font-medium mb-2">Language: {code.language}</h4>
            {code.code ? <> <h4 className="font-medium mb-2 text-center">Code</h4>
            <pre className="bg-gray-100 rounded-md p-2 overflow-auto">{code.code}</pre>
            </>:
            <p className="mb-1">No initial codes</p>
            }
          </div>
        ))}
      </div>

      {problem.testCases && problem.testCases.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl md:text-2xl l:text-3xl font-semibold mb-4">Test Cases:</h3>
          {problem.testCases.map((testCase, index) => (
            <div key={index} className="bg-gray-50 rounded-md p-4 my-2 border border-gray-200">
              <h4 className="font-medium mb-2">Test Case {index + 1}:</h4>
              <p className="mb-1"><strong>Input:</strong> {testCase.input}</p>
              <p className="mb-1"><strong>Expected Output:</strong> {testCase.expectedOutput}</p>
              <p className="mb-1"><strong>Sample:</strong> {testCase.isSample ? 'Yes' : 'No'}</p>
              <p className="mb-1"><strong>Weight:</strong> {testCase.weight}</p>
            </div>
          ))}
        </div>
      )}

      {problem.examples && problem.examples.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl md:text-2xl l:text-3xl font-semibold mb-4">Examples:</h3>
          {problem.examples.map((example, index) => (
            <div key={index} className="bg-gray-50 rounded-md p-4 my-2 border border-gray-200">
              <h4 className="font-medium mb-2">Example {index + 1}:</h4>
              <p className="mb-1"><strong>Input:</strong> {example.input}</p>
              <p className="mb-1"><strong>Expected Output:</strong> {example.output}</p>
              <p className="mb-1"><strong>Explanation:</strong> {example.explanation}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 text-md md:text-lg lg:text-xl">
        <p><strong>Grade:</strong> {problem.grade}</p>
      </div>
    </div>
  );
};

export default ViewProblem;