import React, { useEffect } from 'react'
import Navbar from "../Components/Navbar";
import Front from "../Components/Front";
import Footer from "../Components/Footer";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {

 

  return (
    <div>
      <Navbar/>
      <Front/>
      <Footer/>
    </div>
  );
}

export default Home