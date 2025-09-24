import React, { useEffect, useState } from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { backendUrl } from '../../../config';
import { toast, ToastContainer } from "react-toastify";
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import { FaSortUp, FaSortDown } from 'react-icons/fa';

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "blue",
};

const CompletedContest = () => {
  const [contests, setContests] = useState([]);
  const [sortedContests, setSortedContests] = useState([]);
  const [filteredContests, setFilteredContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10); // Number of contests per page
  const [totalPages, setTotalPages] = useState(0);
  const [showBtn, setShowBtn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const user = useSelector(state => state.user);
  const [showSearch, setShowSearch] = useState(false);
  const [sortField, setSortField] = useState(null); // State for sorting field
  const [sortDirection, setSortDirection] = useState("asc");
  

  useEffect(() => {
    if (!user._id) return;
    fetchEnrolledContests();
  }, [user, currentPage]);

  useEffect(() => {
    sortContests();
  }, [contests, sortField, sortDirection]);

  useEffect(() => {
    firstSearch();
  }, [currentPage, sortedContests]);

  const firstSearch = () => {
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    setFilteredContests(sortedContests.slice(startIndex, endIndex));
  };

  const fetchEnrolledContests = async () => {
    setLoading(true);
    try {
      if (!user._id) return;
      const response = await axios.get(`${backendUrl}/api/enrollment/contest/${user._id}/enrolled-contests`);
      const allContests = response.data.contests;
      setContests(allContests);
      setSortedContests([...allContests]); // Store all contests initially in sortedContests
      setFilteredContests([...allContests]); // Initialize filtered contests
      const totalContests = allContests.length;
      if (totalContests > 0) setShowSearch(true);
      const total = Math.ceil(totalContests / perPage);
      setTotalPages(total);
      if (total > 1) setShowBtn(true);
    } catch (error) {
      toast.error("Error fetching enrolled contests:", error);
    } finally {
      setLoading(false);
    }
  };

  const sortContests = () => {
    if (sortField) {
      const sorted = [...contests].sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        if (sortField === 'duration') {
          // Numeric sort for duration (assuming it's in minutes)
          return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        } else if (sortField === 'problems') {
          // Numeric sort for problems count
          return sortDirection === 'asc' ? aValue.length - bValue.length : bValue.length - aValue.length;
        } else {
          // Default to string comparison (if needed for other fields)
          const compareResult = aValue.localeCompare(bValue, undefined, { sensitivity: 'accent' });
          return sortDirection === 'asc' ? compareResult : -compareResult;
        }
      });
      setSortedContests(sorted);
    } else {
      setSortedContests([...contests]);
    }
  };
  

  const formatDuration = (minutes) => {
    const days = Math.floor(minutes / (24 * 60));
    const hours = Math.floor((minutes % (24 * 60)) / 60);
    const mins = minutes % 60;
    let durationString = '';
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

  const handleContestDetailsClick = (contestId) => {
    navigate(`/contestview/${contestId}`);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value !== "") {
      setShowBtn(false);
    } else {
      setShowBtn(true);
      firstSearch();
      return;
    }
    const searchResults = sortedContests.filter(contest =>
      contest.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredContests(searchResults);
  };

  const handleSort = (field) => {
    let direction = "asc";
    if (field === sortField && sortDirection === "asc") {
      direction = "desc";
    }
    setSortField(field);
    setSortDirection(direction);
  };

  return (
    <main className="w-full h-screen flex justify-between items-start">
      {/* <Sidebar /> */}
      {loading ? (
        <div className="w-full flex justify-center items-center h-screen">
          <ClipLoader
            color="blue"
            loading={true}
            size={150}
            cssOverride={override}
          />
        </div>
      ) : (
        <section className="w-full lg:w-4/5 grow bg-blue-100 h-screen overflow-y-auto flex flex-col justify-start items-center gap-4 p-4">
         { showSearch && <div className="w-full mt-4 mb-4 border border-blue-300 rounded-lg relative">
            <FaSearch className="text-gray-400 absolute top-1/2 transform -translate-y-1/2 left-3" />
            <input
              type="text"
              placeholder="Search Contest.."
              className="pl-10 pr-4 py-2 w-full border rounded-md"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>}
          {/* <Header bgColor="blue" /> */}
          {filteredContests && filteredContests.length > 0 ? (
            <div className="w-full p-6 bg-blue-400 rounded-xl shadow-lg flex flex-col items-center mt-20 overflow-x-auto">
              <h2 className="text-xl font-semibold mb-4 text-blue-950">Completed Contests</h2>

              <div className="w-full overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-blue-200">
                      <th className="px-6 py-3 text-left text-blue-800">
                      <div className="flex items-center gap-2">
                        <p className="hover:cursor-pointer"
                          onClick={() => handleSort('name')}
                        >
                          Name
                        </p>
                        <div className="text-sm">
                          <FaSortUp
                            className={sortField === 'name' && sortDirection === 'asc' ? 'text-blue-500' : 'text-gray-500'}
                          />
                          <FaSortDown
                            className={sortField === 'name' && sortDirection === 'desc' ? 'text-blue-500' : 'text-gray-500'}
                          />
                        </div>
                      </div>
                      </th>
                      <th className="px-6 py-3 text-left text-blue-800">
                      <div className="flex items-center gap-2">
                        <p className="hover:cursor-pointer"
                          onClick={() => handleSort('startDate')}
                        >
                          Start Date
                        </p>
                        <div className="text-sm">
                          <FaSortUp
                            className={sortField === 'startDate' && sortDirection === 'asc' ? 'text-fuchsia-500' : 'text-gray-500'}
                          />
                          <FaSortDown
                            className={sortField === 'startDate' && sortDirection === 'desc' ? 'text-blue-500' : 'text-gray-500'}
                          />
                        </div>
                      </div>
                      </th>
                      <th className="px-6 py-3 text-left text-blue-800">
                      <div className="flex items-center gap-2">
                        <p className="hover:cursor-pointer"
                          onClick={() => handleSort('endDate')}
                        >
                          End Date
                        </p>
                        <div className="text-sm">
                          <FaSortUp
                            className={sortField === 'endDate' && sortDirection === 'asc' ? 'text-blue-500' : 'text-gray-500'}
                          />
                          <FaSortDown
                            className={sortField === 'endDate' && sortDirection === 'desc' ? 'text-blue-500' : 'text-gray-500'}
                          />
                        </div>
                      </div>
                      </th>
                      <th className="px-6 py-3 text-left text-blue-800">
                      <div className="flex items-center gap-2">
                        <p className="hover:cursor-pointer"
                          onClick={() => handleSort('duration')}
                        >
                        Duration
                        </p>
                        <div className="text-sm">
                          <FaSortUp
                            className={sortField === 'duration' && sortDirection === 'asc' ? 'text-blue-500' : 'text-gray-500'}
                          />
                          <FaSortDown
                            className={sortField === 'duration' && sortDirection === 'desc' ? 'text-blue-500' : 'text-gray-500'}
                          />
                        </div>
                      </div>
                      </th>
                      <th className="px-6 py-3 text-left text-blue-800">
                      <div className="flex items-center gap-2">
                        <p className="hover:cursor-pointer"
                          onClick={() => handleSort('problems')}
                        >
                          Total Problems
                        </p>
                        <div className="text-sm">
                          <FaSortUp
                            className={sortField === 'problems' && sortDirection === 'asc' ? 'text-blue-500' : 'text-gray-500'}
                          />
                          <FaSortDown
                            className={sortField === 'problems' && sortDirection === 'desc' ? 'text-blue-500' : 'text-gray-500'}
                          />
                        </div>
                      </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContests.map((contest, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-blue-800 cursor-pointer hover:scale-102" : "bg-blue-700 cursor-pointer hover:scale-102"}
                        onClick={() => handleContestDetailsClick(contest._id)}
                      >
                        <td className="px-6 py-4 text-blue-200">{contest.name}</td>
                        <td className="px-6 py-4 text-blue-200">
                          {new Date(contest.startDate).toLocaleString([], { month: '2-digit', day: '2-digit', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}
                        </td>
                        <td className="px-6 py-4 text-blue-200">
                          {new Date(contest.endDate).toLocaleString([], { month: '2-digit', day: '2-digit', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}
                        </td>
                        <td className="px-6 py-4 text-blue-200">
                          {formatDuration(contest.duration)}
                        </td>
                        <td className="px-6 py-4 text-blue-200">{contest.problems.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {showBtn && <div className="flex justify-center items-center mt-4">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                  >
                    Prev
                  </button>
                  <span className="mx-4 text-blue-800">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>}
              </div>

            </div>
          ) : (
            <div className="w-full bg-white h-screen flex justify-center items-center">
              <div className="w-5/6 bg-blue-200 max-w-xl p-6 rounded-xl shadow-lg flex flex-col items-center">
                <h1 className="text-4xl font-bold text-blue-900 mb-4">No Completed Contests Found</h1>
                <p className="text-lg text-blue-950 text-center">Participate in a contest to see it here!!</p>
              </div>
            </div>



          )}
        </section>
      )}
    </main>
  );
}

export default CompletedContest;