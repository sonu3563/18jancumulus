import React, { useState, useEffect, useRef } from "react";
import { API_URL } from "../utils/Apiconfig";
import editicon from "../../assets/editicon.png";
import shareicondesignee from "../../assets/shareicondesignee.png";
import foldericon from "../../assets/foldericon.png";
import eyeicon from "../../assets/eyeicon.png";
import trashicon from "../../assets/trashicon.png";
import downloadicon from "../../assets/downloadicon.png";
import usePopupStore from "../../store/DesigneeStore";
import useFolderDeleteStore from "../../store/FolderDeleteStore";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Trash2,
  UploadCloud,
  X,
  Eye,
  Edit,
  Folder,
  Users,
  ChevronDown,
  Camera,
  Download,
  Loader2,
  EllipsisVertical,
  Grid,
  Menu,
  LayoutGrid,
  Share2Icon,
  Search,
  Check,
  FileClock,
  FilePenLine,
} from "lucide-react";

import upload from "../../assets/upload.png";

import axios from "axios";

import mammoth from "mammoth";

import { useParams, NavLink, Navigate } from "react-router-dom";

import useLoadingStore from "../../store/UseLoadingStore";
import VersionHistory from "./VersionHistory";

const PublicDashboard = ({ folderId }) => {
  const openPopup = usePopupStore((state) => state.openPopup);
  const { id: routeFolderId } = useParams();
  const [fileIds, setFileIds] = useState([]);
  const activeFolderId = folderId || routeFolderId;
  const [fileName, setFileName] = useState(null);
  const [deletefolderid, setDeletefolderid] = useState("");


  const [files, setFiles] = useState([
    {
      name: "Real Estate 4.zip",

      folder: "",

      date: "Feb 6, 2024",

      contact: "rahul",

      tag: "Will",
    },
  ]);
  console.log(files);
  const [openMenuId, setOpenMenuId] = useState([]);
  const [showOverlay, setShowOverlay] = useState(false);


  const [fileData, setFileData] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const [expandedRow, setExpandedRow] = useState(null);
  const [folderSize, setFolderSize] = useState(null);
  // const [deletebutton, setDeletebutton] = useState(false);

  // const [people, setPeople] = useState([

  //   { name: "Hariom Gupta (you)", email: "hg119147@gmail.com", role: "Owner" },

  //   { name: "Akash", email: "Akahs@gmail.com", role: "" },

  // ]);

  // const [showDesignerPopup, setShowDesignerPopup] = useState(false); // Toggles the popup visibility
  // const [designeeName, setDesigneeName] = useState(""); // Holds the input for designee name
  // const [designeePhone, setDesigneePhone] = useState(""); // Holds the input for designee phone number
  // const [designeeEmail, setDesigneeEmail] = useState(""); // Holds the input for designee email

  const [need, setNeed] = useState([]);
  const menuRef = useRef(null);
  const [access, setAccess] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, [folderId]);
  const toggleEllipses = (fileId) => {
    // Toggle the menu for the specific file by comparing the IDs
    setOpenMenuId((prevId) => (prevId === fileId ? null : fileId));
  };


  // useEffect(() => {
  //   // console.log("API response for fileIds (updated):", fileIds);
  // }, [fileIds]);

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
        // console.error('Error fetching folder size:', err);
        // setError('Failed to retrieve folder size');
        const unit = 'KB';
        setFolderSize({ value: 0 , unit });
      }
    };

    fetchFolderSize();
  }, []);

