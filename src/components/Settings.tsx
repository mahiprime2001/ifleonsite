import React from 'react';
import { Sidebar } from './Sidebar';

const Settings: React.FC = () => {
  return (
    <Sidebar>
      <h1 className="text-3xl font-bold">Settings Page</h1>
      <p className="mt-4">Manage your application settings here.</p>
    </Sidebar>
  );
};

export default Settings;
