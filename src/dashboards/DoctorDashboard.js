// DoctorDashboard.js
import React, { useState } from 'react';
import './DoctorDashboard.css';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const patientsData = {
  '1': {
    id: '1',
    name: 'Sowjanya D',
    room: '301A',
    bed: 'B1',
    diagnosis: 'Diabetes',
    spo2: 97,
    heartRate: 76,
    temperature: 36.9,
    data: [
      { time: '10:00', spo2: 97, heartRate: 76, temperature: 36.9 },
      { time: '10:10', spo2: 96, heartRate: 77, temperature: 37.1 },
      { time: '10:20', spo2: 95, heartRate: 79, temperature: 37.3 }
    ]
  },
  '2': {
    id: '2',
    name: 'Punith M',
    room: '204B',
    bed: 'C3',
    diagnosis: 'Hypertension',
    spo2: 94,
    heartRate: 88,
    temperature: 38.2,
    data: [
      { time: '10:00', spo2: 95, heartRate: 85, temperature: 38.1 },
      { time: '10:10', spo2: 94, heartRate: 88, temperature: 38.2 },
      { time: '10:20', spo2: 93, heartRate: 90, temperature: 38.3 }
    ]
  },
  '3': {
    id: '3',
    name: 'Chidanand T G',
    room: '105A',
    bed: 'A1',
    diagnosis: 'Asthma',
    spo2: 89,
    heartRate: 94,
    temperature: 38.7,
    data: [
      { time: '10:00', spo2: 90, heartRate: 92, temperature: 38.6 },
      { time: '10:10', spo2: 89, heartRate: 94, temperature: 38.7 },
      { time: '10:20', spo2: 88, heartRate: 95, temperature: 39.0 }
    ]
  },
  '4': {
    id: '4',
    name: 'Shashank K S',
    room: '105B',
    bed: 'A1',
    diagnosis: 'Headache',
    spo2: 89,
    heartRate: 94,
    temperature: 38.7,
    data: [
      { time: '10:00', spo2: 90, heartRate: 92, temperature: 38.6 },
      { time: '10:10', spo2: 89, heartRate: 94, temperature: 38.7 },
      { time: '10:20', spo2: 88, heartRate: 95, temperature: 39.0 }
    ]
  },
};

const getVitalColor = (type, value) => {
  switch (type) {
    case 'spo2':
      if (value >= 95) return 'green';         // Normal
      if (value >= 90) return 'orange';        // Slightly low
      return 'red';                            // Critical low

    case 'heartRate':
      if (value >= 60 && value <= 100) return 'green';   // Normal
      if ((value >= 50 && value < 60) || (value > 100 && value <= 110)) return 'orange'; // Slightly abnormal
      return 'red';                                     // Critical

    case 'temperature':
      if (value >= 36.5 && value <= 37.5) return 'green'; // Normal
      if ((value >= 36.0 && value < 36.5) || (value > 37.5 && value <= 38.5)) return 'orange'; // Slightly low/high
      return 'red'; // Critical hypothermia or high fever

    default:
      return '#000'; // Default color for unknown types
  }
};


export default function DoctorDashboard() {
  const [patientId, setPatientId] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);

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
                <h2>Dr. Chaithra Chandrashekar</h2>
                <p>Snr. Physician</p>
                <div>8 Years Experience | 2,598 Patients | 1,537 Reviews</div>
              </div>
            </div>

            <div className="summary-cards">
              <div className="summary-card">Appointments Today: 8</div>
              <div className="summary-card">Pending Reports: 3</div>
              <div className="summary-card">Total Patients: 25</div>
            </div>

  <div className="two-column-section">
  {/* Recent Patients */}
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
            <td>June 19, 2025</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Upcoming Appointments */}
  <div className="table-container">
    <h3>Upcoming Appointments</h3>
    <table>
      <thead>
        <tr>
          <th>Patient</th>
          <th>Date</th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Neha P</td><td>20 Jun 2025</td><td>09:30 AM</td></tr>
        <tr><td>Rahul B</td><td>20 Jun 2025</td><td>10:15 AM</td></tr>
        <tr><td>Asha R</td><td>20 Jun 2025</td><td>11:00 AM</td></tr>
      </tbody>
    </table>
  </div>
</div>


          </>
        ) : (
          <>
            <div className="patient-details">
              <h3 className="patient-id-line">
                Patient ID: <span>{selectedPatient.id}</span>
              </h3>

              <p><strong>Name:</strong> {selectedPatient.name}</p>
              <p><strong>Room:</strong> {selectedPatient.room} | <strong>Bed:</strong> {selectedPatient.bed}</p>
              <p><strong>Health Info:</strong> {selectedPatient.diagnosis}</p>
            </div>

            <div className="vitals-section">
  <div className="vital-card">
    <div className="vital-header">SpO₂</div>
    <h2
      className="vital-value"
      style={{ color: getVitalColor('spo2', selectedPatient.spo2) }}
    >
      {selectedPatient.spo2}%
    </h2>
    {renderChart(
      selectedPatient.data,
      'spo2',
      getVitalColor('spo2', selectedPatient.spo2)
    )}
  </div>

  <div className="vital-card">
    <div className="vital-header">Heart Rate</div>
    <h2
      className="vital-value"
      style={{ color: getVitalColor('heartRate', selectedPatient.heartRate) }}
    >
      {selectedPatient.heartRate} BPM
    </h2>
    {renderChart(
      selectedPatient.data,
      'heartRate',
      getVitalColor('heartRate', selectedPatient.heartRate)
    )}
  </div>

  <div className="vital-card">
    <div className="vital-header">Temperature</div>
    <h2
      className="vital-value"
      style={{ color: getVitalColor('temperature', selectedPatient.temperature) }}
    >
      {selectedPatient.temperature}°C
    </h2>
    {renderChart(
      selectedPatient.data,
      'temperature',
      getVitalColor('temperature', selectedPatient.temperature)
    )}
  </div>
</div>

          </>
        )}
      </main>
    </div>
  );
}
