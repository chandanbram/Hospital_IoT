// App.jsx
import React, { useState } from 'react';
import './App.css';
import users from './users';
import DoctorDashboard from './dashboards/DoctorDashboard';
import NurseDashboard from './dashboards/NurseDashboard';
import AdminDashboard from './dashboards/AdminDashboard';
import EngineerDashboard from './dashboards/EngineerDashboard';
import logo from './logo.png';
import LoginCard from './components/LoginCard';
import FeaturePanel from './components/FeaturePanel';

const App = () => {
  const [user, setUser] = useState(null);
  const [loginData, setLoginData] = useState({ id: '', password: '' });
  const [error, setError] = useState('');

  const handleLogin = () => {
    const foundUser = users.find(u => u.id === loginData.id && u.password === loginData.password);
    if (foundUser) {
      setUser(foundUser);
      setError('');
    } else {
      setError('Invalid credentials!');
    }
  };

  if (user) {
    switch (user.role) {
      case 'doctor':
        return <DoctorDashboard />;
      case 'nurse':
        return <NurseDashboard />;
      case 'admin':
        return <AdminDashboard />;
      case 'engineer':
        return <EngineerDashboard />;
      default:
        return <div>Invalid role</div>;
    }
  }

  return (
    <div className="login-root">
      <div className="login-wrapper">
        <FeaturePanel />
        <div className="right-pane">
          <img src={logo} alt="Logo" className="cbr-logo" />
          <LoginCard
            loginData={loginData}
            setLoginData={setLoginData}
            handleLogin={handleLogin}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
