import React from 'react';
import { Sidebar } from './Sidebar';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

const Profile: React.FC = () => {
  useDocumentMeta({ title: "Profile | IFLEON", noindex: true });
  const handleLogout = () => {
    // Redirect to the same page
    window.location.reload();
  };

  return (
    <Sidebar>
      <h1 className="font-display text-3xl font-bold">Profile Page</h1>
      <p className="mt-4">View and edit your profile information here.</p>
      <button
        onClick={handleLogout}
        className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-2 px-4 rounded"
      >
        Logout
      </button>
    </Sidebar>
  );
};

export default Profile;
