import React, { useEffect, useState, useContext } from 'react';
import { executeCode } from '../../api.js';
import TestCaseContext from '../Contexts/TextCaseContext.js';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SyncLoader from 'react-spinners/SyncLoader';
import axios from 'axios';
import { backendUrl } from '../../config';
import { useNavigate } from 'react-router-dom';

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

export default function Output(props) {
  const { sampleTestCases, allTestCases } = useContext(TestCaseContext);
  const { value, language, problem,contestId } = props;
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [display, setDisplay] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [totalWeight, setTotalWeight] = useState(0);
  const [passedWeight, setPassedWeight] = useState(0);
  const [problemGrade, setProblemGrade] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passedPercentage, setPassedPercentage] = useState(0);
  const [finalProblemGrade, setFinalProblemGrade] = useState(0);
  const [shouldSubmit, setShouldSubmit] = useState(false);
  const [createdTime, setCreatedTime] = useState(0);
  const [contestDuration, setContestDuration] = useState(0);


  const user = useSelector(state => state.user);
  const navigate = useNavigate();


  const fetchCreatedTime = async () => {
    try {
      if (user._id === undefined || contestId === undefined) return;
      const res = await axios.get(`${backendUrl}/api/enrollment/time/${user._id}/${contestId}`);
      const data = res.data;
      if (data) {
      setCreatedTime(data.createdAt);
      setContestDuration(data.duration);
      }
     
    } catch (err) {
      toast.error("Error fetching enrollment:", err.message);
    }
  }


  useEffect(() => {
    if(user && contestId){
      fetchCreatedTime();
    }
  }, [user, contestId]);




  const finalGrade = (pass, grade) => {
    return (pass / 100) * grade;
  };

  useEffect(() => {
    setResults([]);
    setDisplay(false);
    setProblemGrade(problem.grade); 
  }, [value, language, problem.grade]);

  useEffect(() => {
    grading();
  }, [totalWeight, passedWeight]);

  useEffect(() => {
    if (shouldSubmit) {
      const testCases = allTestCases.map(testCase => ({
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        weight: testCase.weight
      }));
      const status = grading() === problem.grade;
      sendSubmission(grading(), testCases, results,status);    
      setShouldSubmit(false);
      deleteDraft(problem._id,user._id,contestId)
      localStorage.clear()
    }
  }, [shouldSubmit, finalProblemGrade, results]);



  const deleteDraft = async (problemId, userId, contestId) => {
    setIsLoading(true)
    if(contestId === undefined) contestId = null;
    try {
        const response = await axios.delete(`${backendUrl}/api/draft/${problemId}/${userId}/${contestId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting draft:', error.message);
        console.log(error)
        throw error;
    }finally{
      setIsLoading(false)
    }
};

  const grading = () => {
    const passedPercentage_ = totalWeight ? (passedWeight / totalWeight) * 100 : 0;
    const finalProblemGrade_ = finalGrade(passedPercentage_, problemGrade);
    setPassedPercentage(passedPercentage_);
    setFinalProblemGrade(finalProblemGrade_);
    return finalProblemGrade_;
  };

  const submitCodeWithInterval = async (input, expectedOutput, weight, index) => {
    const sourceCode = value;
    if (!sourceCode) return;
    try {
      setIsLoading(true);
      const response = await executeCode(sourceCode, language, input);
      let output = response.run.output;
      if (output.endsWith('\n')) {
        output = output.slice(0, -1);
      }

      const result = expectedOutput.trimEnd() === output.trimEnd() ? '✅' : '❌';
      setResults(prevResults => [
        ...prevResults,
        { input, expectedOutput, output, result, weight }
      ]);
      setDisplay(true);
      if (result === '✅') {
        setPassedWeight(prevPassedWeight => prevPassedWeight + weight);
      }
    } catch (error) {
      setResults(prevResults => [
        ...prevResults,
        { input, expectedOutput, output: error.response.data.message, error: true, weight }
      ]);
      setDisplay(true);
    } finally {
      setIsLoading(false);
    }
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const runAllCodeWithInterval = async () => {
    setIsRunning(true);
    setPassedWeight(0);
    setTotalWeight(0);
    setResults([]);
    try {
      for (let index = 0; index < sampleTestCases.length; index++) {
        const testCase = sampleTestCases[index];
        setTotalWeight(prev => prev + testCase.weight);
        await submitCodeWithInterval(testCase.input, testCase.expectedOutput, testCase.weight, index);
        await delay(400); // Adding a delay of 200ms between each request
      }
    } catch (err) {
      toast.error('Error running code:',err.message);
    } finally {
      setIsRunning(false);
    }
  };

  const submitAllCodeWithInterval = async () => {
    setIsRunning(true);
    setPassedWeight(0);
    setTotalWeight(0);
    setResults([]);
    try {
      for (let index = 0; index < allTestCases.length; index++) {
        const testCase = allTestCases[index];
        setTotalWeight(prev => prev + testCase.weight);
        await submitCodeWithInterval(testCase.input, testCase.expectedOutput, testCase.weight, index);
        await delay(400); // Adding a delay of 200ms between each request
      }
    } catch (err) {
      toast.error('Error running code:',err.message);
    } finally {
      setIsRunning(false);
    }
  };
  const sendSubmission = async (grade, testCases, results,status) => {
    try {

      const response = await axios.post(`${backendUrl}/api/submission/`, {
        problemId: problem._id, // Assuming problem object contains _id
        code: value,
        language: language,
        grade: parseFloat(grade).toFixed(2),
        userId: user._id, // Assuming user object contains _id
        status,
        submittedAt: new Date(),
        testCases: testCases,
        results: results,
        contestId:contestId,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = response.data;
      toast.success('Submission saved successfully!');
    } catch (error) {
      toast.error('Error saving submission:',error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    const currentTime = new Date().getTime();
    const contestEndTime = new Date(createdTime).getTime() + contestDuration * 60 * 1000;

    if (currentTime > contestEndTime & contestEndTime !== 0) {
      toast.error('Contest duration has ended. Cannot submit.');
      return;
    }
    setIsSubmitting(true);
    try {
      await submitAllCodeWithInterval();
      setShouldSubmit(true);
    } catch (error) {
      toast.error('Error saving submission:', error.message);
    }
  };

const handleCancel = ()=>{
  window.history.back();
}

  return (
    <div className='flex flex-col space-y-4'>
      <div className='flex justify-around space-x-4 w-full'>
        <button
          className='bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600'
          type='button'
          onClick={runAllCodeWithInterval}
          disabled={isRunning || isSubmitting}>
          {isRunning ? 'Running...' : 'RUN'}
        </button>
        <button
          className='bg-green-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600'
          type='button'
          onClick={handleSubmit}
          disabled={isSubmitting || isRunning}>
          {isSubmitting ? 'Submitting...' : 'SUBMIT'}
        </button>

        <button
          className='bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600'
          type='button'
          onClick={handleCancel}
          disabled={isSubmitting || isRunning}>
          {isSubmitting ? 'Submitting...' : 'CANCEL'}
        </button>
      </div>
      {isLoading && <p className='text-gray-700'>Running...</p>}
      {display && (
        <div className='bg-gray-100 rounded-md p-4 max-h-80 overflow-y-auto'>
          {results.map((result, index) => (
            <div key={index} className='mb-4'>
              <div className='mb-2'>
                <span className='font-semibold text-gray-700'>Input:</span>
                <pre className="whitespace-pre-wrap">{result.input}</pre>
              </div>
              <div className='mb-2'>
                <span className='font-semibold text-gray-700'>Expected Output:</span>
                <pre className="whitespace-pre-wrap">{result.expectedOutput}</pre>
              </div>
              <div className='mb-2'>
                <span className='font-semibold text-gray-700'>Output:</span>
                <pre className="whitespace-pre-wrap">{result.output}</pre>
              </div>

              {result.error && (
                <p className='text-red-600'>
                  <span className='font-semibold'>Error:</span> {result.output}
                </p>
              )}
              {result.result && (
                <p className='text-green-600'>
                  <span className='font-semibold'>Result:</span> {result.result}
                </p>
              )}
              <hr className='my-2 border-gray-400' />
            </div>
          ))}
          {!isRunning && display && (
            <>
              <p className='text-gray-700'>Passed Percentage: {parseFloat(passedPercentage).toFixed(2)}%</p>
              <p className='text-gray-700'>Final Grade: {parseFloat(finalProblemGrade).toFixed(2)}</p>
            </>
          )}
        </div>
      )}
      {isSubmitting || isRunning && (
        <div className="fixed inset-0 bg-black opacity-80 flex justify-center items-center">
          <SyncLoader color="green" loading={true} size={20} css={override} />
        </div>
      )}
    </div>
  );
}