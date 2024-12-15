import { Lock } from "lucide-react";
import SettingSection from "./SettingSection";
import { useState } from "react";

const Security = () => {
  const [twoFactor, setTwoFactor] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái mở/đóng modal
  const [oldPassword, setOldPassword] = useState(""); // Trạng thái lưu old password
  const [newPassword, setNewPassword] = useState(""); // Trạng thái lưu new password

  const openModal = () => {
    setIsModalOpen(true); // Mở modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Đóng modal
    setOldPassword(""); // Reset old password
    setNewPassword(""); // Reset new password
  };

  const handleConfirm = () => {
    // Thực hiện xác nhận thay đổi mật khẩu (Ví dụ: gửi API để thay đổi mật khẩu)
    console.log("Old Password:", oldPassword);
    console.log("New Password:", newPassword);
    closeModal(); // Đóng modal sau khi thay đổi mật khẩu
  };

  return (
    <SettingSection icon={Lock} title={"Security"}>
      <div className="mt-4">
        <button
          onClick={openModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200"
        >
          Change Password
        </button>
      </div>

      {/* Popup Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-700">Change Password</h3>
            <div className="mt-4">
              <label htmlFor="oldPassword" className="block text-sm text-gray-600">
                Old Password
              </label>
              <input
                type="password"
                id="oldPassword"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter old password"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="newPassword" className="block text-sm text-gray-600">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter new password"
              />
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </SettingSection>
  );
};

export default Security;
