import axios from 'axios';
import { API_URL } from './Apiconfig';

export const fetchFolders = async (setFolders, setDeletebutton1) => {
//   setLoading(true);
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No token found. Please log in again.");
    }

    const response = await axios.get(`${API_URL}/api/get-folders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const foldersData = response.data.map((folder) => ({
      id: folder._id,
      name: folder.folder_name,
    }));

    setFolders(foldersData);
  } catch (error) {

    localStorage.removeItem("role");
  } finally {
    // setLoading(false);
  }
};
