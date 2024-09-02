// src/pages/SettingsPage.js
import React, { useState } from 'react';

const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
    document.body.classList.toggle('dark-mode', !darkMode);
  };

  return (
    <div>
      <h2>User Settings</h2>
      <div>
        <h3>Account Management</h3>
        <button>Connect Wallet</button>
        <button>Disconnect Wallet</button>
        <button>Manage Notifications</button>
      </div>
      <div>
        <h3>UI Preferences</h3>
        <button onClick={toggleDarkMode}>
          {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
