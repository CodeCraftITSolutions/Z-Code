import React, { useState, useEffect } from "react";
import { backendUrl } from "../../../config";
import SyncLoader from "react-spinners/ClipLoader";
import axios from "axios";
import GeneratePdf from "./GeneratePdf";
import { FaSearch } from "react-icons/fa";
import { FaSortDown, FaSortUp } from "react-icons/fa";



const ViewProgress = ({ contest, onClose }) => {

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
    <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center justify-center text-xs md:text-sm lg:text:md">
      <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 bg-white shadow-md rounded-lg">
        <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mb-4 text-center">Live Student Progress for the Contest {contest.name}</h2>
        <div className="flex justify-around items-center my-10 sm:my-4">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={onClose}
          >
            Back
          </button>
          <GeneratePdf contest={contest} />

        </div>
        <div className="mb-6">

          {/* <p className="text-sm md:text-md lg:text-lg"><strong>Contest Name:</strong> {contest.name}</p> */}
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3  justify-between sm:gap-2 gap-6 mt-4">
            <p className="text-sm md:text-md lg:text-lg">
              <strong>Start Date:</strong> {new Date(contest.startDate).toLocaleString([], { month: "2-digit", day: "2-digit", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true })}
            </p>
            <p className="text-sm md:text-md lg:text-lg">
              <strong>Duration:</strong> {formatDuration(contest.duration)}
            </p>
            <p className="text-sm md:text-md lg:text-lg">
              <strong>End Date:</strong> {new Date(contest.endDate).toLocaleString([], { month: "2-digit", day: "2-digit", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true })}
            </p>
          </div>
          <p className="text-sm md:text-md lg:text-lg text-center my-10">
            {currentTimestamp <= new Date(contest.endDate).getTime() ? (
              <span className="text-green-600">Contest is live</span>
            ) : (
              <span className="text-red-600">Contest has ended</span>
            )}
          </p>
        </div>


        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map((student) => (
          <div key={student.regNo} className="p-4 border rounded-lg shadow-sm bg-gray-50">
            <div className="flex flex-col justify-between h-full">
              <div>
                <h3 className="text-sm md:text-md lg:text-lg font-semibold">{student.username}</h3>
                <p className="text-gray-600">Reg No: {student.regNo}</p>
              </div>
              <div className="text-right mt-4">
                <p className="text-sm md:text-md lg:text-lg font-bold">{student.totalGrade}</p>
                <p className="text-gray-500">Total Grade</p>
              </div>
            </div>
          </div>
        ))}
      </div> */}
       
          <div className="overflow-x-auto">
            <div className="w-full max-w-screen-lg mx-auto flex flex-col md:flex-row items-center mt-6 space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative flex-grow w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                onChange={(e)=> setSearchQuery(e.target.value)}
                />
                <FaSearch className="absolute top-3 left-3 text-gray-400" />
              </div>
              {/* <div className="w-full md:w-auto">
                <button
                  className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
                  onClick={handleClick}
                >
                  <FaSearch className="mr-2" />
                  Search
                </button>
              </div> */}
            </div>
            {filteredStudents && filteredStudents.length > 0 ?
            <>
            <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mb-4 text-center">Students Progress</h2>
            <table className="min-w-full bg-white border rounded-lg shadow-sm">
              <thead>
                <tr>
                  {/* <th className="py-2 px-4 border-b text-left text-sm md:text-md lg:text-lg font-semibold text-gray-700">Username</th>
        <th className="py-2 px-4 border-b text-left text-sm md:text-md lg:text-lg font-semibold text-gray-700">Reg No</th>
        <th className="py-2 px-4 border-b text-left text-sm md:text-md lg:text-lg font-semibold text-gray-700">Total Grade</th> */}
                  <th className="px-2 md:px-6 py-3 text-left text-blue-800">
                    <div className="flex items-center gap-2">
                      <p className="hover:cursor-pointer"
                        onClick={() => handleSort('totalGrade')}
                      >
                        Rank
                      </p>
                      <div className="text-sm">
                        <FaSortUp
                          className={sortField === 'totalGrade' && sortOrder === 'desc' ? 'text-blue-500' : 'text-gray-500'}
                        />
                        <FaSortDown
                          className={sortField === 'totalGrade' && sortOrder === 'asc' ? 'text-blue-500' : 'text-gray-500'}
                        />
                      </div>
                    </div>


                  </th>

                  <th className="px-2 md:px-6 py-3 text-left text-blue-800">
                    <div className="flex items-center gap-2">
                      <p className="hover:cursor-pointer"
                        onClick={() => handleSort('username')}
                      >
                        Name
                      </p>
                      <div className="text-sm">
                        <FaSortUp
                          className={sortField === 'username' && sortOrder === 'asc' ? 'text-blue-500' : 'text-gray-500'}
                        />
                        <FaSortDown
                          className={sortField === 'username' && sortOrder === 'desc' ? 'text-blue-500' : 'text-gray-500'}
                        />
                      </div>
                    </div>


                  </th>
                  <th className="px-2 md:px-6 py-3 text-left text-blue-800">
                    <div className="flex items-center gap-2">
                      <p className="hover:cursor-pointer"
                        onClick={() => handleSort('regNo')}
                      >
                        Reg No
                      </p>
                      <div className="text-sm">
                        <FaSortUp
                          className={sortField === 'regNo' && sortOrder === 'asc' ? 'text-blue-500' : 'text-gray-500'}
                        />
                        <FaSortDown
                          className={sortField === 'regNo' && sortOrder === 'desc' ? 'text-blue-500' : 'text-gray-500'}
                        />
                      </div>
                    </div>


                  </th>
                  <th className="px-2 md:px-6 py-3 text-left text-blue-800">
                    <div className="flex items-center gap-2">
                      <p className="hover:cursor-pointer"
                        onClick={() => handleSort('totalGrade')}
                      >
                        Grade
                      </p>
                      <div className="text-sm">
                        <FaSortUp
                          className={sortField === 'totalGrade' && sortOrder === 'asc' ? 'text-blue-500' : 'text-gray-500'}
                        />
                        <FaSortDown
                          className={sortField === 'totalGrade' && sortOrder === 'desc' ? 'text-blue-500' : 'text-gray-500'}
                        />
                      </div>
                    </div>


                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student,index) => (
                  <tr key={student.regNo} className="even:bg-gray-50">
                    <td className="py-2 px-4 border-b text-sm md:text-md lg:text-lg">{student.rank}</td>
                    <td className="py-2 px-4 border-b text-sm md:text-md lg:text-lg">{student.username}</td>
                    <td className="py-2 px-4 border-b text-sm md:text-md lg:text-lg">{student.regNo}</td>
                    <td className="py-2 px-4 border-b text-sm md:text-md lg:text-lg font-bold text-right">{student.totalGrade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </>
            :
            <p className="text-center text-lg">No students found</p>
            }
        
          </div>




      </div>
    </div>
  );
};

export default ViewProgress;