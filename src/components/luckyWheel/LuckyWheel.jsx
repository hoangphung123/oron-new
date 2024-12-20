import React, { useRef, useState } from "react";
import { gsap, Power4 } from "gsap";
import "./LuckyWheel.css";
import Button from "@mui/material/Button";

const LuckyWheel = ({ postUsers, onAccept, onClose }) => {
  const wheelRef = useRef(null); // Tham chiếu đến vòng quay
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(""); // Kết quả trúng thưởng
  const [winner, setWinner] = useState(null);

  // Danh sách phần thưởng
  //   const prizeData = [
  //     { id: 1, name: "Giải Nhất" },
  //     { id: 2, name: "Giải Nhì" },
  //     { id: 3, name: "Giải Ba" },
  //     { id: 4, name: "Giải Tư" },
  //     { id: 5, name: "Giải Khuyến Khích" },
  //     { id: 6, name: "Voucher 500K" },
  //     { id: 7, name: "Voucher 200K" },
  //     { id: 8, name: "Voucher 100K" },
  //   ];

  //   const totalSectors = prizeData.length; // Tổng số phần thưởng
  const totalSectors = postUsers.length;

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);

    const sectorAngle = 360 / totalSectors; // Góc của mỗi phần
    const randomSector = Math.floor(Math.random() * totalSectors); // Chọn ngẫu nhiên phần thưởng
    const finalDegree = 360 * 5 + randomSector * sectorAngle + sectorAngle / 2; // Dừng chính xác ở phần thưởng

    const spin = gsap.timeline({
      onComplete: () => {
        // Điều chỉnh góc quay cuối cùng về 0 - 360
        const adjustedDegree = finalDegree % 360;

        // Tính toán phần thưởng trúng dựa trên góc quay
        const winningIndex =
          Math.floor((360 - adjustedDegree) / sectorAngle) % totalSectors;

        setResult(postUsers[winningIndex]); // Hiển thị kết quả
        setIsSpinning(false);
      },
    });

    spin.to(wheelRef.current, 5, {
      rotation: finalDegree,
      ease: Power4.easeOut,
      transformOrigin: "50% 50%",
    });
  };

  return (
    <div className="luckywheel-container">
      <h2 class="luckywheel-title" >Vòng Quay May Mắn</h2>
      <div className="wheel-wrapper">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 730 730"
          className="wheel-svg"
        >
          <g ref={wheelRef} className="wheel">
            {/* Vẽ vòng quay */}
            <circle className="frame" cx="365" cy="365" r="347.6" />
            <g className="sectors">
              {postUsers.map((user, index) => {
                const angle = (360 / totalSectors) * index;
                return (
                  <path
                    key={user.id}
                    className={`sector sector-${index}`}
                    d={`M365,365 L${
                      365 + 328 * Math.cos((Math.PI * angle) / 180)
                    },${
                      365 + 328 * Math.sin((Math.PI * angle) / 180)
                    } A328,328 0 0,1 ${
                      365 +
                      328 *
                        Math.cos((Math.PI * (angle + 360 / totalSectors)) / 180)
                    },${
                      365 +
                      328 *
                        Math.sin((Math.PI * (angle + 360 / totalSectors)) / 180)
                    } Z`}
                  />
                );
              })}
            </g>
            {/* Tên phần thưởng */}
            <g className="labels">
              {postUsers.map((user, index) => {
                const angle =
                  (360 / totalSectors) * index + 360 / (2 * totalSectors);
                return (
                  <text
                    key={user.id}
                    x="365"
                    y="70"
                    transform={`rotate(${angle} 365 365)`}
                    textAnchor="middle"
                    className="prize-text"
                  >
                    {user.user.username}
                  </text>
                );
              })}
            </g>
          </g>
          {/* Con trỏ đứng yên */}
          <g className="pointer">
            <path
              className="poninter-path"
              d="M365,50 L385,0 L345,0 Z"
              fill="#FF0000"
            />
          </g>
        </svg>
      </div>
      {/* Nút quay */}
      <button className="btn" onClick={spinWheel} disabled={isSpinning}>
        {isSpinning ? "Đang quay..." : "Quay"}
      </button>
      {/* Kết quả */}
      {result && (
        <div className="result">
          Kết quả: {result.user.username}
          <Button
            variant="contained"
            color="success"
            onClick={() => onAccept(result.id, result.user.id)}
          >
            Accept
          </Button>
        </div>
      )}
    </div>
  );
};

export default LuckyWheel;
