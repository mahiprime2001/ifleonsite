import React from 'react';
import { Sidebar } from './Sidebar';

const Profile: React.FC = () => {
  const handleLogout = () => {
    // Redirect to the same page
    window.location.reload();
  };

  return (
    <Sidebar>
      <h1 className="text-3xl font-bold">Profile Page</h1>
      <p className="mt-4">View and edit your profile information here.</p>
      <button
        onClick={handleLogout}
        className="mt-6 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Logout
      </button>
    </Sidebar>
  );
};

export default Profile;
