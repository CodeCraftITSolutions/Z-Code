// src/components/Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Sections/Header'; 
import Sidebar from '../Sections/Sidebar';
import SidebarLecturer from '../Sections/SidebarLecturer';
import io from 'socket.io-client';
import { backendUrl } from '../../config';

import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import axios from 'axios';


const socket = io(backendUrl);

const Layout = ({ bgColor,isLecturer }) => {

  const user = useSelector(state => state.user);
  const [isApproved, setIsApproved] = useState(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (!user) return;
    if(!isLecturer) return;
    socket.on('lecturerapproved', (p) => {
    if(user._id === p){
      toast.success('You have been approved as a lecturer');
      setIsApproved(true);

    }
    });

    socket.on('lecturerdisapproved', (p) => {
      if(user._id === p){
        toast.error('You have been disapproved as a lecturer');
        setIsApproved(false);
      }
    });


    
    return () => {
      socket.off('lecturerapproved');
      socket.off('lecturerdisapproved');
    };
  }, []);

   


  useEffect(() => {
    if(isLecturer)
    fetchLecturer();
  }, [user]);

  const fetchLecturer = async () => {
    setLoading(true);
    try {
      if (user._id === undefined) return;
      const res =
        user && (await axios.get(`${backendUrl}/api/lecturer/${user._id}`));
      const data = res && (await res.data);
      if (data) {
        setIsApproved(data.isApproved);
      }
    } catch (err) {
      console.log(err);
      toast.error("error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex justify-between items-start">
  {!isLecturer ?  <Sidebar /> : <SidebarLecturer isApproved = {isApproved}/>}
      <div className={`w-full lg:w-4/5 grow bg-white h-screen overflow-y-auto flex flex-col justify-start items-center gap-4 p-4`}>
        <Header bgColor={bgColor} />
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;