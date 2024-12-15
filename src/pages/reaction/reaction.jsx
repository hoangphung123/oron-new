import React, { useState, useEffect } from "react";
import axios from "axios";

// Mapping các icon với số
const iconMapping = [
  { id: 1, type: "like", emoji: "👍" },
  { id: 2, type: "love", emoji: "❤️" },
  { id: 3, type: "haha", emoji: "😂" },
  { id: 4, type: "wow", emoji: "😮" },
  { id: 5, type: "sad", emoji: "😢" },
  { id: 6, type: "angry", emoji: "😡" },
];

const Post = () => {
  const [selectedReaction, setSelectedReaction] = useState(""); // Chuỗi rỗng: trạng thái mặc định
  const [showIcons, setShowIcons] = useState(false);

  // Gọi API để lấy dữ liệu ban đầu
  useEffect(() => {
    const fetchReaction = async () => {
      try {
        const response = await axios.get("/api/reactions");
        const reactionId = response.data?.reactionId || ""; // Lấy reactionId hoặc mặc định rỗng
        setSelectedReaction(reactionId);
      } catch (error) {
        console.error("Lỗi khi lấy reaction ban đầu:", error);
      }
    };

    fetchReaction();
  }, []);

  // Hàm gọi API cập nhật trạng thái
  const updateReaction = async (reactionId) => {
    try {
      if (reactionId === selectedReaction) {
        // Nếu nhấn vào icon hiện tại, reset về default (xóa trạng thái)
        // await axios.delete("/api/reactions");
        setSelectedReaction(""); // Reset về default
      } else {
        // Nếu chọn icon khác, cập nhật trạng thái
        // await axios.post("/api/reactions", { reactionId });
        setSelectedReaction(reactionId); // Cập nhật trạng thái
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật reaction:", error);
    }
  };

  return (
    <div className="p-4 border rounded-md shadow-md w-1/2 mx-auto mt-4">
      <h2 className="text-lg font-bold mb-4">Bài viết của bạn</h2>
      <p className="mb-4">Đây là nội dung bài viết mẫu. Hãy thử thả một icon!</p>
      <div
        className="relative inline-block"
        onMouseEnter={() => setShowIcons(true)}
        onMouseLeave={() => setShowIcons(false)}
      >
        {/* Nút hiển thị icon hiện tại hoặc mặc định */}
        <button
          className="text-2xl p-2 rounded hover:bg-gray-200"
          onClick={() => updateReaction("")} // Reset về default khi bấm vào icon mặc định
        >
          {selectedReaction
            ? iconMapping.find((icon) => icon.id === selectedReaction)?.emoji
            : "⭐"} {/* Icon mặc định ban đầu */}
        </button>

        {/* Danh sách icon khi hover */}
        {showIcons && (
          <div className="absolute flex gap-2 p-2 bg-white border rounded shadow-lg top-10">
            {iconMapping.map((icon) => (
              <button
                key={icon.id}
                onClick={() => updateReaction(icon.id)}
                className={`text-2xl p-2 rounded ${
                  selectedReaction === icon.id ? "bg-blue-200" : "hover:bg-gray-200"
                }`}
                title={`Thả ${icon.type}`}
              >
                {icon.emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;
