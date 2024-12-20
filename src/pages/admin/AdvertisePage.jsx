import Header from "../../components/common/Header";
import AdsTable from "../../components/advertisement/AdsTable";
import "../tailwind-styles.css";
import { AlertTriangle, CheckCircle, Package, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import StatCard from "../../components/common/StatCard";
import * as AdminServe from "../../server/adminStore";


const AdvertisePage = () => {
  const [ads, setAds] = useState([
    // {
    //   id: 1,
    //   bannerName: "Holiday Sale",
    //   startDate: "2024-12-01",
    //   endDate: "2024-12-31",
    //   redirectURL: "https://example.com/sale",
    //   userName: "Jane Smith",
    //   phoneNumber: "123-456-7890",
    //   email: "jane.smith@example.com",
    //   imageURL: "https://scontent.fsgn2-11.fna.fbcdn.net/v/t39.30808-6/470217651_1151325849688225_2882028425228433680_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=833d8c&_nc_ohc=0BYX1ow5q2YQ7kNvgFqDugN&_nc_zt=23&_nc_ht=scontent.fsgn2-11.fna&_nc_gid=AU2g-Szaa9fGr_dh3RnFUkT&oh=00_AYDw0qeQJDisuWSxSttB_ird-6a0KP97oiwJqSzP-zbT-Q&oe=67643F02",
    //   status: "Pending",
    // },
    // {
    //   id: 2,
    //   bannerName: "Black Friday Promo",
    //   startDate: "2024-11-20",
    //   endDate: "2024-11-27",
    //   redirectURL: "https://example.com/blackfriday",
    //   userName: "John Doe",
    //   phoneNumber: "987-654-3210",
    //   email: "john.doe@example.com",
    //   imageURL: "https://scontent.fsgn2-11.fna.fbcdn.net/v/t39.30808-6/470217651_1151325849688225_2882028425228433680_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=833d8c&_nc_ohc=0BYX1ow5q2YQ7kNvgFqDugN&_nc_zt=23&_nc_ht=scontent.fsgn2-11.fna&_nc_gid=AU2g-Szaa9fGr_dh3RnFUkT&oh=00_AYDw0qeQJDisuWSxSttB_ird-6a0KP97oiwJqSzP-zbT-Q&oe=67643F02",
    //   status: "Accepted",
    // },
  ]);

  const [selectedImage, setSelectedImage] = useState(null); 
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const accessToken = JSON.parse(
          localStorage.getItem("access_token_admin")
        );
        const data = await AdminServe.getBanner(accessToken);
        console.log("banner", data)
        setAds(data.listData);     
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };

    fetchBanner();
  }, []);
  // Trạng thái để lưu ảnh được chọn

  const toggleStatus = (id) => {
    setAds((prevAds) =>
      prevAds.map((ad) =>
        ad.id === id
          ? { ...ad, status: ad.status === "Pending" ? "Accepted" : "Pending" }
          : ad
      )
    );
  };

  const closeModal = () => {
    setSelectedImage(null); // Đóng modal
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      {/* Header */}
      <Header title="Advertisement Management" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
      <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Ad Requests"
            icon={Package}
            value={1234}
            color="#6366F1"
          />
          <StatCard
            name="Pending Payment"
            icon={AlertTriangle}
            value={50}
            color="#F59E0B"
          />
          <StatCard
            name="Showing"
            icon={CheckCircle}
            value={1024}
            color="#10B981"
          />
        </motion.div>
      {/* Import bảng */}
      <AdsTable ads={ads} toggleStatus={toggleStatus} onImageClick={setSelectedImage} />

      {/* Popup Modal */}
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

export default AdvertisePage;
