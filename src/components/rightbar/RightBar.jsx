import "./rightbar.scss";
// import ProfileImg from "../../assets/profile/boyChild.jpg";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { PostsContext } from "../../context/postContext";
import * as UserServices from "../../server/itemstore";
import { formatDistanceToNow } from "date-fns";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { getPosition, getBannerActive } from "../../server/userstore";

const RightBar = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [ads, setAds] = useState([]);
  const {
    postRegistrations,
    setPostRegistrations,
    friendsList,
    setFriendsList,
    postRegistrationsByOwner,
  } = useContext(PostsContext);
  const userDataArray = [
    {
      description: "Có ai thích phim ko",
      imageURL:
        "https://i.pinimg.com/564x/3b/1a/6f/3b1a6f3340cc082e698456137522057a.jpg",
    },
    {
      description: "Dư một chậu cây cảnh",
      imageURL:
        "https://i.pinimg.com/564x/db/30/72/db3072aea296b6a96773e09a79880c54.jpg",
    },
    // Add more user data as needed
  ];

  const formatTimeDifference = (createdAt) => {
    return formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  };

  const redirectToDetail = () => {
    navigate("/detailRegistation");
  };

  useEffect(() => {
    const fetchDataBanner = async () => {
      try {
        const accessToken = JSON.parse(localStorage.getItem("access_token")); // Replace with actual access token
        const positions = await getPosition(accessToken);
        const rightBarPosition = positions.listData.find(
          (position) => position.positionName === "Right-Bar"
        );

        if (rightBarPosition) {
          const banners = await getBannerActive(
            accessToken,
            rightBarPosition.id
          );
          setAds(banners.listData);
        }
      } catch (error) {
        console.error("Error while fetching banners:", error.message);
      }
    };

    // Gọi hàm getPostRegistrationByUserId và cập nhật state khi có dữ liệu trả về
    const fetchData = async () => {
      try {
        const accessToken = JSON.parse(localStorage.getItem("access_token"));
        const userId = currentUser.data.id; // Thay thế bằng userId của người dùng cụ thể
        const limit = 3;
        const result = await UserServices.getPostRegistrationByUserId(
          accessToken,
          userId,
          limit
        );
        setPostRegistrations(result.listData);
      } catch (error) {
        // Xử lý lỗi nếu cần
        console.error(
          "Error while fetching post registrations:",
          error.message
        );
      }
    };

    fetchDataBanner();
    fetchData();
  }, []);

  const defaultAds = [
    {
      image: {
        url: "https://res.cloudinary.com/dinvkxkt1/image/upload/v1735139039/Banner/qy77j95bnkytw6iljkxl.png",
        alternativeText: "Ad 1",
      },
      bannerName: "Ad is empty, place your ad now",
      redirectUrl: "https://oron-social.vercel.app/",
    },
    {
      image: {
        url: "https://res.cloudinary.com/dinvkxkt1/image/upload/v1735139039/Banner/qy77j95bnkytw6iljkxl.png",
        alternativeText: "Ad 2",
      },
      bannerName: "Ad is empty, place your ad now",
      redirectUrl: "https://oron-social.vercel.app/",
    },
  ];

  const adsToDisplay = ads.length > 0 ? ads : defaultAds;

  return (
    <div className="rightBar">
      <div className="container">
        <div className="item">
          <div className="item_title">
            <span>Registration for your posts</span>
          </div>
          <hr className="item_contact" />
          {Array.isArray(postRegistrationsByOwner) &&
          postRegistrationsByOwner.length > 0 ? (
            postRegistrationsByOwner.map((registration, index) => (
              <div className="user" key={index}>
                <div className="userInfo">
                  <img src={registration.user.profilePic.url} alt="" />
                  <p>
                    <span>{registration.message} </span>
                    {registration.action}
                  </p>
                </div>
                <span>{formatTimeDifference(registration.createdAt)}</span>
              </div>
            ))
          ) : (
            <p>No registrations found.</p>
          )}
        </div>
        <div className="item">
          <div className="item_title">
            <span>Your registrations for other post</span>
          </div>
          <hr className="item_contact" />
          {/* Check if postRegistrations is an array before mapping */}
          {Array.isArray(postRegistrations) && postRegistrations.length > 0 ? (
            postRegistrations.map((registration, index) => (
              <div className="user" key={index}>
                <div className="userInfo">
                  <img src={registration.post.image[0].url} alt="" />
                  <p>
                    <span>{registration.post.description} </span>
                    {registration.action}
                  </p>
                </div>
                <span>{formatTimeDifference(registration.createdAt)}</span>
              </div>
            ))
          ) : (
            <p>No registrations found.</p>
          )}
        </div>
        {/* Third Item */}
        <div className="advertisement">
          <span>Advertisement</span>
          <hr className="divider" />
          <div className="ad-container">
            {adsToDisplay.map((ad, index) => (
              <div className="ad-item" key={index}>
                <img
                  src={ad.image.url}
                  alt={ad.image.alternativeText}
                  className="ad-image"
                />
                <div className="ad-content">
                  <h3>{ad.bannerName}</h3>
                  <a
                    href={ad.redirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {ad.redirectUrl}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Third Item */}
        <div className="item">
          <span>Contact</span>
          <hr className="item_contact" />
          {/* Replace the hard-coded user data with FriendsDataArray */}
          {friendsList.map((friendData, index) => (
            <div className="user" key={index}>
              {/* <div className="userInfo">
                <img src={friendData.profilePic.url} alt="" />
                <div className="online" />
                <span>{friendData.username}</span>
              </div> */}
              <a
                href={`https://zalo.me/${friendData.phoneNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none", color: "inherit" }} // Đảm bảo không có gạch chân và giữ màu chữ
              >
                <div className="userInfo">
                  <img src={friendData.profilePic.url} alt="" />
                  <div className="online" />
                  <span>{friendData.username}</span>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightBar;
