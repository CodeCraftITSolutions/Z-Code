import React, { useEffect, useState } from "react";
import signupImage from "../assets/Images/signup-background.svg";
import teamworkImage from "../assets/Images/teamwork.svg";
import { FaLock, FaTimes, FaUser } from "react-icons/fa";
import { FaEnvelopeOpen } from "react-icons/fa6";
import { IoLockClosedSharp } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import ClipLoader from "react-spinners/ClipLoader";
import { CSSProperties } from "react";
import { backendUrl } from "../../config";
import Oauth from "./Oauth";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "white",
};

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [OTP, setOTP] = useState('');
  const { state } = useLocation();

  useEffect(() => {
    if (!state) navigate('/signup');
    setShowOtpInput(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegistering) return;
    setIsRegistering(true);

    if (username === '' || email === '' || password === '' || cpassword === '' || (state.usertype === 'student' && registrationNumber === '')) {
      toast.error('All fields are required');
    } else if (cpassword !== password) {
      toast.error('Passwords do not match');
    } else {
      try {
        const response = await axios.post(`${backendUrl}/api/user/send`, {
          username,
          email,
          password,
          usertype: state.usertype,
          registrationNumber: state.usertype === 'student' ? registrationNumber : undefined,
        });
        const json = response.data;
        toast(json.msg);
        setShowOtpInput(true);
      } catch (error) {
        const err = error.response.data;
        toast.error(err.error);
      }
    }
    setTimeout(() => {
      setIsRegistering(false);
    }, 1800);
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    if (isVerifying) return;
    setIsVerifying(true);

    try {
      const response = await axios.post(`${backendUrl}/api/user/signup`, {
        username,
        email,
        password,
        OTP,
        usertype: state.usertype,
        registrationNumber: state.usertype === 'student' ? registrationNumber : undefined,
      });
      const json = response.data;
      toast.success('OTP Verified');
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error) {
      const err = error.response.data;
      toast.error(err.error);
    } finally {
      setTimeout(() => {
        setIsVerifying(false);
      }, 1800);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const gotoLogin = () => {
    navigate('/login');
  };



  return (
    state &&
    <div className="bg-gradient-to-r from-[#F28383] from-10% via-[#9D6CD2] to-[#481EDC] to-90% flex items-center justify-center h-screen">
      <div className="max-w-[960px] relative bg-black bg-opacity-50 grid grid-cols-1 md:grid-cols-2 items-center p-5 rounded-2xl gap-10 md:gap-20">
        <div className="relative hidden md:block">
          <img src={signupImage} alt="" />
          <img src={teamworkImage} alt="" className="absolute top-36" />
        </div>
        <div className="max-w-80 grid gap-5 ">
          <button onClick={handleBack} className="text-gray-300 text-2xl absolute top-3 right-3 hover:bg-blue-400 hover:text-white hover:rounded-full hover:p-1">
            <FaTimes />
          </button>
          <h1 className="text-5xl font-bold text-white">SignUp</h1>
          <p className="text-white text-opacity-70">
            Create your account. It's free and only takes a minute.
          </p>

          <form action="" className="space-y-6 text-white" onSubmit={handleSubmit} disabled={showOtpInput}>
            <div className="relative">
              <div className="absolute top-1 left-1 bg-white bg-opacity-40 rounded-full p-2 flex items-center justify-center text-blue-300">
                <FaUser />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value) }}
                placeholder="Username"
                className="w-80 bg-white bg-opacity-30 py-2 px-12 rounded-full focus:bg-black focus:bg-opacity-50 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:drop-shadow-lg"
                disabled={showOtpInput}
              />
            </div>
            <div className="relative">
              <div className="absolute top-1 left-1 bg-white bg-opacity-40 rounded-full p-2 flex items-center justify-center text-blue-300">
                <FaEnvelopeOpen />
              </div>
              <input
                value={email}
                onChange={(e) => { setEmail(e.target.value) }}
                type="email"
                placeholder="Email Address"
                className="w-80 bg-white bg-opacity-30 py-2 px-12 rounded-full focus:bg-black focus:bg-opacity-50 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:drop-shadow-lg"
                disabled={showOtpInput}
              />
            </div>
            {state.usertype === 'student' && (
              <div className="relative">
                <div className="absolute top-1 left-1 bg-white bg-opacity-40 rounded-full p-2 flex items-center justify-center text-blue-300">
                  <FaUser />
                </div>
                <input
                  type="text"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  placeholder="Registration Number"
                  className="w-80 bg-white bg-opacity-30 py-2 px-12 rounded-full focus:bg-black focus:bg-opacity-50 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:drop-shadow-lg"
                  disabled={showOtpInput}
                />
              </div>
            )}
            <div className="relative">
              <div className="absolute top-1 left-1 bg-white bg-opacity-40 rounded-full p-2 flex items-center justify-center text-blue-300">
                <FaLock />
              </div>
              <input
                value={password}
                data-testid='password'
                onChange={(e) => { setPassword(e.target.value) }}
                type="password"
                placeholder="Password"
                className="w-80 bg-white bg-opacity-30 py-2 px-12 rounded-full focus:bg-black focus:bg-opacity-50 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:drop-shadow-lg"
                disabled={showOtpInput}
              />
            </div>
            <div className="relative">
              <div className="absolute top-1 left-1 bg-white bg-opacity-40 rounded-full p-2 flex items-center justify-center text-blue-300">
                <IoLockClosedSharp />
              </div>
              <input
                value={cpassword}
                data-testid='confirm'
                onChange={(e) => { setCpassword(e.target.value) }}
                type="password"
                placeholder="Confirm Password"
                className="w-80 bg-white bg-opacity-30 py-2 px-12 rounded-full focus:bg-black focus:bg-opacity-50 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:drop-shadow-lg"
                disabled={showOtpInput}
              />
            </div>
        
            <button className="bg-gradient-to-r from-blue-400 to-cyan-200 w-80 font-semibold rounded-full py-2" disabled={showOtpInput}>
              {isRegistering ? <ClipLoader color="cyan" loading={true} size={20} css={override} /> : "Register Now"}
            </button>
            <Oauth usertype = {state.usertype} />
          </form>

          {showOtpInput && (
            <form className="space-y-6 text-white" onSubmit={handleOTPSubmit}>
              <input
                type="text"
                value={OTP}
                onChange={(e) => setOTP(e.target.value)}
                placeholder="Enter OTP"
                className="w-80 bg-white bg-opacity-30 py-2 px-12 rounded-full focus:bg-black focus:bg-opacity-50 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:drop-shadow-lg"
              />
              <button type="submit" className="bg-gradient-to-r from-blue-400 to-cyan-200 w-80 font-semibold rounded-full py-2">
                {isVerifying ? <ClipLoader color="cyan" loading={true} size={20} css={override} /> : "Verify OTP"}
              </button>
            </form>
          )}
          <div className="text-white text-opacity-70 border-t border-white border-opacity-40 pt-4 space-y-4 text-sm">
            <p>
              If you already have an account?{" "}
              <a onClick={gotoLogin} className="text-blue-600 font-semibold cursor-pointer">
                Log In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;