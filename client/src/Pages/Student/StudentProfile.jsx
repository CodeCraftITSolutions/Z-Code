import React, { useEffect, useRef } from "react";
import Sidebar from "../../Sections/Sidebar";
import Header from "../../Sections/Header";
import EditStudentProfile from "../Student/EditStudentProfile";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import client_ from "../../assets/Images/profile.jpg";

import { ToastContainer, toast } from 'react-toastify';
import { useSelector } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import { CSSProperties } from "react";
import { backendUrl } from "../../../config";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};
axios.defaults.withCredentials = true;

const StudentProfile = () => {

  const shouldLog = useRef(true);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const user = useSelector(state => state.user);
  const [student, setStudent] = useState(null);
  const [editProfile, setEditProfile] = useState(false);
  const [client, setClient] = useState(client_);

  useEffect(() => {
    fetchStudent();
    fecthImage();
  }, [user, editProfile]);

  const fetchStudent = async () => {
    setLoading(true);
    try {
      if (user._id === undefined) return;
      const res = user && await axios.get(`${backendUrl}/api/student/${user._id}`);
      const data = res && (await res.data);
      if (data) setStudent(data);
    } catch (err) {
      toast.error("error in fetching student")
    } finally {
      setLoading(false);
    }
  };

  const fecthImage = async () => {
    setLoading(true);
    try {
      if (user._id === undefined) return;
      const res = await axios.get(`${backendUrl}/api/image/${user._id}`);
      const data = await res.data;
      if (data) {
        setClient(data.image.url);
      }
    } catch (error) {
      console.log("error in loading image");
    } finally {
      setLoading(false);
    }
  };

  const handleProfile = () => {
    setEditProfile(true);
  };

  const cancel = () => {
    setEditProfile(false);
    window.location.reload();
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
            css={override}
          />
        </div>
      ) : (
        editProfile ? (
            <EditStudentProfile cancel={cancel} student={student} logo={client} />
        ) : (
          <div className="w-4/5 grow bg-blue-100 h-screen overflow-y-auto flex flex-col justify-start items-center gap-4 p-4">
              {/* <Header bgColor="blue" /> */}
            <div className="relative max-w-md mx-auto md:max-w-2xl mt-20 min-w-0 break-words bg-blue-900 w-full mb-6 shadow-lg rounded-xl">
              <div className="px-6">
                <div className="flex-grow flex flex-col items-center justify-start">
                  <div className="w-full flex justify-center mt-4">
                    <div className="relative rounded-full overflow-hidden">
                     {loading?
                      <ClipLoader color="blue" loading={true} size={50} css={override} />
                      :
                      <img
                        src={client}
                        className="shadow-xl rounded-full align-middle border-none object-cover w-32 h-32"
                        alt="Student Profile"
                      />}
                    </div>
                  </div>
                  <div className="w-full text-center mt-4">
                    <div className="flex justify-center lg:pt-4 pb-0">
                      <div className="w-full text-center mt-2">
                        <div className="flex justify-center lg:pt-4 pb-0">
                          <div className="w-full lg:w-1/2">
                            <div className="bg-blue-100 p-1 rounded-lg mb-20 shadow-blue-700">
                              <h2 className="text-2xl font-bold text-blue-800 mb-6">
                                Your Profile
                              </h2>
                              <div className="flex items-center mb-4">
                                <label
                                  className="block text-blue-700 text-sm font-bold mr-2"
                                  htmlFor="name"
                                >
                                  Name:
                                </label>
                                {student && (
                                  <p className="text-blue-800 text-lg">
                                    {student.username}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center mb-4">
                                <label
                                  className="block text-blue-700 text-sm font-bold mr-2"
                                  htmlFor="email"
                                >
                                  Email:
                                </label>
                                {student && (
                                  <p className="text-blue-800 text-lg">
                                    {student.email}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center mb-4">
                                <label
                                  className="block text-blue-700 text-sm font-bold mr-2"
                                  htmlFor="regNumber"
                                >
                                  Reg No:
                                </label>
                                {student && (
                                  <p className="text-blue-800 text-lg">
                                    {student.regNo}
                                  </p>
                                )}
                              </div>
                              <div className="text-center">
                                <button
                                  onClick={handleProfile}
                                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                  Edit Profile
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </main>
  );
};

export default StudentProfile;