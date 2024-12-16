import { motion } from "framer-motion";
import { Edit, Trash2, Search } from "lucide-react";
import { useState, useEffect } from "react";
import * as AdminServe from "../../server/adminStore";

const ReportsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredReports, setFilteredReports] = useState([]);
  const [reports, setReports] = useState([]);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null); // Lưu thông tin báo cáo cần xóa

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = reports.filter(
      (report) =>
        report.title.toLowerCase().includes(term) ||
        report.description.toLowerCase().includes(term) ||
        report.reportUser.toLowerCase().includes(term)
    );
    setFilteredReports(filtered);
  };

  const fetchReports = async () => {
    try {
      const accessToken = JSON.parse(
        localStorage.getItem("access_token_admin")
      );
      if (accessToken) {
        const fetchedReports = await AdminServe.getReportsByAdmin(
          accessToken
        );
        setReports(fetchedReports.listData);
        setFilteredReports(fetchedReports.listData);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const handleDeleteClick = (report) => {
    setReportToDelete(report); // Gán báo cáo cần xóa
    setShowConfirmPopup(true); // Hiển thị popup
  };

  const confirmDelete = async () => {
    try {
      if (reportToDelete) {
        const accessToken = JSON.parse(
          localStorage.getItem("access_token_admin")
        );
        await AdminServe.deletePost(reportToDelete.id, accessToken); // Gọi API xóa
        setReports((prev) => prev.filter((r) => r.id !== reportToDelete.id)); // Cập nhật state
        setFilteredReports((prev) =>
          prev.filter((r) => r.id !== reportToDelete.id)
        );
        setReportToDelete(null); // Reset state
        setShowConfirmPopup(false); // Ẩn popup
      }
    } catch (error) {
      console.error("Error deleting report:", error);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Reports</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search reports..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSearch}
            value={searchTerm}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Report User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {filteredReports.map((report) => (
              <motion.tr
                key={report.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                  {report.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {report.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <img
                    src={`http://localhost:3500/${report.post.imageURL}`}
                    alt="Report Image"
                    className="w-12 h-12 rounded-md"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {new Date(report.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {report.user.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {/* <button
                    className="text-indigo-400 hover:text-indigo-300 mr-2"
                  >
                    <Edit size={18} />
                  </button> */}
                  <button
                    className="text-red-400 hover:text-red-300"
                    onClick={() => handleDeleteClick(report)}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup xác nhận */}
      {showConfirmPopup && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg p-6 text-center shadow-lg">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">
              Bạn có chắc chắn muốn xóa báo cáo này?
            </h3>
            <div className="flex justify-center">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-md mr-4 hover:bg-red-500"
                onClick={confirmDelete}
              >
                Xác nhận
              </button>
              <button
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-500"
                onClick={() => setShowConfirmPopup(false)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ReportsTable;
