import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CodingEditor from '../../Components/CodingEditor';
import { CODE_SNIPPETS } from '../../../constant.js';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { backendUrl } from "../../../config.js";
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import BackButton from '../../Components/BackButton';

const difficultyOrder = {
  1: 'Easy',
  2: 'Medium',
  3: 'Hard'
};

const AddProblem = (props) => {
  const user = useSelector(state => state.user);
  const {isContest,onSelection,onClose} = props;
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  
  const predefinedCategories = [
    
    "Basic",
    "Algorithms",
    "Data Structures",
    "Arithmetic",
    "Loops",
    "Control Flow",
    "Functions",
    "Arrays",
    "Strings",
    "Lists",
    "Dictionaries",
    "Sets",
    "File Handling",
    "Exception Handling",
    "Recursion",
    "Sorting",
    "Searching",
    "Linked Lists",
    "Stacks",
    "Queues",
    "Trees",
    "Graphs",
    "Hashing",
    "Dynamic Programming",
    "Greedy Algorithms",
    "Backtracking",
    "Bit Manipulation",
    "Mathematical",
    "Simulation",
    "Regex",
    "Object-Oriented Programming",
    "Functional Programming",
    "Concurrency",
    "Database Queries",
    "API Integration",
    "Unit Testing"
  ];
  
  const [formData, setFormData] = useState({
    name: '',
    difficulty: '',
    category: '',
    customCategory: '',
    description: '',
    initialCode: null,
    testCases: [],
    grade: 0,
    examples: [],
    isPractice: false,
  });
  const { id } = useParams();
  const navigate = useNavigate()
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (name === "category" && value === "Other") {
      setIsCustomCategory(true);
    } else if (name === "category") {
      setIsCustomCategory(false);
    }
  };


  const handleCancelAction = ()=>{
    localStorage.clear();
    if(isContest){
      onClose();
    }
    else{
      navigate('/qbank')
    }
  }

  const handleCheckboxChangePractice = (e) => {
    const  {checked}  = e.target;
    setFormData({
      ...formData,
      isPractice: checked,
    });
  };

  const handleExampleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedExamples = [...formData.examples];
    updatedExamples[index][name] = value;
    setFormData({
      ...formData,
      examples: updatedExamples
    });
  };


  const addExample = () => {
    setFormData({
      ...formData,
      examples: [...formData.examples, { input: '', output: '', explanation: '' }]
    });
  };

  const removeExample = (index) => {
    const updatedExamples = [...formData.examples];
    updatedExamples.splice(index, 1);
    setFormData({
      ...formData,
      examples: updatedExamples
    });
  };



  const handleTestCaseChange = (e, index, field) => {
    const { value } = e.target;
    const updatedTestCases = [...formData.testCases];
    updatedTestCases[index][field] = value;
    setFormData({
      ...formData,
      testCases: updatedTestCases
    });
  };

  const handleCheckboxChange = (e, index) => {
    const { checked } = e.target;
    const updatedTestCases = [...formData.testCases];
    updatedTestCases[index].isSample = checked;
    setFormData({
      ...formData,
      testCases: updatedTestCases
    });
  };

  const addTestCase = () => {
    setFormData({
      ...formData,
      testCases: [...formData.testCases, { input: '', expectedOutput: '', isSample: false, weight: 0 }]
    });
  };

  const removeTestCase = (index) => {
    const updatedTestCases = [...formData.testCases];
    updatedTestCases.splice(index, 1);
    setFormData({
      ...formData,
      testCases: updatedTestCases
    });
  };


  useEffect(() => {
    if (id) {
      fetchProblemDetails(id);
    }else{
      setFormData({
        ...formData,
        initialCode: [
          { language: "cpp", code: CODE_SNIPPETS['cpp'] },
          { language: "c", code: CODE_SNIPPETS['c'] },
          { language: "python", code: CODE_SNIPPETS['python'] },
          { language: "java", code: CODE_SNIPPETS['java'] },
          { language: "javascript", code: CODE_SNIPPETS['javascript'] },
          { language: "csharp", code: CODE_SNIPPETS['csharp'] },
        ]
      });
    }
  }, [id]);



  const fetchProblemDetails = async (id) => {
    try {
      const response = await axios.get(`${backendUrl}/api/problems/${id}`);
      const problem = response.data.problem;
      setFormData({
        name: problem.name,
        difficulty: difficultyOrder[problem.difficulty],
        category: problem.category,
        description: problem.description,
        initialCode: problem.initialCode,
        testCases: problem.testCases,
        grade: problem.grade,
        examples: problem.examples || [],
        isPractice : problem.isPractice ,
        customCategory : problem.customCategory || ''
      });
      if(problem.category === "Other"){
        setIsCustomCategory(true);
      }
    } catch (error) {
      toast.error('Error fetching problem details:', error.message);
    }
  };


  const updateInitialCode = (newInitialCode) => {
    setFormData({
      ...formData,
      initialCode: newInitialCode
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation code here...
    if (!formData.name) {
      toast.error('Name is required');
      return;
    }
    if (!formData.difficulty) {
      toast.error('Difficulty is required');
      return;
    }
    if (!formData.category) {
      toast.error('Category is required');
      return;
    }
    if (!formData.description) {
      toast.error('Description is required');
      return;
    }
    if (!formData.grade || formData.grade <= 0) {
      toast.error('Invalid Grade');
      return;
    }
    if(formData.testCases.length === 0){
      toast.error('Test Cases cannot be empty');
      return;
    }
    if(user._id === undefined){
      return;
    }
    const hasSampleTestCase = formData.testCases.some(testCase => testCase.isSample);
    if (!hasSampleTestCase) {
        toast.error('At least one test case must be marked as a sample');
        return;
    }
    const invalidTestCase = formData.testCases.find(testCase => testCase.weight <= 0);
    if (invalidTestCase) {
      toast.error('Test case weight must be greater than zero');
      return;
    }

    if(formData.category === "Other" && !formData.customCategory){
      toast.error('Custom Category is required');
    }

    if(formData.category !== "Other"){
      formData.customCategory = '';
    }

    

    const url = id ? `${backendUrl}/api/problems/${id}` : `${backendUrl}/api/problems`;
    const method = id ? 'PUT' : 'POST';

    try {
      const response = await axios({
        method: method,
        url: url,
        data:{ ...formData,createdBy : user._id},
      });
      toast.success(`${id ? 'Problem updated' : 'Problem added'} successfully!`);
      localStorage.clear();
      if(isContest){
        onSelection(response.data.problem);
        onClose();
      }else{
        navigate(-1);

      }
    } catch (error) {
      if(error.response.status === 403){
      toast.error(`Problem With Same Name Existing`);
      }
      else{
        toast.error(`Error ${id ? 'updating' : 'adding'} problem. ${error}`);

      }
      console.log(error);
    }
  };

  

   
  


  return (
    <div className="mx-auto p-6 bg-white rounded-xl shadow-md w-full max-w-3xl lg:max-w-full">
      <BackButton handleCancel = {handleCancelAction}/>
  <h2 className="text-2xl font-bold mb-4">{id ? 'Edit Problem' : 'Add Problem'}</h2>
  <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-y-4 md:grid-cols-2 md:gap-x-8">

    {/* Problem Details Section */}
    <div className="col-span-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <div>
          <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="difficulty" className="block mb-1 text-sm font-medium text-gray-700">Difficulty:</label>
          <select
            id="difficulty"
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-indigo-500"
          >
            <option value="">Select an Option</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
        {/* <div>
          <label htmlFor="category" className="block mb-1 text-sm font-medium text-gray-700">Category:</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-indigo-500"
          />
        </div> */}

<div>
      <label htmlFor="category" className="block mb-1 text-sm font-medium text-gray-700">
        Category:
      </label>
      <select
        id="category"
        name="category"
        value={formData.category}
        onChange={handleChange}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-indigo-500"
      >
        <option value="">Select a category</option>
        {predefinedCategories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
        <option value="Other">Other</option>
      </select>
      {isCustomCategory && (
        <div className="mt-2">
          <label htmlFor="customCategory" className="block mb-1 text-sm font-medium text-gray-700">
            Custom Category:
          </label>
          <input
            type="text"
            id="customCategory"
            name="customCategory"
            value={formData.customCategory}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-indigo-500"
          />
        </div>
      )}
    </div>
        <div className="col-span-2">
          <label htmlFor="description" className="block mb-1 text-sm font-medium text-gray-700">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full h-40 px-3 py-2 border rounded-md focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>
    </div>

    {/* Initial Code Editor */}
    <div className="col-span-2">
      <label className="block mb-1 text-sm font-medium text-gray-700">Initial Code:</label>
      {formData.initialCode && <CodingEditor onUpdateInitialCode={updateInitialCode} initialCode={formData.initialCode} showOutput={false} />}
    </div>

    {/* Test Cases Section */}
    <div className="col-span-2">
      <h3 className="text-lg font-semibold mb-2">Test Cases:</h3>
      {formData.testCases.map((testCase, index) => (
        <div key={index} className="bg-gray-100 rounded-md p-4 space-y-4 mb-5">
          {/* Test Case Inputs */}
          <div className="space-y-2">
            <label className="block mb-1 text-sm font-medium text-gray-700">Input:</label>
            <textarea
              type="text"
              name="input"
              value={testCase.input}
              onChange={(e) => handleTestCaseChange(e, index, 'input')}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-indigo-500"
            />
          </div>
          {/* Expected Output */}
          <div className="space-y-2">
            <label className="block mb-1 text-sm font-medium text-gray-700">Expected Output:</label>
            <textarea
              type="text"
              name="expectedOutput"
              value={testCase.expectedOutput}
              onChange={(e) => handleTestCaseChange(e, index, 'expectedOutput')}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-indigo-500"
            />
          </div>
          {/* Sample Checkbox */}
          <div className="inline-flex items-center">
            <input
              type="checkbox"
              name="isSample"
              checked={testCase.isSample}
              onChange={(e) => handleCheckboxChange(e, index)}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">Sample</span>
          </div>
          {/* Weight Input */}
          <div className="space-y-2">
            <label className="block mb-1 text-sm font-medium text-gray-700">Weight:</label>
            <input
              type="number"
              name="weight"
              value={testCase.weight}
              onChange={(e) => handleTestCaseChange(e, index, 'weight')}
              placeholder="Weight"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-indigo-500"
            />
          </div>
          {/* Remove Test Case Button */}
          <button
            className='mt-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600'
            type="button"
            onClick={() => removeTestCase(index)}
          >
            Remove Testcase
          </button>
        </div>
      ))}
      {/* Add Test Case Button */}
      <button
        type="button"
        onClick={addTestCase}
        className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
      >
        Add New Testcase
      </button>
    </div>

    {/* Examples Section */}
    <div className="col-span-2">
      <h3 className="text-lg font-semibold mb-2">Examples:</h3>
      {formData.examples.map((example, index) => (
        <div key={index} className="bg-gray-100 rounded-md p-4 space-y-4">
          {/* Example Inputs */}
          <div className="space-y-2">
            <label className="block mb-1 text-sm font-medium text-gray-700">Input:</label>
            <textarea
              type="text"
              name="input"
              value={example.input}
              onChange={(e) => handleExampleChange(e, index)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-indigo-500"
            />
          </div>
          {/* Expected Output */}
          <div className="space-y-2">
            <label className="block mb-1 text-sm font-medium text-gray-700">Expected Output:</label>
            <textarea
              type="text"
              name="output"
              value={example.output}
              onChange={(e) => handleExampleChange(e, index)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-indigo-500"
            />
          </div>
          {/* Explanation */}
          <div className="space-y-2">
            <label className="block mb-1 text-sm font-medium text-gray-700">Explanation:</label>
            <textarea
              type="text"
              name="explanation"
              value={example.explanation}
              onChange={(e) => handleExampleChange(e, index)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-indigo-500"
            />
          </div>
          {/* Remove Example Button */}
          <button
            type="button"
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            onClick={() => removeExample(index)}
          >
            Remove
          </button>
        </div>
      ))}
      {/* Add Example Button */}
      <button
        type="button"
        onClick={addExample}
        className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
      >
        Add Example
      </button>
    </div>

    {/* Grade and Practice List Section */}
    <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
      <div>
        <label htmlFor="grade" className="block mb-1 text-sm font-medium text-gray-700">Grade:</label>
        <input
          type="number"
          id="grade"
          name="grade"
          value={formData.grade}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-indigo-500"
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isPractice"
          name="isPractice"
          checked={formData.isPractice}
          onChange={handleCheckboxChangePractice}
          className="mr-2"
        />
        <label htmlFor="isPractice" className="text-sm font-medium text-gray-700">Add to Practice List</label>
      </div>
    </div>

    {/* Buttons Section */}
    <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
      <button
        type="submit"
        className="w-full bg-indigo-500 text-white px-6 py-3 rounded-md hover:bg-indigo-600"
      >
        
                  {id ? 'Update Problem' : 'Add Problem'}
                  </button>
                  <button
                    type="button"
                    className="w-full bg-gray-300 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-400"
                    onClick = {()=>handleCancelAction()}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            
              {/* Toast Notifications */}
            </div>
            

  );

};

export default AddProblem;