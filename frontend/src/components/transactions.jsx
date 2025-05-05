import React from "react";
import Title from "./Title.jsx";
import { RiProgress3Line } from "react-icons/ri";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { TiWarning } from "react-icons/ti";

const Transactions = ({ data = [] }) => {
 const formatDate = (dateString) => {
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? "Invalid date" : date.toLocaleDateString();
};


  return (
    <div className="py-20 w-full md:w-2/3">
      <Title title="Latest Transactions" />

      {data.length === 0 ? (
        <p className="mt-6 text-gray-500 dark:text-gray-400 text-center">
          No recent transactions found.
        </p>
      ) : (
        <div className="overflow-x-auto mt-5">
          <table className="w-full">
            <thead className="border-b border-gray-300 dark:border-gray-700 text-left text-black dark:text-gray-400">
              <tr>
                <th className="py-2 px-2">Date</th>
                <th className="py-2 px-2">Type</th>
                <th className="py-2 px-2">Status</th>
                <th className="py-2 px-2">Category</th>
                <th className="py-2 px-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 5).map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/20"
                >
                  <td className="py-2 px-2">{formatDate(item.createdat)}</td>
                  <td className="py-2 px-2 capitalize">
                    <p className="font-medium text-black dark:text-gray-300 text-base">
                      {item.type || "N/A"}
                    </p>
                    <span className="text-sm text-gray-500">
                      {item.description || "No description"}
                    </span>
                  </td>
                  <td className="py-2 px-2">
                    <div className="flex items-center gap-2">
                      {item.status === "Pending" && (
                        <RiProgress3Line className="text-yellow-600" size={20} />
                      )}
                      {item.status === "Completed" && (
                        <IoCheckmarkDoneCircle className="text-emerald-600" size={20} />
                      )}
                      {item.status === "Rejected" && (
                        <TiWarning className="text-red-600" size={20} />
                      )}
                      <span className="capitalize">{item.status || "N/A"}</span>
                    </div>
                  </td>
                  <td className="py-2 px-2">{item.source || "N/A"}</td>
                  <td className="py-2 px-2 font-medium text-black dark:text-gray-300">
                    {Number(item.amount || 0).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Transactions;
