import "./profile.scss";
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
import axios from "axios";
import { useDropzone } from "react-dropzone";
import * as Userserver from "../../server/userstore";
import * as Postserver from "../../server/itemstore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { DarkModeContext } from "../../context/darkModeContext";
import { useNavigate } from "react-router-dom";
import { PostsContext } from "../../context/postContext";
import ShareBox from "../../components/sharebox/ShareBox";
import MyProfileComponent from "../../components/MyProfileComponent/MyProfileComponent";
import FriendComponent from "../../components/FriendComponent/FriendComponent";

const Profile = () => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const { darkMode } = useContext(DarkModeContext);
  const { setPosts } = useContext(PostsContext);

  const cameraIconColor = darkMode ? "#fff" : "#000";

  const api_url = "http://127.0.0.1:3500/api/v1";

  const userStore = JSON.parse(localStorage.getItem("user"));

  const [coverImage, setCoverImage] = useState(
    "https://images.pexels.com/photos/13440765/pexels-photo-13440765.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  );
  const [profileImage, setProfileImage] = useState(currentUser.data.profilePic);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPopupOpenCover, setIsPopupOpenCover] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImages, setSelectedImages] = useState(null);
  const [activeTab, setActiveTab] = useState("Post");

  const handleCoverImageUpload = async (e) => {
    try {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);

      formData.append("filename", file.name);

      const response = await axios.post(
        `${api_url}/picture/upload/local`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Cover image uploaded:", response.data);
    } catch (error) {
      console.error("Error uploading cover image:", error);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];

    const imageUrl = URL.createObjectURL(file);
    console.log("file", imageUrl);
    setSelectedImage(imageUrl);
    setSelectedImages(file);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop,
  });

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const openPopupCover = () => {
    setIsPopupOpenCover(true);
  };

  const closePopupCover = () => {
    setIsPopupOpenCover(false);
  };

  const handleSaveImage = async () => {
    try {
      if (selectedImages) {
        const accessToken = JSON.parse(localStorage.getItem("access_token"));
        

        if (!accessToken) {
          console.error("Access token not found in localStorage");
          return;
        }

        const uploadedPicture = await Userserver.uploadPictureUser(
          accessToken,
          selectedImages
        );
        const uploadPictureDriver = await Userserver.uploadToGoogleDrive(
          accessToken, // Token xác thực
          selectedImages, // File ảnh cần upload
          "Ảnh minh họa", // alternativeText (có thể là null nếu không bắt buộc)
          "user-profile", // relatedType (nếu là bài viết thì là "post")
          userStore.data.id, // ID bài viết hoặc đối tượng liên quan
        );
        setProfileImage(selectedImage);
        currentUser.data = {
          ...currentUser.data,
          profilePic: {
            url: uploadPictureDriver.fileDetails.thumbnailLink,
            alternativeText: "Ảnh minh họa", // Thêm mô tả thay thế
          },
        };
        // console.log('curentUser',currentUser)
        // navigate(`/profile/${currentUser.data.id}`)
        const profileUsers = await Userserver.getProfile(accessToken);

        setCurrentUser(profileUsers);
      }

      closePopup();
    } catch (error) {
      console.error("Error saving image:", error);
    }
  };

  const handleSaveImageCover = async () => {
    try {
      if (selectedImages) {
        const accessToken = JSON.parse(localStorage.getItem("access_token"));

        if (!accessToken) {
          console.error("Access token not found in localStorage");
          return;
        }

        const uploadedPicture = await Userserver.uploadPictureUserCover(
          accessToken,
          selectedImages
        );
        const uploadPictureDriver = await Userserver.uploadToGoogleDrive(
          accessToken, // Token xác thực
          selectedImages, // File ảnh cần upload
          "Ảnh minh họa", // alternativeText (có thể là null nếu không bắt buộc)
          "user-background", // relatedType (nếu là bài viết thì là "post")
          userStore.data.id, // ID bài viết hoặc đối tượng liên quan
        );
        setCoverImage(selectedImage);
        console.log("Image saved successfully:", uploadPictureDriver);
        const profileUsers = await Userserver.getProfile(accessToken);

        setCurrentUser(profileUsers);
      }

      closePopupCover();
    } catch (error) {
      console.error("Error saving image:", error);
    }
  };

  useEffect(() => {
    const fetchUserProfilePicture = async () => {
      try {
        // Retrieve the access token from localStorage
        const accessToken = JSON.parse(localStorage.getItem("access_token"));

        const profileUser = await Userserver.getProfile(accessToken);

        localStorage.setItem("user", JSON.stringify(profileUser));

        const user = JSON.parse(localStorage.getItem("user"));
        console.log(accessToken);
        const pictureUser = user.data.profilePic.url;
        const backtureUser = user.data.backgroundPic.url;
        console.log(user.data.profilePic);

        // Check if the access token is available
        if (!accessToken) {
          console.error("Access token not found in localStorage");
          // Handle the case where the access token is not available
          return;
        }

        // const userProfile = `http://localhost:3500/${pictureUser}`;
        // const userBackProfile = `http://localhost:3500/${backtureUser}`;
        setProfileImage(pictureUser);
        setCoverImage(backtureUser);
      } catch (error) {
        console.error("Error fetching user profile picture:", error);
      }
    };

    const GetPostByUserId = async () => {
      const accessToken = JSON.parse(localStorage.getItem("access_token"));
      const userID = currentUser.data.id;
      const response = await Postserver.getPostByUserId(accessToken, userID, 9);

      setPosts(response.listData);
    };

    // Call the fetchUserProfilePicture function when the component mounts
    fetchUserProfilePicture();
    GetPostByUserId();
  }, [currentUser.data.profilePic]);

  return (
    <div className={`profile ${darkMode ? "theme-dark" : "theme-light"}`}>
      {/* Profile Images */}
      <div className="images">
        <img src={profileImage} alt="" className="profilePics"></img>
        <img src={coverImage} alt="" className="covers" />
        <button className="uploadButtonPicCover" onClick={openPopupCover}>
          <FontAwesomeIcon
            icon={faCamera}
            size="2xl"
            style={{ color: cameraIconColor }}
          />
        </button>
        <div className="open_popup">
          <button className="uploadButtonPics" onClick={openPopup}>
            <FontAwesomeIcon
              icon={faCamera}
              size="2xl"
              style={{ color: cameraIconColor }}
            />
          </button>
        </div>
      </div>

      {/* Popup for Image Upload */}
      {isPopupOpen && (
        <>
          <div className="overlay" onClick={closePopup}></div>
          <div className="popups">
            <div className="popup-content">
              <span className="close" onClick={closePopup}>
                &times;
              </span>
              <h2>Enter OTP Code</h2>
              <div className="imageContainer">
                <div {...getRootProps()} className="dropzone">
                  <input {...getInputProps()} />
                  <p>image here</p>
                </div>
                {selectedImage && <img src={selectedImage} alt="Selected" />}
              </div>
              <div className="button_AS">
                <button className="Access_button" onClick={handleSaveImage}>
                  Save Image
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      {isPopupOpenCover && (
        <>
          <div className="overlay" onClick={closePopupCover}></div>
          <div className="popups">
            <div className="popup-content">
              <span className="close" onClick={closePopupCover}>
                &times;
              </span>
              <h2>Set Image</h2>
              <div className="imageContainer">
                <div {...getRootProps()} className="dropzone">
                  <input {...getInputProps()} />
                  <p>image here</p>
                </div>
                {selectedImage && <img src={selectedImage} alt="Selected" />}
              </div>
              <div className="button_AS">
                <button
                  className="Access_button"
                  onClick={handleSaveImageCover}
                >
                  Save Image
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      {/* User Info */}
      <div className="uInfo_user">
        <div className="left">
          <span>{currentUser.data.username}</span>
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
              <ShareBox />
              <Posts />
            </div>
          </div>
        </>
      )}
      {activeTab === "Friend" && <FriendComponent />}
      {activeTab === "My Profile" && <MyProfileComponent />}
    </div>
  );
};

export default Profile;
