import React, { useState, useEffect } from 'react';
import './EngineerDashboard.css';
import axios from 'axios';

function EngineerDashboard() {
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [homomorphicEnabled, setHomomorphicEnabled] = useState(true);
  const [dpEnabled, setDpEnabled] = useState(false);
  const [accessLoggingEnabled, setAccessLoggingEnabled] = useState(true);
  const [keyRotationStatus, setKeyRotationStatus] = useState("Not Triggered");
  const [trainingEpochs, setTrainingEpochs] = useState(30);
  const [batchSize, setBatchSize] = useState(32);
  const [performance, setPerformance] = useState("Accuracy: 94.3% | Loss: 0.12");
  const [trainingInProgress, setTrainingInProgress] = useState(false);

  const AGGREGATOR_BASE_URL = 'https://reduced-valley-jon-penny.trycloudflare.com';

  useEffect(() => {
    axios.get(`${AGGREGATOR_BASE_URL}/dp-status`)
      .then(res => setDpEnabled(res.data.dp_enabled))
      .catch(err => console.error("Failed to fetch DP status:", err));
  }, []);

 const handleDpToggle = () => {
  const newState = !dpEnabled;
  setDpEnabled(newState); // optimistic UI update

  axios.post(`${AGGREGATOR_BASE_URL}/toggle-dp`, { dp_enabled: newState })
    .then(res => {
      console.log("✅ DP status updated:", res.data);
      alert(`✅ Differential Privacy ${newState ? 'enabled' : 'disabled'} successfully.`);
    })
    .catch(err => {
      console.error("❌ DP toggle failed:", err);
      alert("❌ Failed to update Differential Privacy setting.");
      setDpEnabled(!newState); // revert change on error
    });
};


  const handleStartTraining = async () => {
    setTrainingInProgress(true);
    try {
      const response = await fetch(`${AGGREGATOR_BASE_URL}/api/start_training`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const result = await response.json();
      console.log("Training triggered:", result);
      alert("Success✅ Training triggerd.");
    } catch (error) {
      console.error("❌ Training trigger failed:", error);
      alert("⚠️ Failed to start training.");
    } finally {
      setTrainingInProgress(false);
    }
  };

  const handleKeyRotation = async () => {
    setKeyRotationStatus("Triggering...");
    try {
      const response = await fetch(`${AGGREGATOR_BASE_URL}/api/rotate_keys`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const result = await response.json();
      alert(`🔑 Key Rotation Triggered: ${result.status || 'Sent'}`);
      setKeyRotationStatus("Triggered Successfully");
    } catch (error) {
      console.error(error);
      alert("⚠️ Failed to trigger key rotation.");
      setKeyRotationStatus("Failed to Trigger");
    }
  };

  const renderModelInsights = () => (
    <div className="panel-card">
      <h3>Federated Learning / AI Controls</h3>
      <table>
        <thead>
          <tr><th>Feature</th><th>Details</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Training Config</td>
            <td>
              Epochs: <span style={{ fontWeight: 'bold' }}>{trainingEpochs}</span> |
              Batch Size: <span style={{ fontWeight: 'bold', marginLeft: '10px' }}>{batchSize}</span>
            </td>
          </tr>
          <tr>
            <td>Performance</td>
            <td>{performance}</td>
          </tr>
          <tr>
            <td>Trigger Training</td>
            <td>
              <button onClick={handleStartTraining} className="debug-btn" disabled={trainingInProgress}>
                {trainingInProgress ? 'Training in Progress...' : 'Start FL Training'}
              </button>
              {trainingInProgress && <span className="spinner" style={{ marginLeft: '10px' }}></span>}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  const renderDashboard = () => (
    <>
      <div className="profile-card">
        <div className="details">
          <h2>Chandan B Ram</h2>
          <p>Security & AI Engineer</p>
          <div>6 Years Experience | Federated Systems | IoT Privacy</div>
        </div>
      </div>

      <div className="summary-cards">
        <div className="summary-card">Devices Online: 37</div>
        <div className="summary-card">Active Models: 4</div>
        <div className="summary-card">Synced Nodes: 92%</div>
        <div className="summary-card">Pending Alerts: 3</div>
      </div>

      <div className="two-column-section">
        <div className="panel-card">
          <h3>Rotating Encryption Keys</h3>
          <div className="rotation-keys">AES-256 → AES-GCM → RSA-2048 → ECC-P521</div>
          <p>Last rotated: 08:20 AM · Next scheduled: 08:20 PM</p>
          <button onClick={handleKeyRotation} className="debug-btn">Trigger Key Rotation Now</button>
        </div>

        <div className="panel-card">
          <h3>Sync Summary</h3>
          <table>
            <thead>
              <tr><th>Edge Node</th><th>Status</th><th>Model</th><th>Last Sync</th></tr>
            </thead>
            <tbody>
              <tr><td>Node-01</td><td><span className="status online">Online</span></td><td>v1.2.3</td><td>09:05 AM</td></tr>
              <tr><td>Node-07</td><td><span className="status lagging">Lagging</span></td><td>v1.1.0</td><td>08:45 AM</td></tr>
              <tr><td>Node-15</td><td><span className="status offline">Offline</span></td><td>-</td><td>07:50 AM</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="two-column-section">
        <div className="system-logs">
          <h3>System Logs</h3>
          <ul>
            <li>[09:45 AM] Key rotation executed for group B</li>
            <li>[09:20 AM] Firmware updated on Node-07</li>
            <li>[08:50 AM] DP toggle turned ON</li>
          </ul>
        </div>

        <div className="alerts-panel">
          <h3>Broadcast Messages</h3>
          <ul>
            <li>Scheduled maintenance at 11PM tonight.</li>
            <li>New AI model sync window: 2PM - 4PM.</li>
          </ul>
        </div>
      </div>
    </>
  );

  const renderSecurityPanel = () => (
    <div className="panel-card">
      <h3>Privacy & Security Settings</h3>
      <table>
        <thead>
          <tr><th>Feature</th><th>Description</th><th>Status</th><th>Action</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Homomorphic Encryption</td>
            <td>Real-time encrypted computation</td>
            <td><span className="status" style={{ backgroundColor: homomorphicEnabled ? '#e0f9e8' : '#ffe6e6', color: homomorphicEnabled ? '#28a745' : '#d9534f' }}>{homomorphicEnabled ? 'Enabled' : 'Disabled'}</span></td>
            <td><button className="toggle-btn" onClick={() => setHomomorphicEnabled(p => !p)}>{homomorphicEnabled ? 'Disable' : 'Enable'}</button></td>
          </tr>

          <tr>
            <td>Differential Privacy</td>
            <td>Noise injection for private training</td>
            <td><span className="status" style={{ backgroundColor: dpEnabled ? '#e0f9e8' : '#ffe6e6', color: dpEnabled ? '#28a745' : '#d9534f' }}>{dpEnabled ? 'Enabled' : 'Disabled'}</span></td>
            <td><button className="toggle-btn" onClick={handleDpToggle}>{dpEnabled ? 'Disable' : 'Enable'}</button></td>
          </tr>

          <tr>
            <td>Access Logging</td>
            <td>Log access events (filterable)</td>
            <td><span className="status" style={{ backgroundColor: accessLoggingEnabled ? '#e0f9e8' : '#ffe6e6', color: accessLoggingEnabled ? '#28a745' : '#d9534f' }}>{accessLoggingEnabled ? 'Enabled' : 'Disabled'}</span></td>
            <td><button className="toggle-btn" onClick={() => setAccessLoggingEnabled(p => !p)}>{accessLoggingEnabled ? 'Disable' : 'Enable'}</button></td>
          </tr>

          <tr>
            <td>Manual Key Rotation</td>
            <td>Trigger an immediate key rotation for all devices.</td>
            <td><span className="status" style={{ backgroundColor: keyRotationStatus === "Triggered Successfully" ? '#e0f9e8' : (keyRotationStatus === "Failed to Trigger" ? '#ffe6e6' : '#fff3cd'), color: keyRotationStatus === "Triggered Successfully" ? '#28a745' : (keyRotationStatus === "Failed to Trigger" ? '#d9534f' : '#856404') }}>{keyRotationStatus}</span></td>
            <td><button className="toggle-btn" onClick={handleKeyRotation}>Rotate Keys Now</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  const renderDeviceMonitor = () => (
    <div className="panel-card">
      <h3>IoT Device Monitor</h3>
      <table>
        <thead><tr><th>Device</th><th>Location</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          <tr><td>Dev-01</td><td>ICU</td><td><span className="status online">Online</span></td><td><button>Restart</button></td></tr>
          <tr><td>Dev-03</td><td>Ward A</td><td><span className="status lagging">Lagging</span></td><td><button>Restart</button></td></tr>
          <tr><td>Dev-07</td><td>ER</td><td><span className="status offline">Offline</span></td><td><button>Restart</button></td></tr>
        </tbody>
      </table>
    </div>
  );

  const renderDebugTools = () => (
    <div className="panel-card debug-section">
      <h3>Advanced Debug Tools</h3>
      <div className="debug-subsection">
        <h4>Live Console Access</h4>
        <p>Launch a restricted terminal session for on-device debugging.</p>
        <button className="debug-btn">Open Console</button>
      </div>
      <div className="debug-subsection">
        <h4>Data Download</h4>
        <p>Export device metrics or logs.</p>
        <div className="debug-buttons">
          <button className="debug-btn">Export CSV</button>
          <button className="debug-btn">Export JSON</button>
        </div>
      </div>
      <div className="debug-subsection">
        <h4>Network Bandwidth Monitor</h4>
        <p>Live bandwidth usage:</p>
        <div className="bandwidth-box"><strong>3.5 Mbps</strong></div>
      </div>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'Dashboard':
        return renderDashboard();
      case 'Model Insights':
        return renderModelInsights();
      case 'Security':
        return renderSecurityPanel();
      case 'Device Monitoring':
        return renderDeviceMonitor();
      case 'Debug Tools':
        return renderDebugTools();
      default:
        return <div>Select a section</div>;
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo-container"></div>
        <ul>
          <li onClick={() => setActiveSection('Dashboard')}>Dashboard</li>
          <li onClick={() => setActiveSection('Model Insights')}>Model Insights</li>
          <li onClick={() => setActiveSection('Security')}>Security Panel</li>
          <li onClick={() => setActiveSection('Device Monitoring')}>Devices</li>
          <li onClick={() => setActiveSection('Debug Tools')}>Debug Tools</li>
          <li onClick={() => window.location.href = '/'}>Logout</li>
        </ul>
      </aside>
      <main className="dashboard-content">
        <h1>Welcome, Engineer</h1>
        {renderSection()}
      </main>
    </div>
  );
}

export default EngineerDashboard;
