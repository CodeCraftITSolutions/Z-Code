import React, { useEffect, useState } from "react";
import Sidebar from "../../Sections/Sidebar";
import Header from "../../Sections/Header";
import Logo from "../../assets/Images/profile.jpg";
import 'react-toastify/dist/ReactToastify.css';
import { FaSearch, FaPlus, FaEdit, FaTrash } from "react-icons/fa";

import { ToastContainer, toast } from 'react-toastify';


import axios from "axios";
axios.defaults.withCredentials = true;
import useFetchUser from "../../hooks/fetchUser";
import SyncLoader from 'react-spinners/SyncLoader';
import { backendUrl } from "../../../config";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const EditAdminProfile = (props) => {

  const [username, setUsername] = useState(props.admin.username);
  const [email, setEmail] = useState(props.admin.email);
  const [uploading, setUploading] = useState(false);
  const admin = props.admin;
  const userId = admin.userId;
  const logo = props.logo;
  const [image, setImage] = useState(logo);
  const url = `${backendUrl}/api/image`

  //handle and convert it in base 64
  const handleImage = (e) => {
    const file = e.target.files[0];
    setFileToBase(file);
  }

  const setFileToBase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
    }

  }
  const save = async () => {

    try {
      const res = await axios.put(`${backendUrl}/api/admin/${props.admin._id}`, {
        username,
        email,
      });
      const data = await res.data;

      uploadImage(image);

      if (res.status === 200) {
        toast.success('Profile Updated Successfully');
      }


    }
    catch (err) {
      const error = await err.response.data.error;
      toast.error(error);
    }



  }

  const uploadImage = async (image) => {
    setUploading(true);
    try {
      const res = await axios.post(url, { image, userId });
      const data = await res.data;
      console.log(data);
    } catch (error) {
      console.log(error);
    }
    finally {
      setUploading(false);
      setTimeout(() => {
        props.cancel();
      }
        , 1000);
    }
  };




  const handleUploadButtonClick = () => {
    const fileInput = document.getElementById('formupload');
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleDeleteButtonClick = async() => {
    setUploading(true);
    try {
      const res = await axios.delete(`${backendUrl}/api/image/${userId}`);
      const data = await res.data;
      if (res.status === 200) {
        setImage(Logo);
        toast.success('Image Deleted Successfully');
      }
    } catch (error) {
      console.log(error);
    }
    finally {
      setUploading(false);
    }

  };


  return (

    <div className="relative max-w-md mx-auto md:max-w-2xl mt-20 min-w-0 break-words bg-green-900 w-full mb-6 shadow-lg rounded-xl">
      <div className="px-6">
        <div className="flex-grow flex flex-col items-center justify-start">
          <div className="flex-column mt-4" >
            <div className="relative overflow-hidden">
              <input onChange={handleImage} type="file" id="formupload" name="image" style={{ display: 'none' }} />
              <label htmlFor="formupload">
                <img
                  src={image}
                  alt="hello"
                  className="shadow-xl rounded-full align-middle border-none object-cover w-32 h-32 cursor-pointer"
                />
              </label>

            </div>

            <div className="flex mt-4 justify-between">
              <FaEdit className="text-green-500 hover:text-green-600 cursor-pointer text-xl" onClick={handleUploadButtonClick} />
              <FaTrash className="text-red-500 hover:text-red-600 cursor-pointer text-xl" onClick={handleDeleteButtonClick} />
            </div>
          </div>
          <div className="w-full text-center mt-4">
            <div className="flex justify-center lg:pt-4  pb-0">
              <div className="w-full text-center mt-2">
                <div className="flex justify-center lg:pt-4 pb-0">
                  <div className="w-full lg:w-2/3">
                    {" "}
                    {/* Increased width to 2/3 */}
                    <div className="bg-slate-100 p-8 rounded-lg mb-20 shadow-green-700">
                      <h2 className="text-2xl font-bold text-green-800 mb-6">
                        Your Profile
                      </h2>
                      <div className="flex items-center mb-4">
                        <label
                          className="block text-green-700 text-sm font-bold mr-2 ml-10"
                          htmlFor="name"
                        >
                          Name:
                        </label>
                        <input
                          type="text"
                          className="border-b border-green-500 rounded text-green-800 text-lg focus:outline-none px-2 py-1"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}

                        />
                      </div>
                      <div className="flex items-center mb-4">
                        <label
                          className="block text-green-700 text-sm font-bold mr-2 ml-10"
                          htmlFor="email"
                        >
                          Email:
                        </label>
                        <input
                          type="email"
                          className="border-b border-green-500 rounded text-green-800 text-lg focus:outline-none px-2 py-1"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
          
                      <div className="flex justify-center text-center">
                        <button
                          onClick={props.cancel}
                          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-10 mr-5"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={save}
                          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-5">
                          Save
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
      {uploading && (
        <div className="fixed inset-0 bg-black opacity-80 flex justify-center items-center">
          <SyncLoader color="green" loading={true} size={20} css={override} />
        </div>
      )}
    </div>
  );
};

export default EditAdminProfile;