import React, { useState, useRef, useEffect } from "react";
import song from "../musicplayer/oronchristmas.mp3";

const SimpleMusicPlayer = ({ title = "Music Player" }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Tự động phát nhạc khi component được mount
  useEffect(() => {
    if (audioRef.current) {
      // Đặt âm lượng giảm đi 50%
      audioRef.current.volume = 0.2;

      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true); // Đặt trạng thái là đang phát
          })
          .catch((error) => {
            console.error("Auto-play was prevented:", error);
            // Điều này xảy ra nếu trình duyệt chặn tự động phát nhạc
          });
      }
    }
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div>
      <audio
        ref={audioRef}
        src={song}
        onEnded={() => setIsPlaying(false)}
        preload="auto"
      />
    </div>
  );
};

export default SimpleMusicPlayer;
