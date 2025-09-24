import React, { useEffect, useState } from 'react';
import { FaTrash, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { backendUrl } from '../../config';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import SyncLoader from 'react-spinners/SyncLoader';

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};


const NotificationList = (props) => {


  const [loading, setLoading] = useState(false);
  const usertype = useSelector(state => state.userType);
  const userId = useSelector(state => state.user._id);
  const {notifications,handleNotifications,toggleDropdown} = props
  const totalUnread = notifications.filter(notification => !notification.read).length;
  const navigate = useNavigate();

  // Function to delete a single message
  const deleteMessage = async (notification) => {
    if (loading) return;
    setLoading(true);

    try {


      const response = await axios.delete(`${backendUrl}/api/notification/${notification._id}`,
        {
          params: { usertype ,
            userId
          }
        }
      );
      const data = response.data;
      if (response.status === 200) {
        handleNotifications(data.notifications);
      }
    }
    catch (err) {
      toast.error(err.message);
    }
    finally {
      setLoading(false);
    }



  };

  // Function to mark all messages as read
  const markAllAsRead = async() => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axios.put(`${backendUrl}/api/notification/read`, null, {
        params: { usertype ,
          userId
        }
      });
      const data = response.data;
      if (response.status === 200) {
        handleNotifications(data.notifications);
        toggleDropdown();
        
      }
     
    }
    catch (err) {
      toast.error(err.message);
    }
    finally {
      setLoading(false);
    }
  };

  // Function to delete all messages
  const deleteAllMessages = async() => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axios.delete(`${backendUrl}/api/notification/`, {
        params: { usertype,
          userId

         }
      });
      const data = response.data;
      if (response.status === 200) {
        handleNotifications([]);
        toggleDropdown();
      }
    }
    catch (err) {
      toast.error(err.message);
    }
    finally {
      setLoading(false);
    }
  };

  const handleNav = async(message) => {

    const res = await axios.put(`${backendUrl}/api/notification/${message._id}`,null, {
      params: { usertype,
        userId
      }
    });
    console.log("res",res);

    handleNotifications(res.data.notifications);


    if(usertype === "student"){
      
      
      const response = await axios.get(`${backendUrl}/api/contest/location/${message.objectId}`)
      const data = response.data;
      toggleDropdown();
      if(response.status === 200 && data.location === 'upcoming'){
        navigate(`/dashboard_std`)
      }else{
        navigate(`/available`)
      }


  }
  else if(usertype === "admin"){
    toggleDropdown();
    navigate(`/managelecturer`)
  }
}


  if(!notifications) return null;

  if(loading) {
    return (
      <div className="fixed inset-0 bg-black opacity-80 flex justify-center items-center">
          <SyncLoader color="green" loading={true} size={20} css={override} />
        </div>
    )
  }

  return (
    notifications.length > 0 ?
    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-10 text-sm p-2 border-solid border-4 border-blue">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Notifications</h2>
     
      <div className="flex justify-between mb-4">
        <button
          disabled={totalUnread === 0}
          onClick={markAllAsRead}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Mark All as Read
        </button>
        <button
          onClick={deleteAllMessages}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Delete All
        </button>
      </div>
      <ul className="space-y-4">
        {notifications.map((message, index) => (
          <li key={index} className="bg-white p-4 rounded-lg shadow flex justify-between items-center cursor-pointer hover:bg-gray-100 transition duration-300 ease-in-out"
          onClick={() => handleNav(message)}
          >
            <span className={message.read ? "text-gray-500" : "text-black"}>{message.message}</span>
            <button
              onClick={() => deleteMessage(message)}
              className="text-red-400 hover:text-red-500 focus:outline-none"
            >
              <FaTrash size={20} />
            </button>
          </li>
        ))}
      </ul>
    </div>
    :
    <div className="absolute right-0 mt-1 w-64 bg-white rounded-lg shadow-lg z-10 p-2">
      <h2 className="text-md font-bold text-gray-800 text-center mb-4">No Notifications updates</h2>
      
      </div>

  );
};

export default NotificationList;