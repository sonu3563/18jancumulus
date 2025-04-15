import React, { createContext, useState, useContext } from "react";
import axios from "axios";
import { API_URL } from "./Apiconfig";

const FolderContext = createContext();

export const useFolder = () => useContext(FolderContext);

export const FolderProvider = ({ children }) => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch folders with extra details and sorted by created date (latest first)
  const fetchFolders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in again.");

      const response = await axios.get(`${API_URL}/api/get-folders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const foldersData = response.data.map((folder) => ({
        id: folder._id,
        name: folder.folder_name,
        created: folder.created_at,
        updated: folder.updated_at,
        fileCount: folder.file_count || 0,
      }));

      const sortedFoldersData = foldersData.sort(
        (a, b) => new Date(b.created) - new Date(a.created)
      );

      setFolders(sortedFoldersData);
    } catch (error) {
      console.error("Error fetching folders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add new folder and refresh list
  const handleAddFolder = async (setNewFolder, newFolder, showAlert, setCreateFolder) => {
    if (newFolder) {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found.");

        const response = await axios.post(
          `${API_URL}/api/create-folder`,
          { folder_name: newFolder },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const newFolderData = response.data.folder;

        setFolders((prev) => [
          ...prev,
          {
            id: newFolderData._id,
            name: newFolderData.folder_name,
            created: newFolderData.created_at,
            updated: newFolderData.updated_at,
            fileCount: 0,
          },
        ]);

        showAlert("success", "Success", "Folder Created Successfully.");
        setCreateFolder(null);
        fetchFolders();
        setNewFolder("");
      } catch (error) {
        showAlert("error", "Failed", error.response?.data?.message || "Error creating folder.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <FolderContext.Provider value={{ folders, fetchFolders, handleAddFolder, loading }}>
      {children}
    </FolderContext.Provider>
  );
};
