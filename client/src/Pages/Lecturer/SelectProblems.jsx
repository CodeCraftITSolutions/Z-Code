import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { backendUrl } from "../../../config";
import 'react-toastify/dist/ReactToastify.css';
import { FaEye } from 'react-icons/fa';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import ClipLoader from "react-spinners/ClipLoader";
import { CSSProperties } from "react";
import ViewProblem from './ViewProblem';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';

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

export default function SelectProblems(props) {
    const { onClose, addSelection } = props;
    const [problemsList, setProblemList] = useState([]);
    const [selectedProblems, setSelectedProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showViewProblem, setShowViewProblem] = useState(false);
    const [activeProblemId, setActiveProblemId] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [problemsPerPage] = useState(6); // Set the number of problems per page
    const [totalProblems, setTotalProblems] = useState(0);
    const [showSearch, setShowSearch] = useState(false);
    const [showProblem, setShowProblem] = useState(true);
    const [name, setName] = useState('');
    const [showBtn, setShowBtn] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page")) || 1);
    const navigate = useNavigate();
    const location = useLocation();
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const total = Math.ceil(totalProblems / problemsPerPage);
        if (total === 0) return;
        setTotalPages(total);
        if (total > 1) {
            setShowBtn(true);
        }
        else {
            setShowBtn(false);
        }
        if (currentPage > total) {
            setCurrentPage(1);
        }
    }, [totalProblems, showBtn]);

    useEffect(() => {
        if (showProblem) {
            fetchQuestions(currentPage);
            return;
        }
        if (showSearch) {
            fetchSearchedQuestions(currentPage);
            return;
        }
    }, [showSearch, currentPage, showProblem]);

    useEffect(() => {
        if (name !== "") return;
        setShowProblem(true);
        setShowSearch(false);
    }, [name]);

    const fetchSearchedQuestions = async (page) => {
        setLoading(true);
        if (name === "") return;
        try {
            const response = await axios.get(`${backendUrl}/api/problems/search`, {
                params: {
                    name,
                    page: page,
                    limit: problemsPerPage,
                }
            });
            setProblemList(response.data.problems);
            setTotalProblems(response.data.total);
            setSearchParams({ page: page });
        } catch (error) {
            toast.error("Error fetching questions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        localStorage.clear();
    }, []);

    const fetchQuestions = async (page) => {
        setLoading(true);
        try {
            const response = await axios.get(`${backendUrl}/api/problems`, {
                params: {
                    page: page,
                    limit: problemsPerPage,
                },
            });
            setProblemList(response.data.problems);
            setTotalProblems(response.data.total);
            setSearchParams({ page: page });
        } catch (error) {
            console.log("Error fetching questions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const page = parseInt(searchParams.get("page")) || 1;
        setCurrentPage(page);
    }, [searchParams]);

    useEffect(() => {
        if (location.state && location.state.selectedProblems) {
            setSelectedProblems(location.state.selectedProblems);
        }
    }, [location.state]);

    const handleNext = () => {
        if (currentPage !== totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentPage !== 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const handleChange = (e) => {
        setName(e.target.value);
    };

    const handleClick = () => {
        if (name === "") return;
        setShowSearch(true);
        fetchSearchedQuestions(currentPage);
        setShowProblem(false);
    };

    const handleSelectProblem = (problem) => {
        // Check if the problem is already selected
        if (!selectedProblems.some(p => p._id === problem._id)) {
            const newSelectedProblems = [...selectedProblems, problem];
            setSelectedProblems(newSelectedProblems);
            navigate(location.pathname, { state: { selectedProblems: newSelectedProblems } });
        } else {
            toast.warning("This problem is already selected.");
        }
    };

    const handleRemoveProblem = (problem) => {
        const newSelectedProblems = selectedProblems.filter(p => p._id !== problem._id);
        setSelectedProblems(newSelectedProblems);
        navigate(location.pathname, { state: { selectedProblems: newSelectedProblems } });
    };

    const handleViewProblem = (problem) => {
        setActiveProblemId(problem._id);
        setShowViewProblem(true);
    };

    const handleCloseViewProblem = () => {
        setShowViewProblem(false);
    };

    const handleCancel = () => {
        navigate(location.pathname, { state: { selectedProblems: [] } });
        onClose();
    };

    const handleSave = () => {
        if (selectedProblems.length === 0) {
            toast.error("No Problems Has been selected");
            return;
        }
        addSelection(selectedProblems);
        navigate(location.pathname, { state: { selectedProblems: [] } });
        onClose();
    };

    if (loading) {
        return (
            <div className="w-full flex justify-center items-center h-screen">
                <ClipLoader
                    color="red"
                    loading={true}
                    size={150}
                    css={override}
                />
            </div>
        );
    }

    if (showViewProblem) {
        return <ViewProblem onClose={handleCloseViewProblem} id={activeProblemId} />;
    }

    return (
        <div className="container mx-auto p-4 text-xs md:text-base">
            <div className="absolute top-4 right-4 z-50">
            </div>

            {/* Save and Cancel buttons moved to the top */}
            <div className="flex justify-around items-center flex-wrap m-6">
                <button
                    onClick={handleCancel}
                    className="bg-gray-500 text-white px-4 py-2 rounded  hover:bg-gray-600 mb-2 md:mb-0"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-2 md:mb-0"
                >
                    Save
                </button>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between mx-auto w-full md:w-1/2 mb-4">
                <div className="relative flex-grow mb-4 md:mb-0 md:mr-4">
                    <input
                        type="text"
                        placeholder="Search Question.."
                        className="pl-10 pr-4 py-2 w-full border rounded-md"
                        value={name}
                        onChange={handleChange}
                        disabled={loading}
                    />
                </div>
                <button
                    className="bg-violet-500 hover:bg-violet-600 text-white font-semibold px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 flex items-center"
                    onClick={handleClick}
                >
                    <FaSearch className="mr-2" />
                    Search
                </button>
            </div>

            {/* Problems list or no questions found message */}
            {problemsList && problemsList.length > 0 ? (
                <>
                    <div className="text-xl md:text-2xl font-bold mb-4">Problems</div>
                    <div className="overflow-x-auto max-w-full mb-4">
                        <div className="grid grid-cols-2 gap-4">
                            {problemsList.map((problem, index) => (
                                <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden">
                                    {/* Problem Name */}
                                    <div className="px-4 py-3 bg-gray-200">
                                        <h2 className="text-sm md:text-lg font-semibold text-gray-800">{problem.name}</h2>
                                    </div>
                                    {/* Problem Details */}
                                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 hidden md:grid">
                                        <div className="mb-3 flex items-center">
                                            <span className="text-xs md:text-sm text-gray-600">Category:</span>
                                            <span className="ml-1 text-xs md:text-sm  text-gray-900">{problem.category}</span>
                                        </div>
                                        <div className="mb-3 flex items-center">
                                            <span className="text-xs md:text-sm text-gray-600">Difficulty:</span>
                                            <span className="ml-1 text-xs md:text-sm text-gray-900">{difficultyOrder[problem.difficulty]}</span>
                                        </div>
                                        <div className="mb-3 flex items-center">
                                            <span className="text-xs md:text-sm  text-gray-600">Grade:</span>
                                            <span className="ml-1 text-xs md:text-sm text-gray-900">{problem.grade}</span>
                                        </div>
                                    </div>
                                    {/* Actions */}
                                    <div className="flex justify-around items-center px-4 py-3 gap-2 bg-gray-100">
                                        {/* Select Button */}
                                        <button
                                            onClick={() => handleSelectProblem(problem)}
                                            disabled={selectedProblems.some(p => p._id === problem._id)}
                                            className={`${
                                                selectedProblems.some(p => p._id === problem._id) ? 'bg-green-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                                            } text-white px-4 py-2 rounded`}
                                        >
                                            {selectedProblems.some(p => p._id === problem._id) ? 'Selected' : 'Select'}
                                        </button>
                                        {/* View Button */}
                                        <FaEye
                                            className="text-blue-500 cursor-pointer hover:text-blue-600 text-xl"
                                            onClick={() => handleViewProblem(problem)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <div className="w-full flex justify-center items-center mt-10">
                    <div className="w-full max-w-xl p-6 bg-blue-100 rounded-lg shadow-md flex flex-col items-center">
                        <h1 className="text-3xl font-bold text-blue-800 mb-4">No Questions Found</h1>
                        <p className="text-lg text-violet-700 text-center">
                            There are no questions in the Question Bank as per your request.
                        </p>
                    </div>
                </div>
            )}

            {/* Pagination Controls */}
            {showBtn && (
                <div className="flex justify-center items-center mb-4 space-x-4">
                    <button
                        onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage)}
                        disabled={currentPage === 1}
                        className={`bg-gray-300 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-400'} text-gray-800 font-bold py-2 px-4 rounded-l`}
                    >
                        Prev
                    </button>
                    <div>Page {currentPage} of {totalPages}</div>
                    <button
                        onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : currentPage)}
                        disabled={currentPage === totalPages}
                        className={`bg-gray-300 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-400'} text-gray-800 font-bold py-2 px-4 rounded-r`}
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Selected Problems */}
            {problemsList && problemsList.length > 0 && (
                <>
                    <div className="text-xl md:text-2xl font-bold mt-8 mb-4">Selected Problems</div>
                    <div className="max-w-full mb-4 text-xs md:text-sm lg:text-base">
                        {selectedProblems.length === 0 ? (
                            <div className="text-center">No problems selected.</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {selectedProblems.map((problem, index) => (
                                    <div key={index} className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center">
                                        <span className="text-md md:text-lg lg:text-base">{problem.name}</span>
                                        <button
                                            onClick={() => handleRemoveProblem(problem)}
                                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Additional space to ensure Save and Cancel buttons are not overlapped */}
            <div className="mb-8"></div>
        </div>
    );
}