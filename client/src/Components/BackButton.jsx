import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';


const BackButton = (props) => {

  const handleCancel = () => {
    props.handleCancel();
  }

  return (
    <button
      onClick={handleCancel}
      className="bg-blue-500 ml-2 flex items-center hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-6 text-sm md:text-md lg:text-lg"
    >
      <FaArrowLeft className="mr-2" /> Back
    </button>
  );
};

export default BackButton;