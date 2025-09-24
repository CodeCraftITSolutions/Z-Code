import "./App.css";
import Home from "./Pages/Home";
import Login from "./Components/Login";
import { Routes, Route } from "react-router-dom";
import MainSignup from "./Pages/Auth/MainSignup";
import ContactUs from "./Pages/ContactUs";
import Register from "./Components/Register";
import Reset from "./Pages/Auth/Reset";
import Forgot from "./Pages/Auth/Forgot";
import LecturerDashBoard from "./Pages/Lecturer/LecturerDashBoard";
import StudentDashboard from "./Pages/Student/StudentDashboard";
import AdminDashBoard from "./Pages/Admin/AdminDashBoard";
import AvailableContest from "./Pages/Student/AvailableContest";
import CompletedContest from "./Pages/Student/CompletedContest";
import StudentProfile from "./Pages/Student/StudentProfile";
import Practice from "./Pages/Student/Practice";
import LecturerProfile from "./Pages/Lecturer/LecturerProfile";
import QuestionBank from "./Pages/Lecturer/QuestionBank";
import RequireAuth from "./Components/RequireAuth";
import EditStudentProfile from "./Pages/Student/EditStudentProfile";
import ManageLecturers from "./Pages/Admin/ManageLecturers";
import Mycomponent from "./Components/Mycomponent";
import axios from "axios";
import useFetchUser from "./hooks/fetchUser";
axios.defaults.withCredentials = true;
import Contest from "./Pages/Lecturer/Contest";
import ManageStudents from "./Pages/Admin/ManageStudents";
import AdminProfile from "./Pages/Admin/AdminProfile";
import AddContest from "./Pages/Lecturer/AddContest";
import ContestDetails from "./Pages/Lecturer/ContestDetails";
import AddProblem from "./Pages/Lecturer/AddProblem";
import CodingEditor from "./Components/CodingEditor";
import CodeEditor from "./Components/CodeEditor";
import ContestView from "./Pages/Student/ContestView";
import Layout from "./Components/Layout";
import ErrorComponent from "./Components/ErrorComponent";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "./Components/Loading";
import SearchProblems from "./Components/SearchProblems";
import RegForm from "./Components/RegForm";
import Notify from "./Components/Notify";

function App() {
  const { loading, error } = useFetchUser();

  if (error) {
    console.log(error);
    return <ErrorComponent message="Failed to fetch user data" />; // Conditionally render the error component
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Routes>
        <Route
          element={<RequireAuth allowedRoles={["student"]} redirectTo="/" />}
        >
          <Route element={<Layout bgColor="blue" />}>
            <Route path="/dashboard_std" element={<StudentDashboard />} />
            <Route path="/available" element={<AvailableContest />} />
            <Route path="/completed" element={<CompletedContest />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/profile_std" element={<StudentProfile />} />
            <Route path="/profile_std/edit" element={<EditStudentProfile />} />
          </Route>
          <Route
            path="/contests/:contestId/problems/:problemId"
            element={<CodeEditor />}
          />
          <Route path="/contestview/:id" element={<ContestView />} />
          <Route path="/problems/:problemId" element={<CodeEditor />} />
        </Route>

        <Route
          element={<RequireAuth allowedRoles={["lecturer"]} redirectTo="/" />}
        >
          <Route element={<Layout bgColor="violet" isLecturer={true} />}>
            <Route path="/dashboard_lec" element={<LecturerDashBoard />} />
            <Route path="/qbank" element={<QuestionBank />} />
            <Route path="/profile_lec" element={<LecturerProfile />} />
            <Route path="/contest" element={<Contest />} />
            <Route path="/addcontest" element={<AddContest />} />
            <Route path="/editcontest/:id" element={<AddContest />} />
            <Route path="/contest/:id" element={<ContestDetails />} />
            <Route path="/problem" element={<QuestionBank />} />
            <Route path="/addproblem" element={<AddProblem />} />
            <Route path="/editproblem/:id" element={<AddProblem />} />
          </Route>
        </Route>

        <Route
          element={<RequireAuth allowedRoles={["admin"]} redirectTo="/" />}
        >
          <Route path="/admin" element={<AdminDashBoard />} />
          <Route path="/managelecturer" element={<ManageLecturers />} />
          <Route path="/managestudent" element={<ManageStudents />} />
          <Route path="/adminprofile" element={<AdminProfile />} />
        </Route>

        <Route>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<MainSignup />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset/:token" element={<Reset />} />
          <Route path="/forgotpassword" element={<Forgot />} />
          <Route path="/googleauth" element={<RegForm />} />

          <Route path="/user" element={<Mycomponent />} />
        </Route>
      </Routes>

      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition:Bounce
      />
    </>
  );
}

export default App;
