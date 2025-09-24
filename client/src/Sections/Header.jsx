import React, { useEffect, useRef, useState } from "react";
import client from "../assets/Images/client.jpg";
import LogoImage from "../assets/Images/logo.jpg";
import { useNavigate } from "react-router";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store";
import classNames from "classnames";
import ClipLoader from "react-spinners/ClipLoader";
import { CSSProperties } from "react";
import logo from "../assets/Images/profile.jpg";
import { backendUrl } from "../../config";
import Notify from "../Components/Notify";
import useFetchUser from "../hooks/fetchUser";
import io from "socket.io-client";
const socket = io(backendUrl);

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

axios.defaults.withCredentials = true;

const Header = ({ bgColor, refreshImage }) => {
  const shouldLog = useRef(true);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [client_, setClient] = useState(logo);

  useEffect(() => {
    fecthImage();
  }, [user,refreshImage]);

  


  useEffect(() => {
    socket.on("userdeleted", (p) => {
      if (user._id === p) {
        toast.success("You account has been deleted by admin");
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    });

    return () => {
      socket.off("userdeleted");
    };

  }, []);

 

  const handleNavigate = () => {
    if (user.usertype === "student") {
      navigate("/profile_std");
    } else if (user.usertype === "lecturer") {
      navigate("/profile_lec");
    } else if (user.usertype === "admin") {
      navigate("/adminprofile");
    }
  }


  const fecthImage = async () => {
    console.log("fetching image");
    setLoading(true);
    try {
      if (user._id === undefined) return;
      const res = await axios.get(`${backendUrl}/api/image/${user._id}`);
      const data = await res.data;
      if (data) {
        setClient(data.image.url);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className={classNames(
        "w-full lg:h-20 h-fit flex justify-between items-center p-4 rounded-xl lg:gap-2 gap-4",
        {
          "bg-violet-300": bgColor === "violet",
          "bg-blue-300": bgColor === "blue",
          "bg-green-300": bgColor === "green",
        }
      )}
    >
      <div className="flex items-center">
        <img
          className="w-12 h-12 bg-cover bg-center bg-no-repeat"
          src={LogoImage}
          alt="logo"
        />
      </div>
      <div className="flex-grow flex justify-end items-center gap-4">
        <Notify />
        <h1 className="text-sm md:text-base font-semibold text-blue-900">
          {user ? user.username : <ClipLoader color="blue" loading={true} size={20} css={override} />}
        </h1>
        <div className="w-12 h-12 rounded-full overflow-hidden">
          {
            loading ? <ClipLoader color="blue" loading={true} size={50} css={override} /> :
              <img
                onClick={handleNavigate}
                src={client_}
                alt="client-image"
                className="w-full h-full object-cover cursor-pointer"
              />
          }
        </div>
      </div>
    </section>
  );
};

export default Header;
