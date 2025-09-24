// import React, { useEffect } from "react";
// import { useState } from "react";
// import { motion } from "framer-motion";
// import { MdDashboard, MdLogout } from "react-icons/md";
// import { RiTaskFill } from "react-icons/ri";
// import { FaArrowRight } from "react-icons/fa";
// import { FaUserGraduate } from "react-icons/fa";
// import { MdManageAccounts } from "react-icons/md";
// import { MdOutlineManageAccounts } from "react-icons/md";
// import { useDispatch } from "react-redux";
// import { authActions } from "../store";
// import axios from "axios";
// axios.defaults.withCredentials = true;

// const variants = {
//     expanded: { width: "20%" },
//     collapsed: { width: "5%" },
//   };

//   const navItems = [
//     {
//       name: "Admin Dashboard",
//       icon: MdDashboard,
//     },
//     {
//       name: "Manage Lecturers",
//       icon: MdManageAccounts,
//     },
//     {
//       name: "Manage Students",
//       icon: MdOutlineManageAccounts,
//     },
//     {
//       name: "Profile",
//       icon: FaUserGraduate,
//     },
//   ];

// const SidebarAdmin = () => {
//     const [activeNavIndex, setActiveNavIndex] = useState(0);
//     const [isExpanded, setIsExpanded] = useState(true);
//     const dispatch = useDispatch();

//     useEffect(() => {
//       const handleResize = () => {
//         const width = window.innerWidth;
//         if (width < 768) {
//           setIsExpanded(false);
//         } else {
//           setIsExpanded(true);
//         }
//       };
//       handleResize();
//       window.addEventListener("resize", handleResize);
//       return () => window.removeEventListener("resize", handleResize);
//     }, []);

//     const handleLogout = async () => {
//       // Handle logout
//       const response = await axios.post('http://localhost:4000/api/user/logout',null,{withCredentials: true})
//       const data = await response.data;
//       if(response.status === 200){
//         console.log(data.msg)
//         // setTimeout( ()=>
//         //   navigate('/login')
//         // ,1000)

//         dispatch(authActions.logout())

//       }
//       else{
//         console.log(data.response.data.error)
//       }

//     }
//   return (
//     <motion.section
//     animate={isExpanded ? "expanded" : "collapsed"}
//     variants={variants}
//     className={
//       "w-1/5 bg-gray-900 h-screen flex flex-col justify-between items-center gap-10 relative " +
//       (isExpanded ? "py-8 px-6" : "px-8 py-6")
//     }
//   >
//     <div className="flex flex-col justify-center items-center gap-8">
//       {isExpanded ? (
//         <div id="logo-box">
//           <h1 className="text-green-400 font-bold text-4xl ">
//             ZEE <span className="italic text-blue-200">CODE</span>
//           </h1>
//         </div>
//       ) : (
//         <div className="flex justify-center items-center">
//           <h1 className="text-blue-400 font-bold text-3xl">Z</h1>
//           <span className="italic text-blue-200 text-3xl">C</span>
//         </div>
//       )}
//       <div
//         id="navlinks-box"
//         className="flex flex-col justify-center items-start gap-5 w-full mt-5"
//       >
//         {navItems.map((item, index) => (
//           <div
//             key={item.name}
//             id="link-box"
//             className={
//               "flex justify-start items-center gap-4 w-full cursor-pointer rounded-xl " +
//               (activeNavIndex === index
//                 ? "bg-blue-300 text-blue-900"
//                 : "text-white") +
//               (isExpanded ? " px-6 py-2" : " p-2")
//             }
//             onClick={() => setActiveNavIndex(index)}

//           >
//             <div className="bg-blue-100 text-blue-900 p-2 rounded-full ">
//               <item.icon className="md:w-6 w-4 h-4 md:h-6" />
//             </div>
//             <span className={"text-lg " + (isExpanded ? "flex" : "hidden")}>
//               {item?.name}
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//     <div
//       id="expanded-icon"
//       className="bg-blue-300 text-blue-900 p-2 rounded-full cursor-pointer absolute -right-4 bottom-20 md:bottom-40 md:flex hidden hover:bg-blue-200"
//       onClick={() => setIsExpanded(!isExpanded)}
//     >
//       <FaArrowRight/>
//     </div>
//     <div
//       id="logout-box"
//       className="w-full flex flex-col justify-start items-center gap-4 cursor-pointer"
//       onClick={handleLogout}
//     >
//       <div className="bg-blue-300 w-full h-[0.5px]"></div>
//       <div className="flex justify-center items-center gap-2 ">
//         <MdLogout className="w-6 h-6 text-white hover:text-blue-400" />
//         <span
//           className={"text-white text-lg hover:text-blue-400 " + (isExpanded ? "flex" : "hidden")}
//         >
//           Logout
//         </span>
//       </div>
//     </div>
//   </motion.section>
//   );
// }

