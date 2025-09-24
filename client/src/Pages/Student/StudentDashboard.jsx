import React, { useEffect } from 'react'
//import { Link } from 'react-router-dom'
import Sidebar from '../../Sections/Sidebar'
import Feed from '../../Sections/Feed'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function StudentDashboard() {
  const isLoggedin = useSelector(state => state.isLoggedin);
  const userType = useSelector(state => state.userType);
  const navigate = useNavigate();



  return (
   
    <main className='w-full h-screen flex justify-between items-start'>
      {/* <Sidebar/> */}
      
      <Feed/>
    </main>
  )
}