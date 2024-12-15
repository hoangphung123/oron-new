import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import MoodIcon from "@mui/icons-material/Mood";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import { useContext, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "../../components/modal/modal";
import { AuthContext } from "../../context/authContext";
import { PostsContext } from "../../context/postContext";
import * as Itemserver from "../../server/itemstore";
import * as Userserver from "../../server/userstore";
import Comments from "../comments/Comments";
import "./post.scss";
// import AngryIcon from "@mui/icons-material/Angry";
import Popover from "@mui/material/Popover";
import Rating from "react-rating";
import Notification from "../notification/Notification";
import ImageCreate from "../../assets/choseImage.png";
import IconAddress from "../../assets/icon.png";
import IconTag from "../../assets/IconTag.png";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImages, setSelectedImages] = useState(null);
  const [description, setDescription] = useState("");
  const [descriptionReport, setDescriptionRepost] = useState("");
  const [tittle, setTittles] = useState("");
  const [selectedPostUser, setSelectedPostUser] = useState(null);
  const { setSavePost, setPosts, categoryIds, setPostId } =
    useContext(PostsContext);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [likeAnchorEl, setLikeAnchorEl] = useState(null);
  const [popoverId, setPopoverId] = useState(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [category, setCategory] = useState([]);
  const [wards, setwards] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("Công Khai");
  const Status = ["Công Khai", "Riêng tư", "Bạn bè"];
  const [isRatingPopupOpen, setIsRatingPopupOpen] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);
  const [reviewDescription, setReviewDescription] = useState("");
  const [reactionListOpen, setReactionListOpen] = useState(false);
  const [reactionUser, setReactionUser] = useState([]);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  const [selectedReaction, setSelectedReaction] = useState(""); // Chuỗi rỗng: trạng thái mặc định
  const [showIcons, setShowIcons] = useState(false);
  const [curentIcon, SetCurrentIcon] = useState(false);

  useEffect(() => {
    if (post.currentUserReaction?.type) {
      setSelectedReaction(post.currentUserReaction.type);
      SetCurrentIcon(true)
    }
  }, [post]);

  const iconMapping = [
    { id: 1, type: "like", emoji: "👍" },
    { id: 2, type: "love", emoji: "❤️" },
    { id: 3, type: "haha", emoji: "😂" },
    { id: 4, type: "wow", emoji: "😮" },
    { id: 5, type: "sad", emoji: "😢" },
    { id: 6, type: "angry", emoji: "😡" },
  ];

  const updateReaction = async (reactionId, reactionID) => {
    try {
      if (reactionId === selectedReaction) {
        // Nếu nhấn vào icon hiện tại, reset về default (xóa trạng thái)
        // await axios.delete("/api/reactions");
        setSelectedReaction(""); // Reset về default
        console.log("reactionID", reactionId)
        SetCurrentIcon(false)
      } else {
        // Nếu chọn icon khác, cập nhật trạng thái
        // await axios.post("/api/reactions", { reactionId });
        createReaction(post.id, reactionId);
        setSelectedReaction(reactionId); // Cập nhật trạng thái
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật reaction:", error);
    }
  };

  const handleClosePopupEdit = () => {
    resetEditPopup();
    setIsEditPopupOpen(false);
  };

  const resetEditPopup = () => {
    setSelectedStatus("");
    setSelectedCategory("");
    setSelectedProvince("");
    setSelectedDistrict("");
    setSelectedWard("");
    setDescription("");
    setSelectedImages(null);
    setSelectedImage(null);
  };

  const convertDriveUrl = (url) => {
    if (!url) {
      // Nếu URL không tồn tại, trả về đường dẫn mặc định
      return "https://i.pinimg.com/736x/f9/f5/61/f9f561a14482d93d4e51a65431cfbcaa.jpg";
    }
    const match = url.match(/\/file\/d\/(.*?)\//);
    return match
      ? `https://drive.google.com/uc?export=view&id=${match[1]}`
      : "https://i.pinimg.com/736x/f9/f5/61/f9f561a14482d93d4e51a65431cfbcaa.jpg";
  };

  const handleEditClick = async () => {
    console.log("postimage", post);
    // Initialize edit states with the data of the selected post
    setSelectedStatus(post.status);
    await setSelectedCategory(post.category.id);
    await setSelectedProvince(post.provinceId);
    await setSelectedDistrict(post.districtId);

    setSelectedWard(post.wardId);
    setDescription(post.description);
    setSelectedImages(post.image[0].url);
    setSelectedImage(post.imageURL);

    setIsEditPopupOpen(true);
  };

  const clearNotification = () => {
    setMessage("");
  };

  const handleInputChange = (e, inputField) => {
    const value = e.target.value;
    switch (inputField) {
      case "description":
        setDescription(value);
        break;
      default:
        break;
    }
  };

  const handleInputChangeReport = (e, inputField) => {
    const value = e.target.value;
    switch (inputField) {
      case "description":
        setDescriptionRepost(value);
        break;
      case "tittle":
        setTittles(value);
        break;
      default:
        break;
    }
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];

    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(file);
    setSelectedImages(imageUrl);
  };

  const handleUserClick = (event) => {
    setAnchorEl(event.currentTarget);
    // Pass the post user information to the state
    setSelectedPostUser(post.user);
  };

  const openPopup = () => {
    setIsPopupOpen(true);
    setAnchorEl(null);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setIsRatingPopupOpen(false);
    setReactionListOpen(false);
  };

  const handleSendRepostClick = async () => {
    try {
      const accessToken = JSON.parse(localStorage.getItem("access_token"));

      // Check if both title and description are provided
      if (!tittle || !descriptionReport) {
        toast.error(
          "Please provide both title and description for the report."
        );
        return;
      }

      const reportData = {
        title: tittle,
        description: descriptionReport,
        postId: post.id,
      };

      // Call the API to send the report
      await Itemserver.createReportByPostId(accessToken, reportData);

      // Check if the report was sent successfully

      toast.success("Report sent successfully!");
      // Close the report popup
      setIsPopupOpen(false);
    } catch (error) {
      // Handle unexpected errors, display an error toast
      toast.error(`Error sending report: ${error.message}`);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop,
  });
  const handleRegistrationClick = () => {
    // Check if the post belongs to the current user
    if (post.user.username === currentUser.data.username) {
      toast.error("This post belongs to you.");
    } else {
      console.log(post)
      setOpenModal(true);
    }
  };

  const fetchSavePost = async () => {
    try {
      const accessToken = JSON.parse(localStorage.getItem("access_token"));
      const result = await Itemserver.getSavedPostsByUser(accessToken);
      setSavePost(result.listData);
    } catch (error) {
      // Xử lý lỗi nếu cần
      console.error("Error while fetching List Friends:", error.message);
    }
  };

  const handleSavePost = async () => {
    try {
      const accessToken = JSON.parse(localStorage.getItem("access_token"));
      const savedPost = await Itemserver.savePost(accessToken, post.id);

      // const newData = {
      //   id: savedPost.id,
      //   description: savedPost.data.post.description,
      //   imageURL: savedPost.data.post.imageURL,
      //   image: [
      //     {
      //       url: savedPost.data.image[0].url,
      //       alternativeText: "Ảnh minh họa", // Thêm mô tả thay thế
      //     },
      //   ],
      //   videoURL: savedPost.videoURL,
      //   status: savedPost.status,
      //   fullAddress: savedPost.fullAddress,
      //   specificAddress: savedPost.specificAddress,
      //   user: {
      //     id: currentUser.data.id,
      //     username: post.user.username,
      //     name: currentUser.data.name,
      //     fullAddress: currentUser.data.fullAddress,
      //     specificAddress: currentUser.data.specificAddress,
      //     phoneNumber: currentUser.data.phoneNumber,
      //     email: currentUser.data.email,
      //     profilePic: {
      //       url: currentUser.data.profilePic?.url, // Use optional chaining to handle potential undefined profilePic
      //       alternativeText: currentUser.data.profilePic?.alternativeText,
      //     },
      //     backgroundPic: currentUser.data.backgroundPic,
      //     isVerifyPhone: currentUser.data.isVerifyPhone,
      //     isVerifyEmail: currentUser.data.isVerifyEmail,
      //     status: currentUser.data.status,
      //     updatedAt: currentUser.data.updatedAt,
      //     createdAt: currentUser.data.createdAt,
      //   },
      //   createdAt: savedPost.createdAt,
      //   updatedAt: savedPost.updatedAt,
      // };

      // Update the save posts state with the new data
      fetchSavePost();
      // setSavePost((prevSavePosts) => [newData, ...prevSavePosts]);
      setAnchorEl(null);
      setMessage("Post saved successfully!");
      setType("success");
      // toast.success(`Post saved successfully`);
      // (Có thể thêm thông báo hoặc cập nhật UI ở đây nếu cần)
    } catch (error) {
      setAnchorEl(null);
      setMessage("Post cannot saved");
      setType("danger");
      // toast.error(`Post saved successfully: ${error.message}`);
      // (Có thể thêm thông báo lỗi ở đây nếu cần)
    }
  };

  const handleLikeClick = async () => {
    try {
      // Mở hoặc đóng danh sách phản ứng
      setReactionListOpen(!reactionListOpen);

      // Nếu danh sách phản ứng đang mở, bạn có thể thực hiện các xử lý cần thiết ở đây
      // Ví dụ: Gọi hàm getAllReaction để lấy danh sách phản ứng và cập nhật state
      const postId = post.id;
      const response = await Itemserver.getAllReaction(postId);
      const reactionsList = response.listData;
      // Cập nhật state với danh sách phản ứng mới
      setReactionUser(reactionsList);
    } catch (error) {
      console.error("Error handling like click:", error.message);
      // Xử lý lỗi nếu cần
    }
  };

  const handleIconSelect = (selectedType, type) => {
    setSelectedIcon(selectedType);
    setLikeAnchorEl(null);
    // Call the createReaction function with the post ID and type
    createReaction(post.id, type);
  };

  const createReaction = async (postId, type) => {
    try {
      const accessToken = JSON.parse(localStorage.getItem("access_token"));

      // Use postId and type to create the reaction
      const reactionData = {
        postId,
        type,
      };

      // Call the createReaction function with the reactionData
      await Itemserver.createReaction(accessToken, reactionData);

      const limit = 9;
      const response = await Itemserver.getAllPost(
        accessToken,
        limit,
        categoryIds
      );
      const postData = response.listData;
      setPosts(postData);
      toast.success(`Reaction created successfully`);
    } catch (error) {
      toast.error(`Error creating reaction: ${error.message}`);
      // Handle error, show a notification, or perform other actions
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeletePost = async () => {
    try {
      const accessToken = JSON.parse(localStorage.getItem("access_token"));
      await Itemserver.deletePost(accessToken, post.id);

      const limit = 9;
      const response = await Itemserver.getAllPost(
        accessToken,
        limit,
        categoryIds
      );
      const postData = response.listData;
      setPosts(postData);

      // Update UI or navigate to another page after successful deletion
      toast.success(`Post deleted successfully`);
    } catch (error) {
      toast.error(`Error deleting post: ${error.message}`);
      // Handle error, show a notification, or perform other actions
    }
  };

  const fetchCategory = async () => {
    try {
      const response = await Itemserver.getCategory(1);
      const fetchedCategory = response.listData;

      setCategory(fetchedCategory);
    } catch (error) {
      toast.error(`Error fetching Category: ${error.message}`);
    }
  };

  const fetchProvinces = async () => {
    try {
      const response = await Userserver.getAllProvinces();

      if (!response.error) {
        const fetchedProvinces = response.data.listData;
        setProvinces(fetchedProvinces);
      } else {
        toast.error(`Error fetching provinces: ${response.message}`);
      }
    } catch (error) {
      toast.error(`Error fetching provinces: ${error.message}`);
    }
  };

  const fetchDistrictsByProvinceId = async (provinceId) => {
    try {
      const responses = await Userserver.getDistrictsByProvinceId(provinceId);
      if (!responses.error) {
        const fetchedDistricts = responses.data.listData;
        setDistricts(fetchedDistricts);
      } else {
        toast.error(`Error fetching provinces: ${responses.message}`);
      }
    } catch (error) {
      toast.error(`Error fetching districts: ${error.message}`);
    }
  };

  const fetchWardsByDistrictId = async (districtId) => {
    try {
      const responses = await Userserver.getWardsByDistrictId(districtId);
      if (!responses.error) {
        const fetchedWards = responses.data.listData;
        setwards(fetchedWards);
      } else {
        toast.error(`Error fetching provinces: ${responses.message}`);
      }
    } catch (error) {
      toast.error(`Error fetching districts: ${error.message}`);
    }
  };

  const handleSelectDistricts = (e) => {
    const selectedDistrictId = e.target.value;
    setSelectedDistrict(selectedDistrictId);
    fetchWardsByDistrictId(selectedDistrictId);
  };

  const handleSelectProvince = (e) => {
    const selectedProvinceId = e.target.value;
    setSelectedProvince(selectedProvinceId);
    fetchDistrictsByProvinceId(selectedProvinceId);
  };

  const handSelectedCategory = (e) => {
    setSelectedCategory(e.target.value);
  };

  useEffect(() => {
    fetchCategory();
    fetchProvinces();
  }, []);

  const handleUpdateClick = async () => {
    try {
      let statusValue;
      switch (selectedStatus) {
        case "Công Khai":
          statusValue = 1;
          break;
        case "Riêng tư":
          statusValue = 0;
          break;
        case "Bạn bè":
          statusValue = 2;
          break;
        default:
          statusValue = 1; // Default to "Công Khai" if none selected
          break;
      }
      // setLoading(true);
      const postData = {
        description: description,
        categoryId: selectedCategory,
        province: selectedProvince,
        district: selectedDistrict,
        ward: selectedWard,
        status: statusValue,
      };

      console.log("postData", postData);

      const accessToken = JSON.parse(localStorage.getItem("access_token"));

      const registeredUser = await Itemserver.updatePost(
        accessToken,
        post.id,
        postData
      );

      const registeredUserId = registeredUser.data.id;
      await Itemserver.uploadToGoogleDrive(
        accessToken, // Token xác thực
        selectedImage, // File ảnh cần upload
        "Ảnh minh họa", // alternativeText (có thể là null nếu không bắt buộc)
        "post-image", // relatedType (nếu là bài viết thì là "post")
        registeredUserId // ID bài viết hoặc đối tượng liên quan
      );

      const limit = 9;
      const response = await Itemserver.getAllPost(
        accessToken,
        limit,
        categoryIds
      );
      const postDatas = response.listData;
      setPosts(postDatas);

      resetEditPopup();

      setIsEditPopupOpen(false);
      toast.success(`Success: ${registeredUser.message}`);
      // setShowPopup(true);
    } catch (error) {
      toast.error(`Error: ${error.response.message}`);
    }
  };

  const handleRatingChange = (value) => {
    setRatingValue(value);
    setIsRatingPopupOpen(true);
    // You can update state or perform other actions based on the rating value
  };

  const handleSendRating = async () => {
    // Implement logic to send the rating
    setIsRatingPopupOpen(false);

    try {
      const accessToken = JSON.parse(localStorage.getItem("access_token"));

      // Use the ratingValue and reviewDescription in the CreateReview function
      const reviewData = {
        description: reviewDescription,
        numberStar: ratingValue,
        postId: post.id, // Use the postId from the post object
      };

      // Call the CreateReview function with the reviewData
      await Itemserver.CreateReview(accessToken, reviewData);

      const limit = 9;
      const response = await Itemserver.getAllPost(
        accessToken,
        limit,
        categoryIds
      );
      const postData = response.listData;
      setPosts(postData);

      // Add any additional logic or notifications as needed
      console.log("Review created successfully");
    } catch (error) {
      console.error("Error creating review:", error.message);
      // Handle error, show a notification, or perform other actions
    }
  };

  const handleLikeHover = (event) => {
    setLikeAnchorEl(event.currentTarget);
  };

  const handleLikeLeave = () => {
    setLikeAnchorEl(null);
  };

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={post?.user?.profilePic?.url || ""} alt="" />
            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.user.username}</span>
              </Link>
              <span className="date">1 min ago</span>
            </div>
          </div>
          <div>
            <Tooltip title="Registration">
              <PersonAddIcon
                className="PersonAddIcon"
                onClick={handleRegistrationClick}
              />
            </Tooltip>
            <MoreHorizIcon onClick={handleUserClick} />
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              {selectedPostUser && (
                <>
                  {selectedPostUser.username === currentUser.data.username ? (
                    <MenuItem onClick={handleEditClick}>Edit Post</MenuItem>
                  ) : (
                    <MenuItem onClick={handleSavePost}>Save Post</MenuItem>
                  )}
                  <MenuItem
                    onClick={
                      selectedPostUser.username === currentUser.data.username
                        ? handleDeletePost
                        : openPopup
                    }
                  >
                    {selectedPostUser.username === currentUser.data.username
                      ? "Delete Post"
                      : "Report Post"}
                  </MenuItem>
                </>
              )}
            </Menu>
            {isEditPopupOpen && (
              <>
                <div
                  className="overlay"
                  onClick={() => handleClosePopupEdit()}
                ></div>
                <div className="popup">
                  <div className="popup-title">
                    <div className="shareTop">
                      <img
                        className="shareProfileImg"
                        src={currentUser?.data?.profilePic?.url || ""}
                        alt=""
                      />
                      <div className="shareTop-content">
                        <span>{currentUser.data.username}</span>
                        <select
                          className="selectStatus"
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                          {Status.map((option, index) => (
                            <option key={index} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <span
                      className="close"
                      onClick={() => handleClosePopupEdit()}
                    >
                      x
                    </span>
                  </div>
                  <div className="popup-avatar">
                    <textarea
                      className="input_description"
                      type="text"
                      placeholder="Bạn đang nghĩ gì đấy?"
                      value={description}
                      onChange={(e) => handleInputChange(e, "description")}
                    />
                  </div>
                  <div className="popup-content">
                    <div className="left">
                      <div className="left-container">
                        <div className="imageContainer">
                          <div {...getRootProps()} className="dropzone">
                            <img
                              className="zone_image"
                              src={selectedImages}
                              alt=""
                            />
                            <input {...getInputProps()}></input>
                            {selectedImages && (
                              <img src={selectedImages} alt="Selected" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="right">
                      <div className="right-icon">
                        <img src={IconAddress} alt="" />
                        <img src={IconTag} alt="" />
                      </div>
                      <Button
                        onClick={handleUpdateClick}
                        variant="contained"
                        className="acsess_button"
                      >
                        Cập Nhật
                      </Button>
                    </div>
                  </div>
                  <div className="popup-action">
                    <form>
                      <div className="form-group">
                        {/* Address Section */}
                        <div className="form-column">
                          <h4>Address</h4>
                          <select
                            className="select_popup"
                            value={selectedProvince}
                            onChange={handleSelectProvince}
                          >
                            <option value="" disabled>
                              Province
                            </option>
                            {provinces.map((province) => (
                              <option key={province.id} value={province.id}>
                                {province.name}
                              </option>
                            ))}
                          </select>
                          <select
                            className="select_popup"
                            value={selectedDistrict}
                            onChange={handleSelectDistricts}
                          >
                            <option value="" disabled>
                              District
                            </option>
                            {districts.map((district) => (
                              <option key={district.id} value={district.id}>
                                {district.name}
                              </option>
                            ))}
                          </select>
                          <select
                            className="select_popup"
                            value={selectedWard}
                            onChange={(e) => setSelectedWard(e.target.value)}
                          >
                            <option value="" disabled>
                              Ward
                            </option>
                            {wards.map((ward) => (
                              <option key={ward.id} value={ward.id}>
                                {ward.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Category Section */}
                        <div className="form-column">
                          <h4>Category</h4>
                          <select
                            className="select_popup"
                            value={selectedCategory}
                            onChange={handSelectedCategory}
                          >
                            <option value="" disabled>
                              Category
                            </option>
                            {category.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </>
            )}
            {isPopupOpen && (
              <>
                <div className="overlay" onClick={closePopup}></div>
                <div className="report-popup">
                  <div className="popup-title">
                    <h2>Báo cáo bài viết</h2>
                  </div>
                  <div className="popup-content">
                    <div className="left">
                      <div className="left-container">
                        <h4>Tittle</h4>
                        <form>
                          <textarea
                            className="input_Items"
                            type="text"
                            placeholder="Tittle"
                            // value={tittle}
                            onChange={(e) =>
                              handleInputChangeReport(e, "tittle")
                            }
                          />
                        </form>
                      </div>
                    </div>
                    <div className="right">
                      <h4>Thông tin bài viết</h4>
                      <form>
                        <textarea
                          className="input_Items"
                          type="text"
                          placeholder="Description"
                          // value={description}
                          onChange={(e) =>
                            handleInputChangeReport(e, "description")
                          }
                        />
                      </form>
                    </div>
                  </div>
                  <div className="popup-action">
                    <Button
                      onClick={handleSendRepostClick}
                      variant="contained"
                      className="acsess_button"
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
          <Modal
            open={openModal}
            onClose={() => setOpenModal(false)}
            postId={post.id}
            ownerId={post.user.id}
            post={post}
          />
        </div>
        <div className="content">
          <p>{post.description}</p>
          <img
            src={
              post.image?.[0]?.url ||
              "https://i.pinimg.com/736x/f9/f5/61/f9f561a14482d93d4e51a65431cfbcaa.jpg"
            }
            alt=""
          />
        </div>
        <div className="infos">
          <div className="info">
            {/* <div
              className="item"
              id="likeButton"
              onMouseEnter={handleLikeHover}
              // onClick={handleLikeClick}
            >
              {post.currentUserReaction &&
              post.currentUserReaction.type === 0 ? (
                <ThumbUpAltIcon />
              ) : post.currentUserReaction &&
                post.currentUserReaction.type === 1 ? (
                <FavoriteOutlinedIcon />
              ) : post.currentUserReaction &&
                post.currentUserReaction.type === 2 ? (
                <MoodIcon />
              ) : post.currentUserReaction &&
                post.currentUserReaction.type === 3 ? (
                <SentimentVeryDissatisfiedIcon />
              ) : (
                <ThumbUpOffAltIcon />
              )}
            </div> */}
            <div
              className="relative inline-block"
              onMouseEnter={() => setShowIcons(true)}
              onMouseLeave={() => setShowIcons(false)}
            >
              {/* Nút hiển thị icon hiện tại hoặc mặc định */}
              <button
                className="text-2xl p-2 rounded hover:bg-gray-200"
                // onClick={() => updateReaction("")} // Reset về default khi bấm vào icon mặc định
              >
                {selectedReaction
                  ? iconMapping.find((icon) => icon.id === selectedReaction)
                      ?.emoji
                  : "⭐"}{" "}
                {/* Icon mặc định ban đầu */}
              </button>

              {/* Danh sách icon khi hover */}
              {showIcons && (
                <div className="absolute flex gap-2 p-2 bg-white border rounded shadow-lg top-10">
                  {iconMapping.map((icon) => (
                    <button
                      key={icon.id}
                      onClick={() => updateReaction(icon.id, post.currentUserReaction.id)}
                      className={`text-2xl p-2 rounded ${
                        selectedReaction === icon.id
                          ? "bg-blue-200"
                          : "hover:bg-gray-200"
                      }`}
                      title={`Thả ${icon.type}`}
                    >
                      {icon.emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div onClick={handleLikeClick}>
              {post.currentUserReaction
                ? `${post.totalReactions} bạn và người khác`
                : `${post.totalReactions} người khác`}
            </div>

            {/* Star Rating */}

            <Popover
              id={popoverId}
              open={Boolean(likeAnchorEl)}
              anchorEl={likeAnchorEl}
              onClose={() => setLikeAnchorEl(null)}
              anchorOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <FavoriteOutlinedIcon
                  onClick={() => handleIconSelect(<FavoriteOutlinedIcon />, 1)}
                />
                <MoodIcon onClick={() => handleIconSelect(<MoodIcon />, 2)} />
                <SentimentVeryDissatisfiedIcon
                  onClick={() =>
                    handleIconSelect(<SentimentVeryDissatisfiedIcon />, 3)
                  }
                />
                <ThumbUpAltIcon
                  onClick={() => handleIconSelect(<ThumbUpAltIcon />, 0)}
                ></ThumbUpAltIcon>
              </div>
            </Popover>
            <div
              className="item"
              onClick={() => {
                setCommentOpen(!commentOpen);
                setPostId(post.id);
              }}
            >
              <TextsmsOutlinedIcon />
              {post.totalComments} comments
            </div>
          </div>

          <div className="items">
            <Rating
              initialRating={post.reviewStar}
              emptySymbol={<span className="icon">&#9734;</span>} // Biểu tượng sao Unicode
              fullSymbol={<span className="icon">&#9733;</span>} // Biểu tượng sao Unicode
              onChange={handleRatingChange} // Hàm gọi lại khi rating thay đổi
              readonly={!post.isUserReceived} // Làm cho thành phần rating không thể tương tác nếu post.isUserReceived là false
            />
            {post.reviewer && (
              <div className="reviewer-info">:{post.reviewer.username}</div>
            )}
          </div>
        </div>
        {commentOpen && <Comments postId={post.id} />}
      </div>
      {/* Rating Popup */}
      {isRatingPopupOpen && (
        <>
          <div className="overlay" onClick={closePopup}></div>
          <div className="rating-popup">
            <input
              type="text"
              placeholder="Enter your comment here..."
              className="wide-input" // Add a class for custom styling
              value={reviewDescription}
              onChange={(e) => setReviewDescription(e.target.value)}
              // You can use onChange to handle input changes if needed
            />
            <Button
              onClick={handleSendRating}
              variant="contained"
              className="acsess_button"
              size="medium"
            >
              Send
            </Button>
          </div>
        </>
      )}
      {reactionListOpen && (
        <>
          <div className="overlay" onClick={closePopup}></div>
          <div className="reaction-popup">
            <p>REACTION</p>
            {reactionUser.map((reaction, index) => (
              <div key={index} className="reaction-item">
                {reaction.type === 0 ? (
                  <ThumbUpAltIcon />
                ) : reaction.type === 1 ? (
                  <FavoriteOutlinedIcon />
                ) : reaction.type === 2 ? (
                  <MoodIcon />
                ) : reaction.type === 3 ? (
                  <SentimentVeryDissatisfiedIcon />
                ) : null}
                <span className="username">{reaction.username}</span>
              </div>
            ))}
          </div>
        </>
      )}
      <Notification
        message={message}
        type={type}
        clearNotification={clearNotification}
      />
      <ToastContainer />
    </div>
  );
};

export default Post;
