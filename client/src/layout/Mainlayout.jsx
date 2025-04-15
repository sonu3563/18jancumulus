import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Sidebar from "../Component/Main/Sidebar";
import Dashboard from "../Component/Main/Dashboard";
import Subscription from "../Component/Main/Subscription";
import Enterdashboard from "../Component/Auth/Enterdashboard";
import Navbar from "../Component/Main/Navbar";
import Voicememo from "../Component/Main/Voicememo";
import Help from "../Component/Main/Help";
import SharedFiles from "../Component/Main/SharedFiles";
import Profile from "../Component/Main/Profile";
import { UserProvider } from '../Component/utils/UserContext';
import { ProfileProvider } from "../Component/utils/ProfileContext";
import Afterlifeaccess from "../Component/Main/Afterlifeaccess";
import Desineedashboard from "../Component/Main/Desineedashboard";
import Activity from "../Component/Main/Activity";
import TermCodition from "../Component/Main/TermCodition";
import ViewAllFolder from "../Component/Main/ViewAllFolder";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Designee from "../Component/Main/Designee";
import { FolderProvider } from "../Component/utils/FolderContext";
import { DesigneeProvider } from "../Component/utils/DesigneeContext";
import fetchUserData from "../Component/Main/fetchUserData";
const MainLayout = () => {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const navigate = useNavigate();
  const [plan, setPlan] = useState("");
  const [voiceMemoData, setVoiceMemoData] = useState(null);
  const [planType, setPlanType] = useState("");
  const [planPrice, setPlanPrice] = useState("");
  const [userData, setUserData] = useState(null);
  const [googleDriveData, setGoogleDriveData] = useState(null);
  const [dropboxData, setDropboxData] = useState(null);
  const [storageData, setStorageData] = useState(null);
  const [error, setError] = useState(null);
  const getUserData = async () => {
    try {
        const data = await fetchUserData();
        console.log("Fetched user data:", data);

        if (!data?.user) {
            console.error("Invalid user data structure");
            return;
        }

        // ✅ Log membership details
        console.log("User memberships:", data.memberships);

        // Extract latest membership details
        if (Array.isArray(data.memberships) && data.memberships.length > 0) {
            const latestMembership = data.memberships[data.memberships.length - 1];
            console.log("Latest Membership:", latestMembership);

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

                console.log("Subscription Plan:", subscription.subscription_name);
                console.log("Plan Type:", planType);
                console.log("Plan Price:", planPrice);

                // Check for 'heritage' details in the membership object
                if (latestMembership.subscription_id.heritageDetails) {
                    console.log("Heritage Details:", latestMembership.subscription_id.heritageDetails);

                    // Get the first heritage details item (assuming there's only one)
                    const heritageData = latestMembership.subscription_id.heritageDetails[0];

                    // Check if googledrive_dropbox is true for both Google Drive and Dropbox
                    const googleDriveData = heritageData.googledrive_dropbox === true; // true if enabled, false otherwise
                    const dropboxData = heritageData.googledrive_dropbox === true; // true if enabled, false otherwise

                    // Check if voice memo is enabled
                    const voiceMemoEnabled = heritageData.voice_memo === true; // true if enabled, false otherwise

                    const storageAvailable = heritageData.storage ? `Storage: ${heritageData.storage} GB` : "No storage data available";

                    // Log the heritage plan data
                    console.log("Storing Google Drive Data:", googleDriveData);
                    console.log("Storing Dropbox Data:", dropboxData);
                    console.log(storageAvailable);
                    console.log(voiceMemoEnabled);

                    // Set separate states for Google Drive, Dropbox, storage, and voice memo
                    setGoogleDriveData(googleDriveData);
                    setDropboxData(dropboxData);
                    setStorageData(storageAvailable);
                    setVoiceMemoData(voiceMemoEnabled);
                    console.log("googleDriveData", googleDriveData);
                    console.log("voiceMemoData", voiceMemoEnabled); // Log updated value
                    console.log("dropboxData", dropboxData);
                    console.log("storageAvailable", storageAvailable);
                } else {
                    console.log("No heritage details found for the latest membership.");
                }

                setPlan(subscription.subscription_name);
                setPlanType(planType);
                setPlanPrice(planPrice);
            }
        } else {
            console.warn("No membership found.");
        }



    } catch (err) {
        console.error("Error fetching user data:", err.message || err);
    }
};
  
  useEffect(() => {
    getUserData();
  }, []);
    useEffect(() => {
      const getUserData = async () => {
        try {
          const data = await fetchUserData();
          setUserData(data);
        } catch (err) {
          setError(err.message || "Failed to fetch user data");
        }
      };
      getUserData();
    }, []);

  const handleFolderSelect = (folderId) => {
    setSelectedFolder(folderId);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      setShowSessionExpired(true);
      // navigate("/Login");
      return;
    }
  
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
  
      if (decodedToken.exp < currentTime) {
        setShowSessionExpired(true);
        localStorage.removeItem("token");
        // navigate("/Login");
      } else {
        setShowSessionExpired(false);
  
        // ✅ Now also check API token validity
        fetchUserData()
          .then((data) => {
            // user is valid, optionally do something with data
          })
          .catch((error) => {
            if (error.response && error.response.status === 403) {
              // If API returns 403 Forbidden — token expired/invalid server-side
              setShowSessionExpired(true);
              localStorage.removeItem("token");
              // navigate("/Login");
            } else {
              console.error("Error fetching user:", error);
            }
          });
      }
    } catch (error) {
      setShowSessionExpired(true);
      localStorage.removeItem("token");
      // navigate("/Login");
    }
  }, [navigate]);
  

  const handleLoginRedirect = () => {
    localStorage.removeItem("token"); // Clear token on session expiration
    setShowSessionExpired(false);
    navigate("/Login");  // Redirect to login page
  };

  const CLIENT_ID = "938429058016-5msrkacu32pvubd02tpoqb6vpk23cap3.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <UserProvider>
        <FolderProvider>
          <DesigneeProvider>
            <ProfileProvider>
            {showSessionExpired && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
                      <h2 className="text-lg font-semibold mb-2">Session Expired</h2>
                      <p className="text-sm text-gray-600 mb-4">Your session has expired. Please log in again.</p>
                      <div className="flex justify-end">
                        <button
                          className="bg-blue-500 text-white px-4 py-2 rounded"
                          onClick={handleLoginRedirect}
                        >
                          Login
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              <Routes>
                {/* Standalone Routes - Without Sidebar */}
                <Route path="/subscription" element={<Subscription />} />
                <Route path="/enterdashboard" element={<Enterdashboard />} />

                {/* Session expired popup */}
             

                {/* Main Layout with Sidebar */}
                {!showSessionExpired && (
                  <Route
                    path="/*"
                    element={
                      <div className="flex">
                        <Sidebar onFolderSelect={handleFolderSelect} />
                        <div className="flex-grow">
                          <Navbar onFolderSelect={handleFolderSelect} setSearchQuery={setSearchQuery} />
                          <Routes>
                            <Route
                              path="/folder/:id"
                              element={<Dashboard folderId={selectedFolder} onFolderSelect={handleFolderSelect} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
                            />
                            <Route path="/Activity" element={<Activity searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
                            <Route path="/SharedFiles" element={<SharedFiles />} />
                            <Route path="/Afterlifeaccess" element={<Afterlifeaccess searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
                            {(plan === "Legacy (Premium)" || voiceMemoData === true) && (
                              <Route path="/Voicememo" element={<Voicememo searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
                            )}
                            <Route path="/my-profile" element={<Profile />} />
                            <Route path="/designee/:email" element={<Designee folderId={selectedFolder} onFolderSelect={handleFolderSelect} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
                            <Route path="/help" element={<Help />} />
                            <Route path="/termconditions" element={<TermCodition />} />
                            <Route path="/viewall" element={<ViewAllFolder searchQuery={searchQuery} setSearchQuery={setSearchQuery} onFolderSelect={handleFolderSelect} />} />
                            <Route path="/designee-dashboard" element={<Desineedashboard searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
                          </Routes>
                        </div>
                      </div>
                    }
                  />
                )}
              </Routes>
            </ProfileProvider>
          </DesigneeProvider>
        </FolderProvider>
      </UserProvider>
    </GoogleOAuthProvider>
  );
};

export default MainLayout;
