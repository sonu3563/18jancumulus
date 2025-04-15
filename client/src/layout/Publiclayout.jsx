import React, {useState} from "react";
import { Routes, Route } from "react-router-dom";
import PublicSidebar from "../Component/Main/PublicSidebar";
import PublicNavbar from "../Component/Main/PublicNavbar";
import SharedFiles from "../Component/Main/SharedFiles";
import Dashboard from "../Component/Main/Dashboard";
import PublicDashboard from "../Component/Main/PublicDashboard";
const PublicLayout = () => {

  const [selectedFolder, setSelectedFolder] = useState();
  const [searchQuery, setSearchQuery] = useState('');

  const handleFolderSelect = (folderId) => {

    setSelectedFolder(folderId);
  };
  return (
    <div className="flex">
      <PublicSidebar />
      <div className="flex-grow">
        <PublicNavbar />
        <Routes>
          <Route path="/SharedFiles" element={<SharedFiles />} />
          <Route path="aboutCumulus" element={<PublicDashboard folderId={1} />} />
        </Routes>
      </div>
    </div>
  );
};
export default PublicLayout;