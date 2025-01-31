import React, { useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import editicon from "../../assets/edit-icon.png";
import profileicon from "../../assets/profile-icon.png";
// import profileavatar from "../../assets/profile-avatar.png";
import { ProfileContext } from '../utils/ProfileContext';
import avatar from "../../assets/avatar.png";
import key from "../../assets/key.png";
import file from "../../assets/file.png";
import filefolder from "../../assets/files-folder.png";
import security from "../../assets/security.png";
import { API_URL } from "../utils/Apiconfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import googledrive from '../../assets/googledrive.png';
import dropbox from '../../assets/dropbox.png';
import profile from '../../assets/profile.png';
import plans from '../../assets/plans.png';
const Profile = () => {
  const [folderSize, setFolderSize] = useState(null);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [memb, setMemb] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const { profilePicture, setProfilePicture } = useContext(ProfileContext);
  const navigate = useNavigate();
  // Fetch user details on component mount

  useEffect(() => {
    // Fetch folder size from the backend API
    const fetchFolderSize = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/get-folder-size`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Include JWT token if required
          },
        });

        const totalSizeKB = response.data.totalSizeKB; // Get size in KB
        let displaySize;
        let unit;

        if (totalSizeKB < 1024) {
          displaySize = totalSizeKB.toFixed(2);
          unit = 'KB';
        } else if (totalSizeKB < 1024 * 1024) {
          displaySize = (totalSizeKB / 1024).toFixed(2);
          unit = 'MB';
        } else {
          displaySize = (totalSizeKB / 1024 / 1024).toFixed(2);
          unit = 'GB';
        }

        setFolderSize({ value: displaySize, unit });
      } catch (err) {
        console.error('Error fetching folder size:', err);
        setError('Failed to retrieve folder size');
      }
    };

    fetchFolderSize();
  }, []);
 
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/api/auth/get-personaluser-details`, {
          headers: {
            Authorization: `Bearer ${token}`, // Assuming token is stored in localStorage
          },
        });
        setUserDetails({
          name: response.data.user.username,
          email: response.data.user.email,
          phone: response.data.user.phoneNumber,
        });
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    
// Fetch the profile picture when the component mounts
const fetchProfilePicture = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/auth/get-profile-picture`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming you store the token in localStorage
      },
    });
    setProfilePicture(response.data.profilePicture); // Set the profile picture URL in state
  } catch (error) {
    console.error("Error fetching profile picture:", error);
  }
};

    useEffect(() => {
  
      fetchProfilePicture();
    }, []);


  useEffect(() => {
    
    fetchUserDetails();
  }, []);


  async function logout() {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("No token found. Please log in again.");
        }

        const apiUrl = `${API_URL}/api/auth/signout`;

        const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };

        const response = await fetch(apiUrl, { method: "POST", headers });

        if (!response.ok) {
            throw new Error("Failed to log out. Please try again.");
        }

        // Clear token from localStorage
        localStorage.removeItem("token");

        // Clear cookies if used
        Cookies.remove("token");

        // Prevent cached pages from being accessed
        window.history.pushState(null, null, window.location.href);
        window.addEventListener("popstate", () => {
            window.history.pushState(null, null, window.location.href);
        });

        // Redirect to the login page
        navigate("/Login");
    } catch (error) {
        console.error(error);
    }
}

  // Handle profile picture upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Preview the image locally
      setProfilePicture(URL.createObjectURL(file));

      // Prepare form data
      const formData = new FormData();
      formData.append("profilePicture", file);
      console.log("API URL:", `${API_URL}/api/auth/upload-profile-picture`);


      try {
        // Send the image to the backend
        const token = localStorage.getItem("token");
        const response = await axios.post(
          `${API_URL}/api/auth/upload-profile-picture`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`, // Add token if needed
            },
          }
        );

        if (response.status === 200) {
          alert("Profile picture updated successfully!");
          fetchProfilePicture();
        }
        // setProfilePicture(response.data.profilePicture); // Update the state in Navbar
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        alert("Failed to upload profile picture. Please try again.");
      }
    }
  };
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [id]: value,
    }));
  };
  const saveChanges = async () => {
    //   toggleEditMode();
    try {
      const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
      const response = await fetch(`${API_URL}/api/auth/update-user-details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token for authentication
        },
        body: JSON.stringify({
          username: userDetails.name,
          email: userDetails.email,
          phoneNumber: userDetails.phone,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message); // Show success message
        setIsEditMode(false); // Exit edit mode
        fetchUserDetails();
      } else {
        alert(data.message); // Show error message
      }
    } catch (error) {
      console.error("Error saving user details:", error);
      alert("An error occurred while saving the details. Please try again.");
    }
  };

const convertToGB = (value, unit) => {
  switch (unit.toLowerCase()) {
    case "kb":
      return value / (1024 * 1024); // KB to GB
    case "mb":
      return value / 1024; // MB to GB
    case "gb":
      return value; // Already in GB
    default:
      return 0; // Default for unknown units
  }
};
  return (
    <div className="bg-gray-50 p-6">
      <div className="mx-auto">
        {/* <div className="flex items-center mb-6">
          <i className="fas fa-arrow-left text-gray-500 mr-2"></i>
          <span className="text-[#212636]">Back</span>
        </div> */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-6 gap-4">
            {/* Profile Picture */}
            <span className="border border-[#DCDFE4] rounded-full p-2">
              <div className="relative w-16 h-16 group">
                <div className="w-full h-full rounded-full overflow-hidden">
                  {/* Display the profile picture if available */}
        {profilePicture ? (
          <img
            src={profilePicture}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center text-white">No Image</div> // Fallback if no image
        )}
                </div>
                <div
                  className="absolute cursor-pointer inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <div className="rounded-full p-4 relative">
                    <img
                      src={editicon}
                      alt="Edit Profile"
                      className="w-full h-full object-cover"
                    />
                    {/* Hidden file input */}
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
              </div>
            </span>
            {/* Edit Button */}
            {/* <button
              className="absolute top-0 right-0 p-2 bg-gray-700 text-white rounded-full cursor-pointer hover:opacity-100 transition-opacity"
              onClick={() => setIsEditing(true)} 
            >
              <i className="fas fa-pencil-alt"></i>
            </button> */}
            {/* File Input for Image Upload */}
            {isEditing && (
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-24 h-24 opacity-0 cursor-pointer z-10" // Ensure z-index is high enough
                onChange={handleImageChange}
                onClick={(e) => e.stopPropagation()} // Prevent click event from closing the input
              />
            )}
            <div>
              <h1 className="text-3xl font-semibold capitalize text-[#212636]">{userDetails.name}</h1>
              <p className="text-[#667085] text-base">{userDetails.email}</p>
            </div>
          </div>
          <div className="md:flex md:flex-row flex-col gap-6">
            <div className="md:w-2/5 flex flex-col w-full gap-6">
              <div className="bg-white rounded-[20px] border-2 border-[#ececec]">
                <div className="flex justify-between px-6 mt-4">
                  <div className="flex items-center justify-start mb-4">
                    <span className="rounded-full p-2 bg-white shadow-md">
                      <img src={avatar} alt="" className="h-[25px]" />
                    </span>
                    <h2 className="text-lg font-semibold ml-2">Basic Details</h2>
                    {/* <i
                    className="fa-light fa-pen text-gray-500 cursor-pointer"
                    onClick={toggleEditMode}
                  ></i> */}
                  </div>
                  <img src={profileicon} className="h-[37px] mt-1" alt="" onClick={toggleEditMode} />
                </div>
                <div className="px-6 py-3 border-b-2 border-[#ececec]">
                  <p className="text-gray-500">Name</p>
                  {!isEditMode ? (
                    <p>{userDetails.name}</p>
                  ) : (
                    <input
                      id="name"
                      className="border border-gray-300 rounded-lg p-2 w-full"
                      type="text"
                      value={userDetails.name}
                      onChange={handleInputChange}
                    />
                  )}
                </div>
                <div className="px-6 py-3 border-b-2 border-[#ececec]">
                  <p className="text-gray-500">Email</p>
                  {!isEditMode ? (
                    <p>{userDetails.email}</p>
                  ) : (
                    <input
                      id="email"
                      className="border border-gray-300 rounded-lg p-2 w-full"
                      type="email"
                      value={userDetails.email}
                      onChange={handleInputChange}
                    />
                  )}
                </div>
                <div className="mb-4 px-6 py-3">
                  <p className="text-gray-500">Phone number</p>
                  {!isEditMode ? (
                    <p>{userDetails.phone}</p>
                  ) : (
                    <input
                      id="phone"
                      className="border border-gray-300 rounded-lg p-2 w-full"
                      type="text"
                      value={userDetails.phone}
                      onChange={handleInputChange}
                    />
                  )}
                </div>
                <div className="mb-4 px-6 pb-3">
                  {isEditMode && (
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                      onClick={saveChanges}>
                      Save
                    </button>
                  )}
                </div>
              </div>
              <div className="bg-white p-6 rounded-[20px] border-2 border-[#ececec]">
      {/* Header Section */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gray-200 p-2 rounded-full">
        <img
            src={profile}
            alt="Google Drive"
            className="w-8 h-8"
          />
        </div>
        <h2 className="text-lg font-semibold text-gray-800">Accounts</h2>
      </div>

      {/* Google Drive Account */}
      <div className="flex items-center justify-between border-b border-gray-300 pb-4 mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={googledrive}
            alt="Google Drive"
            className="w-8 h-8"
          />
          <div>
            <p className="text-gray-900 font-medium">Google Drive</p>
            <p className="text-sm text-gray-500">alicejohnes@gmail.com</p>
          </div>
        </div>
        {/* Toggle Button */}
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" defaultChecked />
          <div className="w-10 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-400 rounded-full peer peer-checked:bg-green-500 transition-all"></div>
          <span className="w-4 h-4 bg-white rounded-full absolute left-1 top-1 peer-checked:translate-x-4 transition-transform"></span>
        </label>
      </div>

      {/* DropBox Account */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
                    src={dropbox}
            alt="Dropbox"
            className="w-8 h-8"
          />
          <p className="text-gray-900 font-medium">Drop Box</p>
        </div>
        <button className="text-sm font-medium text-gray-600 bg-gray-100 px-4 py-1 rounded-full border border-gray-300 hover:bg-gray-200 transition">
          Connect
        </button>
      </div>
    </div>
              <div className="bg-white p-6 rounded-[20px] border-2 border-[#ececec]">
                <div className="flex items-center justify-start mb-4">
                  <span className="rounded-full p-2 bg-white shadow-md">
                    <img src={key} alt="" className="h-[25px]" />
                  </span>
                  <h2 className="text-lg font-semibold ml-2">Secure Personal Information</h2>
                </div>
                <p className="text-gray-500 mb-4">
                  Please re-enter your password to view or edit this information.
                </p>
                {/* <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                  Gain Access
                </button> */}
                <button className="text-blue-600 border w-full 2xl:w-4/12 font-medium hover:border-green-400 border-[#0067FF] px-4 py-2 rounded-lg text-sm hover:text-green-500">Gain Access</button>
              </div>
   
            </div>
            <div className="md:w-3/5 flex flex-col w-full gap-6">
              <div className="bg-white p-6 rounded-[20px] border-2 border-[#ececec]">
                <div className="p-6 mb-10 rounded-[8px] border-2 border-[#ececec]">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{
                        width:
                          folderSize && folderSize.value
                            ? `${Math.min(
                                (convertToGB(folderSize.value, folderSize.unit) / 20) * 100,
                                100
                              )}%`
                            : "0%", 
                      }}
                    ></div>
                  </div>
                  {/* <p className="text-gray-500">10.47 GB of 20 GB</p> */}
                  {error ? (
        <p className="text-red-500">{error}</p>
      ) : folderSize !== null ? (
        <p className="text-gray-500">
          {folderSize.value} {folderSize.unit} of 20 GB
        </p>
      ) : (
        <p className="text-gray-500">Loading...</p>
      )}
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Storage Used</h2>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-[20px] border-2 border-[#ececec]">
                <div className="flex flex-col lg:flex-row md:justify-between lg:items-center mb-4">
                  <div className="flex items-center justify-start mt-2 mb-4">
                    <span className="rounded-full p-2 bg-white shadow-md">
                      <img src={file} alt="" className="h-[25px]" />
                    </span>
                    <h2 className="text-lg font-semibold ml-2">Subscription Plan</h2>
                  </div>
                  <button className="text-blue-600 border font-medium border-[#0067FF] bg-[#0067FF14] px-4 py-2 rounded-lg text-sm">Deactivate Subscription</button>
                </div>
                <div className="border-2 border-blue-600 rounded-lg p-8 mb-4">
                  <p className="text-black text-xs mb-1 font-semibold">STANDARD</p>
                  <div className="flex justify-between md:mr-3 items-center flex-col lg:flex-row">
                    <div className="flex items-center">
                      <h1 className="text-5xl font-semibold">$4.99</h1>
                      <span className="text-4xl text-gray-500 ml-2">/mo</span>
                    </div>
                    <img src={filefolder} alt="Subscription plan icon" className="mt-4 w-28" />
                  </div>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
                onClick={()=>setMemb(true)}>
                  Upgrade Plan
                </button>
              </div>
              <div className="bg-white p-6 rounded-[20px] border-2 border-[#ececec]">
                <div className="flex items-center mb-4">
                  <span className="rounded-full p-2 bg-white shadow-md">
                    <img src={security} alt="" className="h-[25px]" />
                  </span>
                  <h2 className="text-lg font-semibold ml-2">Log Out of Your Account</h2>
                </div>
                <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg my-2 hover:text-red-500" onClick={logout}>
                  Log Out
                </button>
                <p className="text-gray-500 my-2">
                  Click to securely log out of your account. We'll save all your
                  progress for when you return.
                </p>
              </div>
              
            </div>
          </div>
        </div>
        {memb && (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full m-4 md:m-6">
      <h1 className="text-2xl font-semibold mb-6 text-left">Upgrade Plan</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Legacy Plan */}
        <div className="border  rounded-lg p-6">
          <div className="flex items-center mb-4">
          <img
              src={plans}
              alt="Heritage Plan Icon"
              className="mr-3 h-10 w-10"
            />
            <div>
              <p className="text-2xl font-bold">
                $99 <span className="text-lg font-normal">/Year</span>
              </p>
              <p className="text-lg">Legacy</p>
            </div>
          </div>
          <ul className="space-y-2">
            <li className="flex items-center">
              <i className="fas fa-check-circle text-green-500 mr-2"></i>50 GB Storage
            </li>
            <li className="flex items-center">
              <i className="fas fa-check-circle text-green-500 mr-2"></i>Enhanced Encryption
            </li>
            <li className="flex items-center">
              <i className="fas fa-check-circle text-green-500 mr-2"></i>Advanced Sharing Controls
            </li>
            <li className="flex items-center">
              <i className="fas fa-check-circle text-green-500 mr-2"></i>Advanced Nominee Assignment
            </li>
            <li className="flex items-center">
              <i className="fas fa-check-circle text-green-500 mr-2"></i>Google Drive, Dropbox Integration
            </li>
            <li className="flex items-center">
              <i className="fas fa-check-circle text-green-500 mr-2"></i>Automatic Photo Upload
            </li>
            <li className="flex items-center">
              <i className="fas fa-check-circle text-green-500 mr-2"></i>Priority Support
            </li>
            <li className="flex items-center">
              <i className="fas fa-check-circle text-green-500 mr-2"></i>Voice Memo
            </li>
          </ul>
        </div>
        {/* Heritage Plan */}
        <div className="border border-gray-300 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <img
              src={plans}
              alt="Heritage Plan Icon"
              className="mr-3 h-10 w-10"
            />
            <div>
              <p className="text-2xl font-bold">Custom Pricing</p>
              <p className="text-lg">Heritage</p>
            </div>
          </div>
          <ul className="space-y-2">
            <li className="flex items-center">
              <i className="fas fa-check-circle text-green-500 mr-2"></i>Custom Storage Options
            </li>
            <li className="flex items-center">
              <i className="fas fa-check-circle text-green-500 mr-2"></i>Top Compliance Level Encryption
            </li>
            <li className="flex items-center">
              <i className="fas fa-check-circle text-green-500 mr-2"></i>Full Sharing & Customization
            </li>
            <li className="flex items-center">
              <i className="fas fa-check-circle text-green-500 mr-2"></i>Custom Inheritance Options
            </li>
            <li className="flex items-center">
              <i className="fas fa-check-circle text-green-500 mr-2"></i>Full Suite of Integrations
            </li>
            <li className="flex items-center">
              <i className="fas fa-check-circle text-green-500 mr-2"></i>Automatic Photo Upload
            </li>
            <li className="flex items-center">
              <i className="fas fa-check-circle text-green-500 mr-2"></i>24/7 Dedicated Support
            </li>
            <li className="flex items-center">
              <i className="fas fa-check-circle text-green-500 mr-2"></i>Voice Memo, Notepad
            </li>
            <li className="flex items-center">
              <i className="fas fa-check-circle text-green-500 mr-2"></i>Customizable Solutions
            </li>
          </ul>
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <button className="text-gray-500 mr-4 text-sm"
        onClick={()=>setMemb(false)}>Cancel</button>
        <button className="bg-blue-500 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors">
          Upgrade
        </button>
      </div>
    </div>
  </div>
)}

      
      </div>

     

    </div>
  );
};
export default Profile;