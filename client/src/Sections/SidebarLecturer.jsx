import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MdDashboard, MdSchool, MdLogout } from "react-icons/md";
import { RiQuestionAnswerFill } from "react-icons/ri";
import { FaUserGraduate } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from "react-redux";
import { authActions } from "../store";
import { backendUrl } from "../../config";
import useFetchUser  from "../hooks/fetchUser";
import Approval from "../Pages/Lecturer/Approval";

axios.defaults.withCredentials = true;

const variants = {
  expanded: { width: "20%" },
  collapsed: { width: "5%" },
};

const navItems = [
  {
    name: "Lecturer Dashboard",
    icon: MdDashboard,
    link: "/dashboard_lec",
  },
  {
    name: "Contest",
    icon: MdSchool,
    link: "/contest",
  },
  {
    name: "Questions Bank",
    icon: RiQuestionAnswerFill,
    link: "/qbank",
  },
  {
    name: "Profile",
    icon: FaUserGraduate,
    link: "/profile_lec",
  },
];

const SidebarLecturer = (props) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Get current location

  const {isApproved} = props;
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsExpanded(width >= 768); // Expand sidebar if width is greater than or equal to 768px
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/user/logout`, null, { withCredentials: true });
      const data = response.data;
      if (response.status === 200) {
        toast.success(data.msg);
        dispatch(authActions.logout());
      } else {
        toast.error(data.response.data.error);
      }
    } catch (error) {
      toast.error("An error occurred during logout.");
      dispatch(authActions.logout())

    }
  };

  return (
    <motion.section
      animate={isExpanded ? "expanded" : "collapsed"}
      variants={variants}
      className={
        "w-1/5 bg-gray-900 h-screen flex flex-col justify-between items-center gap-10 relative " +
        (isExpanded ? "py-8 px-6" : "px-8 py-6")
      }
    >
      <div className="flex flex-col justify-center items-center gap-8">
        {isExpanded ? (
          <div id="logo-box">
            <h1 className="text-violet-400 font-bold text-4xl ">
              ZEE <span className="italic text-violet-200">CODE</span>
            </h1>
          </div>
        ) : (
          <div className="flex justify-center items-center">
            <h1 className="text-violet-400 font-bold text-3xl">Z</h1>
            <span className="italic text-violet-200 text-3xl">C</span>
          </div>
        )}
        <div
          id="navlinks-box"
          className="flex flex-col justify-center items-start gap-5 w-full mt-5"
        >
          {navItems.map((item, index) => (
            <div
              key={item.name}
              className={
                "flex justify-start items-center gap-4 w-full cursor-pointer rounded-xl " +
                (location.pathname === item.link // Check if current path matches the link's path
                  ? "bg-violet-300 text-violet-900" // Apply active styles
                  : "text-white") +
                (isExpanded ? " px-6 py-2" : " p-2")
              }
              onClick={() => navigate(item.link)}
            >
              <div className="bg-violet-100 text-violet-900 p-2 rounded-full ">
                <item.icon className="md:w-6 w-4 h-4 md:h-6" />
              </div>
              <span className={"text-lg " + (isExpanded ? "flex" : "hidden")}>
                {item?.name}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div
        id="expanded-icon"
        className="bg-violet-300 text-violet-900 p-2 rounded-full cursor-pointer absolute -right-4 bottom-20 md:bottom-40 md:flex hidden hover:bg-violet-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <FaArrowRight />
      </div>
      <div
        id="logout-box"
        className="w-full flex flex-col justify-start items-center gap-4 cursor-pointer"
        onClick={handleLogout}
      >
        <div className="bg-violet-300 w-full h-[0.5px]"></div>
        <div className="flex justify-center items-center gap-2 ">
          <MdLogout className="w-6 h-6 text-white hover:text-violet-400" />
          <span
            className={"text-white text-lg hover:text-violet-400 " + (isExpanded ? "flex" : "hidden")}
          >
            Logout
          </span>
        </div>
      </div>
      {isApproved === false && <Approval handleLogout={handleLogout} />}

    </motion.section>
  );
};

export default SidebarLecturer;