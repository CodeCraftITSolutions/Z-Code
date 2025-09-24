import React from 'react'
import { FaCopyright } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-gray-800 py-4 px-6 text-white flex items-center justify-center absolute bottom-0 w-full">
    <div className="flex items-center ">
      <FaCopyright className="mr-2" />
      <span>2025 by Z-Code Software. All rights reserved.</span>
    </div>
  </footer>
  );
}

export default Footer