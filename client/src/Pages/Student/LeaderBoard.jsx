import React, { useState, useEffect } from "react";
import { backendUrl } from "../../../config";
import SyncLoader from "react-spinners/ClipLoader";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import { FaSortDown, FaSortUp } from "react-icons/fa";



const LeaderBoard = ({ contest, onClose }) => {

  const [showSearch, setShowSearch] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState('totalGrade'); // Sorting field
  const [sortOrder, setSortOrder] = useState('desc'); // Sorting order
  const [name, setName] = useState('')
  const [showStudent, setShowStudent] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);


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


  const fetchStudents = async (sortField, sortOrder) => {
    console.log("fetching students",sortField,sortOrder)
    try {
      const response = await axios.get(`${backendUrl}/api/enrollment/contest/${contest._id}/enrolled-students-grades`, {
        params: {
          sortField,
          sortOrder
        },
      });
      const data = response.data;
      setStudents(data.studentsWithGrades);
      setFilteredStudents(data.studentsWithGrades);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };





  useEffect(() => {
    // Fetch data initially based on the conditions'
    if (showStudent) {
      setLoading(true);
      fetchStudents(sortField, sortOrder);
    } 

    // Set an interval to fetch data every 5000 ms (5 seconds)
    const interval = setInterval(() => {
      if (showStudent) {
        fetchStudents(sortField, sortOrder);
      } 
    }, 5000);

    // Clear the interval when the component unmounts or when dependencies change
    return () => clearInterval(interval);
  }, [contest._id, showStudent, sortField, sortOrder]);


  useEffect(() => {
    if (searchQuery !== "") {
      setShowStudent(false)
      handleSearchChange(searchQuery);
      return
    }
    setShowStudent(true)
  }, [searchQuery])



  const handleSearchChange = (searchQuery) => {

      const searchResults = students.filter((student) =>
        student.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.regNo.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStudents(searchResults);
    
  };


  const handleSort = (field) => {
    setLoading(true);
    const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);
  }




  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-100 opacity-50 flex justify-center items-center">
        <SyncLoader color="red" loading={true} size={120} cssOverride={{ display: "block", margin: "0 auto", borderColor: "red" }} />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  let currentTimestamp = new Date().getTime();

  return (

 
    <div className="container mx-auto mt-10 p-10">
    <div className="w-full max-w-screen-lg mx-auto flex flex-col md:flex-row items-center mt-6 space-y-4 md:space-y-0 md:space-x-4">
      <div className="relative flex-grow w-full md:w-auto">
        <input
          type="text"
          placeholder="Search..."
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FaSearch className="absolute top-3 left-3 text-gray-500" />
      </div>
    </div>
  
    {filteredStudents && filteredStudents.length > 0 ? (
      <>
        <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mb-4 text-center text-blue-800 my-10">Leaderboard</h2>
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md mt-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-blue-800">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleSort('totalGrade')}>
                  <p>Rank</p>
                  <div className="text-sm">
                    <FaSortUp className={sortField === 'totalGrade' && sortOrder === 'desc' ? 'text-blue-500' : 'text-gray-500'} />
                    <FaSortDown className={sortField === 'totalGrade' && sortOrder === 'asc' ? 'text-blue-500' : 'text-gray-500'} />
                  </div>
                </div>
              </th>
              <th className="px-4 py-3 text-left text-blue-800">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleSort('username')}>
                  <p>Name</p>
                  <div className="text-sm">
                    <FaSortUp className={sortField === 'username' && sortOrder === 'asc' ? 'text-blue-500' : 'text-gray-500'} />
                    <FaSortDown className={sortField === 'username' && sortOrder === 'desc' ? 'text-blue-500' : 'text-gray-500'} />
                  </div>
                </div>
              </th>
              <th className="px-4 py-3 text-left text-blue-800">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleSort('regNo')}>
                  <p>Reg No</p>
                  <div className="text-sm">
                    <FaSortUp className={sortField === 'regNo' && sortOrder === 'asc' ? 'text-blue-500' : 'text-gray-500'} />
                    <FaSortDown className={sortField === 'regNo' && sortOrder === 'desc' ? 'text-blue-500' : 'text-gray-500'} />
                  </div>
                </div>
              </th>
              <th className="px-4 py-3 text-left text-blue-800">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleSort('totalGrade')}>
                  <p>Grade</p>
                  <div className="text-sm">
                    <FaSortUp className={sortField === 'totalGrade' && sortOrder === 'asc' ? 'text-blue-500' : 'text-gray-500'} />
                    <FaSortDown className={sortField === 'totalGrade' && sortOrder === 'desc' ? 'text-blue-500' : 'text-gray-500'} />
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.regNo} className="even:bg-gray-50 transition duration-200 hover:bg-gray-100">
                <td className="py-2 px-4 border-b text-sm md:text-md lg:text-lg">{student.rank}</td>
                <td className="py-2 px-4 border-b text-sm md:text-md lg:text-lg">{student.username}</td>
                <td className="py-2 px-4 border-b text-sm md:text-md lg:text-lg">{student.regNo}</td>
                <td className="py-2 px-4 border-b text-sm md:text-md lg:text-lg font-bold text-right">{student.totalGrade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    ) : (
      <p className="text-center text-lg mt-4">No students found</p>
    )}
  </div>
  




  );
};

export default LeaderBoard;