import React, { useState, useEffect } from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaPlay,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import {Link } from "react-router-dom"
import { Loader2, Camera } from "lucide-react";
import phoneIcon from "../../assets/phone-icon.png";
import useLoadingStore from "../../store/UseLoadingStore";
import emailIcon from "../../assets/email-icon.png";
import youtube from "../../assets/youtube.png";
import checkSecurity from "../../assets/check-security.png";
import axios from "axios";
import { API_URL } from "../utils/Apiconfig";
import usePopupStore from "../../store/DesigneeStore";
import DesignerPopup from "./Designeepopup";
import useFolderDeleteStore from "../../store/FolderDeleteStore";
const Help = () => {
  const [faqs, setFaqs] = useState([]);
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [question, setQuestion] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const { isLoading, showLoading, hideLoading } = useLoadingStore();
  const [isSubmitted, setIsSubmitted] = useState(false); // Track submission status
  const [file, setFile] = useState(null);

  const {
    showDesignerPopup,
    closePopup,
    designeeName,
    setDesigneeName,
    designeePhone,
    setDesigneePhone,
    designeeEmail,
    setDesigneeEmail,
  } = usePopupStore();

  const {
    deletebuttonfolder,
    setDeletebuttonfolder,
    setSelectedFolder,
    selectedFolder,
    deleteFolder,
    openMenufolderId,
    setOpenMenufodlerId,
  } = useFolderDeleteStore();
  useEffect(() => {
    const email = localStorage.getItem("email");
    // console.log("EMAIL IN HELP",email);
  }, []);
  const handleSendQuery = async () => {
    showLoading();
    const email = localStorage.getItem("email");
    // console.log("EMAIL IN HELP", email);
    // console.log("EMAIL IN question", question);

    if (!question.trim()) {
      setStatusMessage("Please describe the issue you're experiencing.");
      return;
    }

    if (!email) {
      setStatusMessage("No email found. Please log in.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/email/sendhelpqueries`,
        {
          query: question,
          email: email,
        }
      );

      if (response.status === 200 || response.data.success) {
        // setStatusMessage("Query sent successfully!");
        setIsSubmitted(true);
        setQuestion(""); // Clear the textarea after sending
      } else {
        throw new Error("Failed to submit query, server responded with error.");
      }
    } catch (error) {
      // console.error("Error submitting query:", error);
      // setStatusMessage("Error submitting query. Please try again later.");
    } finally {
      hideLoading();
    }
  };

  const handleAddDesignee = async () => {
    const token = localStorage.getItem("token");
    if (!designeeName || !designeePhone || !designeeEmail) {
      alert("Please fill in all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("profilePicture", file);
    formData.append("designeeName", designeeName);
    formData.append("designeePhone", designeePhone);
    formData.append("designeeEmail", designeeEmail);

    try {
      const response = await axios.post(
        `${API_URL}/api/designee/add-designee`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        alert(response.data.message);
        closePopup(); // Close the popup on success
      } else {
        alert("Error: " + response.data.message);
      }
    } catch (error) {
      // console.error("Error adding designee:", error);
      alert("Error adding designee. Please try again later.");
    } finally {
    }
  };

  const predefinedFAQs = [
    {
      question: "What is Cumulus?",
      answer:
        "Cumulus is a secure digital vault platform designed to store, manage, and share your important documents. \nIt offers features like after-life access, designee workflows, and secure document sharing.",
    },
    {
      question: "Who can use Cumulus?",
      answer:
        "Anyone who needs to securely store and manage important documents can use Cumulus.",
    },
    {
      question: "What makes Cumulus secure?",
      answer:
        "Cumulus uses advanced encryption and security protocols to ensure your documents are safe and secure.",
    },
  ];
  const handlePhoneClick = () => {
    window.location.href = "tel:800-371-3193";
  };
 
  const handleEmailClick = () => {
    const email = "support@cumulus.rip"; 
    const subject = "Request Query";
    const body = ""; 
    

    const gmailComposeUrl = `https://mail.google.com/mail/u/0/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    

    window.open(gmailComposeUrl, "_blank");
  };
  
  
  
  
  
  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);

  };
  return (
    <div className="mx-auto p-4">
      <div className="flex justify-between items-center my-6 gap-4 flex-wrap ">
        <h1 className="text-2xl font-normal text-[#1F1F1F]">Help & Support</h1>
        <div className="flex space-x-4">
          <button
            className="flex items-center space-x-2 border border-gray-300 rounded-lg px-4 py-2"
            onClick={handlePhoneClick}
          >
            <img src={phoneIcon} className="h-[20px]" alt="Phone Icon" />
            <span>Contact Us</span>
          </button>
          <button
            className="flex items-center space-x-2 border border-gray-300 rounded-lg px-4 py-2"
            onClick={handleEmailClick}
          >
            <img src={emailIcon} className="h-[16px]" alt="Email Icon" />
            <span>Email Us</span>
          </button>



        </div>
      </div>
      <div className="overflow-y-scroll scrollbar-thin mt-2 bg-white h-[50vh] w-full py-0 px-4">
        <div className="  flex flex-col md:flex-row gap-6 px-2 my-4">
          <div className="md:w-2/5 flex flex-col w-full gap-6">
            <p className="text-base font-normal text-[#212636]">
              Watch Demo Video
            </p>
            <div className="relative group mx-2">
              <img
                alt="Screenshot of Cumulus platform with a play button overlay"
                className="rounded-lg shadow-md transition-transform duration-300 group-hover:scale-100"
                height="400"
                src="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2Vic2l0ZSUyMGRhc2hib2FyZCUyMHNjcmVlbnxlbnwwfHwwfHx8MA%3D%3D"
                width="550"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 rounded-lg group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button className="rounded-full transform scale-100 group-hover:scale-110 transition-transform duration-300">
                  <img src={youtube} className="h-[35px]" alt="Play button" />
                  {/* <FaPlay className="text-2xl text-gray-700" /> */}
                </button>
              </div>
            </div>
            {/* <p className="text-base text-[#667085]">Watch Demo Video</p> */}
          </div>
          <div className="md:w-3/5 flex flex-col w-full gap-6">
            <h2 className="text-base font-normal text-[#212636]">
              General Questions FAQs
            </h2>
            <div className="bg-[#F6F7F9] rounded-lg shadow-md">
              <div className="bg-[#F6F7F9] rounded-lg shadow-md">
                <div className="space-y-4">
                  {/* Render predefined FAQs */}
                  {predefinedFAQs.map((faq, index) => (
                    <div
                      className="border-b-2 border-[#DCDFE4] p-4 !my-1 mr-5"
                      key={`predefined-${index}`}
                    >
                      <button
                        className="faq-button flex justify-between items-center w-full text-left text-gray-700 font-medium"
                        onClick={() => toggleFAQ(index)}
                      >
                        <span>{faq.question}</span>
                        {activeFAQ === index ? (
                          <FaChevronUp />
                        ) : (
                          <FaChevronDown />
                        )}
                      </button>
                      {activeFAQ === index && (
                        <p className="p-3 text-gray-600 whitespace-pre-wrap break-words max-w-full">
                          {faq.answer}
                        </p>
                      )}
                    </div>
                  ))}

                  {/* Render dynamic FAQs */}
                  {faqs.length > 0
                    ? faqs.map((faq, index) => {
                      const adjustedIndex = index + predefinedFAQs.length; // Offset the index
                      return (
                        <div
                          className="border-b-2 border-[#DCDFE4] p-4 !my-1 mr-5"
                          key={`dynamic-${index}`}
                        >
                          <button
                            className="faq-button flex justify-between items-center w-full text-left text-gray-700 font-medium"
                            onClick={() => toggleFAQ(adjustedIndex)}
                          >
                            <span>{faq.question}</span>
                            {activeFAQ === adjustedIndex ? (
                              <FaChevronUp />
                            ) : (
                              <FaChevronDown />
                            )}
                          </button>
                          {activeFAQ === adjustedIndex && (
                            <p className="text-gray-600 p-4 whitespace-pre-wrap break-words max-w-full">
                              {faq.answer}
                            </p>
                          )}
                        </div>
                      );
                    })
                    : ""}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="">
        <h2 className="text-base mb-2 text-[#212636]">
          Encountering an Issue? Let Us Know
        </h2>
        <textarea
          className="w-full border border-gray-300 rounded-lg p-4 placeholder-gray-9  00"
          placeholder="Describe the issue you're experiencing here."
          rows="4"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        ></textarea>
        <div className="flex justify-end mt-2">
          {isLoading ? (
            <button
              type="button"
              className="bg-blue-500 flex justify-center items-center cursor-not-allowed text-white text-xl font-semibold py-3 px-6 rounded-lg transition"
            >
              <Loader2 className="animate-spin h-6 w-6" />
            </button>
          ) : isSubmitted ? (
            <button
              type="button"
              className="bg-green-500 text-white text-xl font-semibold py-3 px-6 rounded-lg transition"
            >
              Submitted
            </button>
          ) : (
            <button
              type="button"
              className={`${question
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-blue-500 hover:bg-blue-600 cursor-not-allowed"
                } flex justify-center items-center text-white text-xl font-semibold py-3 px-6 rounded-lg transition`}
              disabled={!question}
              onClick={handleSendQuery}
            >
              Send
            </button>
          )}
        </div>
        {statusMessage && (
          <p className="mt-2 text-sm text-gray-600">{statusMessage}</p>
        )}
      </div>
      <div className="flex justify-end items-center mt-6 text-gray-500 text-sm">
        <img src={checkSecurity} className="h-[16px] mr-2" alt="" />
        <Link to="/termconditions"><span>Terms and Policy</span></Link>
      </div>
      {showDesignerPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-semibold">Add Designee</h3>
              <button onClick={closePopup} className="text-gray-500">
                ✕
              </button>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-center mb-4">
                <div className="w-24 h-24 rounded-full border-dashed border-2 flex items-center justify-center text-gray-500">
                  <Camera className="h-4 w-6" />
                </div>
              </div>
              <label className="block mb-2 text-sm font-medium">
                Enter Designee Name
              </label>
              <input
                type="text"
                placeholder="Designee Name"
                value={designeeName}
                onChange={(e) => setDesigneeName(e.target.value)}
                className="border p-2 rounded w-full mb-3"
              />
              <label className="block mb-2 text-sm font-medium">
                Enter Designee Phone Number
              </label>
              <input
                type="text"
                placeholder="Designee Phone Number"
                value={designeePhone}
                onChange={(e) => setDesigneePhone(e.target.value)}
                className="border p-2 rounded w-full mb-3"
              />
              <label className="block mb-2 text-sm font-medium">
                Enter Designee Email
              </label>
              <input
                type="email"
                placeholder="Designee Email"
                value={designeeEmail}
                onChange={(e) => setDesigneeEmail(e.target.value)}
                className="border p-2 rounded w-full mb-4"
              />
            </div>
            <button
              onClick={handleAddDesignee}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            >
              Invite to Cumulus
            </button>
          </div>
        </div>
      )}

      {deletebuttonfolder && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-labelledby="deleteModalLabel"
          aria-describedby="deleteModalDescription"
        >
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full m-2">
            <div className="flex justify-between items-center mb-4">
              <h2 id="deleteModalLabel" className="text-lg font-semibold">
                Are you sure you want to delete this folder?
              </h2>
            </div>
            <div
              id="deleteModalDescription"
              className="text-sm text-gray-600 mb-4"
            >
              This action cannot be undone. Please confirm if you'd like to
              proceed.
            </div>            <div className="flex justify-end gap-2 my-2">
              <button
                onClick={() => setDeletebuttonfolder(false)}
                className="border-2 border-blue-500 text-gray-700 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>              <button
                onClick={() => {
                  if (selectedFolder) deleteFolder(selectedFolder);
                  setDeletebuttonfolder(false);
                }}
                className="bg-blue-500 text-white px-6 py-2 rounded flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Help;
