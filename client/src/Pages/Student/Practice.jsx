import React, { useEffect, useState } from "react";
import Sidebar from "../../Sections/Sidebar";
import Header from "../../Sections/Header";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { CSSProperties } from "react";
import { backendUrl } from "../../../config";
import NotFoundPage from "../../Components/NotFoundPage";
import { useSelector } from "react-redux";
import { FaSearch,FaSortUp,FaSortDown } from "react-icons/fa";

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

const Practice = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page")) || 1);
  const [problemsPerPage] = useState(10); // Set the number of problems per page
  const [totalProblems, setTotalProblems] = useState(0);
  const [showBtn, setShowBtn] = useState(false);
  const [totalPages,setTotalPages] = useState(0)
  const [notFound,setNotFound] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showProblem, setShowProblem] = useState(true)
  const [name, setName] = useState("");
  const [sortField, setSortField] = useState('name'); // Sorting field
  const [sortOrder, setSortOrder] = useState('asc'); // Sorting order
  const user = useSelector(state => state.user);

  useEffect(()=>{
    const total = Math.ceil(totalProblems / problemsPerPage)
    if(total === 0)return
    setTotalPages(total);
    if(  total > 1)setShowBtn(true)
    else setShowBtn(false)
    if (currentPage > total) {
      setSearchParams({ page: 1 });
      setCurrentPage(1);
    }
  },[totalProblems,showBtn,currentPage])

  useEffect(() => {
    if (showProblem) {
      fetchQuestions(currentPage,sortField,sortOrder)
      return
    }
    if (showSearch) {
      fetchSearchedQuestions(currentPage,sortField,sortOrder)
      return
    }
  }, [showSearch, currentPage, showProblem,sortField,sortOrder]);



  useEffect(() => {
    if (name !== "") return
    setShowProblem(true)
    setShowSearch(false)
  }, [name])

  const fetchQuestions = async (page,sortField,sortOrder) => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/problems/practice`, {
        params: {
          page: page,
          limit: problemsPerPage,
          sortField,
          sortOrder
        },
      });
      setProblems(response.data.problems);
      setTotalProblems(response.data.total); // Assuming the backend sends total number of problems
      setSearchParams({ page: page });
    } catch (error) {
      toast.error("Error fetching questions:");
    } finally {
      setLoading(false);
    }
  };

  const fetchSearchedQuestions = async (page,sortField,sortOrder) => {
    setLoading(true);
    if (name === "") return
    try {
      const response = await axios.get(`${backendUrl}/api/problems/search/practice`, {
        params: {
          name,
          page: page,
          limit: problemsPerPage,
          sortField,
          sortOrder
        }
      });
      setProblems(response.data.problems);
      setTotalProblems(response.data.total);
      setSearchParams({ page: page });
    } catch (error) {
      toast.error("Error fetching questions:");
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    if(user._id === undefined)return
    const pid = localStorage.getItem('problemId');
    const cid = localStorage.getItem('contestId');
    const codes = JSON.parse(localStorage.getItem('codes'))
    const uid = user._id
    if(pid !== null && uid !== null){

      sendDraft(pid,uid,cid,codes)
      localStorage.clear();
    }

  }, [])

  
  const handleSort = (field) => {
    const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);
  }


  const sendDraft = async (pid,uid,cid,codes) => {
    setLoading(true);
    try {
      const response = await axios.put(`${backendUrl}/api/draft/${pid}/${uid}/${cid}`, {
        codes
      });
    } catch (error) {
      toast.error('Error saving draft:', error);
    } finally {
      setLoading(false)
    }
  }

  


  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleChange = (e) => {
    setName(e.target.value)
  }

  const handleClick = () => {
    if (name === "") return
    setShowSearch(true)
    fetchSearchedQuestions(currentPage)
    setShowProblem(false)
  }


  return (
    <main className="w-full h-screen flex justify-between items-start">
    {/* <Sidebar /> */}
    {loading ? (
      <div className="w-full flex justify-center items-center h-screen">
        <ClipLoader color="blue" loading={true} size={150} css={override} />
      </div>
    ) : (
      <section className="w-full lg:w-4/5 grow bg-blue-100 h-screen overflow-y-auto flex flex-col justify-start items-center gap-4 p-4">
        {
          problems && !problems.length > 0 ?

 <div className="w-full h-screen flex justify-center items-center">
              <div className="w-5/6 max-w-xl p-6 rounded-xl shadow-lg flex flex-col items-center">
                <h1 className="text-4xl font-bold text-blue-900 mb-4">No Practice Problems</h1>
                <p className="text-lg text-blue-950 text-center">Sorry We do not have any Practice Problems at the moment. Please come back later!!</p>
              </div>
            </div>
            :

        <div className="w-full p-6 bg-blue-400 rounded-xl shadow-lg flex flex-col items-center mt-20">
          <div className="flex flex-col md:flex-row items-center justify-between w-full mb-4">
              <div className="relative flex-grow w-full md:w-auto mb-4 md:mb-0 mr-0 md:mr-4">
                <input
                  type="text"
                  placeholder="Search Question.."
                  className="pl-10 pr-4 py-2 w-full border rounded-md"
                  value={name}
                  onChange={handleChange}
                  disabled={loading}
                />
                <FaSearch className="absolute top-3 left-3 text-gray-400" />
              </div>
              <div>
                <button
                  className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
                  onClick={handleClick}
                >
                  <FaSearch className="mr-2" />
                  Search
                </button>
              </div>
            </div>
          <h2 className="text-xl italic font-semibold mb-4 text-blue-950 bg-blue-200 p-4 rounded">
            Practice Makes Perfect
          </h2>
          <table className="w-full border-collapse">
  <thead className="bg-blue-200">
    <tr className="block md:table-row">
      <th className="px-2 md:px-6 py-3 text-left text-blue-800">
        <div className="flex items-center gap-2">
          <p
            className="hover:cursor-pointer"
            onClick={() => handleSort("name")}
          >
            Name
          </p>
          <div className="text-sm">
            <FaSortUp
              className={
                sortField === "name" && sortOrder === "asc"
                  ? "text-blue-500"
                  : "text-gray-500"
              }
            />
            <FaSortDown
              className={
                sortField === "name" && sortOrder === "desc"
                  ? "text-blue-500"
                  : "text-gray-500"
              }
            />
          </div>
        </div>
      </th>
      <th className="px-2 md:px-6 py-3 text-left text-blue-800 md:table-cell hidden">
        <div className="flex items-center gap-2">
          <p
            className="hover:cursor-pointer"
            onClick={() => handleSort("difficulty")}
          >
            Difficulty
          </p>
          <div className="text-sm">
            <FaSortUp
              className={
                sortField === "difficulty" && sortOrder === "asc"
                  ? "text-blue-500"
                  : "text-gray-500"
              }
            />
            <FaSortDown
              className={
                sortField === "difficulty" && sortOrder === "desc"
                  ? "text-blue-500"
                  : "text-gray-500"
              }
            />
          </div>
        </div>
      </th>
      <th className="px-2 md:px-6 py-3 text-left text-blue-800 md:table-cell hidden">
        <div className="flex items-center gap-2">
          <p
            className="hover:cursor-pointer"
            onClick={() => handleSort("category")}
          >
            Category
          </p>
          <div className="text-sm">
            <FaSortUp
              className={
                sortField === "category" && sortOrder === "asc"
                  ? "text-blue-500"
                  : "text-gray-500"
              }
            />
            <FaSortDown
              className={
                sortField === "category" && sortOrder === "desc"
                  ? "text-blue-500"
                  : "text-gray-500"
              }
            />
          </div>
        </div>
      </th>
      <th className="px-2 md:px-6 py-3 text-left text-blue-800 md:table-cell hidden">
        <div className="flex items-center gap-2">
          <p
            className="hover:cursor-pointer"
            onClick={() => handleSort("grade")}
          >
            Grade
          </p>
          <div className="text-sm">
            <FaSortUp
              className={
                sortField === "grade" && sortOrder === "asc"
                  ? "text-blue-500"
                  : "text-gray-500"
              }
            />
            <FaSortDown
              className={
                sortField === "grade" && sortOrder === "desc"
                  ? "text-blue-500"
                  : "text-gray-500"
              }
            />
          </div>
        </div>
      </th>
    </tr>
  </thead>
  <tbody>
    {problems.map((problem, index) => (
      <tr
        key={index}
        className={`block md:table-row cursor-pointer ${
          index % 2 === 0 ? "bg-blue-800" : "bg-blue-700"
        }`}
        onClick={() => navigate(`/problems/${problem._id}`)}
      >
        <td className="px-2 md:px-6 py-3 text-blue-200">{problem.name}</td>
        <td className="px-2 md:px-6 py-3 text-blue-200 md:table-cell hidden">{difficultyOrder[problem.difficulty]}</td>
        <td className="px-2 md:px-6 py-3 text-blue-200 md:table-cell hidden">{problem.category}</td>
        <td className="px-2 md:px-6 py-3 text-blue-200 md:table-cell hidden">{problem.grade}</td>
      </tr>
    ))}
  </tbody>
</table>

            {showBtn && <div className="w-full flex justify-center items-center mt-4 gap-6">
                <button
                  onClick={handlePrev}
                  className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
                <span className="text-blue-800 font-semibold">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNext}
                  className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>}
        </div>

              }
      </section>

    )}
  </main>
  );
};

export default Practice;