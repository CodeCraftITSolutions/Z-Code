import React, { useEffect, useRef, useState } from "react";
import LecturerSidebar from "../../Sections/SidebarLecturer";
import Header from "../../Sections/Header";
import client_ from "../../assets/Images/profile.jpg";
import { useNavigate } from "react-router-dom";
import EditLectureProfile from "./EditLecturerProfile";
import axios from "axios";
import { useSelector } from "react-redux";
axios.defaults.withCredentials = true;
import ClipLoader from "react-spinners/ClipLoader";
import {  CSSProperties } from "react";
import { backendUrl } from "../../../config";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const LecturerProfile = () => {


  const user  = useSelector(state => state.user);
  const [editProfile, setEditProfile] = useState(false);
  const [lecturer,setLecturer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState(client_);


  useEffect(() => {
    fetchLecturer();
    fecthImage();
  }, [user,editProfile]);

  const fetchLecturer = async () => {
    setLoading(true);
    try{
      if(user._id === undefined) return;
      const res = user && await axios.get(`${backendUrl}/api/lecturer/${user._id}`);
      const data = res && (await res.data);
      if (data) setLecturer(data);
    }
    catch(err){
      toast.error("error",err.message)
    }
    finally{
      setLoading(false);
    }

  };

  const fecthImage = async () => {
    setLoading(true);
    try {
      if(user._id === undefined) return;
      const res = await axios.get(`${backendUrl}/api/image/${user._id}`);
      const data = await res.data;
      if (data) {
        setClient(data.image.url);
      }
    } catch (error) {
      console.log("error", error.message);
    }finally{
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
    <main className="w-full h-screen flex flex-col md:flex-row justify-between items-start text-sm md:text-base">
    {/* <LecturerSidebar /> */}
  
    {
      loading ? 
        (
          <div className="w-full flex justify-center items-center h-screen">
            <ClipLoader
              color="red"
              loading={true}
              size={150}
              css={override}
            />
          </div>
        ) :
        (
          editProfile ? (
            <div className="w-full md:w-4/5 grow bg-white h-screen overflow-y-auto flex flex-col justify-start items-center gap-4 p-4">
              <EditLectureProfile cancel={cancel} lecturer={lecturer} logo={client} />
            </div>
          ) : (
            <div className="w-full md:w-4/5 grow bg-white h-screen overflow-y-auto flex flex-col justify-start items-center gap-4 p-4">
              {/* <Header bgColor="violet" /> */}
              <div className="relative max-w-md mx-auto md:max-w-2xl mt-10 min-w-0 break-words bg-violet-900 w-full mb-6 shadow-lg rounded-xl">
                <div className="px-6">
                  <div className="flex-grow flex flex-col items-center justify-start">
                    <div className="w-full flex justify-center mt-4">
                      <div className="relative rounded-full overflow-hidden">
                        <img
                          src={client}
                          className="shadow-xl rounded-full align-middle border-none object-cover w-24 h-24 md:w-32 md:h-32"
                          alt="Lecturer Profile"
                        />
                      </div>
                    </div>
                    <div className="w-full text-center mt-6 md:mt-10">
  <div className="flex justify-center lg:pt-4 pb-0">
    <div className="w-full text-center mt-2">
      <div className="flex justify-center lg:pt-4 pb-0">
        <div className="w-full lg:w-1/2">
          <div className="bg-violet-100 p-6 md:p-8 rounded-lg mb-10 md:mb-20 shadow-violet-700">
            <h2 className="text-lg md:text-base font-bold text-violet-800 mb-4 md:mb-6">
              Your Profile
            </h2>
            <div className="flex items-center mb-4 text-sm md:text-base">
              <label
                className="block text-violet-700 font-bold mr-2"
                htmlFor="name"
              >
                Name:
              </label>
              {lecturer && 
              <p className="text-violet-800  break-words max-w-full">{lecturer.username}</p>
              }
            </div>
            <div className="flex items-center mb-6">
              <label
                className="block text-violet-700 font-bold mr-2"
                htmlFor="email"
              >
                Email:
              </label>
              {lecturer && 
              <p className="text-violet-800  break-words max-w-full">
                {lecturer.email}
              </p>}
            </div>
            <div className="text-center text-sm md:text-base">
              <button onClick={handleProfile} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm md:text-base">
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
        )
    }
  </main>
  
  );
};

export default LecturerProfile;