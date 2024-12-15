import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, CircleX, CircleCheck } from "lucide-react";

const AdsTable = ({ ads, onImageClick }) => {
  // State để quản lý trạng thái từng ad
  const [adStatuses, setAdStatuses] = useState(
    ads.reduce((acc, ad) => ({ ...acc, [ad.id]: ad.status }), {})
  );

  // Xử lý CircleCheck button
  const handleApproveClick = (id) => {
    setAdStatuses((prev) => {
      if (prev[id] === "Pending") return { ...prev, [id]: "Waiting for payment" };
      if (prev[id] === "Waiting for payment") return { ...prev, [id]: "Approve" };
      return prev;
    });
  };

  // Xử lý CircleX button
  const handleCancelClick = (id) => {
    setAdStatuses((prev) => ({ ...prev, [id]: "Cancel" }));
  };

  return (
    <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}>
    <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8">
      {/* Header bảng */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">
          Advertisement List
        </h2>
        <div className="relative z-20">
          <input
            type="text"
            placeholder="Search reports..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {/* Bảng */}
      <table className="overflow-x-auto">
        <thead className="min-w-full divide-y divide-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Banner Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Start Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              End Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Redirect URL
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              User
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Image
            </th>
            <th className="w-115 px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {ads.map((ad) => (
            <tr key={ad.id} className="hover:bg-gray-700 transition">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                {ad.bannerName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                {ad.startDate}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                {ad.endDate}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                <a
                  href={ad.redirectURL}
                  target="_blank"
                  className="text-blue-400 hover:underline"
                  rel="noreferrer"
                >
                  {ad.redirectURL}
                </a>
              </td>
              <td className="px-4 py-2">
                {ad.userName}
                <div className="text-xs text-gray-400">
                  {ad.phoneNumber} | {ad.email}
                </div>
              </td>
              <td className="w-89 px-6 py-4 whitespace-nowrap text-sm">
                <img
                  src={ad.imageURL}
                  alt={ad.bannerName}
                  className="w-12 h-12 rounded-md cursor-pointer"
                  onClick={() => onImageClick(ad.imageURL)} // Gọi hàm khi click ảnh
                />
              </td>
              <td className="px-6 py-4 whitespace-normal text-sm text-gray-300">
                <span
                  className={`px-2 py-1 rounded-md text-xs ${
                    adStatuses[ad.id] === "Pending"
                      ? "bg-yellow-500 text-gray-900"
                      : adStatuses[ad.id] === "Waiting for payment"
                      ? "bg-blue-500 text-gray-900"
                      : adStatuses[ad.id] === "Approve"
                      ? "bg-green-500 text-gray-900"
                      : "bg-red-500 text-gray-900"
                  }`}
                >
                  {adStatuses[ad.id]}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {/* Action buttons */}
                {adStatuses[ad.id] !== "Cancel" && (
                  <>
                    {adStatuses[ad.id] !== "Approve" && (
                      <button
                        onClick={() => handleApproveClick(ad.id)}
                        className="text-indigo-400 hover:text-indigo-300 mr-2"
                      >
                        <CircleCheck size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => handleCancelClick(ad.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <CircleX size={18} />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </motion.div>
  );
};

export default AdsTable;
