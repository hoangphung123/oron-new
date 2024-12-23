import ProductsTable from "../../components/products/ProductsTable";
import { motion } from "framer-motion";

import Header from "../../components/common/Header";
import StatCard from "../../components/common/StatCard";

import { AlertTriangle, CheckCircle, Package,Ban } from "lucide-react";
import * as AdminSever from "../../server/adminStore";
import { useState, useEffect } from "react";

const ProductsPage = () => {
  const [selectedImage, setSelectedImage] = useState(null); 
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
  });

  const closeModal = () => {
    setSelectedImage(null); // Đóng modal
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const accessToken = JSON.parse(localStorage.getItem("access_token_admin"));
        if (accessToken) {
          const response = await AdminSever.getReportsByAdmin(accessToken);
          const { total, pendingCount, acceptedCount, cancelledCount } = response;

          setStats({
            total: total || 0,
            pending: pendingCount || 0,
            accepted: acceptedCount || 0,
            canceled: cancelledCount || 0,
          });
        }
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Reports" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Reports"
            icon={Package}
            value={stats.total}
            color="#6366F1"
          />
          <StatCard
            name="Pending Reports"
            icon={AlertTriangle}
            value={stats.pending}
            color="#F59E0B"
          />
          <StatCard
            name="Processed"
            icon={CheckCircle}
            value={stats.accepted}
            color="#10B981"
          />
          <StatCard
            name="Canceled"
            icon={Ban}
            value={stats.canceled}
            color="#ff0000"
          />
        </motion.div>

        <ProductsTable onImageClick={setSelectedImage}/>

        {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <img
              src={selectedImage}
              alt="Popup"
              className="max-w-full max-h-[80vh] rounded-lg"
            />
            <button
              onClick={closeModal}
              className="mt-4 bg-red-500 text-white py-1 px-4 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
      </main>
    </div>
  );
};

export default ProductsPage;