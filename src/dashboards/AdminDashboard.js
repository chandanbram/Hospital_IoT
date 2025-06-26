import React, { useState } from 'react';
import './AdminDashboard.css';

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('Dashboard');

  const renderSection = () => {
    switch (activeSection) {
      case 'User Management':
        return (
          <div className="panel-card">
            <h3>User Management</h3>
            <table>
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>U-001</td>
                  <td>Dr. Aditi Rao</td>
                  <td>Doctor</td>
                  <td><span className="status-tag green">Active</span></td>
                  <td><button>Deactivate</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        );

      case 'Broadcast Composer':
        return (
          <div className="panel-card">
            <h3>Send Broadcast Message</h3>
            <textarea placeholder="Write your message here..." rows={5}></textarea>
            <div style={{ marginTop: '10px' }}>
              <select>
                <option>All</option>
                <option>Doctors</option>
                <option>Nurses</option>
              </select>
              <button style={{ marginLeft: '10px' }}>Send</button>
            </div>
          </div>
        );

      case 'Settings':
        return (
          <div className="panel-card">
            <h3>Platform Settings</h3>
            <ul>
              <li>Session Timeout: <input type="number" value={15} /> mins</li>
              <li>Default Role: <select><option>Doctor</option><option>Nurse</option></select></li>
              <li><button>Save Changes</button></li>
            </ul>
          </div>
        );

      default:

  return (
    <>
      <div className="profile-card">
        <div className="details">
          <h2>Suprith Gowda</h2>
          <p>Hospital Administrator</p>
          <div>12 Years Experience | System Overseer</div>
        </div>
      </div>

      <div className="summary-cards">
        <div className="summary-card">Devices Online: 42</div>
        <div className="summary-card">Active Staff: 87</div>
        <div className="summary-card">Admitted Patients: 231</div>
        <div className="summary-card">Pending Requests: 5</div>
      </div>

      <div className="two-column-section">
        <div className="panel-card">
          <h3>Device Status</h3>
          <table>
            <thead>
              <tr>
                <th>Device ID</th>
                <th>Ward</th>
                <th>Status</th>
                <th>Last Seen</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>D-102</td>
                <td>ICU</td>
                <td><span className="status online">Online</span></td>
                <td>10:42 AM</td>
              </tr>
              <tr>
                <td>D-203</td>
                <td>Ward A</td>
                <td><span className="status lagging">Lagging</span></td>
                <td>10:21 AM</td>
              </tr>
              <tr>
                <td>D-309</td>
                <td>ER</td>
                <td><span className="status offline">Offline</span></td>
                <td>9:55 AM</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="panel-card system-logs">
          <h3>System Logs</h3>
          <ul>
            <li>[10:45 AM] Nurse Rita Shah updated vitals for P-128</li>
            <li>[10:30 AM] Dr. Rao signed in</li>
            <li>[10:20 AM] Device D-309 went offline</li>
          </ul>
        </div>
      </div>
    </>
  );

    }
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="logo-container">
          <img src="/logo.png" alt="CBR CareNet Logo" className="logo-img" />
        </div>
        <ul>
          <li onClick={() => setActiveSection('Dashboard')}>Dashboard</li>
          <li onClick={() => setActiveSection('User Management')}>User Management</li>
          <li onClick={() => setActiveSection('Broadcast Composer')}>Broadcast Message</li>
          <li onClick={() => setActiveSection('Settings')}>Settings</li>
          <li onClick={() => window.location.href = '/'}>Logout</li>
        </ul>
      </div>

      <div className="dashboard-content">
        <h1>Welcome, Admin</h1>
        {renderSection()}
      </div>
    </div>
  );
}

export default AdminDashboard;
