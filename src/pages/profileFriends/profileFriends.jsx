import "./profileFriends.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import { AuthContext } from "../../context/authContext";
import { useContext, useState, useEffect } from "react";
import * as Userserver from "../../server/userstore";
import * as Postserver from "../../server/itemstore";
import { DarkModeContext } from "../../context/darkModeContext";
import { useNavigate } from "react-router-dom";
import { PostsContext } from "../../context/postContext";
import { Search } from "lucide-react";
import FriendProfile from "../../components/FriendProfile/FiendProfile";
import FriendComponent from "../../components/FriendComponent/FriendComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

const ProfileFriends = () => {
  const { currentUser, setCurrentUser, currentUserId, setCurrentUserId } =
    useContext(AuthContext);
  const { darkMode, toggle } = useContext(DarkModeContext);
  const navigate = useNavigate();
  const { setPosts } = useContext(PostsContext);
  const [activeTab, setActiveTab] = useState("Post");
  const [coverImage, setCoverImage] = useState(
    "https://images.pexels.com/photos/13440765/pexels-photo-13440765.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  );
  const [profileImage, setProfileImage] = useState(currentUser.data.profilePic);
  const [profileUserName, setprofileUserName] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const cameraIconColor = darkMode ? "#fff" : "#000";

  useEffect(() => {
    const fetchUserProfilePicture = async () => {
      try {
        // Retrieve the access token from localStorage
        const accessToken = JSON.parse(localStorage.getItem("access_token"));

        const profileUser = await Userserver.getUserByUserId(
          accessToken,
          currentUserId.userId
        );

        console.log("profileUser", profileUser);

        // const pictureUser = profileUser.listData[0].profilePic;
        // const backtureUser = profileUser.data.backgroundPic;
        // const profileUserName = profileUser.listData[0].username;

        // Check if the access token is available
        if (!accessToken) {
          console.error("Access token not found in localStorage");
          // Handle the case where the access token is not available
          return;
        }

        // const userProfile = `http://localhost:3500/${pictureUser}`;
        // const userBackProfile = `http://localhost:3500/${backtureUser}`;
        setProfileImage(profileUser.data.profilePic.url);
        setCoverImage(profileUser.data.backgroundPic.url);
        setprofileUserName(profileUser.data.username);
      } catch (error) {
        console.error("Error fetching user profile picture:", error);
      }
    };

    const GetPostByUserId = async () => {
      const accessToken = JSON.parse(localStorage.getItem("access_token"));
      console.log("userId", currentUserId);
      const response = await Postserver.getPostByUserId(
        accessToken,
        currentUserId.userId,
        9
      );

      setPosts(response.listData);
    };

    const fetchFollowing = async () => {
      try {
        const accessToken = JSON.parse(localStorage.getItem("access_token"));

        const followings = await Userserver.getFollowings(accessToken);

        console.log(
          "followings",
          currentUserId.userId,
          followings.listData[0].id
        );

        const isCurrentUserFollowing = followings.listData.some(
          (following) => following.id === currentUserId.userId
        );

        setIsFollowing(isCurrentUserFollowing);
        // Check if the currentUserId is in the list of followings
      } catch (error) {
        console.error("Error fetching user followings:", error);
      }
    };

    // Call the fetchUserProfilePicture function when the component mounts
    fetchFollowing();
    fetchUserProfilePicture();
    GetPostByUserId();
  }, [currentUser.data.profilePic]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleFollowButtonClick = async () => {
    try {
      const accessToken = JSON.parse(localStorage.getItem("access_token"));

      // Call the follow/unfollow API based on the current state
      if (isFollowing === false) {
        await Userserver.createFollow(accessToken, currentUserId.userId);
        setIsFollowing(true);
      } else {
        console.log("access_token", accessToken);
        await Userserver.UnFollow(accessToken, currentUserId.userId);
        setIsFollowing(false);
      }
    } catch (error) {
      console.error("Error handling follow button click:", error);
    }
  };

  return (
    <div className={`profile ${darkMode ? "theme-dark" : "theme-light"}`}>
      {/* Profile Images */}
      <div className="images">
        <img src={profileImage} alt="" className="profilePics"></img>
        <img src={coverImage} alt="" className="covers" />
      </div>
      {/* User Info */}
      <div className="uInfo_user">
        <div className="left">
          <span>{profileUserName}</span>
        </div>
        <div className="center"></div>
        <div className="right"></div>
      </div>
      <div className="menu_content">
        <nav className="menu">
          <ul>
            <li onClick={() => handleTabChange("Post")}>Post</li>
            <li onClick={() => handleTabChange("Friend")}>Friend</li>
            <li onClick={() => handleTabChange("My Profile")}>My Profile</li>
            {/* <li>Option 2</li>
          <li>Option 3</li>
          <li>Option 4</li> */}
          </ul>
        </nav>
        <button onClick={handleFollowButtonClick}>
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
      </div>

      {/* Profile Content */}

      {activeTab === "Post" && (
        <>
          <div className="profileContainer_user">
            <div className="Information_left">
              {/* Introduction Section */}
              <div className="introduction">
                <h3>Introduction</h3>
                <div className="location">
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className="icon-profile"
                    // size="2xl"
                    style={{ color: cameraIconColor }}
                  />
                  <span>{currentUser.data.specificAddress}</span>
                </div>
                <div className="link">
                  <FontAwesomeIcon
                    icon={faLink}
                    className="icon-profile"
                    // size="2xl"
                    style={{ color: cameraIconColor }}
                  />
                  <a href="https://google.com">Google.com</a>
                </div>
              </div>
            </div>

            {/* Posts Section */}
            <div className="posts_content">
              <Posts />
            </div>
          </div>
        </>
      )}
      {activeTab === "Friend" && <FriendComponent />}
      {activeTab === "My Profile" && <FriendProfile />}
    </div>
  );
};

export default ProfileFriends;
