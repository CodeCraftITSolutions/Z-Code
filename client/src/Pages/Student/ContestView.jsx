
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ClipLoader from 'react-spinners/ClipLoader';
import CountDown from "./CountDown";
import { useSelector } from "react-redux";
import { backendUrl } from "../../../config";
import NotFoundPage from "../../Components/NotFoundPage";
import BackButton from "../../Components/BackButton";
import { toast } from "react-toastify";
import ContestNavBar from "./ContestNavBar";
import LeaderBoard from "./LeaderBoard";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "blue",
};

const difficultyMap = {
  1 : 'Easy',
  2 : 'Medium',
  3 : 'Hard'
}

const ContestView = () => {
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

  const [contest, setContest] = useState(null);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector(state => state.user);
  const [enr, setEnr] = useState({});
  const [totalGrade, setTotalGrade] = useState(0);
  const [notFound, setNotFound] = useState(false);
  const [duration, setDuration] = useState(0);
  const [shouldRender, setShouldRender] = useState(false);
  const [show, setShow] = useState(false);

  const fetchTotalGrade = async () => {
    try {
      if (user._id === undefined || id === undefined) return;
      const response = await axios.get(`${backendUrl}/api/submission/${user._id}/${id}/total-grade`);
      const data = response.data.totalGrade;
      setTotalGrade(data);
    } catch (error) {
      toast.error("Error fetching total grade:");
      console.log(error);
    }
  };

  const fetchCreatedTime = async () => {
    setLoading(true);
    try {
      if (user._id === undefined || contest._id === undefined) return;
      const res = await axios.get(`${backendUrl}/api/enrollment/time/${user._id}/${contest._id}`);
      const data = res.data;
      if (data) {
        setEnr(data.createdAt);
        setDuration(data.duration);
        setShouldRender(true);
      }
    } catch (err) {
      console.log(err);
      toast.error("Error fetching enrollment:");
      
    } finally {
      setLoading(false);
    }
  }

  const fetchProblemsDetails = async (selectedProblems) => {
    setLoading(true);
    try {

      const solvedStatuses = await Promise.all(
        selectedProblems.map(async (problem) => {
          if (user._id === undefined || problem === undefined || contest._id === undefined) return;
          const isSolvedResponse = await axios.get(`${backendUrl}/api/submission/is-solved/${user._id}/${problem}/${contest._id}`);
          return isSolvedResponse.data.isSolved;
        })
      );

      // Combine problem data with solved statuses
      const problemsWithStatus = problems.map((problem, index) => ({
        ...problem,
        solved: solvedStatuses[index]
      }));


      setProblems(problemsWithStatus);
    } catch (error) {
      toast.error("Error fetching problems:");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContest = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/contest/${id}`);
      const data = response.data;
      setContest(data.contest);
      setProblems(data.problems);
      // fetchProblemsDetails(data.problems);
    } catch (error) {
      toast.error("Error fetching contest:");
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchContest();
    }
  }, [id]);

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

  useEffect(() => {
    if (contest && contest.problems) {
      fetchProblemsDetails(contest.problems);
    }
  }, [contest]);


  const sendDraft = async (pid,uid,cid,codes) => {
    setLoading(true);
    try {
      const response = await axios.put(`${backendUrl}/api/draft/${pid}/${uid}/${cid}`, {
        codes
      });
    } catch (error) {
      toast.error('Error saving draft:');
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    if (user && contest) {
      fetchCreatedTime();
      fetchTotalGrade();
    }
  }, [user, contest]);

  const handleCancel = () => {
    navigate("/available");
  };

  const showLeader = ()=> {
    setShow(prev => !prev);
  }

  const onClose = () => {
    setShow(false);
  }

  

  return (
    notFound === false ?
      <div className="container mx-auto mt-10 ">
        <BackButton handleCancel = {handleCancel} />
        {shouldRender && (
          <div className="flex justify-center">
            <CountDown contestDuration={duration} enrollmentCreatedAt={enr} />
          </div>
        )}

        <ContestNavBar contestId = {id} showLeader = {showLeader} activeTab = {show}/>

        {loading ? (
          <div className="flex justify-center bg-blue-100 p-8 rounded-lg shadow-xl">
            <ClipLoader color="blue" loading={true} size={150} cssOverride={override} />
          </div>
        ) : contest && (
          show === true ?
          <LeaderBoard contest = {contest} onClose = {onClose} />
          :
          <div className="bg-blue-200 p-8 rounded-lg shadow-xl mt-10 ml-3 mr-3">
            <h2 className="text-3xl text-violet-800 font-bold mb-6">{contest.name}</h2>
            <div className="flex bg-blue-50 justify-between items-center mb-6">
              <div>
                <p className="text-red-800 p-2">Deadline:</p>
                <p className="text-red-500 p-2">
                  {new Date(contest.endDate).toLocaleString([], {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
                </p>
              </div>
              <div>
                <p className="text-blue-600 p-2">Duration:</p>
                <p className="text-blue-800 p-2">{formatDuration(contest.duration)}</p>
              </div>
              <div>
                <p className="text-blue-600 p-2">Total Grade:</p>
                <p className="text-blue-800 p-2">{parseFloat(totalGrade).toFixed(2)}</p>
              </div>
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {problems.map((problem, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md p-4 hover:bg-blue-100 transition duration-300 cursor-pointer"
                  onClick={() => navigate(`/contests/${id}/problems/${problem._id}`)}
                >
                  <header className="mb-4">
                    <h4 className="text-lg font-semibold text-violet-600">{problem.name}</h4>
                  </header>
                  <div className="text-gray-700 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-blue-600">{difficultyMap[problem.difficulty]}</span>
                      <span className="text-sm text-blue-600">Category: {problem.category}</span>
                      <span className="text-sm text-blue-600">Max Grade: {problem.grade}</span>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      className={`bg-${problem.solved ? 'green' : 'blue'}-500 text-white py-2 px-4 rounded-md`}
                      onClick={() => navigate(`/contests/${id}/problems/${problem._id}`)}
                    >
                      {problem.solved ? 'Solved' : 'Solve Problem'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      :
      <NotFoundPage />
  );
};

export default ContestView;