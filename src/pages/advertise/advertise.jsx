import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Button,
  Modal,
  DatePicker,
  Upload,
  Select,
  Input,
  Checkbox,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "./advertise.scss";
import UseHomePage from "./UserHomePage.png";
import * as UserServer from "../../server/userstore";
import moment from "moment";

const AdvertisePage = () => {
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(""); // Lưu vị trí được chọn
  const [positions, setPositions] = useState([]);
  const [banner, setBanner] = useState([]);
  const [fileList, setFileList] = useState([]);
  const accessToken = JSON.parse(localStorage.getItem("access_token"));
  const [formData, setFormData] = useState({
    startDate: null,
    endDate: null,
    images: [], // Chứa danh sách ảnh cùng vị trí
  });
  const [currentImage, setCurrentImage] = useState(null); // Ảnh hiện tại để gắn vị trí

  useEffect(() => {
    const fetchPositions = async () => {     
      try {
        const response = await UserServer.getPosition(accessToken);
        setPositions(response.listData || []); // Cập nhật danh sách vị trí
      } catch (error) {
        console.error("Lỗi khi lấy danh sách vị trí:", error);
      }
    };
    const fectchBanner = async () => {
      try {
        const response = await UserServer.getBanner(accessToken);
        setBanner(response.listData || [])
      }catch (error) {
        console.error("Lỗi khi lấy danh sách vị trí:", error);
      }
    }
    fectchBanner();
    fetchPositions();
  }, []);

  useEffect(() => {
    if (isCreateModalVisible) {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser && storedUser.data) {
        setFormData((prev) => ({
          ...prev,
          name: storedUser.data.name,
          phoneNumber: storedUser.data.phoneNumber,
          email: storedUser.data.email,
        }));
      }
    }
  }, [isCreateModalVisible]);

  // Fake data
  const data = [
    {
      key: "1",
      image:
        "https://i.pinimg.com/736x/3d/6a/f1/3d6af1574ef42b53b065e4079bd0a7b6.jpg",
      startDate: "2024-12-01",
      endDate: "2024-12-31",
      totalAmount: "$500",
      status: 0,
    },
    {
      key: "2",
      image:
        "https://i.pinimg.com/736x/3d/6a/f1/3d6af1574ef42b53b065e4079bd0a7b6.jpg",
      startDate: "2024-11-01",
      endDate: "2024-11-15",
      totalAmount: "$300",
      status: 1,
    },
    {
      key: "3",
      image:
        "https://i.pinimg.com/736x/3d/6a/f1/3d6af1574ef42b53b065e4079bd0a7b6.jpg",
      startDate: "2024-10-01",
      endDate: "2024-10-10",
      totalAmount: "$200",
      status: 3,
    },
  ];

  // Status tags
  const statusTags = {
    0: { text: "Đang chờ duyệt", color: "blue" },
    1: { text: "Đã duyệt", color: "green" },
    2: { text: "Đã thanh toán", color: "purple" },
    3: { text: "Bị từ chối", color: "red" },
  };

  // Columns definition
  const columns = [
    {
      title: "Ảnh quảng cáo",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img src={image} alt="Quảng cáo" style={{ width: 100 }} />
      ),
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
    },
    {
      title: "Tình trạng",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={statusTags[status].color}>{statusTags[status].text}</Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Button danger onClick={() => handleDelete(record.key)}>
          Delete
        </Button>
      ),
    },
  ];

  // Delete handler
  const handleDelete = (key) => {
    console.log("Xóa mục:", key);
  };

  const handleRemoveImage = (file) => {
    setFileList((prevFileList) =>
      prevFileList.filter((item) => item.uid !== file.uid)
    );
    // Tìm ảnh dựa trên `uid` và xóa ảnh khỏi `formData.images`
    const updatedImages = formData.images.filter((img) => img.uid !== file.uid);
    setFormData((prev) => ({ ...prev, images: updatedImages }));
  };

  // Modal Handlers
  const showCreateModal = () => {
    setIsCreateModalVisible(true);
    console.log(FormData);
  };

  const handleCreateOk = async () => {
    const accessToken = JSON.parse(localStorage.getItem("access_token"));
    try {
      // Lặp qua mỗi image trong formData.images và gọi API cho mỗi image
      for (let i = 0; i < formData.images.length; i++) {
        const image = formData.images[i];

        const requestData = {
          bannerInfo: {
            bannerName: formData.bannerName,
            redirectUrl: formData.redirectUrl,
          },
          clientInfo: {
            name: formData.name,
            contactNum: formData.phoneNumber,
            emailAddress: formData.email,
          },
          rentalContactInfo: {
            positionRid: image.position.id, // position riêng cho từng image
            startDate: formData.startDate,
            endDate: formData.endDate,
          },
        };

        // Gọi API createDivertise từ UserServer với requestData và accessToken
        await UserServer.createDivertise(accessToken, requestData);

        console.log(`Advertisement created for image ${i + 1}`);
      }

      setFileList([]); // Reset file list
      setFormData({
        // Reset formData về giá trị mặc định
        bannerName: "",
        redirectUrl: "",
        name: "",
        phoneNumber: "",
        email: "",
        startDate: "",
        endDate: "",
        images: [], // Reset danh sách ảnh
      });

      // Đóng modal sau khi tất cả các API được gọi
      setIsCreateModalVisible(false);

      // Hiển thị thông báo thành công
      console.log("Advertisements created successfully!");
    } catch (error) {
      console.error("Error creating advertisement:", error);
    }
  };

  const handleCreateCancel = () => {
    setIsCreateModalVisible(false);
    setFileList([]);
    setFormData({
      // Reset formData về giá trị mặc định
      bannerName: "",
      redirectUrl: "",
      name: "",
      phoneNumber: "",
      email: "",
      startDate: "",
      endDate: "",
      images: [], // Reset danh sách ảnh
    });
  };

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value, // Cập nhật trường tương ứng trong formData
    }));
  };

  const showRegisterModal = (image) => {
    setCurrentImage(image); // Đặt ảnh hiện tại
    setIsRegisterModalVisible(true);
    setSelectedPosition("");
  };

  const handleRegisterOk = () => {
    const updatedImages = [...formData.images];
    const index = updatedImages.findIndex((img) => img.image === currentImage);

    if (index !== -1) {
      updatedImages[index].position = {
        id: selectedPosition.id,
        name: selectedPosition.name,
      };
    } else {
      updatedImages.push({
        image: currentImage,
        position: { id: selectedPosition.id, name: selectedPosition.name },
      });
    }

    setFormData((prev) => ({ ...prev, images: updatedImages }));
    setIsRegisterModalVisible(false);
    setSelectedPosition("");
    setCurrentImage(null);
  };

  const handleRegisterCancel = () => {
    setIsRegisterModalVisible(false);
  };

  const handleAddImage = (file) => {
    const newImage = {
      id: Date.now(), // Hoặc dùng `uuid` để tạo ID duy nhất
      image: URL.createObjectURL(file), // URL của ảnh
      position: "", // Chưa có vị trí
      uid: file.uid, // Thêm `uid` của ảnh từ `file`
    };

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, newImage],
    }));

    // Hiển thị modal chọn vị trí
    showRegisterModal(newImage.image);

    return false; // Ngừng hành động upload mặc định
  };

  return (
    <div className="advertise">
      <div className="advertise_container">
        <Button
          type="primary"
          style={{ marginBottom: 16 }}
          onClick={showCreateModal}
        >
          Create
        </Button>
        <Table columns={columns} dataSource={data} />
      </div>

      {/* Create Advertise Modal */}
      <Modal
        title="Create Advertise"
        visible={isCreateModalVisible}
        onOk={handleCreateOk}
        onCancel={handleCreateCancel}
        okText="Submit"
        cancelText="Cancel"
      >
        <div>
          <label>Ngày bắt đầu:</label>
          <DatePicker
            style={{ width: "100%", marginBottom: 16 }}
            value={formData.startDate ? moment(formData.startDate) : null}
            onChange={(date, dateString) =>
              handleInputChange("startDate", dateString)
            }
          />
        </div>

        <div>
          <label>Ngày kết thúc:</label>
          <DatePicker
            style={{ width: "100%", marginBottom: 16 }}
            value={formData.endDate ? moment(formData.endDate) : null}
            onChange={(date, dateString) =>
              handleInputChange("endDate", dateString)
            }
          />
        </div>
        {/* Banner Name */}
        <div>
          <label>Banner Name:</label>
          <Input
            value={formData.bannerName} // Gắn giá trị từ formData vào Input
            placeholder="Enter Banner Name"
            style={{ width: "100%", marginBottom: 16 }}
            onChange={(e) => handleInputChange("bannerName", e.target.value)} // Cập nhật state khi thay đổi
          />
        </div>

        <div>
          <label>Redirect URL:</label>
          <Input
            placeholder="Enter Redirect URL"
            type="url"
            style={{ width: "100%", marginBottom: 16 }}
            value={formData.redirectUrl}
            onChange={(e) => handleInputChange("redirectUrl", e.target.value)}
          />
        </div>

        {/* Name */}
        <div>
          <label>Name:</label>
          <Input
            placeholder="Enter Name"
            value={formData.name}
            style={{ width: "100%", marginBottom: 16 }}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />
        </div>

        {/* Phone Number */}
        <div>
          <label>Phone Number:</label>
          <Input
            placeholder="Enter Phone Number"
            value={formData.phoneNumber}
            style={{ width: "100%", marginBottom: 16 }}
            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
          />
        </div>

        {/* Email */}
        <div>
          <label>Email:</label>
          <Input
            placeholder="Enter Email"
            value={formData.email}
            style={{ width: "100%", marginBottom: 16 }}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />
        </div>
        <div>
          <label>Hình ảnh quảng cáo:</label>
          <Upload
            listType="picture-card"
            maxCount={5} // Giới hạn 5 ảnh
            fileList={fileList}
            onRemove={handleRemoveImage}
            beforeUpload={handleAddImage}
            Upload
            onChange={({ fileList: newFileList }) => setFileList(newFileList)}
          >
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>

          <div style={{ marginTop: 16 }}>
            <h4>Danh sách ảnh đã chọn:</h4>
            <div className="upload_content-img">
              {formData.images.map((img, index) => (
                <div className="img-content" key={index}>
                  <img
                    src={img.image}
                    alt="Quảng cáo"
                    style={{ width: 100, marginRight: 8 }}
                  />
                  <span>{img.position.name || "Chưa chọn"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Register ADS Modal */}
      <Modal
        title="Register ADS"
        visible={isRegisterModalVisible}
        onOk={handleRegisterOk}
        onCancel={handleRegisterCancel}
        okText="Register"
        cancelText="Cancel"
      >
        <div>
          <p>Where do you want to register to place ads?</p>
          <img src={UseHomePage} alt="" />
          {positions.map((pos) => (
            <Checkbox
              key={pos.id}
              value={pos.positionName}
              onChange={(e) =>
                setSelectedPosition(
                  e.target.checked ? { id: pos.id, name: pos.positionName } : ""
                )
              }
            >
              {pos.positionName} (Kích thước: {pos.dimention}, Giá:{" "}
              {pos.pricePerDay} VND/ngày)
            </Checkbox>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default AdvertisePage;
