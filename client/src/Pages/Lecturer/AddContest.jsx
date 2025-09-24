import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SyncLoader from 'react-spinners/MoonLoader';
import { backendUrl } from "../../../config";
import { useSelector } from "react-redux";
import AddProblem from "./AddProblem";
import { FaSearch, FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import ViewProblem from "./ViewProblem";
import SelectProblems from "./SelectProblems";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const AddContest = ({ onAdd }) => {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [durationDays, setDurationDays] = useState(0);
  const [durationHours, setDurationHours] = useState(0);
  const [durationMinutes, setDurationMinutes] = useState(0);
  const [selectedProblems, setSelectedProblems] = useState([]);
  const [showAddProblem, setShowAddProblem] = useState(false);
  const [showViewProblem, setShowViewProblem] = useState(false);
  const [activeProblemId, setActiveProblemId] = useState(false);
  const [showSelections, setShowSelections] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false)
  const [disabled_btn, setDisabled_btn] = useState(false)

  const user = useSelector(state => state.user);


  const fetchContestById = async (contestId) => {
    setLoading(true)
    try {
      const response = await axios.get(`${backendUrl}/api/contest/${contestId}`);
      const contest = response.data.contest;
      const { name, startDate, endDate, duration, problems } = contest;
      setName(name);
      setStartDate(formatDate(startDate)); // Format the date
      setEndDate(formatDate(endDate)); // Format the date
      setDurationDays(Math.floor(duration / (24 * 60)));
      setDurationHours(Math.floor((duration % (24 * 60)) / 60));
      setDurationMinutes(duration % 60);
      setSelectedProblems(response.data.problems);
    } catch (error) {
      toast.error("Error fetching contest details:", error);
    }
    finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    if (id) {
      fetchContestById(id);
    }
  }, [id])

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleProblemSelection = (problem) => {
    const isSelected = selectedProblems.includes(problem);
    if (isSelected) {
      return;
    } else {
      setSelectedProblems([...selectedProblems, problem]);
    }
  };


  const handleSubmit = async (e) => {

    e.preventDefault();
    setDisabled_btn(true)
    // Validation can be added here if needed
    if (!name || !startDate || !endDate || (!durationDays && !durationHours && !durationMinutes)) {
      toast.error("Please fill in all fields");
      setTimeout(() => {
        setDisabled_btn(false)
      }, 1000)
      return;
    }

    if (selectedProblems.length === 0) {
      toast.error("Please add problems");
      setTimeout(() => {
        setDisabled_btn(false)
      }, 1000)
      return;
    }

    const totalDurationMinutes = (parseInt(durationDays) * 24 * 60) + (parseInt(durationHours) * 60) + parseInt(durationMinutes);

    // Ensure end date is after start date
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end <= start) {
      toast.error("End date must be after start date. Please reselect the dates.");
      setTimeout(() => {
        setDisabled_btn(false)
      }, 1000)
      return;
    }

    // Calculate the difference between start and end dates in minutes
    const durationDifference = Math.floor((end - start) / 60000);

    // Ensure duration is less than or equal to the difference between end date and start date
    if (totalDurationMinutes > durationDifference) {
      toast.error("The specified duration is longer than the time between the start and end dates. Please adjust the duration.");
      setTimeout(() => {
        setDisabled_btn(false)
      }, 1000)
      return;
    }
    // Create new contest object
    const newContest = {
      name,
      startDate,
      endDate,
      duration: totalDurationMinutes,
      problems: selectedProblems,
      createdBy: user._id
    };

    try {
      if (id) {
        await axios.put(`${backendUrl}/api/contest/${id}`, newContest);
      } else {
        await axios.post(`${backendUrl}/api/contest`, newContest);
      }
      toast.success("Contest saved successfully");
      navigate("/contest");
    } catch (error) {
      toast.error("Failed to save contest");
    }

    finally {
      setDisabled_btn(false)
    }



    setName("");
    setStartDate("");
    setEndDate("");
    setDurationDays(0);
    setDurationHours(0);
    setDurationMinutes(0);

    navigate("/contest")
  };

  const handleMinutesChange = (e) => {
    const minutes = e.target.value;
    if (minutes === "" || (!isNaN(minutes) && parseInt(minutes) >= 0)) {
      if (minutes === "" || parseInt(minutes) < 60) {
        setDurationMinutes(minutes);
      } else {
        const hours = parseInt(durationHours) + Math.floor(parseInt(minutes) / 60);
        const remainingMinutes = parseInt(minutes) % 60;
        setDurationHours(hours.toString());
        const days = parseInt(durationDays) + Math.floor(parseInt(hours) / 24);
        const remainingHours = parseInt(hours) % 24;
        setDurationDays(days.toString());
        setDurationHours(remainingHours.toString());
        setDurationMinutes(remainingMinutes.toString());
      }
    }
  };

  const handleHoursChange = (e) => {
    const hours = e.target.value;
    if (hours === "" || (!isNaN(hours) && parseInt(hours) >= 0)) {
      if (hours === "" || parseInt(hours) < 24) {
        setDurationHours(hours);
      } else {
        const days = parseInt(durationDays) + Math.floor(parseInt(hours) / 24);
        const remainingHours = parseInt(hours) % 24;
        setDurationDays(days.toString());
        setDurationHours(remainingHours.toString());
      }
    }
  };

  const handleAddProblem = (e) => {
    e.preventDefault();
    setShowAddProblem(true);
  };

  const handleCloseAddProblem = () => {
    setShowAddProblem(false);
  };

  const handleDeleteProblem = (problem) => {
    const newProblems = selectedProblems.filter(p => p._id !== problem._id)
    setSelectedProblems(newProblems)
  }

  const handleViewProblem = (problem) => {

    setActiveProblemId(problem._id);
    setShowViewProblem(true)

  }

  const handleCloseViewProblem = () => {
    setShowViewProblem(false);
  };

  const handleShowSelection = () => {
    setShowSelections(true)
  }

  const handleCloseShowSelections = () => {
    setShowSelections(false);
  };

  const addSelections = (problems) => {
    const filteredProblems = problems.filter(problem => (
      !selectedProblems.some(selectedProblem => selectedProblem._id === problem._id)
    ));
    setSelectedProblems([...selectedProblems, ...filteredProblems])
  }



  if (showAddProblem) {
    return <AddProblem onClose={handleCloseAddProblem} onSelection={handleProblemSelection} isContest={true} />
  }

  if (showViewProblem) {
    return <ViewProblem onClose={handleCloseViewProblem} id={activeProblemId} />
  }

  if (showSelections) {
    return <SelectProblems onClose={handleCloseShowSelections} addSelection={addSelections} />
  }

  return (
    <main className="w-full h-screen flex justify-between items-start bg-white text-xs md:text-base">
      <section className="w-full lg:w-4/5 bg-white  flex-grow flex flex-col justify-start items-center p-4">
        <div className="w-full lg:max-w-full mx-auto p-6 rounded-xl flex flex-col items-center mt-20">
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
            <div className="flex justify-between space-x-4">
              <button
                type="button"
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center"
                onClick={() => navigate('/contest')}
              >
                Cancel
              </button>
              <button
                disabled={disabled_btn}
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
              >
                {id ? "Save Changes" : "Add Contest"}
              </button>
            </div>
            <div className="mb-4">
              <label htmlFor="name" className="block text-violet-800 mb-2 font-semibold">Name:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter contest name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="startDate" className="block text-violet-800 mb-2 font-semibold">Start Date:</label>
              <input
                type="datetime-local"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="endDate" className="block text-violet-800 mb-2 font-semibold">End Date:</label>
              <input
                type="datetime-local"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div className="mb-4 flex justify-between space-x-4">
              <div>
                <label htmlFor="durationDays" className="block text-violet-800 mb-2 font-semibold">Days:</label>
                <input
                  type="number"
                  id="durationDays"
                  value={durationDays}
                  onChange={(e) => setDurationDays(e.target.value)}
                  placeholder="Days"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label htmlFor="durationHours" className="block text-violet-800 mb-2 font-semibold">Hours:</label>
                <input
                  type="number"
                  id="durationHours"
                  value={durationHours}
                  onChange={handleHoursChange}
                  placeholder="Hours"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label htmlFor="durationMinutes" className="block text-violet-800 mb-2 font-semibold">Minutes:</label>
                <input
                  type="number"
                  id="durationMinutes"
                  value={durationMinutes}
                  onChange={handleMinutesChange}
                  placeholder="Minutes"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>
            <div className="mb-6">
              <h3 className="block text-violet-800 mb-2 font-semibold">Problems</h3>
              <div className="flex flex-col md:flex-row justify-center items-center  gap-4 mb-4 text-sm">
                <button
                  type="button"
                  className="w-full px-4 py-2 bg-violet-500 text-white font-semibold rounded-md shadow-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-violet-500 hover:bg-violet-600"
                  onClick={handleShowSelection}
                >
                  Select from Question Bank
                </button>
                <span className="text-center text-violet-800 font-semibold">Or</span>


                <button
                  type="button"
                  className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-blue-600"
                  onClick={handleAddProblem}
                >
                  <FaPlus className="mr-2" /> Add Manually
                </button>

              </div>
              {selectedProblems.map((problem, index) => (
                <div key={index} className="w-full bg-white border border-violet-500 rounded-md p-4 mb-2 flex justify-between items-center">
                  <div className="flex flex-col">
                    <h1 className="text-2xl font-bold text-violet-800"> {problem.name}</h1>
                    <div className="text-sm text-gray-500 mt-1">
                      <p>Difficulty: {problem.difficulty}</p>
                      <p>Grade: {problem.grade}</p>
                      <p>Category: {problem.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      className="text-blue-500 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mr-2"
                      onClick={() => handleViewProblem(problem)}
                    >
                      <FaEye />
                    </button>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      onClick={() => handleDeleteProblem(problem)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>


          </form>
        </div>
      </section>
      {loading && (
        <div className="fixed inset-0 bg-black opacity-80 flex justify-center items-center">
          <SyncLoader color="red" loading={true} size={80} />
        </div>
      )}
    </main>

  );
};

export default AddContest;