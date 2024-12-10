import "./navbar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link, useNavigate } from "react-router-dom";
import * as Userserver from "../../server/userstore";
import * as postserver from "../../server/itemstore";
import { useContext, useState, useEffect } from "react";
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

const NavBar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser, currentUserId, setCurrentUserId, setCurrentUser } =
    useContext(AuthContext);
  const navigate = useNavigate();
  // const [profileImage, setProfileImage] = useState(currentUser.data.profilePic);
  const [searchQuery, setSearchQuery] = useState("");
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

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
                        src={userData.profilePic.url}
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
          <img
            src={currentUser.data.profilePic.url}
            alt=""
          />
          <span>{currentUser.data.username}</span>
        </div>
        <img src={ImageNofication} alt="IconNofication" />
        <img src={ImageMessage} alt="IconMessage" />

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
            <a href="#" class="wave-link">
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
            </a>
          </MenuItem>
          <MenuItem className="custom-menu" onClick={handleLogout}>
            <a href="#" class="wave-link">
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
            </a>
          </MenuItem>
          <MenuItem className="custom-menu" onClick={handleOpenDialog}>
            <a href="#" class="wave-link">
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
            </a>
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
