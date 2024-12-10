import React, { useState, useEffect } from "react";
import "./MyProfileComponent.scss";
import ButtonCanncel from "./Icon Button.png";
import ButtonSave from "./Icon Button1.png";
import { DatePicker } from "antd";
import * as UserSever from "../../server/userstore";
import moment from "moment";

const FriendProfileComponent = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [userData, setUserData] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [wards, setwards] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [firstName, setFirstName] = useState("");
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState(null);
  const [specificAddress, setSpecificAddress] = useState("");
  const [genderCD, setGenderCD] = useState(1);
  const [mail, setMail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [relatedUrl, setRelatedUrl] = useState("");

  // const onChange: DatePickerProps['onChange'] = (date, dateString) => {
  //   console.log(date, dateString);
  // };

  const DeleteData = () => {
    setBirthDate(null);
    setGenderCD(2);
    setFirstName("");
    setSpecificAddress("");
    setSelectedProvince("");
    setSelectedDistrict("");
    setSelectedWard("");
    userData.fullAddress = "";
  };

  const handleSaveProfile = async () => {
    try {
      const accessToken = JSON.parse(localStorage.getItem("access_token"));
      const updatedProfile = {
        name: firstName,
        birthDate: birthDate ? birthDate.format("YYYY-MM-DD") : null,
        specificAddress: specificAddress,
        province: selectedProvince,
        district: selectedDistrict,
        ward: selectedWard,
        genderCD: genderCD,
        phoneNumber: phoneNumber,
        relatedUrl: relatedUrl
      };

      const response = await UserSever.UpdateProfile(
        accessToken,
        updatedProfile
      );
      if (response.success) {
        console.log("Profile updated successfully!");
        // Optionally refresh user data or show a success message
      } else {
        console.log("Error updating profile:", response.error);
      }
    } catch (error) {
      console.error("Error calling UpdateProfile API:", error.message);
    }
  };

  const fetchProvinces = async () => {
    try {
      const response = await UserSever.getAllProvinces();

      if (!response.error) {
        const fetchedProvinces = response.data.listData;
        setProvinces(fetchedProvinces);
      } else {
        console.log("error");
      }
    } catch (error) {
      console.log("error", error.message);
    }
  };

  const fetchDistrictsByProvinceId = async (provinceId) => {
    try {
      const responses = await UserSever.getDistrictsByProvinceId(provinceId);
      if (!responses.error) {
        const fetchedDistricts = responses.data.listData;
        setDistricts(fetchedDistricts);
      } else {
        console.log("error");
      }
    } catch (error) {
      console.log("error", error.message);
    }
  };

  const fetchWardsByDistrictId = async (districtId) => {
    try {
      const responses = await UserSever.getWardsByDistrictId(districtId);
      if (!responses.error) {
        const fetchedWards = responses.data.listData;
        setwards(fetchedWards);
      } else {
        console.log("error");
      }
    } catch (error) {
      console.log("error", error.message);
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

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const accessToken = JSON.parse(localStorage.getItem("access_token"));
        const profileResponse = await UserSever.getProfile(accessToken);
        setUserData(profileResponse.data);
        setFirstName(profileResponse.data.name);
        setBirthDate(
          profileResponse.data.birthDate
            ? moment(profileResponse.data.birthDate)
            : null
        );
        setSpecificAddress(profileResponse.data.specificAddress);
        setGenderCD(profileResponse.data.genderCD);
        setMail(profileResponse.data.email);
        setPhoneNumber(profileResponse.data.phoneNumber);
        setRelatedUrl(profileResponse.data.relatedUrl)
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchProvinces();
    fetchUserProfile();
  }, []);

  if (!userData) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <div className="profile-container-title">
        <h2>My Profile</h2>
        <div className="profile-container_button">
          <img src={ButtonCanncel} alt="buttonCanncel" onClick={DeleteData} />
          <img src={ButtonSave} alt="" onClick={handleSaveProfile} />
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-sidebar">
          <button
            className={activeTab === "Overview" ? "active-tab" : ""}
            onClick={() => setActiveTab("Overview")}
          >
            Overview
          </button>
          {/* <button
            className={activeTab === "Details" ? "active-tab" : ""}
            onClick={() => setActiveTab("Details")}
          >
            Details
          </button>
          <button
            className={activeTab === "Other" ? "active-tab" : ""}
            onClick={() => setActiveTab("Other")}
          >
            Other
          </button> */}
        </div>
        <div className="profile-details">
          {activeTab === "Overview" && (
            <div>
              <p className="profile-details-title">
                <strong>Name</strong>
              </p>
              <p className="profile-details-content">{userData.name}</p>
              <p className="profile-details-title">
                <strong>Birthday</strong>
              </p>
              <p className="profile-details-content">
                {userData.birthDate
                  ? moment(userData.birthDate).format("DD/MM/YYYY")
                  : "N/A"}
              </p>
              <p className="profile-details-title">
                <strong>Address</strong>
              </p>
              <p className="profile-details-content">{userData.fullAddress}</p>
              <p className="profile-details-title">
                <strong>Contact</strong>
              </p>
              <p className="profile-details-content">
                {userData.email || userData.phoneNumber}
              </p>
              {/* <div className="edit-buttons">
                <button className="edit-button">H</button>
                <button className="delete-button">X</button>
              </div> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendProfileComponent;
