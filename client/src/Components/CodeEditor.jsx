import React from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useState ,useEffect} from 'react';
import axios from 'axios';
import CodingEditor from './CodingEditor';
import TestCaseContext from '../Contexts/TextCaseContext.js';
import NavbarSubmission from './NavbarSubmission';
import { useSelector } from 'react-redux';
import SubmissionResult from './SubmissionResult';
import MoonLoader from 'react-spinners/MoonLoader';
import { backendUrl } from '../../config';
import BackButton from './BackButton';
import Loading from './Loading';
import { toast } from 'react-toastify';
const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

export default function CodeEditor() {

  const { contestId, problemId } = useParams();
    const [problem,setProblem] = useState(null);
    const [sampleTestCases,setSampleTestCases] = useState([]);
    const [allTestCases,setAllTestCases] = useState([]);
    const [viewSubmission, setViewSubmission] = useState(false);
    const [loading, setLoading] = useState(true);
    const [codes,setCodes] = useState(null);
    const [shouldFetch,setShouldFetch] = useState(false);
    const user = useSelector(state => state.user);
    const navigate = useNavigate();

    
    useEffect(() => {
      if(user._id === undefined)return;
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`${backendUrl}/api/problems/${problemId}`);
          const data = response.data;
          setProblem(data.problem);
          setShouldFetch(true)

          if(!data.problem)return;
          
          // Filter sample test cases and store them in sampleTestCases state
          if (data.problem.testCases) {
            const sampleCases = data.problem.testCases.filter(testCase => testCase.isSample);
            setSampleTestCases(sampleCases);
            setAllTestCases(data.problem.testCases);
          }
        } catch (error) {
          toast.error(error.message);
        }
        finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [problemId]);

    useEffect(()=>{
      if(shouldFetch){
        if(user._id === undefined)return;
        if(contestId === undefined){
        fetchDraft(problemId,user._id,null)
        }
        else{
          fetchDraft(problemId,user._id,contestId)
        }
      }
    },[shouldFetch])

    const fetchDraft = async(pid,uid,cid) =>{
      setLoading(true)
      try{
        const response = await axios.get(`${backendUrl}/api/draft/${pid}/${uid}/${cid}`)
        if(response.data.draftCodes === null){
          setCodes(problem.initialCode)
        }else{
          if(response.data.draftCodes.codes !== null){
            setCodes(response.data.draftCodes.codes);
          }else{
            setCodes(problem.initialCode)
          }

        }
      }
      catch(err){
       toast.error(err.message);
      }
      finally{
        setLoading(false)
      }

    }


    const updateInitialCode = (newInitialCode) => {
      setProblem({ ...problem, initialCode: newInitialCode });
    };

    const handleNavigation = (p) => {
      if(p === 'submission') {
        setViewSubmission(true);
      }
      else {
        setViewSubmission(false);
      }
    };

    if(loading){
      return <Loading/>
    }

    if(!problem){
      return null
    }

    const handleCancel = () => {
      if(contestId){
        navigate(`/contestview/${contestId}`)
      }
      else navigate(-1);
    };


    return (
        <div className='mx-auto px-4 py-8 flex flex-col justify-center items-start space-x-4'>
          <BackButton handleCancel =  {handleCancel}/>
            <div className="w-full"> {/* Added w-full class to make the Navbar take full width */}
    <NavbarSubmission handleNavigation = {handleNavigation} viewSubmission=  {viewSubmission}/>
          
  </div>

       {viewSubmission ? (
      <div className="w-full"> {/* Ensure full width when viewing submission */}
      <SubmissionResult userId={user._id} problemId={problemId} contestId={contestId}/>
    </div>
       ):  <div className="w-full bg-gray-50 rounded-lg shadow-md p-6 my-6">
  <h3 className="text-lg font-semibold mb-4 text-center">{problem.name}</h3>
  <div className="flex justify-between">
    <div>
      <p className="text-sm text-gray-600">Category: {problem.category}</p>
    </div>
    <div>
      <p className="text-sm text-gray-600">Difficulty: {problem.difficulty}</p>
    </div>
  </div>
  <div className="mt-4">
  <p className="text-gray-700 font-bold">Problem Description</p>
    <p className="text-gray-700">{problem.description}</p>
    {problem.explanation && (
      <div className="mt-4">
        <p className="text-gray-800 font-semibold">Explanation:</p>
        <p className="text-gray-700">{problem.explanation}</p>
      </div>
    )}
    {problem.examples && problem.examples.length > 0 && (
      <div className="mt-4">
        <p className="text-gray-800 font-semibold">Examples:</p>
        <ul className="list-disc list-inside">
        {problem.examples.map((example, index) => (
  <li key={index} className="mb-2 text-gray-700">
    <strong>Input:</strong><pre className="whitespace-pre-wrap">{example.input}</pre>
    <strong>Output:</strong><pre className="whitespace-pre-wrap">{example.output}</pre>
    <strong>Explanation:</strong><pre className="whitespace-pre-wrap">{example.explanation}</pre>
  </li>
))}
        </ul>
      </div>
    )}
    {sampleTestCases && sampleTestCases.length > 0 && (
      <div className="mt-4">
        <p className="text-gray-800 font-semibold">Sample Test Cases:</p>
        <ul className="list-disc list-inside">
          {sampleTestCases.map((testCase, index) => (
           <li key={index} className="mb-2 text-gray-700">
           <strong>Input:</strong><pre className="whitespace-pre-wrap">{testCase.input}</pre>
           <strong>Output:</strong><pre className="whitespace-pre-wrap">{testCase.expectedOutput}</pre>
         </li>
         
          ))}
        </ul>
      </div>
    )}
  </div>
</div>
}
        {!viewSubmission && <div className='w-full'>
            {problem && codes && (
              <TestCaseContext.Provider value={{ sampleTestCases, allTestCases }}>
                <CodingEditor
                  initialCode={codes || problem.initialCode}
                  onUpdateInitialCode={updateInitialCode}
                  showOutput={true}
                  problem={problem}
                  contestId={contestId}
                />
              </TestCaseContext.Provider>
            )}
          </div>
          
          }

       
        </div>
      );
}