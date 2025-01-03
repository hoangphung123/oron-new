import { motion } from "framer-motion";
import { Edit, Trash2, Search, CircleCheckBig } from "lucide-react";
import { useState, useEffect } from "react";
import * as AdminServe from "../../server/adminStore";
import * as Itemserver from "../../server/itemstore";

const ReportsTable = ({ onImageClick }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredReports, setFilteredReports] = useState([]);
  const [reports, setReports] = useState([]);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showConfirmPopupAccess, setShowConfirmPopupAccess] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null); // Lưu thông tin báo cáo cần xóa
  const [postToDelete, setPostToDelete] = useState(null);

  const REPORT_STATUS = {
    PENDING: 1,
    ACCEPTED: 2,
    CANCELED: 3,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case REPORT_STATUS.PENDING:
        return "text-yellow-400";
      case REPORT_STATUS.ACCEPTED:
        return "text-green-400";
      case REPORT_STATUS.CANCELED:
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

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
        const fetchedReports = await AdminServe.getReportsByAdmin(accessToken);
        console.log("fetchedReports", fetchedReports);
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

  const handleHidePost = (report) => {
    setPostToDelete(report); // Gán báo cáo cần xóa
    setShowConfirmPopupAccess(true); // Hiển thị popup
  };

  const confirmDelete = async () => {
    // const dataNofication = {
    //   userRid: reportToDelete.user.id,
    //   title: "Report Post",
    //   itemRid: reportToDelete.post.id,
    //   content: `Your report is not identified`, // Sửa lỗi ở đây
    //   typeCd: "0",
    // };
    try {
      if (reportToDelete) {
        const accessToken = JSON.parse(
          localStorage.getItem("access_token_admin")
        );
        await AdminServe.updateReport(reportToDelete.id, 3 , accessToken); // Gọi API xóa
        // setReports((prev) => prev.filter((r) => r.id !== reportToDelete.id)); // Cập nhật state
        // setFilteredReports((prev) =>
        //   prev.filter((r) => r.id !== reportToDelete.id)
        // );
        // await Itemserver.createNoficationRegisPost(accessToken, dataNofication);
        setReportToDelete(null); // Reset state
        fetchReports();
        setShowConfirmPopup(false); // Ẩn popup
      }
    } catch (error) {
      console.error("Error deleting report:", error);
    }
  };

  const confirmDeletePost = async () => {
    // const dataNofication = {
    //   userRid: reportToDelete.user.id,
    //   title: "Report Post",
    //   itemRid: reportToDelete.post.id,
    //   content: `Your report has been approved`, // Sửa lỗi ở đây
    //   typeCd: "0",
    // };
    const updatedata = {
      status: 3
    }
    try {
      if (postToDelete) {
        const accessToken = JSON.parse(
          localStorage.getItem("access_token_admin")
        );
        await AdminServe.updateReport(postToDelete.id, 2 , accessToken); // Gọi API xóa
        // setReports((prev) => prev.filter((r) => r.id !== reportToDelete.id)); // Cập nhật state
        // setFilteredReports((prev) =>
        //   prev.filter((r) => r.id !== reportToDelete.id)
        // );
        await Itemserver.updatePost(accessToken, postToDelete.post.id, updatedata);
        // await Itemserver.createNoficationRegisPost(accessToken, dataNofication);
        setPostToDelete(null); // Reset state
        fetchReports();
        setShowConfirmPopupAccess(false); // Ẩn popup
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
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Post Content
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
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
                <td className="w-89 px-6 py-4 whitespace-nowrap text-sm">
                  <img
                    src={report.post.image[0].url}
                    alt={report.post.image[0].alternativeText}
                    className="w-12 h-12 rounded-md cursor-pointer"
                    onClick={() => onImageClick(report.post.image[0].url)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                  {report.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {report.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {report.post.description}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getStatusColor(
                    report.status
                  )}`}
                >
                  {Object.keys(REPORT_STATUS).find(
                    (key) => REPORT_STATUS[key] === report.status
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {new Date(report.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {report.user.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {report.status === REPORT_STATUS.PENDING && (
                    <>
                      <button
                        className="text-indigo-400 hover:text-indigo-300 mr-2"
                        onClick={() => handleHidePost(report)}
                      >
                        <CircleCheckBig color="#79c9ec" size={18} />
                      </button>
                      <button
                        className="text-red-400 hover:text-red-300"
                        onClick={() => handleDeleteClick(report)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {showConfirmPopup && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg p-6 text-center shadow-lg">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">
              Are you sure you want to delete this report?
            </h3>
            <div className="flex justify-center">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-md mr-4 hover:bg-red-500"
                onClick={confirmDelete}
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
      {showConfirmPopupAccess && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg p-6 text-center shadow-lg">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">
              Are you sure you want to hide this post?
            </h3>
            <div className="flex justify-center">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-md mr-4 hover:bg-red-500"
                onClick={confirmDeletePost}
              >
                Confirm
              </button>
              <button
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-500"
                onClick={() => setShowConfirmPopupAccess(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ReportsTable;
