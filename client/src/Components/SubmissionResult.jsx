import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClipLoader from 'react-spinners/ClipLoader';
import moment from 'moment';
import DetailedSubmission from './DetailedSubmission';
import { backendUrl } from '../../config';
// import NavbarSubmission from './NavbarSubmission';

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "green",
};

const SubmissionResult = (props) => {
  const { userId, problemId, contestId } = props;
  const [submissions, setSubmissions] = useState([]);
  const [problem, setProblem] = useState({});
  const [loading, setLoading] = useState(false);
  const [viewResults, setViewResults] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    fetchSubmissions(userId, problemId, contestId);
  }, [userId, problemId, contestId]);

  useEffect(() => {
    fetchProblem(problemId);
  }, [problemId]);

  const fetchProblem = async (problemId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/problems/${problemId}`);
      setProblem(response.data.problem);
    } catch (error) {
      toast.error('Failed to fetch problem.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async (userId, problemId, contestId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/submission/`, {
        params: {
          userId: userId,
          problemId: problemId,
          contestId: contestId,
        },
      });
      setSubmissions(response.data.submission);
    } catch (error) {
      toast.error('Failed to fetch submissions.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time) => {
    return moment(time).fromNow();
  };

  const handleViewResults = async (submissionId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/submission/${submissionId}`);
      setSelectedSubmission(response.data.submission);
      setViewResults(true);
    } catch (error) {
      toast.error('Failed to fetch submission details.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseResults = () => {
    setViewResults(false);
    setSelectedSubmission(null);
  };

  return (
    <div className="p-6 font-sans">
    {/* <NavbarSubmission /> */}
    {problem && <h1 className="text-2xl font-bold my-6">{problem.name}</h1>}
    {viewResults ? (
      <DetailedSubmission submission={selectedSubmission} onClose={handleCloseResults} />
    ) : (
      <>
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b text-center">Status</th>
                <th className="px-4 py-2 border-b text-center">Score</th>
                <th className="px-4 py-2 border-b text-center">Language</th>
                <th className="px-4 py-2 border-b text-center">Time</th>
                <th className="px-4 py-2 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission, index) => (
                <tr key={index} className="bg-gray-50">
                  <td className="px-4 py-2 border-b text-center">{submission.status ? '✅' : '❌'}</td>
                  <td className="px-4 py-2 border-b text-center">{submission.grade}</td>
                  <td className="px-4 py-2 border-b text-center">{submission.language}</td>
                  <td className="px-4 py-2 border-b text-center">{formatTime(submission.submittedAt)}</td>
                  <td className="px-4 py-2 border-b text-center">
                    <button className="text-blue-500 hover:underline" onClick={() => handleViewResults(submission._id)}>
                      View Results
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {loading && (
          <div className="fixed inset-0 bg-black opacity-80 flex justify-center items-center">
            <ClipLoader color="green" loading={true} size={120} />
          </div>
        )}
      </>
    )}
  </div>
  );
};

export default SubmissionResult;