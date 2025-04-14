import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { API_URL } from "./Apiconfig";

const DesigneeContext = createContext();

export const useDesignee = () => useContext(DesigneeContext);

export const DesigneeProvider = ({ children }) => {
  const [designees, setDesignees] = useState([]);
  const [designes, setDesignes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);



  const fetchdesignes = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token is missing.");
      setLoading(false);
      return;
    }
    try {
        console.log("1",token);
      const response = await fetch(
        `${API_URL}/api/designee/getting-all-shared-files`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setDesignes(data);
      console.log("Fetched designees:", data);

      console.log("data",data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDesignee = async ({
    file,
    designeeName,
    designeePhone,
    designeeEmail,
    showAlert,
    showLoading,
    hideLoading,
    closePopup,
    clearInputs,
  }) => {
    const token = localStorage.getItem("token");
    if (!designeeName || !designeePhone || !designeeEmail) {
      showAlert("warning", "missing fields", "Please fill in all fields.");
      hideLoading();
      return;
    }

    const formData = new FormData();
    formData.append("profilePicture", file);
    formData.append("designeeName", designeeName);
    formData.append("designeePhone", designeePhone);
    formData.append("designeeEmail", designeeEmail);

    try {
      showLoading();
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

      showAlert("success", "success", "Designee added successfully.");
      closePopup();
      clearInputs();
      fetchdesignes();
    //   fetchDesignees();
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          showAlert("error", "Failed", "Designee already exists, please check.");
        } else if (error.response.status === 400) {
          const serverMessage = error.response.data.message;
          if (serverMessage === "Designee already exists and is linked to your account.") {
            showAlert("error", "Failed", "This designee is already linked to your account.");
          } else {
            showAlert("error", "Failed", "Error: " + serverMessage);
          }
        } else {
          showAlert("error", "Failed", "Error adding designee. Please try again later.");
        }
      } else {
        showAlert("error", "Failed", "Network error. Please check your connection.");
      }
    } finally {
      hideLoading();
    }
  };


  const deletedesignee = async (email,showAlert,setOpenEdit,setShowwarning) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.delete(
        `${API_URL}/api/designee/remove-designee`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { email },
        }
      );
      showAlert("success", "Success", response.data.message || "Designee removed successfully!");
    //   await fetchDesignees();  // notice await — to ensure it finishes before moving on
      await fetchdesignes();
    } catch (error) {
      console.error("Error deleting designee:", error);
      showAlert("error", "Failed", "Failed to remove designee.");
    } finally {
      setOpenEdit(null);
      setShowwarning(false);
    }
  };


  
  
  const handleUpdateDesigneeName = async (name, email,showAlert) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/designee/add-title-name`,
        { email, new_name: name },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        showAlert("success", "success", "Designee Name Updated Successfully.");
        fetchdesignes();
        // fetchDesignees();
      }
    } catch (error) {
      console.error("Error updating title:", error.response?.data || error.message);
    }
  };





  return (
    <DesigneeContext.Provider
      value={{
        designees,
        loading,
        error,
        
        handleAddDesignee,
        deletedesignee,
        fetchdesignes,
        designes,
        handleUpdateDesigneeName
      }}
    >
      {children}
    </DesigneeContext.Provider>
  );
};
