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
  Tooltip,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "./advertise.scss";
import UseHomePage from "./UserHomePage.png";
import * as UserServer from "../../server/userstore";
import moment from "moment";
import Loading from "../../components/loading/Loading";

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
  const [errors, setErrors] = useState({
    startDate: false,
    endDate: false,
  });
  const [positionStatus, setPositionStatus] = useState({});
  const [openloading, setOpenloading] = useState(false);

  const handleDateChange = async (field, value) => {
    // Cập nhật formData và kiểm tra lỗi
    const updatedFormData = { ...formData, [field]: value };
    setFormData(updatedFormData);
    setErrors({ ...errors, [field]: !value });

    // Kiểm tra nếu cả startDate và endDate đều đã được chọn
    if (updatedFormData.startDate && updatedFormData.endDate) {
      try {
        const accessToken = JSON.parse(localStorage.getItem("access_token")); // Lấy token từ localStorage
        const positions = await UserServer.getPositionAvailable(
          accessToken,
          updatedFormData.startDate,
          updatedFormData.endDate
        );
        // Gắn trạng thái id và dateStatusCd vào state positionStatus
        const statusMap = {};
        positions.listData.forEach((pos) => {
          statusMap[pos.id] = pos.dateStatusCd;
        });
        setPositionStatus(statusMap); // Ví dụ: Lưu vào state positions
      } catch (error) {
        console.error("Failed to fetch available positions:", error);
      }
    }
  };

  const isAnyPositionUnavailable = formData.images.some(
    (img) => positionStatus[img.position.id] === "Unavailable"
  );

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
        setBanner(response.listData || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách vị trí:", error);
      }
    };
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

  const statusTags = {
    1: { text: "Đang chờ duyệt", color: "green" },
    2: { text: "Đang chờ thanh toán", color: "purple" },
    3: { text: "Bị từ chối", color: "red" },
    4: { text: "Đã thanh toán", color: "blue" },
  };

  const columns = [
    {
      title: "Ảnh minh họa",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img
          src={image.url}
          alt={image.alternativeText}
          style={{ width: 100 }}
        />
      ),
    },
    {
      title: "Tên Banner",
      dataIndex: "bannerName",
      key: "bannerName",
    },
    {
      title: "Vị trí hiển thị",
      dataIndex: "positionName",
      key: "positionName",
    },
    // {
    //   title: "Kích thước",
    //   dataIndex: "positionDimention",
    //   key: "positionDimention",
    // },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Tổng chi phí",
      dataIndex: "totalCost",
      key: "totalCost",
      render: (cost) => `${cost.toLocaleString()} VND`,
    },
    {
      title: "Tên khách hàng",
      dataIndex: "clientName",
      key: "clientName",
    },
    {
      title: "Tình trạng",
      dataIndex: "contractStatus",
      key: "contractStatus",
      render: (status) => {
        const { text, color } = statusTags[status] || {};
        return <Tag color={color || "default"}>{text || "Không xác định"}</Tag>;
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Button danger onClick={() => handleDelete(record.contractId)}>
          Xóa
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
    setOpenloading(true);
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
        const bannerData = await UserServer.createDivertise(
          accessToken,
          requestData
        );
        const bannerId = bannerData.data.bannerId;
        const selectedImage = image.originFileObj;

        try {
          await UserServer.uploadToGoogleDrive(
            accessToken, // Token xác thực
            selectedImage, // File ảnh cần upload
            "Ảnh minh họa", // alternativeText
            "advertisement-banner", // Thư mục hoặc định danh loại ảnh
            bannerId // ID banner liên quan
          );

          console.log(`Image ${i + 1} uploaded successfully to Google Drive.`);
        } catch (uploadError) {
          console.error(`Error uploading image ${i + 1}:`, uploadError);
        }

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

      setOpenloading(false);

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
      originFileObj: file, // Lưu file thực tế để upload
    };

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, newImage],
    }));

    // Hiển thị modal chọn vị trí
    showRegisterModal(newImage.image);

    return false; // Ngừng hành động upload mặc định
  };

  const handleUploadClick = (e) => {
    if (!formData.startDate || !formData.endDate) {
      // Ngăn chặn hành động mở cửa sổ upload
      e.preventDefault();
      setErrors({
        startDate: !formData.startDate,
        endDate: !formData.endDate,
      });
    }
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
        <Table columns={columns} dataSource={banner} />
      </div>

      {/* Create Advertise Modal */}
      <Modal
        title="Create Advertise"
        visible={isCreateModalVisible}
        onOk={handleCreateOk}
        onCancel={handleCreateCancel}
        footer={null}
        okText="Submit"
        cancelText="Cancel"
        okButtonProps={{ disabled: isAnyPositionUnavailable }}
      >
        <div>
          <label>Ngày bắt đầu:</label>
          <DatePicker
            style={{ width: "100%", marginBottom: 16 }}
            value={formData.startDate ? moment(formData.startDate) : null}
            onChange={(date, dateString) =>
              handleDateChange("startDate", dateString)
            }
          />
          {errors.startDate && (
            <div style={{ color: "red", fontSize: "12px" }}>
              Bạn phải chọn ngày bắt đầu
            </div>
          )}
        </div>

        <div>
          <label>Ngày kết thúc:</label>
          <DatePicker
            style={{ width: "100%", marginBottom: 16 }}
            value={formData.endDate ? moment(formData.endDate) : null}
            onChange={(date, dateString) =>
              handleDateChange("endDate", dateString)
            }
          />
          {errors.endDate && (
            <div style={{ color: "red", fontSize: "12px" }}>
              Bạn phải chọn ngày kết thúc
            </div>
          )}
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
            maxCount={3} // Giới hạn 5 ảnh
            fileList={fileList}
            onRemove={handleRemoveImage}
            beforeUpload={handleAddImage}
            disabled={
              !formData.startDate ||
              !formData.endDate ||
              formData.images.length === 3
            }
            Upload
            onChange={({ fileList: newFileList }) => setFileList(newFileList)}
          >
            <div onClick={handleUploadClick}>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>

          <div style={{ marginTop: 16 }}>
            <h4>Danh sách ảnh đã chọn:</h4>
            <div className="upload_content-img">
              {formData.images.map((img, index) => {
                const isUnavailable =
                  positionStatus[img.position.id] === "Unavailable";

                return (
                  <div className="img-content" key={index}>
                    <img
                      src={img.image}
                      alt="Quảng cáo"
                      style={{ width: 100, marginRight: 8 }}
                    />
                    <span style={{ color: isUnavailable ? "red" : "black" }}>
                      {img.position.name || "Chưa chọn"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 16,
            flexDirection: "row-reverse",
            gap: 10,
          }}
        >
          <Button
            type="primary"
            danger
            ghost
            // disabled={isAnyPositionUnavailable}
            onClick={handleCreateCancel}
          >
            Cancel
          </Button>
          <Tooltip
            title={
              isAnyPositionUnavailable
                ? "Nút này bị vô hiệu hóa vì một số vị trí đã chọn không khả dụng."
                : ""
            }
          >
            <Button
              type="primary"
              disabled={isAnyPositionUnavailable}
              onClick={handleCreateOk}
            >
              Submit
            </Button>
          </Tooltip>
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
      {openloading && <Loading></Loading>}
    </div>
  );
};

export default AdvertisePage;
