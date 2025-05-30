import React, { useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import {
  Loader2
    } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../utils/Alerts";
import { NavLink } from "react-router-dom";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import editicon from "../../assets/edit-icon.png";
import profileicon from "../../assets/profile-icon.png";
import fetchUserData from "./fetchUserData";
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
import { FAPI_URL } from "../utils/Apiconfig";
import { FaPen } from "react-icons/fa";
import useLoadingStore from "../../store/UseLoadingStore";
import DropboxPicker from "../utils/GoogleDropboxPicker";
import GainAccess from "./gainaccess";
import defaultprofile from '../../assets/defaulttwo.jpeg'
import { Check, X } from "lucide-react";
const DROPBOX_APP_KEY = "oy5t6b3unmpbk0b";  // Replace with your actual Dropbox App Key
const DROPBOX_APP_SECRET = "4jne7a8ly866znt";  // Replace with your actual Dropbox App Secret setGoogleemail  deletebutton1
const DROPBOX_REDIRECT_URI = `${FAPI_URL}/my-profile`;
const Profile = () => {
  const { isLoading, showLoading, hideLoading } = useLoadingStore();
  const [folderSize, setFolderSize] = useState(null);
  const [deletebutton1, setDeletebutton1] = useState(null);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [needshow, setNeedshow] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [memb, setMemb] = useState(false);
  const [connected, setConnected] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [googleDriveData, setGoogleDriveData] = useState(null);
const [dropboxData, setDropboxData] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem("dropboxAccessToken") || "");
  const [googleUser, setGoogleUser] = useState(null);
  const [information, setInformation] = useState(null);
  const [googleemail, setGoogleemail] = useState(null);
  const [validate, setValidate] = useState(true);
  const [plan, setPlan] = useState("");
  const [cut, setCut] = useState(false);
  const [planName, setPlanName] = useState("");
const [planType, setPlanType] = useState("");
const [storageData, setStorageData] = useState(null);
const [storageData1, setStorageData1] = useState(null);
const [voiceMemoData, setVoiceMemoData] = useState(null);
const [planPrice, setPlanPrice] = useState("");
  const [UpdatePassword, setUpdatePassword] = useState(false);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
       const [countryCode, setCountryCode] = useState('+1'); 
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [phoneverifybox, setPhoneverifybox] = useState(false);
  const [otpverifybox, setOtpverifybox] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { profilePicture, setProfilePicture } = useContext(ProfileContext);
  const navigate = useNavigate();
  // Fetch user details on component mount
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [socialSecurityNumber, setSocialSecurityNumber] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
 const [phoneNumber, setPhoneNumber] = useState(''); // Phone number input
    const [isotpsendbox, setIsotpsendbox] = useState(false);
    const [otp, setOtp] = useState(Array(6).fill(""));

    const verifyOTP = async () => { 
      console.log("otp", otp);
      console.log("phone", `${countryCode}${phoneNumber}`);

      if (!otp || !phoneNumber) {
        console.error("Missing OTP or Phone Number");
        // alert("OTP and phone number are required!");
        return;
      }
     
    try {
      const requestBody = {
        phoneNumber: `${countryCode}${phoneNumber}`, 
        otp: otp.toString().trim()
    };

    console.log("Request Body:", requestBody);
  
      // Making the POST request using axios
      const response = await axios.post(`${API_URL}/api/otp/verify-otp`, requestBody, {
          headers: {
            'Content-Type': 'application/json',
          },
      });
      
      // Directly access the response data
      const data = response.data;
      console.log("response",data);
      if (data.success) {
      setMessage('Phone number verified successfully!');
          await updatePhoneNumber();
   
        }
        else{
          console.error("Error verifying OTP:", data.message);
          // alert(data.message || "Verification failed. Please try again.");
          showAlert("error", "Failed", "Otp is invalid or expired");

        }
      
      }catch (error) {
        console.error("Error verifying OTP:", error.response ? error.response.data : error.message);
        // alert('Error: OTP verification failed.');
        showAlert("error", "Failed", error.message);
      }
    };


  const updatePhoneNumber = async () => {
        const phone = { email, phoneNumber }; // Ensure you're sending email and phoneNumber

        // console.log("Login Payload:", phone);

        try {
            const response = await fetch(`${API_URL}/api/auth/update-phone`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(phone),
            });

            // Check if the response is successful
            if (response.ok) {
                const data = await response.json();  // Parse the response body as JSON
                setMessage(data.message || "Phone number updated successfully.");
          setOtpverifybox(false);
          fetchUserData();
          setIsEditMode(false);
            } else {
                // If response is not successful, handle the error
                const errorData = await response.json();  // Parse the error response
                if (errorData.message === "This phone number is already registered.") {
                    setMessage("This phone number is already registered with another account.");
                } else {
                    setMessage(errorData.message || "Failed to update phone number.");
                }
            }
        } catch (error) {
            // Handle any network or unexpected errors
            console.error("Error details:", error);
            setMessage(error.message || "Failed to update phone number.");
        }
    };



    const otphandle = (e) => {
      setOtp(e.target.value);
  };



 
  const handlePhoneNumberChange = (e) => {
    let input = e.target.value.replace(/\D/g, ''); // Remove all non-digit characters
  
    if (input.length > 10) {
      input = input.slice(0, 10); // Limit to 10 digits
    }
  
    let formatted = input;
  
    if (input.length > 6) {
      formatted = `(${input.slice(0, 3)})-${input.slice(3, 6)}-${input.slice(6)}`;
    } else if (input.length > 3) {
      formatted = `(${input.slice(0, 3)})-${input.slice(3)}`;
    } else if (input.length > 0) {
      formatted = `(${input}`;
    }
  
    setPhoneNumber(formatted);
  };


  const [formData, setFormData] = useState({
    ssn: "",
    address: "",
  });
  const handleCountryCodeChange = (event) => {
    setCountryCode(event.target.value);
  };


  const [isEdditing, setIsEdditing] = useState({
    ssn: false,
    address: false,
  });
  const [status, setStatus] = useState(false); // Default status is false
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [checkpass, setCheckpass] = useState("");
  const [alert, setAlert] = useState(null);
