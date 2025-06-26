import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const VitalsChart = ({ data, type, color }) => {
  const labelMap = {
    spo2: 'SpO₂ (%)',
    heartRate: 'Heart Rate (BPM)',
    temperature: 'Temp (°C)',
  };

  return (
    <div style={{ width: '100%', height: 200, marginTop: '20px' }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
          <XAxis dataKey="time" label={{ value: 'Time', position: 'insideBottomRight', offset: 0 }} />
          <YAxis
            label={{
              value: labelMap[type],
              angle: -90,
              position: 'insideLeft',
            }}
          />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          <Line
            type="monotone"
            dataKey={type}
            stroke={color}
            strokeWidth={2}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VitalsChart;
