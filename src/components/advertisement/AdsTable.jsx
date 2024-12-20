import React from "react";
import { motion } from "framer-motion";
import { Search, CircleX, CircleCheck } from "lucide-react";

const AdsTable = ({ ads, onImageClick }) => {
  // Map trạng thái contractStatus sang màu sắc
  const getStatusColor = (status) => {
    switch (status) {
      case "1":
        return "bg-yellow-500 text-gray-900"; // Pending for approval
      case "2":
        return "bg-blue-500 text-gray-900"; // Pending for Payment
      case "3":
        return "bg-red-500 text-gray-900"; // Rejected
      case "4":
        return "bg-green-500 text-gray-900"; // Paid
      case "5":
        return "bg-gray-500 text-gray-900"; // User Cancelled
      default:
        return "bg-gray-700 text-gray-300"; // Default
    }
  };

  // Định dạng ngày
  const formatDate = (dateString) => {
    const localDate = new Date(dateString);
    return localDate.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8 overflow-x-auto">
        {/* Header bảng */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-100">Advertisement List</h2>
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
              <th className="w-115 px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
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
                <td className="w-115 px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                  <span className="block truncate max-w-xs" title={ad.bannerName}>
                    {ad.bannerName}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                  {formatDate(ad.startDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                  {formatDate(ad.endDate)}
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
                  {ad.clientName}
                  <div className="text-xs text-gray-400">
                    {ad.clientContactNumber} | {ad.clientEmail}
                  </div>
                </td>
                <td className="w-89 px-6 py-4 whitespace-nowrap text-sm">
                  <img
                    src={ad.image.url}
                    alt={ad.bannerName}
                    className="w-12 h-12 rounded-md cursor-pointer"
                    onClick={() => onImageClick(ad.image.url)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <span className={`px-2 py-1 rounded-md text-xs ${getStatusColor(ad.contractStatus)}`}>
                    {(() => {
                      switch (ad.contractStatus) {
                        case "1":
                          return "Pending for approval";
                        case "2":
                          return "Pending for Payment";
                        case "3":
                          return "Rejected";
                        case "4":
                          return "Paid";
                        case "5":
                          return "User Cancelled";
                        default:
                          return "Unknown";
                      }
                    })()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {ad.contractStatus ==="1" && (
                    <button
                      onClick={() => console.log(`Action on ad ${ad.id}`)}
                      className="text-indigo-400 hover:text-indigo-300 mr-2"
                    >
                      <CircleCheck size={18} />
                    </button>
                  )}
                  {ad.contractStatus ==="1" && (
                    <button
                      onClick={() => console.log(`Cancel ad ${ad.id}`)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <CircleX size={18} />
                    </button>
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