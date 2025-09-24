import React, { useState } from "react";
import Header from "../../Sections/Header";
import Feed from "../../Sections/Feed";
import Logo from "../../assets/Images/profile.jpg";
import SidebarLecturer from "../../Sections/SidebarLecturer";
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from "react";
import { FaSearch, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import SyncLoader from "react-spinners/ClipLoader";
import { backendUrl } from "../../../config";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};
import { ToastContainer,toast } from 'react-toastify';
import axios from "axios";
axios.defaults.withCredentials = true;

const EditLecturerProfile = (props) => {

  const [username,setUsername] = useState(props.lecturer.username);
  const [email,setEmail] = useState(props.lecturer.email);
  const lecturer = props.lecturer;
  const userId = lecturer.userId;
  const logo = props.logo;
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState(logo);
  const url = `${backendUrl}/api/image`

  const save = async () => {
    setUploading(true)

    try{
      const res  = await axios.put(`${backendUrl}/api/lecturer/${props.lecturer._id}`,{
        username,
        email,
      });
  
      const data = await res.data;
  
      uploadImage(image);


    }
    catch(err){
      const error = await err.response.data.error;
      toast.error(error);
    }
    finally{
      // setUploading(false);
      // props.cancel();
      // toast.success('Profile Updated Successfully');
    }



  }

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

  const uploadImage = async (image) => {
    setUploading(true);
    try {
      const res = await axios.post(url, { image, userId });
      const data = await res.data;
    } catch (error) {
      // toast("error uploading image",error);
    }
    finally{
      setUploading(false);
      props.cancel();
      toast.success('Profile Updated Successfully');
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
    <div className="relative max-w-md mx-auto md:max-w-2xl mt-20 min-w-0 break-words bg-violet-900 w-full mb-6 shadow-lg rounded-xl text-sm md:text-base">
    <div className="px-6">
      <div className="flex-grow flex flex-col items-center justify-start">
        <div className="flex flex-col items-center mt-4">
          <div className="relative overflow-hidden">
            <input onChange={handleImage} type="file" id="formupload" name="image" style={{ display: 'none' }} />
            <label htmlFor="formupload">
              <img
                src={image}
                alt="Profile"
                className="shadow-xl rounded-full align-middle border-none object-cover w-32 h-32 cursor-pointer"
              />
            </label>
          </div>
          <div className="flex mt-4 justify-between w-full max-w-xs">
            <FaEdit className="text-green-500 hover:text-green-600 cursor-pointer text-xl" onClick={handleUploadButtonClick} />
            <FaTrash className="text-red-500 hover:text-red-600 cursor-pointer text-xl" onClick={handleDeleteButtonClick} />
          </div>
        </div>
        <div className="w-full text-center mt-10">
          <div className="flex justify-center lg:pt-4 pb-0">
            <div className="w-full text-center mt-2">
              <div className="flex justify-center lg:pt-4 pb-0">
                <div className="w-full lg:w-1/2">
                  <div className="bg-slate-100 p-6 md:p-8 rounded-lg mb-10 md:mb-20 shadow-violet-700">
                    <h2 className="text-xl md:text-2xl font-bold text-violet-800 mb-4 md:mb-6">
                      Your Profile
                    </h2>
                    <div className="flex flex-col items-start mb-4">
                      <label
                        className="block text-violet-700 text-sm font-bold mb-1"
                        htmlFor="name"
                      >
                        Name:
                      </label>
                      <input
                        type="text"
                        className="w-full border-b border-violet-500 rounded text-violet-800 focus:outline-none px-2 py-1"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col items-start mb-6">
                      <label
                        className="block text-violet-700 text-sm font-bold mb-1"
                        htmlFor="email"
                      >
                        Email:
                      </label>
                      <input
                        type="email"
                        className="w-full border-b border-violet-500 rounded text-violet-800 focus:outline-none px-2 py-1"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-center text-center">
                      <button onClick={props.cancel} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2">
                        Cancel
                      </button>
                      <button onClick={save} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2">
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
      {uploading && (
        <div className="fixed inset-0 bg-black opacity-80 flex justify-center items-center">
          <SyncLoader color="red" loading={true} size={120} css={override} />
        </div>
      )}
    </div>
  </div>
  
  );
};

export default EditLecturerProfile;