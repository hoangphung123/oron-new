import "./rightbar.scss";
// import ProfileImg from "../../assets/profile/boyChild.jpg";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import { PostsContext } from "../../context/postContext";
import * as UserServices from "../../server/itemstore";
import { formatDistanceToNow } from "date-fns";
import Button from "@mui/material/Button";
import { useNavigate } from 'react-router-dom';

const RightBar = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
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
    navigate('/detailRegistation');
  };

  useEffect(() => {
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

    fetchData();
  }, []);

  return (
    <div className="rightBar">
      <div className="container">
        <div className="item">
          <div className="item_title">
            <span>Registration for your posts</span>
          </div>
          <hr className="item_contact"/>
          {Array.isArray(postRegistrationsByOwner) &&
          postRegistrationsByOwner.length > 0 ? (
            postRegistrationsByOwner.map((registration, index) => (
              <div className="user" key={index}>
                <div className="userInfo">
                  <img
                    src={registration.user.profilePic.url}
                    alt=""
                  />
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
          <hr className="item_contact"/>
          {/* Check if postRegistrations is an array before mapping */}
          {Array.isArray(postRegistrations) && postRegistrations.length > 0 ? (
            postRegistrations.map((registration, index) => (
              <div className="user" key={index}>
                <div className="userInfo">
                  <img
                    src={registration.post.image.url}
                    alt=""
                  />
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
      <span>Sponsored</span>
      <hr className="divider" />
      <div className="ad-container">
        {/* Ad Item 1 */}
        <div className="ad-item">
          <img
            src="https://viettel-hanoi.vn/wp-content/uploads/2022/08/trung-tam-viettel-quan-ba-dinh-2.jpg" // Thay bằng link ảnh thực tế
            alt="Ad 1"
            className="ad-image"
          />
          <div className="ad-content">
            <h3>Đăng ký truyền hình TV360 - tặng đến 4 tháng cước =&gt;</h3>
            <a href="https://viettel.vn" target="_blank" rel="noopener noreferrer">
              viettel.vn
            </a>
          </div>
        </div>

        {/* Ad Item 2 */}
        <div className="ad-item">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhZsaCQOFPrS53FPHn3WI6fhaz_71Vo5nPPw&s" // Thay bằng link ảnh thực tế
            alt="Ad 2"
            className="ad-image"
          />
          <div className="ad-content">
            <h3>ƯU ĐÃI PIN XỊN</h3>
            <a href="https://cellphones.com.vn" target="_blank" rel="noopener noreferrer">
              cellphones.com.vn
            </a>
          </div>
        </div>
      </div>
    </div>        
        {/* Third Item */}
        <div className="item">
          <span>Contact</span>
          <hr className="item_contact" />
          {/* Replace the hard-coded user data with FriendsDataArray */}
          {friendsList.map((friendData, index) => (
            <div className="user" key={index}>
              <div className="userInfo">
                <img
                  src={friendData.profilePic.url}
                  alt=""
                />
                <div className="online" />
                <span>{friendData.username}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightBar;
