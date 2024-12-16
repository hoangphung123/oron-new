import "./navbar.scss";
// import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LockResetIcon from "@mui/icons-material/LockReset";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
// import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link, useNavigate } from "react-router-dom";
import * as Userserver from "../../server/userstore";
import * as postserver from "../../server/itemstore";
import { useContext, useState, useEffect, useRef } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import ImageNofication from "./IconNofication.png";
import ImageMessage from "./IconMessage.png";
import {
  messaging,
} from "../../pages/nofication/filebase";
import { onMessage } from "firebase/messaging";
import PostRegistation from "../postRegistation/postRegistation";
import DetailPost from "../../pages/detailPost/detailPost";
// import toast, {Toaster} from "react-hot-toast";

const NavBar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser, currentUserId, setCurrentUserId, setCurrentUser } =
    useContext(AuthContext);
  const navigate = useNavigate();
  // const [profileImage, setProfileImage] = useState(currentUser.data.profilePic);
  const [searchQuery, setSearchQuery] = useState("");
  const [postRegis, setPostRegis] = useState([]);
  const [postAccept, setPostAccept] = useState([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [selectedNoficationRegis, setSelectedNoficationRegis] = useState(false);
  const [selectedNoficationRegisAccess, setSelectedNoficationRegisAccess] =
    useState(false);

  const [isOpen, setIsOpen] = useState(false); // Đóng/mở dropdown thông báo
  const [notifications, setNotifications] = useState([
    // {
    //   creatorName: "Nguyễn Văn A",
    //   creatorProfilePic: {
    //     url: "https://i.pinimg.com/736x/30/ba/69/30ba692a5ee196961d6e3df42b0f6f79.jpg",
    //     alternativeText: "Avatar Nguyễn Văn A",
    //   },
    //   content: "Bạn có một thông báo mới từ hệ thống.",
    //   createDate: "2024-12-13T10:30:00",
    // },
    // {
    //   creatorName: "Trần Thị B",
    //   creatorProfilePic: {
    //     url: "https://i.pinimg.com/736x/30/ba/69/30ba692a5ee196961d6e3df42b0f6f79.jpg",
    //     alternativeText: "Avatar Trần Thị B",
    //   },
    //   content: "Dự án của bạn đã được phê duyệt thành công.",
    //   createDate: "2024-12-12T15:45:00",
    // },
    // {
    //   creatorName: "Lê Hoàng C",
    //   creatorProfilePic: null, // Không có ảnh
    //   content: "Bạn đã được thêm vào nhóm mới.",
    //   createDate: "2024-12-11T09:20:00",
    // },
  ]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  // const [notifications, setNotifications] = useState([]);

  const handleIconClick = () => {
    setIsDropdownOpen((prev) => !prev);

    // Xóa số thông báo khi mở dropdown
    if (!isDropdownOpen) {
      setNotificationCount(0);
    }
  };

  const handleClosePopup = () => {
    setSelectedNoficationRegis(false);
    setSelectedNoficationRegisAccess(false);
  };

  const handleNotificationClick = async (id, typeCd) => {
    if (typeCd === "1") {
      const accessToken = JSON.parse(localStorage.getItem("access_token"));

      try {
        const response = await postserver.getPostByPostId(accessToken, id);
        setPostRegis(response.data);
        setSelectedNoficationRegis(true);
        console.log("response", response.data);
      } catch (error) {
        console.log("error", error);
      }
      // Gọi API ở đây với id và typeCd
      // Ví dụ gọi API:
      // fetchNotificationData(id);
    } else if (typeCd === "2") {
      const accessToken = JSON.parse(localStorage.getItem("access_token"));

      try {
        const response = await postserver.getPostByPostId(accessToken, id);
        setPostAccept(response.data);
        setSelectedNoficationRegisAccess(true);
        console.log("response", response.data);
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  const fetchNofication = async () => {
    try {
      const accessToken = JSON.parse(localStorage.getItem("access_token"));
      const response = await postserver.getNofication(accessToken);
      const fetchedCategory = response.listData;

      const reponses = setNotifications(fetchedCategory);
      if (!reponses) {
        console.log("notifications", notifications);
      }
    } catch (error) {
      toast.error(`Error fetching Category: ${error.message}`);
    }
  };

  useEffect(() => {
    // Lắng nghe thông báo từ FCM
    onMessage(messaging, (payload) => {
      console.log(payload);
      // toast.success(payload.notification.body);

      // Cập nhật số lượng thông báo
      setNotificationCount((prev) => prev + 1);
      setNotifications((prev) => [...prev, payload.notification]);
    });
    fetchNofication();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchChange = async (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      // If the search query is empty, reset recent searches
      setRecentSearches([]);
    } else {
      try {
        // Retrieve the access token from localStorage
        const accessToken = JSON.parse(localStorage.getItem("access_token"));

        // Call the getUserByUsername function to get user by username
        const user = await Userserver.getUserByUsername(accessToken, query);

        // Set recent searches to the entire listData array
        setRecentSearches(user?.listData || []);
      } catch (error) {
        console.error("Error while fetching user by username:", error.message);
      }
    }
  };

  const handleUserClicks = ({ userId, username }) => {
    // Use the userId and username
    const updatedUserId = { userId, username };
    setCurrentUserId(updatedUserId);

    // Store the updated user data in localStorage
    localStorage.setItem("friends", JSON.stringify(updatedUserId));
    navigate("/profileFriends");
    // Optionally, you may also want to close the recent searches dropdown
    setShowRecentSearches(false);
  };

  const handleSearchClick = () => {
    setShowRecentSearches(true);
  };

  // Hàm xử lý khi nhấp bên ngoài ô tìm kiếm
  const handleOutsideClick = (event) => {
    // Kiểm tra xem sự kiện click có phải là bên trong ô tìm kiếm hay không
    if (event.target.closest(".search")) {
      // Bạn có thể thêm xử lý khác ở đây nếu cần thiết
      return;
    }

    // Nếu không phải là bên trong ô tìm kiếm, đóng dropdown
    setShowRecentSearches(false);
  };

  const handleUserClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    // setCurrentUser(null)
    // Chuyển hướng đến trang đăng nhập (hoặc trang khác tùy thuộc vào yêu cầu của bạn)
    navigate("/login");
    // Đóng Menu sau khi logout
    handleClose();
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    // Optionally, reset password fields
    setOldPassword("");
    setNewPassword("");
  };

  const handleChangepassword = async () => {
    try {
      // Check if passwords are not empty
      if (!oldPassword || !newPassword) {
        toast.error("Please enter both old and new passwords.");
        return;
      }

      const accessToken = JSON.parse(localStorage.getItem("access_token"));

      const datachage = {
        oldPassword: oldPassword,
        newPassword: newPassword,
      };

      // Call the changePassWord function with the old and new passwords
      await Userserver.changePassWord(accessToken, datachage);

      // Assuming the changePassWord function returns an object with a success property

      toast.success("Password changed successfully.");
      handleCloseDialog();
      setAnchorEl(null);
    } catch (error) {
      const errorMessage = Array.isArray(error.response.data.message)
        ? error.response.data.message[0]
        : error.response.data.message;

      toast.error(`Error changing password: ${errorMessage}`);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);

    // Hủy đăng ký sự kiện khi component unmount
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  // useEffect(() => {
  //   const fetchUserProfilePicture = async () => {
  //     try {
  //       // Retrieve the access token from localStorage
  //       const accessToken = JSON.parse(localStorage.getItem("access_token"));

  //       const profileUser = await Userserver.getProfile(accessToken);

  //       localStorage.setItem("user", JSON.stringify(profileUser));

  //       const user = JSON.parse(localStorage.getItem("user"));
  //       const pictureUser = user.data.profilePic

  //       const userProfile = `http://localhost:3500/user-profile/${pictureUser}`;

  //       setProfileImage(userProfile)

  //     } catch (error) {
  //       console.error('Error fetching user profile picture:', error);
  //     }
  //   };

  //   // Call the fetchUserProfilePicture function when the component mounts
  //   fetchUserProfilePicture();
  // }, [currentUser.data.profilePic]);

  const handlefetchFriends = async () => {
    try {
      // Assuming you have an accessToken, you can get it from your authentication context or elsewhere
      const accessToken = JSON.parse(localStorage.getItem("access_token"));
      const friends = await postserver.getFriends(accessToken);
      const updatedUserId = {
        userId: friends.listData[0].id,
        username: friends.listData[0].username,
      };
      localStorage.setItem("friends", JSON.stringify(updatedUserId));
      setCurrentUserId(updatedUserId);
    } catch (error) {
      console.error("Error fetching friends:", error.message);
    }
  };

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span onClick={handlefetchFriends}>ORON</span>
        </Link>
        {/* <HomeOutlinedIcon/> */}
        {darkMode ? (
          <WbSunnyOutlinedIcon onClick={toggle} />
        ) : (
          <DarkModeOutlinedIcon onClick={toggle} />
        )}
        {/* <GridViewOutlinedIcon/> */}
        <div className="search">
          <div className="search_input">
            <SearchOutlinedIcon />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={handleSearchChange}
              onClick={handleSearchClick}
            />
          </div>
          {showRecentSearches && (
            <div className="recent-searches">
              {recentSearches.length > 0 ? (
                recentSearches.map((userData, index) => {
                  return (
                    <div
                      key={index}
                      className="search-item"
                      onClick={() =>
                        handleUserClicks({
                          userId: userData.id,
                          username: userData.username,
                        })
                      }
                    >
                      {/* Assuming user data has properties like 'profilePic' and 'username' */}
                      <img
                        src={userData?.profilePic?.url || ""}
                        alt={`${userData.username} avatar`}
                        className="avatar"
                      />
                      <span>{userData.username}</span>
                    </div>
                  );
                })
              ) : (
                <div>Không có tìm kiếm gần đây</div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="center">
        <PersonOutlinedIcon />
        <EmailOutlinedIcon />
        <NotificationsOutlinedIcon />
      </div>
      <div className="right">
        <div className="user" onClick={handleUserClick}>
          <img src={currentUser?.data?.profilePic?.url || ""} alt="" />
          <span>{currentUser.data.username}</span>
        </div>
        <img src={ImageMessage} alt="IconNofication" />
        <div
          className="Nofication_content"
          onClick={handleIconClick}
          // ref={dropdownRef}
        >
          {/* Icon thông báo */}
          <img src={ImageNofication} alt="Notification Icon" />
          {notificationCount > 0 && (
            <span className="nofication_now">{notificationCount}</span>
          )}
        </div>

        {/* Dropdown thông báo */}
        {isDropdownOpen && (
          <div className="dropDown_Nofication">
            <div className="dropdown_nofication-title">
              <h3 className="text-lg font-semibold p-4 border-b">Thông báo</h3>
              <div class="close" onClick={() => setIsDropdownOpen(false)}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <svg viewBox="0 0 36 36" class="circle">
                  <path
                    stroke-dasharray="100, 100"
                    d="M18 2.0845
        a 15.9155 15.9155 0 0 1 0 31.831
        a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
              </div>
            </div>
            <ul className="max-h-64 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <li
                    key={index}
                    className="flex items-center p-4 hover:bg-gray-100 border-b last:border-none"
                    onClick={() =>
                      handleNotificationClick(
                        notification.itemRid,
                        notification.typeCd
                      )
                    }
                  >
                    <img
                      src={
                        notification.creatorProfilePic?.url ||
                        "https://via.placeholder.com/40"
                      }
                      alt={
                        notification.creatorProfilePic?.alternativeText ||
                        "Avatar"
                      }
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-gray-800">
                        {notification.creatorName || "Người dùng"}
                      </h4>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {notification.content || "Không có nội dung"}
                      </p>
                      <small className="text-gray-400 text-xs">
                        {new Date(notification.createDate).toLocaleString(
                          "vi-VN"
                        )}
                      </small>
                    </div>
                  </li>
                ))
              ) : (
                <li className="p-4 text-gray-500 text-center">
                  Không có thông báo mới
                </li>
              )}
            </ul>
          </div>
        )}

        {selectedNoficationRegis && (
          <>
            <div className="overlay" onClick={() => handleClosePopup()}></div>
            <div className="popupss">
              <div className="popup-title">
                <div></div>
                <h2>Chi Tiết Bài viết</h2>
                <span className="close" onClick={() => handleClosePopup()}>
                  x
                </span>
              </div>
              <div className="popup-content">
                <PostRegistation post={postRegis} key={postRegis.id} />
              </div>
            </div>
          </>
        )}

        {selectedNoficationRegisAccess && (
          <>
            <div className="overlay" onClick={() => handleClosePopup()}></div>
            <div className="popups">
              <div className="popup-title">
                <div></div>
                <h2>Chi Tiết Bài viết</h2>
                <span className="close" onClick={() => handleClosePopup()}>
                  x
                </span>
              </div>
              <div className="popup-content">
                <DetailPost post={postAccept} />
              </div>
            </div>
          </>
        )}

        {/* Material-UI Menu component */}
        <Menu
          className="MEnu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem
            component={Link}
            to={`/profile/${currentUser.data.id}`}
            onClick={handleClose}
            className="custom-menu"
          >
            {/* <a href="#" class="wave-link">
              <span>Profile</span>
              <svg
                class="link__graphic link__graphic--slide"
                width="300%"
                height="100%"
                viewBox="0 0 1200 60"
                preserveAspectRatio="none"
              >
                <path d="M0,56.5c0,0,298.666,0,399.333,0C448.336,56.5,513.994,46,597,46c77.327,0,135,10.5,200.999,10.5c95.996,0,402.001,0,402.001,0"></path>
              </svg>
            </a> */}
            <button class="Btns">
              <div class="svgWrapper">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 42 42"
                  class="svgIcon"
                >
                  <path
                    stroke-width="5"
                    stroke="#fff"
                    d="M9.14073 2.5H32.8593C33.3608 2.5 33.8291 2.75065 34.1073 3.16795L39.0801 10.6271C39.3539 11.0378 39.5 11.5203 39.5 12.0139V21V37C39.5 38.3807 38.3807 39.5 37 39.5H5C3.61929 39.5 2.5 38.3807 2.5 37V21V12.0139C2.5 11.5203 2.6461 11.0378 2.91987 10.6271L7.89266 3.16795C8.17086 2.75065 8.63921 2.5 9.14073 2.5Z"
                  ></path>
                  <rect
                    stroke-width="3"
                    stroke="#fff"
                    rx="2"
                    height="4"
                    width="11"
                    y="18.5"
                    x="15.5"
                  ></rect>
                  <path stroke-width="5" stroke="#fff" d="M1 12L41 12"></path>
                </svg>
                <div class="text">Profile</div>
              </div>
            </button>
          </MenuItem>
          <MenuItem className="custom-menu" onClick={handleOpenDialog}>
            {/* <a href="#" class="wave-link">
              <span>Change password</span>
              <svg
                class="link__graphic link__graphic--slide"
                width="300%"
                height="100%"
                viewBox="0 0 1200 60"
                preserveAspectRatio="none"
              >
                <path d="M0,56.5c0,0,298.666,0,399.333,0C448.336,56.5,513.994,46,597,46c77.327,0,135,10.5,200.999,10.5c95.996,0,402.001,0,402.001,0"></path>
              </svg>
            </a> */}
            <button class="Btnss">
              <div class="sign">
                <LockResetIcon />
              </div>

              <div class="text">Logout</div>
            </button>
          </MenuItem>
          <MenuItem className="custom-menu" onClick={handleLogout}>
            {/* <a href="#" class="wave-link">
              <span>Logout</span>
              <svg
                class="link__graphic link__graphic--slide"
                width="300%"
                height="100%"
                viewBox="0 0 1200 60"
                preserveAspectRatio="none"
              >
                <path d="M0,56.5c0,0,298.666,0,399.333,0C448.336,56.5,513.994,46,597,46c77.327,0,135,10.5,200.999,10.5c95.996,0,402.001,0,402.001,0"></path>
              </svg>
            </a> */}
            <button class="Btn">
              <div class="sign">
                <svg viewBox="0 0 512 512">
                  <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
                </svg>
              </div>

              <div class="text">Logout</div>
            </button>
          </MenuItem>
          <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
            <DialogTitle>Change Password</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Old Password"
                type="password"
                fullWidth
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <TextField
                margin="dense"
                label="New Password"
                type="password"
                fullWidth
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button
                onClick={handleChangepassword}
                variant="contained"
                color="primary"
              >
                Change
              </Button>
            </DialogActions>
          </Dialog>
        </Menu>
        <ToastContainer />
      </div>
    </div>
  );
};

export default NavBar;
