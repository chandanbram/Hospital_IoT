import React, { useState, useEffect } from 'react';
import './NurseDashboard.css';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function NurseDashboard() {
  const [patientsData, setPatientsData] = useState({});
  const [patientId, setPatientId] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);

  // 1️⃣ Fetch sensor data every 5 seconds
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://hospital-esp-backend.onrender.com/api/sensordata');
        const rawData = await response.json();

        const grouped = {};
        rawData.forEach(entry => {
          if (!grouped[entry.id]) {
            grouped[entry.id] = {
              id: entry.id,
              name: entry.name || 'Unknown',
              room: entry.room || 'N/A',
              bed: entry.bed || 'N/A',
              diagnosis: entry.diagnosis || 'N/A',
              spo2: entry.spo2,
              heartRate: entry.heartRate,
              temperature: entry.temperature,
              data: []
            };
          }
          grouped[entry.id].data.push({
            time: entry.time || new Date().toLocaleTimeString(),
            spo2: entry.spo2,
            heartRate: entry.heartRate,
            temperature: entry.temperature
          });
        });

        setPatientsData(grouped);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData(); // initial fetch
    const interval = setInterval(fetchData, 5000); // refresh every 5 sec
    return () => clearInterval(interval);
  }, []);

  // 2️⃣ Sync selected patient with latest vitals
  useEffect(() => {
    if (patientId && patientsData[patientId]) {
      setSelectedPatient(patientsData[patientId]);
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
        if (value >= 36.5 && value <= 37.5) return 'green';
        if ((value >= 36.0 && value < 36.5) || (value > 37.5 && value <= 38.5)) return 'orange';
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
                    <tr>
                      <th>Patient</th>
                      <th>Room</th>
                      <th>Last Visit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(patientsData).map((p) => (
                      <tr
                        key={p.id}
                        onClick={() => handleRecentClick(p.id)}
                        style={{ cursor: 'pointer' }}
                      >
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
                  {selectedPatient.temperature}°C
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