const filteredFiles = files;
const filteredMobileFiles = files

  const fetchFiles = async () => {
    setLoading(true);
    setFiles([]);
    setError(null);

    try {
      
        console.log("fetch folder", folderId);
        // console.log("Folder ID is 0, fetching all files for userId:", userId);

        const response = await axios.get(
          `${API_URL}/api/default/default-files`
        );

        // console.log("API response for defaultttttttttttt:", response.data);

        const filesArray = response.data?.files || []; // Extract the files array

        setFiles(filesArray); // Set only the files array to the state   

        setNeed(true);
    } catch (error) {
      // console.error("Error fetching files:", error.response || error.message);

      // console.log(error.response?.data?.message || "Error fetching files.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRow = (_id) => {
    // console.log("Toggling row with id:", _id); // Log the ID when toggling the row

    setExpandedRow((prev) => {
      const newExpandedRow = prev === _id ? null : _id;

      // console.log("Updated expandedRow:", newExpandedRow); // Log the new expandedRow value

      return newExpandedRow;
    });
  };


  console.log(folderId);

 
  const fetchFileContent = async (fileId) => {
    try {
      setLoading(true);
      setError("");

      // const token = Cookies.get('token');
   

      // console.log("defaultttttttttttttt", fileId);

      // if (folderId === 1 || folderId === "1") {
        // console.log("defaultttttttttttttttttttt", fileId);
        // console.log("inside 1");
        const response = await axios.get(
          `${API_URL}/api/default/view-file/${fileId}`
        );

        if (response.status !== 200) {
          throw new Error(
            `Failed to fetch file, status code: ${response.status}`
          );
        }
        // console.log("11");
        const { file_name, aws_file_link, mime_type } = response.data.file;

        if (!aws_file_link) {
          throw new Error("File URL is missing from the response.");
        }
        // console.log("12");
        setFileData({
          fileName: file_name || "Unknown",
          mimeType: mime_type || "Unknown",
          fileUrl: aws_file_link,
        });
        // console.log("13",fileData);
        setShowOverlay(true);

    } catch (err) {
      // console.error("Error fetching file content:", err);
      setError(
        err.response?.data?.message ||
        "An unexpected error occurred while fetching the file content."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderFileContent = () => {
    // console.log("14");
    if (!fileData || !fileData.fileUrl) return null;
// console.log("15");
    const { mimeType, fileUrl } = fileData; // Destructuring to get mimeType and fileUrl from state

    const supportedImageTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/svg+xml",
      "jpeg",
      "jpg",
      "png",
      "heic", // For iPhone-specific images
      "image/heic" // For iPhone-specific images
    ];
    
    if (mimeType.startsWith("image/") || supportedImageTypes.includes(mimeType) || fileUrl.match(/\.(jpeg|jpg|png|gif|svg|heic)$/i)) {
      return (
        <div>
          <img
            src={fileUrl}
            alt="file content"
            // style={{ width: "100%", maxHeight: "500px" }}
            className="min-w-full max-h-[90vh] object-contain rounded-md"
            onError={(e) => {
              // console.error("Error loading image:", e);

              e.target.src = "https://via.placeholder.com/500"; // Fallback if image fails to load
            }}
          />
        </div>
      );
    }

    // Handle PDF files

    if (mimeType === "application/pdf" || mimeType === "pdf") {
 
      return (
        <iframe
          src={`${fileUrl}#toolbar=0&navpanes=0`}
          title="PDF Document"
          // style={{ width: "500vw", height: "500vh", border: "none" }}
          className="h-[90vh] w-[90vw]"
        />
      );
    }

    // Handle Word Documents (.docx) via Google Docs Viewer

    if (
      mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      mimeType === "application/msword" ||
      mimeType === "docx" // In case backend sends 'docx' instead of full MIME type
    ) {
      const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(
        fileUrl
      )}&embedded=true`;

      return (
        <iframe
          src={googleDocsUrl}
          farmeBorder="0"
          allowFullScreen={false}
          title="Word Document Viewer"
          style={{ width: "90vw", height: "90vh", border: "none" }}
          className="iframe-no-interaction"

        />
      );
    }

    // Handle Excel files (e.g., .xlsx, .xls)

    if (
      mimeType ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      mimeType === "application/vnd.ms-excel"
    ) {
      return (
        <div>
          <p>Spreadsheet detected. Please download to view:</p>

          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            Download Spreadsheet
          </a>
        </div>
      );
    }

    // Default fallback for unsupported file types

    return <p>Unsupported file type for viewing.</p>;
  };


  useEffect(() => {
    // Disable right-click
    const disableContextMenu = (e) => e.preventDefault();
    document.addEventListener("contextmenu", disableContextMenu);

    // Detect screenshot tools
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        document.body.style.filter = "brightness(0)"; // Make screen black
      } else {
        document.body.style.filter = "none"; // Restore visibility
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("contextmenu", disableContextMenu);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
   const renderOverlay = () => {
 
 
     return (
       <div
         className="fixed top-0 pt-10 left-0 w-[100vw] h-[100%] bg-[rgba(0,0,0,0.8)] text-white z-[1000] flex justify-center items-center"
       >
         <div className="h-10 w-screen pr-2 md:pr-10 mb-4 fixed top-0 flex justify-between">
           <div>
             <p className="p-4">{fileName}</p>
           </div>
 
           <div className="flex gap-x-4 md:gap-x-10 p-4">
             {/* <button 
           className="hidden w-40 h-10 rounded bg-blue-500 md:flex p-2 text-white"
           onClick={() => {
             setEditFileId(file._id);
             setTempFName(fileName);
           }}
           
           >Edit document <FilePenLine className="ml-3" /></button>
           <button className="w-14  md:hidden  h-10 rounded bg-blue-500 flex p-2 text-white"><FilePenLine className="ml-3" /></button>
           <button 
           // onClick={handleDownloadFile(fileId)}
           ><p ><Download  className="mt-2 cursor-pointer"/></p></button> */}
             <button
               className="  text-white mt-2"
               onClick={() => setShowOverlay(false)}
             >
               <X />
             </button>
           </div>
 
         </div>
         <div
           className="text-black mt-4 flex justify-center items-center p-5 rounded-lg min-w-[20%] min-h-[90%] relative h-auto"
           style={{
             userSelect: "none", // Disable text selection if needed
             // Removed pointerEvents: "none" to allow interactions
           }}
         >
 
           {renderFileContent()}
 
         </div>
       </div>
 
     );
   };





  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null); // Close the menu
      }
    };

    // Attach event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);



  return (
    <>
       <div className="mt-2 bg-white rounded hidden md:flex max-h-[70vh] pb-[100px] overflow-y-scroll">
                <table className="w-full">
                  <thead className="sticky top-0 ">
                    <tr className="bg-gray-100 text-left text-[0.8rem]  border-black">
                      <th className="p-2 md:p-4 font-medium text-[#667085] text-sm">
                        File Name
                      </th>
                      <th className="p-2 md:p-4 font-medium text-[#667085] text-sm">
                        Folder
                      </th>
                      <th className="p-2 md:p-4 font-medium text-[#667085] text-sm">
                        Date Uploaded
                      </th>
    
                    </tr>
                  </thead>
    
                  <tbody className="">
                  {Array.isArray(filteredFiles) && filteredFiles.length > 0 ? (

                      // If files is an array, use map
    
                      filteredFiles.map((file) => {
                        // console.log("File Object:", file); // Debugging file object
    
                        const isExpanded = expandedRow === file._id; // Check if the current row is expanded
    
                        return (
                          <React.Fragment key={file._id}>
                            {/* Main Row */}
                            <tr
                              className={`text-xs sm:text-sm border-b-2 ${isExpanded ? "bg-blue-100 border-blue-100" : ""
                                } transition-all duration-100`}
                            >
                              <td className="p-0 md:p-4 flex items-center gap-0 md:gap-2">
                                <button
                                  className="text-gray-500 hover:text-gray-800"
                                  onClick={() => {
                                    // console.log("1", folderId);
                                    if (folderId !== "1" || folderId !== 1) {
                                      // console.log("2", folderId);
                                      setDeletefolderid(file.folder_id?.['_id']);
                                    }
    
                                    handleToggleRow(file._id);
                                    setFileName(file.file_name);
                                  }}
    
    
                                >
                                    
                                  <ChevronDown
                                    className={`${isExpanded ? "rotate-180" : ""
                                      } h-5 transition-transform`}
    
                                  />
                                  
                                </button>
                                {file.file_name}
    
                              </td>
    
                              <td className="p-0 md:p-4">
                                <div
                                  className={`bg-[#EEEEEF] rounded-lg px-3 py-1 text-[1rem] inline-block transition-all duration-300 ${isExpanded ? "bg-white" : "bg-[#EEEEEF]"
                                    }`}
                                >
                                  {file.folder_name ? file.folder_name : 'Cumulus'}
    
                                </div>
                              </td>
                              <td className="p-0 md:p-4">
                                <p className="text-xss sm:text-sm text-gray-600 mt-1">
                                  {file.date_of_upload &&
                                    !isNaN(new Date(file.date_of_upload))
                                    ? new Date(file.date_of_upload).toLocaleString("en-US", {
                                      weekday: "short",
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                      hour: "numeric",
                                      minute: "numeric",
                                      hour12: true, // for 12-hour format
                                    })
                                    : "Invalid Date"}
                                </p>
                              </td>
                              <td className="p-0 md:p-4">
                                {/* {file.sharing_contacts} */}
    
                                {/* <span className="h-5 w-5 bg-slate-100 rounded-lg p-2">Nishant</span>
                                <span className="h-5 w-5 bg-slate-100 rounded-lg p-2 ml-3">+6</span> */}
    
                                {file.access_details && file.access_details.length > 0 ? (
                                  <div className="flex items-center gap-2">
                                    {/* Display the first designee's name */}
                                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs sm:text-sm">
                                      {file.access_details[0].designee.name}
                                    </span>
                                    {/* If more designees exist, show the count */}
                                    {file.access_details.length > 1 && (
                                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs sm:text-sm">
                                        +{file.access_details.length - 1}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-gray-500 text-xs sm:text-sm"></span>
                                )}
    
    
                              </td>
                            </tr>
    
                            {/* Expanded Row */}
                            {isExpanded && (
                              <tr className="">
                                <td
                                  colSpan="5"
                                  className="px-4 pb-4 border-r border-blue-100 bg-blue-100 rounded-bl-3xl rounded-br-3xl"
                                >
                                  <div className="flex gap-4 items-center">
    
                                    <button
                                      className="relative group flex items-center gap-2 text-gray-600 hover:text-blue-500"
                                      onClick={() => {
                                        // console.log("heklko",file._id);
                                        fetchFileContent(file._id)
                                        // setOverlayFileId(file.file._id)
                                      }
    
    
    
                                      }
                                    >
                                      <img src={eyeicon} alt="" className="h-4" />
                                      <span className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-white text-black text-xs py-1 px-2 rounded shadow z-20">
                                        View
                                      </span>
                                    </button>
    
                                    {/* Conditionally render Files and Voice based on availability */}
                                    {file.hasFile && (
                                      <div className="text-gray-600">
                                        <h3>Files:</h3>
                                        {/* Display the file content or link here */}
                                        <p>{file.fileContent || "No file content available"}</p>
                                      </div>
                                    )}
                                    {file.hasVoice && (
                                      <div className="text-gray-600">
                                        <h3>Voice:</h3>
                                        {/* Display the voice content or player here */}
                                        <audio controls>
                                          <source src={file.voiceUrl} type="audio/mp3" />
                                          Your browser does not support the audio element.
                                        </audio>
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
    
                        );
                      })
                    ) : (
                      // If files is not an array (single file object), render the row without map
    
                      <React.Fragment key={files._id}>
                        {/* Main Row */}
    
                        <tr className="text-sm">
                          <td className="p-0 md:p-4 flex items-center gap-0 md:gap-2">
                            <button
                              className="text-gray-500 hover:text-gray-800"
                              onClick={() => handleToggleRow(files._id)} // Toggle specific file row
                            >
                              <ChevronDown
                                className={
                                  expandedRow === files._id ? "rotate-180" : ""
                                }
                              />
                            </button>
    
                            {files.file_name}
                          </td>
    
                          <td className="p-0 md:p-4">{files.folder_name}</td>
    
                          <td className="p-0 md:p-4">{files.date_of_upload}</td>
    
                          <td className="p-0 md:p-4">{files.tags}</td>
                        </tr>
    
                        {/* Expanded Actions */}
    
                        {expandedRow === files._id && (
                          <tr className="bg-white">
                            <td colSpan="5" className="p-4">
                              <div className="flex gap-4 items-center">

    
                                {/* Access Button */}
    
                                <button
                                  className="flex items-center gap-2 text-gray-600 hover:text-blue-500"
                                  onClick={() => setAccess(true)}
                                >
                                  {/* <Folder className="h-4" /> */}
    
                                  <img src={foldericon} alt="" className="h-6" />
    
                                  <img src={foldericon} alt="" className="h-4" />
                                </button>
    
                              
    
                                {/* View Content Button */}
    
                                <button
                                  className="flex items-center gap-2 text-gray-600 hover:text-blue-500"
                                  onClick={() => fetchFileContent(files._id)}
                                >
                                  {/* <Eye className="h-4" /> */}
                                  <img src={eyeicon} alt="" className="h-4 " />
                                </button>
    
                               
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    )}
                  </tbody>
                </table>
              </div>
              {showOverlay && renderOverlay()}


<div className="grid grid-cols-1 gap-4 md:hidden p-1 max-h-[50vh] overflow-y-scroll bg-white mt-2 ">
                {Array.isArray(filteredMobileFiles) && filteredMobileFiles?.length > 0 &&
                filteredMobileFiles.map((file) => (

                <div key={file._id} className="border p-2 rounded  ">
                  <div className="flex justify-between relative">
                    
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium">
                        {
  file.file_name && file.file_name.length > 20
    ? `${file.file_name.substring(0, 20)}...`
    : `${file.file_name || "Untitled File"}`
}


                        </h3>
                      </div>
                    

                    {/* Ellipsis Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleEllipses(file._id);
                      }}
                    >
                      <EllipsisVertical />
                    </button>

                    {/* Dropdown Menu */}
                    {openMenuId === file._id && (
                      <div
                        ref={menuRef}
                        className="absolute top-5 right-6 mt-2 w-48 bg-white shadow-lg rounded-lg text-black flex flex-col gap-y-2 p-2 z-50 "
                        initial={{ opacity: 0, scale: 0.9, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                      >

                       

                        <button
                          className="flex items-center gap-2 text-gray-600 hover:text-blue-500"
                          onClick={() => {
                            fetchFileContent(file._id);
                            setOpenMenuId(null); // Close menu after selecting
                          }}
                        >
                          {/* <Eye className="h-4" /> */}
                          <img src={eyeicon} alt="" className="h-4" />
                          View Content
                        </button>

                      </div>
                    )}
                  </div>

                  <span className="">
                    <p className="text-lg text-gray-500">{file.date_of_upload}</p>
                  </span>

                  <span className="">
                    <p className=" text-sm text-gray-800  ">
                      {file.date_of_upload &&
                        !isNaN(new Date(file.date_of_upload))
                        ? new Date(file.date_of_upload).toLocaleString(
                          "en-US",
                          {
                            weekday: "short",

                            year: "numeric",

                            month: "short",

                            day: "numeric",

                            hour: "numeric",

                            minute: "numeric",

                            // second: 'numeric',

                            hour12: true, // for 24-hour format
                          }
                        )
                        : "Invalid Date"}
                    </p>
                  </span>

                  {/* <span className="flex justify-between">
                    <p className="text-sm text-gray-600"> */}
                  {/* Sharing contact: {file.folder_contact} */}


                  {/* </p>
                  </span> */}

                  <div className="flex  w-full justify-between h-10 relative">
                    <div></div>

                    <div className="flex">



                      {file.access_details && file.access_details.length > 0 ? (
                        file.access_details.slice(0, 3).map((detail, index) => (
                          <img
                            key={index}
                            src={detail.designee.profile_picture || "/default-profile.png"}
                            alt={detail.designee.name}
                            className={`absolute shadow-lg h-8 w-8 rounded-full ${index === 0
                              ? "z-20 right-6"
                              : index === 1
                                ? "z-10 right-10"
                                : "z-0 right-14"
                              }`}
                          />
                        ))
                      ) : (
                        <span className="text-gray-500"></span>
                      )}
                    </div>
                  </div>

                  <div className="mt-2 flex gap-2"></div>
                </div>
              ))}
          
          </div>
          </>
   );
};

  
export default PublicDashboard;