const showAlert = (variant, title, message) => {
  setAlert({ variant, title, message });

  // Automatically remove alert after 5 seconds
  setTimeout(() => {
    setAlert(null);
  }, 3000);
};
  const [socialSecurityPass, setSocialSecurityPass] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    setOtp("");
    e.preventDefault();
    
    if (phoneNumber.trim() === '') {
        setMessage('Please enter a phone number');
        return;
    }

    const isRegistered = await checkPhoneNumber(phoneNumber);
    if (!isRegistered) {
        sendOtpWithTwilio(phoneNumber);
    }
};

const checkPhoneNumber = async (phoneNumber) => {
  const data = { phoneNumber };

  // console.log("Checking phone number:", phoneNumber);

  try {
      const response = await fetch(`${API_URL}/api/auth/check-phone`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
      });

      // Check if the response is successful (status 2xx)
      if (response.ok) {
          const contentType = response.headers.get('Content-Type');
          
          if (contentType && contentType.includes('application/json')) {
              const responseData = await response.json();
              if (responseData.message === "Phone number already registered.") {
                  setMessage("This phone number is already registered.");
                  return true; // Phone number exists
              } else if (responseData.message === "Phone number is available.") {
                  setMessage("Phone number is available.");
                  return false; // Phone number is available
              }
          } else {
              setMessage("Received unexpected non-JSON response.");
          }
      } else {
          // Handle error response gracefully
          const errorData = await response.text(); // Read response as text
          // console.error("Error response:", errorData);
          setMessage("Failed to check phone number.");
      }
  } catch (error) {
      // console.error("Error details:", error);
      setMessage(error.message || "Failed to check phone number.");
  }
};


