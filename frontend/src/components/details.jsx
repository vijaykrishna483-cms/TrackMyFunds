import React from "react";
import { IoClose } from "react-icons/io5";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { RiProgress3Line } from "react-icons/ri";
import { TiWarning } from "react-icons/ti";

const TransactionDetails = ({ data, onClose }) => {
  if (!data) return null;

  const statusIcon = {
    Pending: <RiProgress3Line className="text-amber-500" size={18} />,
    Completed: <IoCheckmarkDoneCircle className="text-emerald-500" size={18} />,
    Rejected: <TiWarning className="text-red-500" size={18} />,
  };

  const statusColor = {
    Pending: "bg-amber-100 text-amber-600",
    Completed: "bg-emerald-100 text-emerald-600",
    Rejected: "bg-red-100 text-red-600",
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-2xl w-full max-w-md p-6">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
          onClick={onClose}
        >
          <IoClose size={22} />
        </button>

        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Transaction Details
        </h2>

        <div className="space-y-5 text-sm text-gray-700 dark:text-gray-300">
          <div className="flex justify-between">
            <span className="font-medium">Date</span>
            <span>{new Date(data.createdat).toDateString()}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">Description</span>
            <span className="text-right max-w-[60%] truncate">{data.description}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium">Status</span>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                statusColor[data.status]
              }`}
            >
              {statusIcon[data.status]} {data.status}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">Source</span>
            <span>{data.source}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">Type</span>
            <span className="capitalize">{data.type}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium">Amount</span>
            <span
              className={`text-lg font-bold px-3 py-1 rounded-full ${
                data.type === "income"
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {data.type === "income" ? "+" : "-"} ₹{data.amount}
            </span>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-full shadow-md transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;