// export default SidebarAdmin

import React, { useEffect } from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { MdDashboard, MdLogout } from "react-icons/md";
import { RiTaskFill } from "react-icons/ri";
import { FaArrowRight } from "react-icons/fa";
import { FaUserGraduate } from "react-icons/fa";
import { MdManageAccounts } from "react-icons/md";
import { MdOutlineManageAccounts } from "react-icons/md";
import { useDispatch } from "react-redux";
import { authActions } from "../store";
import axios from "axios";
axios.defaults.withCredentials = true;

import { Link, useLocation } from "react-router-dom";
import { backendUrl } from "../../config";

const variants = {
  expanded: { width: "20%" },
  collapsed: { width: "5%" },
};

const navItems = [
  {
    name: "Admin Dashboard",
    icon: MdDashboard,
    link: "/admin",
  },
  {
    name: "Manage Lecturers",
    icon: MdManageAccounts,
    link: "/managelecturer",
  },
  {
    name: "Manage Students",
    icon: MdOutlineManageAccounts,
    link: "/managestudent",
  },
  {
    name: "Profile",
    icon: FaUserGraduate,
    link: "/adminprofile",
  },
];

const SidebarAdmin = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setIsExpanded(false);
      } else {
        setIsExpanded(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    // Handle logout
    const response = await axios.post(
      `${backendUrl}/api/user/logout`,
      null,
      { withCredentials: true }
    );
    const data = await response.data;
    if (response.status === 200) {
      // setTimeout( ()=>
      //   navigate('/login')
      // ,1000)

      dispatch(authActions.logout());
    } else {
      toast.error("Error while logout")
    }
  };
  const location = useLocation();
  const [activeNavIndex, setActiveNavIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);
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
            <h1 className="text-green-400 font-bold text-4xl ">
              ZEE <span className="italic text-green-200">CODE</span>
            </h1>
          </div>
        ) : (
          <div className="flex justify-center items-center">
            <h1 className="text-green-400 font-bold text-3xl">Z</h1>
            <span className="italic text-green-200 text-3xl">C</span>
          </div>
        )}
        <div
          id="navlinks-box"
          className="flex flex-col justify-center items-start gap-5 w-full mt-5"
        >
          {navItems.map((item, index) => (
            <Link
              key={item.name}
              to={item.link}
              id="link-box"
              className={
                "flex justify-start items-center gap-4 w-full cursor-pointer rounded-xl " +
                (location.pathname === item.link
                  ? "bg-green-300 text-green-900"
                  : "text-white") +
                (isExpanded ? " px-6 py-2" : " p-2")
              }
              onClick={() => setActiveNavIndex(index)}
            >
              <div className="bg-green-100 text-green-900 p-2 rounded-full ">
                <item.icon className="md:w-6 w-4 h-4 md:h-6" />
              </div>
              <span className={"text-lg " + (isExpanded ? "flex" : "hidden")}>
                {item?.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
      <div
        id="expanded-icon"
        className="bg-green-300 text-green-900 p-2 rounded-full cursor-pointer absolute -right-4 bottom-20 md:bottom-40 md:flex hidden hover:bg-green-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <FaArrowRight />
      </div>
      <div
        id="logout-box"
        className="w-full flex flex-col justify-start items-center gap-4 cursor-pointer"
        onClick={handleLogout}
      >
        <div className="bg-green-300 w-full h-[0.5px]"></div>
        <div className="flex justify-center items-center gap-2 ">
          <MdLogout className="w-6 h-6 text-white hover:text-green-400" />
          <span
            className={
              "text-white text-lg hover:text-green-400 " +
              (isExpanded ? "flex" : "hidden")
            }
          >
            Logout
          </span>
        </div>
      </div>
    </motion.section>
  );
};

export default SidebarAdmin;