const sendOtpWithTwilio = async () => {
  console.log("Payload:", { phone_number: `${countryCode}${phoneNumber}` });

  if (!phoneNumber || phoneNumber.trim() === '') {
      alert('Phone number is required.');
      return;
  }

  // setLoading(true);
  try {
      console.log("Sending OTP...");

      const payload = { phoneNumber: `${countryCode}${phoneNumber}` };

      const response = await axios.post(`${API_URL}/api/otp/send-otp`, payload, {
          headers: {
              'Content-Type': 'application/json', // JSON fosrmat mein bhej raha hai
          },
      });

      console.log("Response received:", response);

      if (response.data.success) {
          setMessage('OTP sent successfully!');
         setPhoneverifybox(false);
         setOtpverifybox(true);
      } else {
          setMessage(`Error: ${response.data.phone_number || 'Unknown error.'}`);
      }
  } catch (error) {
      console.error("Error sending OTP:", error);
      setMessage('Something went wrong.');
  } finally {
      // setLoading(false);
  }
};




  // const handleSubmit = async () => {
  //   setLoading(true);
  //   setMessage("");
  //   try {
  //     const response = await fetch(`${API_URL}/api/gain-access/verify-social-pass`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //       body: JSON.stringify({ socialSecurityPass }),
  //     });
  //     const data = await response.json();
  //     if (response.ok) {
  //       // alert("verified");
  //       setMessage("Password verified. You can now update details.");
  //       setTimeout(() => {
  //       }, 1000);
  //       setSocialSecurityPass("");
  //       setStatus(false);
  //       setValidate(false);
  //       setInformation(true);

  //     } else {
  //       setMessage(data.message);
  //       alert("Please enter valid key")
  //     }
  //   } catch (error) {
  //     setMessage("Error verifying password.");
  //   }
  //   setLoading(false);
  // };
  const handleGainAccess = async () => {
    setMessage("");
    try {
      const response = await fetch(`${API_URL}/api/gain-access/check-social-pass`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        if (data.socialSecurityPassExists) {
          setStatus(true);
          setMessage("You already have a social security pass.");
        } else {
          setShowPopup(true);
          setMessage("No pass found. Please set your social security pass.");
        }
      } else {
        setMessage(data.message);
      }
      // console.log(message);
    } catch (error) {
      setMessage("Error checking access.");
    }
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const toggleEdit = (field) => {
    setIsEdditing({ ...isEdditing, [field]: !isEdditing[field] });
  };
  const fetchsecurityUserDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/api/gain-access/user/details`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setFormData({
          ssn: data.socialSecurityNumber || "",
          address: data.homeAddress || "",
        });
      }
    } catch (error) {
      // console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchsecurityUserDetails();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(`${API_URL}/api/gain-access/update-social-details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // User authentication
        },
        body: JSON.stringify({
          socialSecurityNumber: formData.ssn,
          homeAddress: formData.address,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Details updated successfully.");
        setIsEditing({ ssn: false, address: false }); // Disable editing after save
        // alert("details updated successfully");
        setValidate(true);
        setInformation(false);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Error updating details.");
    }
    setLoading(false);
  };

  const getUserData = async () => {
    try {
        const data = await fetchUserData();
        // console.log("Fetched user data:", data);

        if (!data?.user) {
            console.error("Invalid user data structure");
            return;
        }
        console.log("helooo",data);
        console.log(data.user.email);
        setEmail(data.user.email);

        // ✅ Log membership details
        // console.log("User memberships:", data.memberships);

        // Extract latest membership details
        if (Array.isArray(data.memberships) && data.memberships.length > 0) {
            const latestMembership = data.memberships[data.memberships.length - 1];
            // console.log("Latest Membership:", latestMembership);

            const subscription = latestMembership?.subscription_id;
            if (subscription) {
                const planType = latestMembership.planTime;
                let planPrice = "N/A";

                if (planType === "monthly" && subscription.cost?.monthly) {
                    planPrice = `$${subscription.cost.monthly}`;
                } else if (planType === "yearly" && subscription.cost?.yearly) {
                    planPrice = `$${subscription.cost.yearly}`;
                } else if (subscription.cost?.custom_pricing) {
                    planPrice = "Custom Pricing";
                }

                // console.log("Subscription Plan:", subscription.subscription_name);
                // console.log("Plan Type:", planType);
                // console.log("Plan Price:", planPrice);

                // Check for 'heritage' details in the membership object
                if (latestMembership.subscription_id.heritageDetails) {
                    // console.log("Heritage Details:", latestMembership.subscription_id.heritageDetails);

                    // Get the first heritage details item (assuming there's only one)
                    const heritageData = latestMembership.subscription_id.heritageDetails[0];

                    // Check if googledrive_dropbox is true for both Google Drive and Dropbox
                    const googleDriveData = heritageData.googledrive_dropbox === true; // true if enabled, false otherwise
                    const dropboxData = heritageData.googledrive_dropbox === true; // true if enabled, false otherwise

                    // Check if voice memo is enabled
                    const voiceMemoEnabled = heritageData.voice_memo === true; // true if enabled, false otherwise

                    const storageAvailable = heritageData.storage ? `${heritageData.storage} GB` : "No storage data available";

                    // Log the heritage plan data
                    // console.log("Storing Google Drive Data:", googleDriveData);
                    // console.log("Storing Dropbox Data:", dropboxData);
                    // console.log(storageAvailable);
                    // console.log(voiceMemoEnabled);

                    // Set separate states for Google Drive, Dropbox, storage, and voice memo
                    setGoogleDriveData(googleDriveData);
                    setDropboxData(dropboxData);
                    setStorageData(storageAvailable);
                    setVoiceMemoData(voiceMemoEnabled);
                    // console.log("googleDriveData", googleDriveData);
                    // console.log("voiceMemoData", voiceMemoEnabled); // Log updated value
                    // console.log("dropboxData", dropboxData);
                    // console.log("storageAvailable", storageAvailable);
                } else {
                    // console.log("No heritage details found for the latest membership.");
                }

                setPlan(subscription.subscription_name);
                setPlanType(planType);
                setPlanPrice(planPrice);
                if (plan !== "Heritage (Enterprise)") {
                  setStorageData1(subscription.features.storage);
              }
              
            }
        } else {
            console.warn("No membership found.");
        }

        // Log Google Drive connection
        const googleDrive = data.user.googleDrive?.[0];
        // console.log("Google Drive Data:", googleDrive);

        if (googleDrive?.connected && googleDrive?.accessToken) {
            localStorage.setItem("googleDriveToken", googleDrive.accessToken);
            localStorage.setItem("googleDriveConnected", "true");
            setIsGoogleConnected(true);
        } else {
            localStorage.removeItem("googleDriveToken");
            localStorage.setItem("googleDriveConnected", "false");
            setIsGoogleConnected(false);
        }

        // Log Dropbox connection
        const dropbox = data.user.dropbox?.[0];
        // console.log("Dropbox Data:", dropbox);

        if (dropbox?.connected && dropbox?.accessToken) {
            localStorage.setItem("dropboxToken", dropbox.accessToken);
            localStorage.setItem("dropboxConnected", "true");
            setIsConnected(true);
        } else {
            localStorage.removeItem("dropboxToken");
            localStorage.setItem("dropboxConnected", "false");
            setIsConnected(false);
        }

    } catch (err) {
        // console.error("Error fetching user data:", err.message || err);
    }
};







  
  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    // console.log("Latest Subscription Name:", plan);
  }, [plan]);


  const updatePassword = () => {
    setUpdatePassword(true);
  }

  const handleDropboxAuth = () => {
    if (plan !== "Legacy (Premium)" || dropboxData === false) {
      setDeletebutton1(true);
      // console.log("inside auth"); 
      return;
    } else {
      setDeletebutton1(false);
    }
    const authUrl = `https://www.dropbox.com/oauth2/authorize?client_id=${DROPBOX_APP_KEY}&response_type=code&redirect_uri=${encodeURIComponent(
      DROPBOX_REDIRECT_URI
    )}`;
    window.location.href = authUrl; // Redirect user to Dropbox authentication
  };

  // Handle Dropbox Callback to exchange code for access token
  const handleDropboxCallback = async (code) => {
    try {
      // console.log("Received Dropbox authorization code:", code);

      const data = new URLSearchParams();
      data.append("code", code);
      data.append("grant_type", "authorization_code");
      data.append("client_id", DROPBOX_APP_KEY);
      data.append("client_secret", DROPBOX_APP_SECRET);
      data.append("redirect_uri", DROPBOX_REDIRECT_URI);

      const response = await axios.post(
        "https://api.dropboxapi.com/oauth2/token",
        data,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      // console.log("response",response);
      const { access_token } = response.data;
      // console.log("Received Dropbox access token:", access_token);

      if (!access_token) {
        throw new Error("Access token is null. Check the Dropbox API response.");
      }
      updateCloudConnections("", "", true, access_token);

      setIsConnected(true);
      showAlert(
        "success",
        "Connected",
        "Drop box is connected succesfully"
      );
      const accessToken = localStorage.getItem("dropboxAccessToken");
      // console.log("acccessssstokeeennn",accessToken);
    } catch (error) {
      // console.error("Error exchanging Dropbox code for token:", error.response ? error.response.data : error.message);
    }
  };

  const updateCloudConnections = async (googleDriveConnected, googleDriveToken, dropboxConnected, dropboxToken) => {
    // console.log("122");
    const url = `${API_URL}/api/auth/update-cloud-connections`;
    const token = localStorage.getItem("token");
    const payload = {};

    // console.log("googleDriveConnected", googleDriveConnected);

    // Check if the parameter is explicitly passed, even if it's false
    if (typeof googleDriveConnected === "boolean") {
      payload.googleDriveConnected = googleDriveConnected;
    }

    if (googleDriveToken) {
      payload.googleDriveToken = googleDriveToken;
    }

    if (typeof dropboxConnected === "boolean") {
      payload.dropboxConnected = dropboxConnected;
    }

    if (dropboxToken) {
      payload.dropboxToken = dropboxToken;
    }

    // console.log("payload", payload);
    // console.log("token", token);

    try {
      const response = await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // console.log("Cloud connections updated successfully:", response.data);
      getUserData();
      showAlert(
        "success",
        "Connected",
        "Google drive is connected succesfully"
      );
    } catch (error) {
      // console.error("Error updating cloud connections:", error.response ? error.response.data : error.message);
      getUserData();
    }
  };




  // Handle Dropbox disconnection
  const handleDropboxDisconnect = () => {
    // console.log("dropbox");
    // localStorage.removeItem("dropboxToken");
    updateCloudConnections("", "", false, "");
    showAlert(
      "success",
      "Disconnected Successfully",
      "dropbox Disconnected Successfully"
    );
    // setIsConnected(false);
    // getUserData();
  };

  const handledriveDisconect = () => {
    // console.log("drive");
    // localStorage.removeItem("googleDriveToken");
    updateCloudConnections(false, "", "", "");
    showAlert(
      "success",
      "Disconnected Successfully",
      "Google Drive Disconnected Successfully"
    );
    // setIsGoogleConnected(false);
    // getUserData();
  };

  // Check if Dropbox account is already connected on page load
  useEffect(() => {
    const accessToken = localStorage.getItem("dropboxToken");
    // console.log("acccessssstokeeennn",accessToken);
    if (accessToken) {
      setIsConnected(true);

    }

    // If the page contains a "code" query parameter, handle the callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      handleDropboxCallback(code); // Call the function to exchange code for access token
    }
  }, []);


  useEffect(() => {
    const accessgoogletoken = localStorage.getItem("googleDriveToken");
    // console.log("acccessssstokeee3333nnn",accessgoogletoken);
    if (accessgoogletoken) {
      setIsGoogleConnected(true);
      setGoogleemail(googleemail);
    }
  }, []);


  const handleGoogleAuth = () => {
    if (!window.google || !window.google.accounts) {
      // console.error("❌ Google Identity Services not loaded.");
      return;
    }

    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: "938429058016-5msrkacu32pvubd02tpoqb6vpk23cap3.apps.googleusercontent.com",
      scope: "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/drive.readonly",
      callback: async (response) => {
        if (response && response.access_token) {
          // console.log("✅ Auth successful:", response);
          // localStorage.setItem("googleToken", response.access_token);
          setIsGoogleConnected(true);
          updateCloudConnections(true, response.access_token, "", "");
          // Fetch user profile info dynamically
          fetchGoogleUser(response.access_token);
        } else {
          // console.error("❌ Auth failed:", response);
        }
      },
    });

    client.requestAccessToken();
  };

  // Fetch Google user profile info dynamically
  const fetchGoogleUser = async (accessToken) => {
    try {
      const res = await fetch("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const userData = await res.json();
      // console.log("👤 Google User Data:", userData);
      setGoogleUser(userData);
      localStorage.setItem("googledriveemail", userData.email);
      // console.log("--------------------");
      const googleemail = localStorage.getItem("googledriveemail");

      // console.log("googleemail",googleemail);
    } catch (error) {
      // console.error("❌ Error fetching Google user data:", error);
    }
  };



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

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log(token);
      const response = await axios.get(`${API_URL}/api/auth/get-personaluser-details`, {
        headers: {
          Authorization: `Bearer ${token}`, // Assuming token is stored in localStorage
        },
      });
      // console.log("user login",response);
      setUserDetails({
        name: response.data.user.username,
        email: response.data.user.email,
        phone: response.data.user.phoneNumber,
      });
    } catch (error) {
      // console.error("Error fetching user details:", error);
    }
  };

  const checkpassword = async () => {
  
    console.log("Email:", userDetails.email);
    console.log("Password:", checkpass);
    const email=userDetails.email;   
     const password = checkpass;
    // Clear previous errors
    setError("");
    // Validate input fields
    if (!email) {
        setError("Email is required.");
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError("Please enter a valid email address.");
        return;
    }
    if (!password) {
        setError("Password is required.");
        return;
    }
    const loginRequestBody = { email, password };
    console.log("Login Payload:", loginRequestBody);
    try {
        showLoading();
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginRequestBody),
        });
        console.log('Response status:', response.status);
        if (response.status === 400) {
            const errorData = await response.json();
            console.log("Error Response Data:", errorData);
            setError(errorData.message || "Incorrect email or password.");
            return;
        }
        handleChangePassword();
    } catch (error) {
        hideLoading();
        console.error("Login error:", error);
        setError("There was an error during login. Please try again.");
    }
  
};
const handleChangePassword = async () => {
    console.log("newPassword", password);
    console.log("newPassword", confirm);
    console.log("userDetails.email", userDetails.email);
 
    try {
      const response = await fetch(`${API_URL}/api/auth/update-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userDetails.email, newPassword: confirm }), // FIXED: Changed "password" to "newPassword"
      });
      showAlert("success", "success", "Password updated Successfully.");
      setCheckpass("")
      setConfirm("");
      setUpdatePassword("");
      
      if (!response.ok) {
        throw new Error("Failed to update password");
      }
    } catch (err) {
      // alert(err.message);
      showAlert("error", "Failed", err.message);
    }
    finally{
      setUpdatePassword(null);
      hideLoading();
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
      // console.error("Error fetching profile picture:", error);
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
      localStorage.removeItem("googleDriveToken");
      localStorage.removeItem("dropboxToken");
      localStorage.removeItem("role");
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
      // console.error(error);
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
      // console.log("API URL:", `${API_URL}/api/auth/upload-profile-picture`);


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
          // alert("Profile picture updated successfully!");
          showAlert("success", "success", "Profile picture updated successfully.");
          fetchProfilePicture();
        }
        showAlert("success", "success", "Profile picture updated successfully.");

        // setProfilePicture(response.data.profilePicture); // Update the state in Navbar
      } catch (error) {
        showAlert("error", "Failed", "Failed to upload profile picture. Please try again.");
        // console.error("Error uploading profile picture:", error);
        // alert("Failed to upload profile picture. Please try again.");
      }
    }
  };
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    setCut(true);
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
        // alert(data.message); // Show success message
        showAlert("success", "success", data.message);
        setIsEditMode(false); // Exit edit mode
        fetchUserDetails();
      } else {
        // alert(data.message); // Show error message
        showAlert("error", "Failed", data.message);
      }
    } catch (error) {
      // console.error("Error saving user details:", error);
      // alert("An error occurred while saving the details. Please try again.");
      showAlert("error", "Failed", "An error occurred while saving the details. Please try again.");
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
    <div className=" max-h-full max-w-screen mx-auto">
      <div className="bg-gray-50">
          <div className="p-6">
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
                        <img
                        src={defaultprofile}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />                  )}
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
                  {!isEditMode ? (
      <img
        src={profileicon}
        className={` h-[37px] mt-1`}
        alt=""
        onClick={toggleEditMode}
      />
    ) : (
      cut && (
        <p
          onClick={() => {
            setIsEditMode(false);
            setCut(false);
          }}
        >
          <X className="mt-3 text-gray-500" />
        </p>
      )
    )}

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
                      {/* {!isEditMode ? (
                        <p>{userDetails.email}</p>
                      ) : (
                        <input
                          id="email"
                          className="border border-gray-300 rounded-lg p-2 w-full"
                          type="email"
                          value={userDetails.email}
                          onChange={handleInputChange}
                         
                        />
                      )} */}
                      <p>{userDetails.email}</p>
                    </div>
                    <div className="mb-4 px-6 py-3">
      <p className="text-gray-500">Phone number</p>

      {userDetails.phone ? (
        <p className="text-black">{userDetails.phone}</p>
      ) : (
        isEditMode && (
          <p className="text-red-500">
            You haven’t verified your number. Update phone number to verify.
          </p>
        )
      )}


    </div>


    <div className="flex flex-wrap justify-evenly px-6 pb-4 gap-2">
      {isEditMode && (
        <>
          <button
            onClick={updatePassword}
            className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded-md hover:bg-blue-700 transition"
          >
            Change Password
          </button>

          <button
            type="submit"
            onClick={() => setPhoneverifybox(true)}
            className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded-md hover:bg-blue-700 transition"
          >
            Update Phone Number
          </button>


          <button
            onClick={saveChanges}
            className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded-md hover:bg-blue-700 transition"
          >
            Save Changes
          </button>

        
        </>
      )}
    </div>




                  </div>
                  {
                    UpdatePassword && (
                      <>
                        <div className="flex justify-center items-center fixed inset-0 h-screen w-screen z-20 bg-black bg-opacity-40">
                          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                            <div className="flex justify-between">
                              <button></button>
                              <button
                                onClick={() => setUpdatePassword(false)}
                              >
                                <X className="text-red-600" />
                              </button>
                            </div>
                            <h2 className="text-xl font-semibold mb-4 text-center">Update Password</h2>

                            <label className="block text-sm font-medium text-gray-700">Previous Password</label>
                            <input
                              type="password"
                              className="w-full px-4 py-2 mt-1 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter previous password"
                              value={checkpass}
                onChange={(e) => setCheckpass(e.target.value)}
                            />

                            <label className="block text-sm font-medium text-gray-700">New Password</label>
                            <input
                              type="password"
                              className="w-full px-4 py-2 mt-1 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter new password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                              <label className="block text-sm font-medium text-gray-700">Confirm  Password</label>
                            <input
                              type="password"
                              className="w-full px-4 py-2 mt-1 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Confirm new password" 
                                value={confirm}
                              onChange={(e) => setConfirm(e.target.value)}
                            />

                            {/* <button
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-300"
                            onClick={()=>checkpassword()}
                            >
                              Update Password
                            </button> */}

    {isLoading ?  ( <button
                                type="submit"
                                className="cursor-not-allowed flex justify-center  bg-blue-400 w-full py-2 rounded-md text-white"
                            >
                            <Loader2 className="animate-spin h-6 w-6 font-bold"/>
                            </button>):(<button
                                type="submit"
                                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition "
                                onClick={()=>checkpassword()}
                            >
                              Update Password
                            </button>
    )}
                          </div>
                        </div>

                      </>
                    )
                  }
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
                        <img src={googledrive} alt="Google Drive" className="w-8 h-8" />
                        <div>
                          <p className="text-gray-900 font-medium">Google Drive</p>
                          <p className="text-sm text-gray-500">{googleemail ? googleemail : ""}</p>

                        </div>
                      </div>

                      {/* Toggle Button */}
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={isGoogleConnected}
                          onChange={() => {

                            // console.log("1");
                            if (isGoogleConnected) {
                              handledriveDisconect();
                            } else {
                              handleGoogleAuth();
                            }
                          }
                          }
                        />
                        <div className="w-10 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-400 rounded-full peer peer-checked:bg-green-500 transition-all"></div>
                        <span className="w-4 h-4 bg-white rounded-full absolute left-1 top-1 peer-checked:translate-x-4 transition-transform"></span>
                      </label>

                    </div>

                    {/* DropBox Account */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img src={dropbox} alt="" className="w-8 h-8" />
                        <p className="text-gray-900 font-medium">Dropbox</p>
                      </div>
                      {isConnected ? (
                        <button
                          className="text-sm font-medium text-gray-600 bg-gray-100 px-4 py-1 rounded-full border border-gray-300 hover:bg-gray-200 transition hover:text-red-500"
                          onClick={handleDropboxDisconnect} // Disconnect Dropbox
                        >
                          Disconnect
                        </button>
                      ) : (
                        <button
                          className="text-sm font-medium text-gray-600 bg-gray-100 px-4 py-1 rounded-full border border-gray-300 hover:bg-gray-200 transition  hover:text-green-500"
                          onClick={handleDropboxAuth}
                        >
                          Connect
                        </button>
                      )}
                    </div>
                  </div>
                  {validate && (
                    //         <div className="bg-white p-6 rounded-[20px] border-2 border-[#ececec]">
                    //           <div className="flex items-center justify-start mb-4">
                    //             <span className="rounded-full p-2 bg-white shadow-md">
                    //               <img src={key} alt="" className="h-[25px]" />
                    //             </span>
                    //             <h2 className="text-lg font-semibold ml-2">Secure Personal Information</h2>
                    //           </div>
                    //           <p className="text-gray-500 mb-4">
                    //             Please re-enter your password to view or edit this information.
                    //           </p>
                    //           {/* <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                    //             Gain Access
                    //           </button> */}
                    //           <button className="text-blue-600 border w-full 2xl:w-4/12 font-medium hover:border-green-400 border-[#0067FF] px-4 py-2 rounded-lg text-sm hover:text-green-500" onClick={handleGainAccess}>Gain Access</button>
                    //           {showPopup && (
                    //   <GainAccess onClose={() => setShowPopup(false)} onVerified={() => setShowPopup(false)} />
                    // )}
                    //         </div>

                    <></>
                  )}
                  {status && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                      <div className="bg-white w-11/12 max-w-md rounded-lg shadow-lg p-6 relative">
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-lg font-semibold">Sensitive Personal Information</h2>
                          <button className="text-gray-400 hover:text-gray-600">
                            <i className="fas fa-times" onClick={() => {
                              setStatus(false)
                              setSocialSecurityPass("");
                            }}></i>
                          </button>
                        </div>
                        <p className="text-gray-600 mb-4">An extra layer of password protection for added security</p>
                        <label className="block text-gray-700 mb-2">Enter Social Security Pass</label>
                        <input
                          type="password"
                          className="w-full border border-gray-300 rounded-lg p-2 mb-4"
                          value={socialSecurityPass}
                          onChange={(e) => setSocialSecurityPass(e.target.value)}
                        />
                        <button
                          className="w-full bg-blue-600 text-white rounded-lg py-2 disabled:opacity-50"
                          onClick={handleSubmit}
                          disabled={loading}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  )}
                  {information && (
                    <div className="">
                      <div className="flex items-center mb-4">
                        <img
                          src="https://storage.googleapis.com/a1aa/image/dAx-e24EbgXzqmzZ8lUNBHQtNAzj3eYYasPS1I7Em3Q.jpg"
                          alt="Key icon"
                          className="w-6 h-6 mr-2"
                        />
                        <h2 className="text-lg font-semibold">Sensitive Personal Information</h2>
                      </div>
                      {/* Social Security Number */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-gray-700">Social Security Number</label>
                          <FaPen
                            className="text-gray-400 cursor-pointer"
                            onClick={() => toggleEdit("ssn")}
                          />
                        </div>
                        <input
                          className="bg-blue-100 text-blue-600 p-2 rounded w-full"
                          id="ssn"
                          type="text"
                          value={formData.ssn}
                          onChange={handleChange}
                          disabled={!isEdditing.ssn}
                        />
                      </div>
                      {/* Home Address */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-gray-700">Home Address</label>
                          <FaPen
                            className="text-gray-400 cursor-pointer"
                            onClick={() => toggleEdit("address")}
                          />
                        </div>
                        <input
                          className="bg-blue-100 text-blue-600 p-2 rounded w-full"
                          id="address"
                          type="text"
                          value={formData.address}
                          onChange={handleChange}
                          disabled={!isEdditing.address}
                        />
                      </div>
                      {/* Save Button */}
                      {(isEdditing.ssn || isEdditing.address) && (
                        <button className="bg-blue-500 text-white p-2 rounded mt-4 w-full" onClick={handleSave}>
                          Save
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="md:w-3/5 flex flex-col w-full gap-6">
                  <div className="bg-white p-6 rounded-[20px] border-2 border-[#ececec]">
                    <div className="p-6  rounded-[8px] border-2 border-[#ececec]">
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
                      {folderSize.value} {folderSize.unit} of {(plan === "Heritage (Enterprise)" ? storageData : storageData1)}
                        </p>
                      ) : (
                        <p className="text-gray-500">Loading...</p>
                      )}
                      <div className="flex items-center justify-between ">
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
        </div>
        
        <div className="border-2 border-blue-600 rounded-lg p-8 mb-4">
            <p className="text-black text-xs mb-1 font-semibold">{plan}</p>
            <div className="flex justify-between md:mr-3 items-center flex-col lg:flex-row">
                <div className="flex items-center">
                    <h1 className="text-5xl font-semibold">{planPrice}</h1>
                    <span className="text-4xl text-gray-500 ml-2">
                        {planType === "monthly" ? "/mo" : planType === "yearly" ? "/yr" : ""}
                    </span>
                </div>
                <img src={filefolder} alt="Subscription plan icon" className="mt-4 w-28" />
            </div>
        </div>
        
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
            onClick={()=>{navigate("/subscription")}}>
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
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-6">
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg max-w-3xl w-full m-4 md:m-6">
                <h1 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-left">Upgrade Plan</h1>

                {/* Parent div now conditionally renders the entire plan section */}
                {plan !== "Legacy (Premium)" ? (
                  // Show Both Plans
                  <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
                    {/* Legacy Plan */}
                    <div className="border rounded-lg p-4 sm:p-6 flex flex-col w-full md:w-1/2">
                      <div className="flex items-center mb-3 sm:mb-4">
                        <img src={plans} alt="Legacy Plan Icon" className="mr-2 sm:mr-3 h-8 sm:h-10 w-8 sm:w-10" />
                        <div>
                          <p className="text-xl sm:text-2xl font-bold">
                            $99 <span className="text-sm sm:text-lg font-normal">/Year</span>
                          </p>
                          <p className="text-md sm:text-lg">Legacy</p>
                        </div>
                      </div>
                      <ul className="space-y-1 sm:space-y-2 flex-1 text-sm sm:text-base">
                        {[
                          "50 GB Storage",
                          "Enhanced Encryption",
                          "Advanced Sharing Controls",
                          "Advanced Nominee Assignment",
                          "Google Drive, Dropbox Integration",
                          "Automatic Photo Upload",
                          "Priority Support",
                          "Voice Memo"
                        ].map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <i className="fas fa-check-circle text-green-500 mr-1 sm:mr-2"></i>{feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Heritage Plan */}
                    <div className="border rounded-lg p-4 sm:p-6 flex flex-col w-full md:w-1/2">
                      <div className="flex items-center mb-3 sm:mb-4">
                        <img src={plans} alt="Heritage Plan Icon" className="mr-2 sm:mr-3 h-8 sm:h-10 w-8 sm:w-10" />
                        <div>
                          <p className="text-xl sm:text-2xl font-bold">Custom Pricing</p>
                          <p className="text-md sm:text-lg">Heritage</p>
                        </div>
                      </div>
                      <ul className="space-y-1 sm:space-y-2 flex-1 text-sm sm:text-base">
                        {[
                          "Custom Storage Options",
                          "Top Compliance Level Encryption",
                          "Full Sharing & Customization",
                          "Custom Inheritance Options",
                          "Full Suite of Integrations",
                          "Automatic Photo Upload",
                          "24/7 Dedicated Support",
                          "Voice Memo, Notepad",
                          "Customizable Solutions"
                        ].map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <i className="fas fa-check-circle text-green-500 mr-1 sm:mr-2"></i>{feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  // Show ONLY Heritage Plan (No extra blank space)
                  <div className="border rounded-lg p-4 sm:p-6 flex flex-col">
                    <div className="flex items-center mb-3 sm:mb-4">
                      <img src={plans} alt="Heritage Plan Icon" className="mr-2 sm:mr-3 h-8 sm:h-10 w-8 sm:w-10" />
                      <div>
                        <p className="text-xl sm:text-2xl font-bold">Custom Pricing</p>
                        <p className="text-md sm:text-lg">Heritage</p>
                      </div>
                    </div>
                    <ul className="space-y-1 sm:space-y-2 flex-1 text-sm sm:text-base">
                      {[
                        "Custom Storage Options",
                        "Top Compliance Level Encryption",
                        "Full Sharing & Customization",
                        "Custom Inheritance Options",
                        "Full Suite of Integrations",
                        "Automatic Photo Upload",
                        "24/7 Dedicated Support",
                        "Voice Memo, Notepad",
                        "Customizable Solutions"
                      ].map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <i className="fas fa-check-circle text-green-500 mr-1 sm:mr-2"></i>{feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex justify-end mt-4 sm:mt-6">
                  <button className="text-gray-500 mr-3 sm:mr-4 text-xs sm:text-sm" onClick={() => setMemb(false)}>
                    Cancel
                  </button>
                  <NavLink to="/subscription">
                    <button className="bg-blue-500 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm hover:bg-blue-600 transition-colors">
                      Upgrade
                    </button>
                  </NavLink>
                </div>
              </div>
            </div>
            )}

            {deletebutton1 && (
              <div
                className="fixed inset-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center z-50"
                role="dialog"
                aria-labelledby="deleteModalLabel"
                aria-describedby="deleteModalDescription"
              >
                <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full m-2">
                  <div className="flex justify-between items-center mb-4">
                    <h2 id="deleteModalLabel" className="text-lg font-semibold">
                      Upgrade Plan
                    </h2>
                  </div>

                  <div
                    id="deleteModalDescription"
                    className="text-sm text-gray-600 mb-4"
                  >
                    Upgrade your Membership to access this features
                  </div>

                  <div className="flex justify-end gap-2 my-2">
                    <button
                      onClick={() => setDeletebutton1(false)}
                      className="border-2 border-blue-500 text-gray-700 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>

                    <button
                      className="bg-blue-500 text-white px-6 py-2 rounded flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={() => {
                        setDeletebutton1(false)
                        setMemb(true);
                      }}
                    >
                      Upgrade Plan
                    </button>

                  </div>
                </div>
              </div>
            )}
    {phoneverifybox && (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-black">Phone Verification</h2>
            <button
              className="text-gray-600 hover:text-black"
              onClick={() => {
                setPhoneverifybox(false);
                hideLoading();
                setMessage("");
              }}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <hr className="mb-4" />

          {/* Stepper */}


          {/* Phone Input */}
          <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg shadow-sm">
            <select
              className="border text-black border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={countryCode}
              onChange={handleCountryCodeChange}
            >
              <option value="+1">+1 (US)</option>
              <option value="+91">+91 (IND)</option>
              <option value="+81">+81 (JPN)</option>
            </select>
            <input
              type="text"
              id="phoneNumber"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
              placeholder="Enter phone number"
            />
          </div>

          {/* Checkbox */}
          <div className="flex items-center space-x-2 mt-3">
            <input
              type="checkbox"
              id="acceptTerms"
              className="h-5 w-5 border-gray-300 rounded"
              checked={isotpsendbox}
              onChange={(e) => setIsotpsendbox(e.target.checked)}
            />
    <label htmlFor="acceptTerms" className="text-[13px] text-gray-600 ">
      I consent to receive security related text messages from Cumulus Inc. 
      I understand that Cumulus will send me a code for two factor authentication during each sign-in. Message rates may apply.
    </label>
          </div>

          <div className="flex justify-center mt-2">
  <span className="text-[13px] text-blue-600 underline decoration-blue-600 mr-1" onClick={() => navigate("/privacy")}>
    Privacy Policy
  </span>
  <span className="text-[13px] text-blue-600 underline decoration-blue-600" onClick={() => navigate("/terms")}>
    | Terms & Conditions
  </span>
</div>

          {/* Message */}
          {message && (
            <div className="mt-4 p-2 border rounded-md text-center bg-gray-100 text-gray-800 text-sm">
              {message}
            </div>
          )}

    
          <button
            onClick={handleSubmit}
            disabled={phoneNumber.length < 10 || !isotpsendbox}
            className={`w-full mt-4 py-2 rounded-md transition ${
              phoneNumber.length < 10 || !isotpsendbox
                ? 'bg-white text-blue-500 border border-blue-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Next
          </button>

        </div>
      </div>
    )}


    {otpverifybox && (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">

          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-black">Phone Verification</h2>
            <button
              className="text-gray-600 hover:text-black"
              onClick={() => {
                setOtpverifybox(false);
                hideLoading();
                setMessage("");
              }}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <hr className="mb-4" />

          {/* Stepper */}
          <div className="flex items-center  mb-4">
            <div className="text-black flex items-center">
          
            <span className="text-sm md:text-base">Please enter the OTP sent to {countryCode}{phoneNumber}</span>
            </div>
          </div>

          {/* OTP Input */}
          <div className="mb-4">
            {/* <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
              Enter OTP
            </label> */}
            <input
              type="text"
              id="otp"
              value={otp}
              maxLength={6}
              onChange={otphandle}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Enter OTP"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={verifyOTP}
            disabled={!otp}
            className={`w-full py-2 rounded-md transition ${
              otp
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-white text-blue-500 border border-blue-500 cursor-not-allowed'
            }`}
          >
            Submit
          </button>
        </div>
      </div>
    )}







    {alert && <Alert {...alert} />}
          </div>
      </div>
    </div>
  );
};
export default Profile;