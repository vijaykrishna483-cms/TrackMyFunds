import React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Title from "./Title";

const Chart = ({ data }) => {

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

 
  const customTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      
      const month = months[label];
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: "#fff",
            borderRadius: "5px",
            padding: "10px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <p>{`Month: ${month}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.stroke }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full md:w-2/3">
      <Title title="Transaction Activity" />

      <ResponsiveContainer width={"100%"} height={500} className="mt-5">
        <LineChart width={500} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <YAxis />
          <XAxis tickFormatter={(index) => months[index]} />
          <Legend />
          <Tooltip content={customTooltip} />
          <Line type="monotone" dataKey={"income"} stroke="#8884d8" />
          <Line type="monotone" dataKey={"expense"} stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
