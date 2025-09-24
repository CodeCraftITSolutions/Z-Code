import React, { useState, useEffect } from "react";
import Header from "../../Sections/Header";
import SidebarAdmin from "../../Sections/SidebarAdmin";
import { FaSearch, FaEdit, FaTrash, FaAdjust, FaToggleOff, FaToggleOn, FaSortUp, FaSortDown } from "react-icons/fa";
import ClipLoader from "react-spinners/ClipLoader";
import { CSSProperties } from "react";
import { backendUrl } from "../../../config";
import io from 'socket.io-client';
import { toast } from "react-toastify";
import axios from "axios";


const socket = io(backendUrl);


const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const ManageLecturers = () => {

  const studentsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [showSearch, setShowSearch] = useState(false);
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [lecturerToDelete, setLecturerToDelete] = useState(null);
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [name, setName] = useState('')
  const [totalStudents, setTotalStudents] = useState(0);
  const [showBtn, setShowBtn] = useState(false);
  const [showStudent, setShowStudent] = useState(true);
  const [totalPages, setTotalPages] = useState(0)


  useEffect(() => {
    const total = Math.ceil(totalStudents / studentsPerPage)

    if (total === 0) return
    setTotalPages(total);
    if (total > 1) {
      setShowBtn(true)
    }
    else {
      setShowBtn(false)
    }
    if (currentPage > total) {
      setCurrentPage(1)
    }
  }, [totalStudents, showBtn, currentPage])

  useEffect(() => {

    if (showStudent) {
      fetchLecturers(currentPage, sortField, sortOrder)
      return
    }
    if (showSearch) {
      fetchSeachedLecturers(currentPage, sortField, sortOrder)
      return
    }
  }, [showSearch, currentPage, showStudent, sortField, sortOrder]);



  // useEffect(() => {
  //   fetchLecturers(sortField, sortOrder);
  // }, [sortField, sortOrder]);

  useEffect(() => {
    if (name !== "") return
    setShowStudent(true)
    setShowSearch(false)
  }, [name])



  useEffect(() => {
    fetchLecturers();
    socket.on('lecturercreated', () => {
      toast.success('New lecturer added');
      fetchLecturers();
    });
    socket.on('lecturerupdated', () => {
      fetchLecturers();
    });
    return () => {
      socket.off('lecturercreated');
      socket.off('lecturerupdated');
    };
  }, []);



  const fetchLecturers = async (page,sortField, sortOrder) => {
    setLoading(true); // Set loading to true when fetching data
    try {
      const response = await axios.get(`${backendUrl}/api/lecturer`,

        {
          params: {
            page: page,
            limit: studentsPerPage,
            sortField,
            sortOrder
          },
        }

      );
      if (response.status === 200) {
        setLecturers(response.data.lecturers);
        setTotalStudents(response.data.total);

      }
    }
    catch (error) {
      console.log(error);
      toast.error(error);
    }
    finally {
      setLoading(false);
    }
  };

  const fetchSeachedLecturers = async (page, sortField, sortOrder) => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/lecturer/search`, {
        params: {
          name,
          page: page,
          limit: studentsPerPage,
          sortField,
          sortOrder
        }
      });
      if (response.status === 200) {
        setLecturers(response.data.lecturers);
        setTotalStudents(response.data.total);
      }
    }
    catch (error) {
      console.error(error);
    }
    finally {
      setLoading(false);
    }
  }



  const toggleApprovalStatus = async (id, isApproved, email) => {
    setLoading(true); // Set loading to true when updating data
    try {
      const response = await fetch(`${backendUrl}/api/lecturer/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, isApproved: !isApproved }),
      });
      if (response.ok) {
        // If successful, update the local state
        fetchLecturers();
      } else {
        throw new Error('Failed to update approval status');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Set loading to false when data updating is done
    }
  };
  const deleteLecturer = async (lecturerId) => {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/lecturer/${lecturerId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete lecturer");
      }
      // Remove the deleted lecturer from the state
      setLecturers((prevLecturers) =>
        prevLecturers.filter((lecturer) => lecturer._id !== lecturerId)
      );
    } catch (error) {
      console.error("Error deleting lecturer:", error);
    }
    finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirmation = (lecturerId) => {
    setLecturerToDelete(lecturerId);
    setShowConfirmation(true);
  };

  const handleConfirmDelete = () => {
    if (lecturerToDelete) {
      deleteLecturer(lecturerToDelete);
      setLecturerToDelete(null);
      setShowConfirmation(false);
    }
  };

  const handleCancelDelete = () => {
    setLecturerToDelete(null);
    setShowConfirmation(false);
  };

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);
  }

  const handleNext = () => {
    if (currentPage !== totalPages) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentPage !== 1) {
      setCurrentPage((prev) => prev - 1)

    }
  }



  const handleChange = (e) => {
    setName(e.target.value)
  }


  const handleClick = () => {
    if (name === "") return
    setShowSearch(true)
    fetchSeachedLecturers(currentPage)
    setShowStudent(false)
  }



  return (
    <main className="w-full h-screen flex justify-between items-start bg-green-100">
      <SidebarAdmin />
      {
        loading ? (

          <div className="w-full flex justify-center items-center h-screen">
            <ClipLoader
              color="green"
              loading={true}
              size={150}
              css={override}
            />
          </div>

        )
          :

          <section className="w-4/5 grow bg-green-100 h-screen overflow-y-auto flex flex-col justify-start items-center gap-4 p-4">
            <Header bgColor="green" />
            <div className="w-full max-w-screen-lg mx-auto flex flex-col md:flex-row items-center mt-6 space-y-4 md:space-y-0 md:space-x-4">
  <div className="relative flex-grow w-full md:w-auto">
    <input
      type="text"
      placeholder="Search..."
      className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
      value={name}
      onChange={handleChange}
      disabled={loading}
    />
    <FaSearch className="absolute top-3 left-3 text-gray-400" />
  </div>
  <div className="w-full md:w-auto">
    <button
      className="w-full md:w-auto bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center"
      onClick={handleClick}
    >
      <FaSearch className="mr-2" />
      Search
    </button>
  </div>
</div>

            <div className="w-full p-6 bg-green-100 rounded-xl shadow-lg flex flex-col items-center mt-8">
              <div className="overflow-x-auto w-full">
                <table className="w-full">
                  <thead>
                    <tr className="bg-green-200">
                      {/* <th className="px-6 py-3 text-left text-green-800">Name</th>
                  <th className="px-6 py-3 text-left text-green-800">Email</th> */}
                      <th className="px-2 md:px-6 py-3 text-left text-green-800">
                        <div className="flex items-center gap-2">
                          <p className="hover:cursor-pointer"
                            onClick={() => handleSort('createdAt')}
                          >
                            Date
                          </p>
                          <div className="text-sm">
                            <FaSortUp
                              className={sortField === 'createdAt' && sortOrder === 'asc' ? 'text-green-500' : 'text-gray-500'}
                            />
                            <FaSortDown
                              className={sortField === 'createdAt' && sortOrder === 'desc' ? 'text-green-500' : 'text-gray-500'}
                            />
                          </div>
                        </div>


                      </th>

                      <th className="px-2 md:px-6 py-3 text-left text-green-800">
                        <div className="flex items-center gap-2">
                          <p className="hover:cursor-pointer"
                            onClick={() => handleSort('username')}
                          >
                            Name
                          </p>
                          <div className="text-sm">
                            <FaSortUp
                              className={sortField === 'username' && sortOrder === 'asc' ? 'text-green-500' : 'text-gray-500'}
                            />
                            <FaSortDown
                              className={sortField === 'username' && sortOrder === 'desc' ? 'text-green-500' : 'text-gray-500'}
                            />
                          </div>
                        </div>


                      </th>

                      <th className="px-2 md:px-6 py-3 text-left text-green-800">
                        <div className="flex items-center gap-2">
                          <p className="hover:cursor-pointer"
                            onClick={() => handleSort('email')}
                          >
                            Email
                          </p>
                          <div className="text-sm">
                            <FaSortUp
                              className={sortField === 'email' && sortOrder === 'asc' ? 'text-green-500' : 'text-gray-500'}
                            />
                            <FaSortDown
                              className={sortField === 'email' && sortOrder === 'desc' ? 'text-green-500' : 'text-gray-500'}
                            />
                          </div>
                        </div>


                      </th>
                      <th className="px-2 md:px-6 py-3 text-left text-green-800">
                        <div className="flex items-center gap-2">
                          <p className="hover:cursor-pointer"
                            onClick={() => handleSort('isApproved')}
                          >
                            Status
                          </p>
                          <div className="text-sm">
                            <FaSortUp
                              className={sortField === 'isApproved' && sortOrder === 'asc' ? 'text-green-500' : 'text-gray-500'}
                            />
                            <FaSortDown
                              className={sortField === 'isApproved' && sortOrder === 'desc' ? 'text-green-500' : 'text-gray-500'}
                            />
                          </div>
                        </div>


                      </th>
                      {/* <th className="px-6 py-3 text-left text-green-800">Status</th> */}
                      <th className="px-6 py-3 text-left text-green-800">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lecturers.map((lecturer, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-green-800" : "bg-green-700"}>
                        <td className="px-6 py-4 text-green-200 text-xs">
                          {`${new Date(lecturer.createdAt).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })} ${new Date(lecturer.createdAt).toLocaleTimeString('en-GB', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                          })}`}
                        </td>
                        <td className="px-6 py-4 text-green-200">{lecturer.username}</td>
                        <td className="px-6 py-4 text-green-200">{lecturer.email}</td>
                        <td className="px-6 py-4 text-green-200">{lecturer.isApproved ? "Active" : "Inactive"}</td>
                        <td className="px-6 py-4 flex">
                          :
                          {lecturer.isApproved ?
                            <FaToggleOn
                              className="mr-4 text-green-500 hover:text-green-600 cursor-pointer"
                              onClick={() => toggleApprovalStatus(lecturer._id, lecturer.isApproved, lecturer.email)}
                              disabled={loading}
                              title="Click to deactivate"
                            /> :
                            <FaToggleOff
                              className="mr-4 text-green-500 hover:text-green-600 cursor-pointer"
                              onClick={() => toggleApprovalStatus(lecturer._id, lecturer.isApproved, lecturer.email)}
                              disabled={loading}
                              title="Click to activate"

                            />}


                          <FaTrash
                            className="text-red-500 hover:text-red-600 cursor-pointer"
                            onClick={() => handleDeleteConfirmation(lecturer._id)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {showBtn && (
              <div className="w-full flex flex-col md:flex-row justify-center gap-2 md:gap-6 items-center mt-4">
                <button
                  onClick={handlePrev}
                  className="px-3 py-2 md:px-4 md:py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
                <span className="text-green-800 font-semibold text-sm md:text-base">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNext}
                  className="px-3 py-2 md:px-4 md:py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
            </div>
          </section>}
      {showConfirmation && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow">
            <p className="mb-4">Are you sure you want to delete this lecturer?</p>
            <div className="flex justify-end">
              <button className="bg-red-500 text-white px-4 py-2 mr-2 rounded" onClick={handleConfirmDelete}>Delete</button>
              <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded" onClick={handleCancelDelete}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ManageLecturers;