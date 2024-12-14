import "./shareBox.scss";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import LabelIcon from "@mui/icons-material/Label";
import PlaceIcon from "@mui/icons-material/Place";
import MoodIcon from "@mui/icons-material/Mood";
import { useDropzone } from "react-dropzone";
import * as UserService from "../../server/userstore";
import * as UserServices from "../../server/itemstore";
import { PostsContext } from "../../context/postContext";
import { ToastContainer, toast } from "react-toastify";
import Button from "@mui/material/Button";
import ImageCreate from "../../assets/choseImage.png";
import IconAddress from "../../assets/icon.png";
import IconTag from "../../assets/IconTag.png";
// import Carousel from '../carousel/Carousel';

export default function Share() {
  const { currentUser } = useContext(AuthContext);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [category, setCategory] = useState([]);
  const [wards, setwards] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImages, setSelectedImages] = useState(null);
  const [selectedWard, setSelectedWard] = useState("");
  const [description, setDescription] = useState("");
  const { setPosts } = useContext(PostsContext);
  const Status = ["Công Khai", "Riêng tư", "Bạn bè"];
  const [selectedStatus, setSelectedStatus] = useState("Công Khai");

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];

    const imageUrl = URL.createObjectURL(file);
    console.log("file", imageUrl);
    setSelectedImage(file);
    setSelectedImages(imageUrl);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop,
  });

  const fetchCategory = async () => {
    try {
      const response = await UserServices.getCategory(1);
      console.log("listdata", response);
      const fetchedCategory = response.listData;

      setCategory(fetchedCategory);
    } catch (error) {
      toast.error(`Error fetching Category: ${error.message}`);
    }
  };

  const fetchProvinces = async () => {
    try {
      const response = await UserService.getAllProvinces();

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
      const responses = await UserService.getDistrictsByProvinceId(provinceId);
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
      const responses = await UserService.getWardsByDistrictId(districtId);
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

  const handleSaveImageCover = async () => {
    try {
      if (selectedImage) {
        const accessToken = JSON.parse(localStorage.getItem("access_token"));

        if (!accessToken) {
          console.error("Access token not found in localStorage");
          return;
        }

        // const uploadedPicture = await Userserver.uploadPictureUserCover(accessToken, selectedImages);
        // console.log('Image saved successfully:', uploadedPicture);
        // const profileUsers = await Userserver.getProfile(accessToken);

        // setCurrentUser(profileUsers)
      }
    } catch (error) {
      console.error("Error saving image:", error);
    }
  };

  const handleRegisterClick = async () => {
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

      const accessToken = JSON.parse(localStorage.getItem("access_token"));

      const registeredUser = await UserServices.createPost(
        accessToken,
        postData
      );

      const registeredUserId = registeredUser.data.id;

      console.log(selectedImage);

      const uploadedPicturePost = await UserServices.uploadPost(
        accessToken,
        selectedImage,
        registeredUserId
      );

      const uploadPictureDriver = await UserServices.uploadToGoogleDrive(
        accessToken, // Token xác thực
        selectedImage, // File ảnh cần upload
        "Ảnh minh họa", // alternativeText (có thể là null nếu không bắt buộc)
        "post-image", // relatedType (nếu là bài viết thì là "post")
        registeredUserId // ID bài viết hoặc đối tượng liên quan
      );
      console.log("testanhr", uploadPictureDriver.fileDetails.thumbnailLink);

      const newData = {
        id: registeredUser.data.id,
        description: description,
        image: [
          {
            url: uploadPictureDriver.fileDetails.thumbnailLink,
            alternativeText: "Ảnh minh họa", // Thêm mô tả thay thế
          },
        ],
        videoURL: null, // Bạn có thể cung cấp giá trị videoURL nếu có
        status: 1, // Thay đổi giá trị này nếu cần
        fullAddress: currentUser.data.fullAddress, // Lấy từ user hoặc post, tùy vào yêu cầu
        specificAddress: currentUser.data.specificAddress, // Tương tự như trên
        user: {
          id: currentUser.data.id,
          username: currentUser.data.username,
          name: currentUser.data.name,
          fullAddress: currentUser.data.fullAddress,
          specificAddress: currentUser.data.specificAddress,
          phoneNumber: currentUser.data.phoneNumber,
          email: currentUser.data.email,
          profilePic: {
            url: currentUser.data.profilePic?.url, // Use optional chaining to handle potential undefined profilePic
            alternativeText: currentUser.data.profilePic?.alternativeText,
          },
          backgroundPic: currentUser.data.backgroundPic,
          isVerifyPhone: currentUser.data.isVerifyPhone,
          isVerifyEmail: currentUser.data.isVerifyEmail,
          status: currentUser.data.status,
          updatedAt: currentUser.data.updatedAt,
          createdAt: currentUser.data.createdAt,
        },
        category: null, // Thay đổi nếu có thông tin về category
        createdAt: new Date().toISOString(), // Hoặc sử dụng giá trị từ newPost nếu cần
        updatedAt: new Date().toISOString(), // Tương tự như trên
      };

      setPosts((prevPosts) => [newData, ...prevPosts]);
      setIsPopupOpen(false);
      toast.success(`Success: ${registeredUser.message}`);
      // setShowPopup(true);
    } catch (error) {
      toast.error(`Error: ${error.response.message}`);
    }
  };

  useEffect(() => {
    fetchCategory();
    fetchProvinces();
  }, []);

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <div className="share-info">
            <img
              className="shareProfileImg"
              src={currentUser?.data?.profilePic?.url || ""}
              alt=""
            />
            <span>What product do you want to share?</span>
          </div>
          <div className="shareBottom">
            <div className="shareOptions"></div>
            <button className="shareButton" onClick={openPopup}>
              Share
            </button>
          </div>
        </div>
        <hr className="shareHr" />

        {isPopupOpen && (
          <>
            <div className="overlay" onClick={closePopup}></div>
            <div className="popup">
              <div className="popup-title">
                <div className="shareTop">
                  <img
                    className="shareProfileImg"
                    src={currentUser?.data?.profilePic?.url || ""
                    }
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
                <span className="close" onClick={closePopup}>
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
                        <img className="zone_image" src={ImageCreate} alt="" />
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
                    onClick={handleRegisterClick}
                    variant="contained"
                    className="acsess_button"
                  >
                    Đăng
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
      </div>
      <ToastContainer />
    </div>
  );
}
