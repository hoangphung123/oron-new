import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, CircleX, CircleCheck } from "lucide-react";
import * as AdminServe from "../../server/adminStore";

const AdsTable = ({ ads, onImageClick, onUpdateSuccess }) => {
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [bannerId, setBannerId] = useState(null);
  const [pendingStatusCd, setPendingStatusCd] = useState(null); // Lưu trạng thái chờ
  const [rejectReason, setRejectReason] = useState(""); // Lưu lý do từ chối
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredReport, setFilteredReport] = useState([]);

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

  const formatDate = (dateString) => {
    const localDate = new Date(dateString);
    return localDate.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const handleStatusUpdate = async (statusCd, bannerId) => {
    const accessToken = JSON.parse(localStorage.getItem("access_token_admin"));
    const updateData = { statusCd };

    // Nếu trạng thái là Reject, thêm rejectReason vào dữ liệu
    if (statusCd === "3") {
      updateData.rejectReason = rejectReason;
    }

    try {
      await AdminServe.updateBanner(accessToken, bannerId, updateData);
      setShowConfirmPopup(false);
      setRejectReason(""); // Reset rejectReason

      if (onUpdateSuccess) {
        onUpdateSuccess();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleStatusClick = (statusCd, bannerId) => {
    setPendingStatusCd(statusCd);
    setBannerId(bannerId);
    setShowConfirmPopup(true);
  };

  const handleConfirmStatus = () => {
    handleStatusUpdate(pendingStatusCd, bannerId);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = ads.filter((report) =>
      report.bannerName.toLowerCase().includes(term)
    );
    setFilteredReport(filtered);
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
          <h2 className="text-xl font-semibold text-gray-100">
            Advertisement List
          </h2>
          <div className="relative z-20">
            <input
              type="text"
              placeholder="Search users..."
              className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
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
                Total cost
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
                  <span
                    className="block truncate max-w-xs"
                    title={ad.bannerName}
                  >
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
                  {ad.totalCost}
                </td>
                <td className="px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                  <a
                    href={ad.redirectUrl}
                    target="_blank"
                    className="text-blue-400 hover:underline truncate"
                    rel="noreferrer"
                    style={{
                      maxWidth: "150px",
                      display: "inline-block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {ad.redirectUrl}
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
                  <span
                    className={`px-2 py-1 rounded-md text-xs ${getStatusColor(
                      ad.contractStatus
                    )}`}
                  >
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
                  {ad.contractStatus === "1" && (
                    <>
                      <button
                        onClick={() => handleStatusClick("2", ad.contractId)} // Accept
                        className="text-indigo-400 hover:text-indigo-300 mr-2"
                      >
                        <CircleCheck size={18} />
                      </button>
                      <button
                        onClick={() => handleStatusClick("3", ad.contractId)} // Reject
                        className="text-red-400 hover:text-red-300"
                      >
                        <CircleX size={18} />
                      </button>
                    </>
                  )}
                  {ad.contractStatus === "2" && (
                    <button
                      onClick={() => handleStatusClick("4", ad.contractId)} // Paid
                      className="text-green-400 hover:text-green-300"
                    >
                      <CircleCheck size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showConfirmPopup && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-800 rounded-lg p-6 text-center shadow-lg">
              <h3 className="text-lg font-semibold text-gray-100 mb-4">
                {pendingStatusCd === "3"
                  ? "Please provide a reason for rejection"
                  : "Are you sure you want to update the status?"}
              </h3>
              {pendingStatusCd === "3" && (
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Enter reject reason..."
                  className="w-full p-2 mb-4 bg-gray-700 text-gray-100 rounded-md"
                />
              )}
              <div className="flex justify-center">
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-md mr-4 hover:bg-blue-500"
                  onClick={handleConfirmStatus}
                  disabled={pendingStatusCd === "3" && !rejectReason.trim()}
                >
                  Confirm
                </button>
                <button
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-500"
                  onClick={() => setShowConfirmPopup(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AdsTable;
