import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const VitalsChart = ({ data, dataKey, color, label }) => {
  return (
    <div style={{ background: "white", borderRadius: "12px", padding: "16px", boxShadow: "0 0 8px rgba(0,0,0,0.1)" }}>
      <h4 style={{ marginBottom: "12px", textAlign: "center", color: "#007bff" }}>{label}</h4>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VitalsChart;
