import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { app } from '../firebase.js';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { authActions } from '../store';
import { backendUrl } from '../../config.js';
import { FaGoogle } from "react-icons/fa";
import { toast } from "react-toastify";

export default function Oauth(props) {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {isLogin} = props;

    const handleGoogleClick = async (e)=>{
        e.preventDefault() ;
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      try{

        const resultFromGoogle = await signInWithPopup(getAuth(app), provider)
        if(isLogin){
          const response = await axios.post(`${backendUrl}/api/user/googlelogin`, {email : resultFromGoogle.user.email},
            {withCredentials: true, credentials: 'include'}
          )
          const data = response.data;
          dispatch(authActions.login({ userType: `${data.msg}`,user : data.user}));
          if(data.msg === 'student'){
            setTimeout(() => {
              navigate('/dashboard_std');
            }, 1000);
          }else if(data.msg === 'lecturer'){
            setTimeout(() => {
              navigate('/dashboard_lec');
            }, 1000);
          }else{
            setTimeout(() => {
              navigate('/admin');
            }, 1000);
          }
        }
        else{
        navigate('/googleauth',{state : {username : resultFromGoogle.user.displayName , email : resultFromGoogle.user.email, usertype: props.usertype}})
        }
      }catch(err){
        console.log(err)
        toast.error(err.response.data.error);
      }
    }


  return (
    <div>
      <button
        type="button"
        onClick={handleGoogleClick}
        className="flex items-center justify-center w-80 bg-red-600 text-white font-semibold rounded-full py-2 px-4 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        <FaGoogle className="mr-2" /> {isLogin ?  'Sign in with Google' : "Sign up with Google"}
      </button>
    </div>
  );
}