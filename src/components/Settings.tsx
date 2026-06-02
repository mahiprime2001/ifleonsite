import React from 'react';
import { Sidebar } from './Sidebar';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

const Settings: React.FC = () => {
  useDocumentMeta({ title: "Settings | IFLEON", noindex: true });
  return (
    <Sidebar>
      <h1 className="font-display text-3xl font-bold">Settings Page</h1>
      <p className="mt-4">Manage your application settings here.</p>
    </Sidebar>
  );
};

export default Settings;
