import React, { useState, useEffect, useRef } from 'react';
import './NurseDashboard.css';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function NurseDashboard() {
  const [patientsData, setPatientsData] = useState({});
  const [patientId, setPatientId] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [latestAlert, setLatestAlert] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const previousAlertRef = useRef(null);

  // Fetch patient sensor data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://hospital-esp-backend.onrender.com/api/sensordata');
        const rawData = await response.json();

        const grouped = {};
        rawData.forEach(entry => {
          const tempF = +(entry.temperature * 9 / 5 + 32).toFixed(1);
          const spo2 = Math.round(entry.spo2);
          const heartRate = Math.round(entry.heartRate);

          if (!grouped[entry.id]) {
            grouped[entry.id] = {
              id: entry.id,
              name: entry.name || 'Unknown',
              room: entry.room || 'N/A',
              bed: entry.bed || 'N/A',
              diagnosis: entry.diagnosis || 'N/A',
              spo2,
              heartRate,
              temperature: tempF,
              data: []
            };
          }

          grouped[entry.id].data.push({
            time: entry.time || new Date().toLocaleTimeString(),
            spo2,
            heartRate,
            temperature: tempF
          });

          grouped[entry.id].data = grouped[entry.id].data.slice(-10);
        });

        setPatientsData(grouped);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch latest alert
  useEffect(() => {
    const fetchLatestAlert = async () => {
      try {
        const response = await fetch('https://hospital-esp-backend.onrender.com/api/alerts');
        const alertData = await response.json();

        if (alertData && alertData.length > 0) {
          const latest = alertData[alertData.length - 1];

          if (!previousAlertRef.current || previousAlertRef.current.time !== latest.time) {
            setLatestAlert(latest);
            setShowPopup(true);
            previousAlertRef.current = latest;

            const audio = new Audio('/alert.mp3');
            audio.play().catch(err => console.error("Audio Error:", err));

            setTimeout(() => setShowPopup(false), 5000);
          }
        }
      } catch (error) {
        console.error("Failed to fetch alerts:", error);
      }
    };

    fetchLatestAlert();
    const interval = setInterval(fetchLatestAlert, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (patientId && patientsData[patientId]) {
      setSelectedPatient({ ...patientsData[patientId] });
    } else if (!patientId) {
      setSelectedPatient(null);
    }
  }, [patientsData, patientId]);

  const getVitalColor = (type, value) => {
    switch (type) {
      case 'spo2':
        if (value >= 95) return 'green';
        if (value >= 90) return 'orange';
        return 'red';
      case 'heartRate':
        if (value >= 60 && value <= 100) return 'green';
        if ((value >= 50 && value < 60) || (value > 100 && value <= 110)) return 'orange';
        return 'red';
      case 'temperature':
        if (value >= 97.7 && value <= 99.5) return 'green';
        if ((value >= 96.8 && value < 97.7) || (value > 99.5 && value <= 101.3)) return 'orange';
        return 'red';
      default:
        return '#000';
    }
  };

  const handleSearch = () => {
    const data = patientsData[patientId.trim()];
    if (data) setSelectedPatient(data);
    else alert('Patient not found!');
  };

  const handleRecentClick = (id) => {
    const data = patientsData[id];
    if (data) {
      setSelectedPatient(data);
      setPatientId(id);
    }
  };

  const renderChart = (data, type, color) => (
    <ResponsiveContainer width="100%" height={160}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey={type} stroke={color} strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );

 return (
  <div className="dashboard-container">
    {showPopup && latestAlert && (
      <div className="popup-alert">
        <button className="dismiss-btn" onClick={() => setShowPopup(false)}>❌</button>
        🚨 <strong>Alert!</strong><br />
        <strong>{latestAlert.name || 'Unknown'}</strong> (<strong>{latestAlert.id}</strong>)<br />
        Room <strong>{latestAlert.room}</strong>, Bed <strong>{latestAlert.bed}</strong><br />
        {latestAlert.message || 'Needs attention'}
      </div>
    )}



      <aside className="sidebar">
        <div className="logo-container">
          <img src="/logo.png" alt="CBR CareNet Logo" className="logo-img" />
        </div>
        <nav>
          <ul>
            <li onClick={() => { setSelectedPatient(null); setPatientId(''); }}>Dashboard</li>
            <li onClick={() => window.location.href = '/'}>Logout</li>
          </ul>
        </nav>
      </aside>

      <main className="dashboard-content">
        <h1>Welcome, Nurse</h1>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by Patient ID..."
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        {!selectedPatient ? (
          <>
            <div className="profile-card">
              <div className="details">
                <h2>Nurse Anjali Mehra</h2>
                <p>Critical Care Nurse</p>
                <div>6 Years Experience | 1,204 Patients | 857 Feedbacks</div>
              </div>
            </div>

            <div className="summary-cards">
              <div className="summary-card">Vitals Monitored Today: 15</div>
              <div className="summary-card">Medications Administered: 9</div>
              <div className="summary-card">Critical Alerts: 2</div>
            </div>

            <div className="two-column-section">
              <div className="table-container">
                <h3>Recent Patients</h3>
                <table>
                  <thead>
                    <tr><th>Patient</th><th>Room</th><th>Last Visit</th></tr>
                  </thead>
                  <tbody>
                    {Object.values(patientsData).map((p) => (
                      <tr key={p.id} onClick={() => handleRecentClick(p.id)} style={{ cursor: 'pointer' }}>
                        <td>{p.name}</td>
                        <td>{p.room}</td>
                        <td>{new Date().toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="table-container">
                <h3>Medication Schedule</h3>
                <table>
                  <thead>
                    <tr><th>Patient</th><th>Medication</th><th>Time</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>Sowjanya D</td><td>Metformin</td><td>08:00 AM</td></tr>
                    <tr><td>Punith M</td><td>Amlodipine</td><td>09:00 AM</td></tr>
                    <tr><td>Chidanand T G</td><td>Albuterol</td><td>09:30 AM</td></tr>
                    <tr><td>Shashank K S</td><td>Albuterol</td><td>09:30 AM</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="patient-details">
              <h3 className="patient-id-line">Patient ID: {selectedPatient.id}</h3>
              <p><strong>Name:</strong> {selectedPatient.name}</p>
              <p><strong>Room:</strong> {selectedPatient.room} | <strong>Bed:</strong> {selectedPatient.bed}</p>
              <p><strong>Health Info:</strong> {selectedPatient.diagnosis}</p>
            </div>

            <div className="vitals-section">
              <div className="vital-card">
                <div className="vital-header">SpO₂</div>
                <h2 className="vital-value" style={{ color: getVitalColor('spo2', selectedPatient.spo2) }}>
                  {selectedPatient.spo2}%
                </h2>
                {renderChart(selectedPatient.data, 'spo2', getVitalColor('spo2', selectedPatient.spo2))}
              </div>

              <div className="vital-card">
                <div className="vital-header">Heart Rate</div>
                <h2 className="vital-value" style={{ color: getVitalColor('heartRate', selectedPatient.heartRate) }}>
                  {selectedPatient.heartRate} BPM
                </h2>
                {renderChart(selectedPatient.data, 'heartRate', getVitalColor('heartRate', selectedPatient.heartRate))}
              </div>

              <div className="vital-card">
                <div className="vital-header">Temperature</div>
                <h2 className="vital-value" style={{ color: getVitalColor('temperature', selectedPatient.temperature) }}>
                  {selectedPatient.temperature}°F
                </h2>
                {renderChart(selectedPatient.data, 'temperature', getVitalColor('temperature', selectedPatient.temperature))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
