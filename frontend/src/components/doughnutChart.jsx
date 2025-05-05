import React from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import Title from "./Title";

const COLORS = ["#0088FE", "#FFBB28", "#FF8042", "#00C49F"];

const DoughnutChart = ({ dt }) => {
  if (!dt) return null;

  // Parse values to numbers to avoid string values causing issues in the pie chart
  const chartData = [
    { name: "Income", value: parseFloat(dt.income) || 1 },  // Convert to number, default to 1 if invalid
    { name: "Expense", value: parseFloat(dt.expense) || 1 },  // Convert to number, default to 1 if invalid
    { name: "Balance", value: parseFloat(dt.balance) || 1 }, // Convert to number, default to 1 if invalid
  ];

  // console.log("Chart Data:", chartData);  // Log the data to check values

  return (
    <div className='w-full md:w-1/3 flex flex-col items-center bg-gray-50 dark:bg-transparent'>
      <Title title='Summary' />
      <ResponsiveContainer width={"100%"} height={500}>
        <PieChart width={500} height={400}>
          <Tooltip />
          <Legend />
          <Pie
            data={chartData}
            innerRadius={80}    // Adjusted radius
            outerRadius={150}   // Adjusted radius
            fill='#8884d8'
            paddingAngle={5}
            dataKey='value'
            nameKey='name'
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DoughnutChart;
