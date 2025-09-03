// DoctorDashboard.js
import React, { useState, useEffect, useRef } from 'react';
import './DoctorDashboard.css';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function DoctorDashboard() {
  const [patientsData, setPatientsData] = useState({});
  const [patientId, setPatientId] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [latestAlert, setLatestAlert] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const previousAlertRef = useRef(null);

  // Fetch patient sensor data (every 1s like NurseDashboard)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://hospital-esp-backend.onrender.com/api/sensordata');
        const rawData = await response.json();

        const grouped = {};
        rawData.forEach(entry => {
          const tempF = +(entry.temperature * 9 / 5 + 32).toFixed(1); // Fahrenheit
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
        console.error("Failed to fetch patient data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch latest alert (like NurseDashboard)
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

  // Update selected patient when searching or selecting recent
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
      case 'temperature': // Fahrenheit ranges
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

  // ✅ Static Appointments
  const appointments = [
    { name: "Sowjanya D", date: "2025-09-04", time: "10:00 AM" },
    { name: "Punith M", date: "2025-09-04", time: "11:00 AM" },
    { name: "Chidanand T G", date: "2025-09-04", time: "12:00 PM" },
    { name: "Shashank K S", date: "2025-09-04", time: "02:00 PM" },
  ];

  return (
    <div className="dashboard-container">
      {/* Popup alert */}
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
        <h1>Welcome, Doctor</h1>

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
                <h2>Dr. M B Nirmala</h2>
                <p>Snr. Physician</p>
                <div>8 Years Experience | 2,598 Patients | 1,537 Reviews</div>
              </div>
            </div>

            <div className="summary-cards">
              <div className="summary-card">Appointments Today: {appointments.length}</div>
              <div className="summary-card">Pending Reports: 3</div>
              <div className="summary-card">Total Patients: {Object.keys(patientsData).length}</div>
            </div>

            <div className="two-column-section">
              {/* Recent Patients */}
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

              {/* Next Appointments */}
              <div className="table-container">
                <h3>Next Appointments</h3>
                <table>
                  <thead>
                    <tr><th>Patient</th><th>Date</th><th>Time</th></tr>
                  </thead>
                  <tbody>
                    {appointments.map((appt, idx) => (
                      <tr key={idx}>
                        <td>{appt.name}</td>
                        <td>{appt.date}</td>
                        <td>{appt.time}</td>
                      </tr>
                    ))}
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

