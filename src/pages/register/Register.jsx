import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./register.scss";
import * as UserService from "../../server/userstore";
import { RingLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [provinces, setProvinces] = useState([]);
  const [wards, setwards] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [specificAddress, setSpecificAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingAS, setLoadingAS] = useState(false);
  const [loadingOTP, setLoadingOTP] = useState(false);
  const [countdown, setCountdown] = useState(300);

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

  useEffect(() => {
    let countdownInterval;

    if (showPopup && countdown > 0) {
      countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }

    return () => {
      clearInterval(countdownInterval);
    };
  }, [showPopup, countdown]);

  useEffect(() => {
    if (countdown === 0) {
    }
  }, [countdown]);

  const resetCountdown = () => {
    setCountdown(300);
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

  useEffect(() => {
    fetchProvinces();
  }, []);

  const handleRegisterClick = async () => {
    try {
      setLoading(true);
      const userData = {
        username: username,
        password: password,
        name: name,
        province: selectedProvince,
        district: selectedDistrict,
        ward: selectedWard,
        specificAddress: specificAddress,
        phoneNumber: phoneNumber,
        email: email,
      };

      const registeredUser = await UserService.registerUser(userData);

      localStorage.setItem("userID", registeredUser.data.user.id);

      toast.success(`Success: ${registeredUser.message}`);
      setShowPopup(true);
    } catch (error) {
      if (error.response.data.statusCode === 400) {
        error.response.data.message.forEach((errorMessage) => {
          toast.error(`Error: ${errorMessage}`);
        });
      } else if (error.response.data.code === 1) {
        const errorMessage = error.response.data.message;
        toast.error(`Error: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTPClick = async () => {
    try {
      setLoadingOTP(true);
      const userID = localStorage.getItem("userID");

      if (!userID) {
        toast.error("User ID not found in localStorage");
        return;
      }

      const verificationDataResends = {
        userId: userID,
      };

      const sendOTPcode = await UserService.ResendVerifyCode(
        verificationDataResends
      );
      resetCountdown();
      console.log("User verified successfully:", sendOTPcode);
    } catch (error) {
      toast.error(`Error: ${error.response.data.message}`);
    } finally {
      setLoadingOTP(false);
    }
  };

  const handleAccessClick = async () => {
    try {
      setLoadingAS(true);
      const userID = localStorage.getItem("userID");

      if (!userID) {
        toast.error("User ID not found in localStorage");
        return;
      }

      const verificationData = {
        id: userID,
        verificationCode: otpCode,
      };

      const verifiedUser = await UserService.verifyCode(verificationData);

      console.log("User verified successfully:", verifiedUser);

      localStorage.removeItem("userID");

      window.location.href = "/login";

      setShowPopup(false);
    } catch (error) {
      toast.error(`Error: ${error.response.data.message}`);
    } finally {
      setLoadingAS(false);
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  const handleInputChange = (e, inputField) => {
    const value = e.target.value;
    switch (inputField) {
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        break;
      case "name":
        setName(value);
        break;
      case "username":
        setUsername(value);
        break;
      case "phoneNumber":
        setPhoneNumber(value);
        break;
      case "specificAddress":
        setSpecificAddress(value);
        break;
      default:
        break;
    }
  };

  return (
    <div className="register">
      <div className="card">
        <h1>Register</h1>
        <div className="right">
          <form className="form1">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => handleInputChange(e, "email")}
            />
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => handleInputChange(e, "name")}
            />
            <input
              type="text"
              placeholder="UserName"
              value={username}
              onChange={(e) => handleInputChange(e, "username")}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => handleInputChange(e, "password")}
            />
            <input type="password" placeholder="Confirm Password" />
          </form>
          <form className="form2">
            <select value={selectedProvince} onChange={handleSelectProvince}>
              <option value="" disabled>
                Province
              </option>
              {provinces.map((province) => (
                <option key={province.id} value={province.id}>
                  {province.name}
                </option>
              ))}
            </select>
            <select value={selectedDistrict} onChange={handleSelectDistricts}>
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
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
            >
              <option value="" disabled>
                Ward
              </option>
              {wards.map((ward, index) => (
                <option key={ward.id} value={ward.id}>
                  {ward.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => handleInputChange(e, "phoneNumber")}
            />
            <input
              type="text"
              placeholder="Specific Address"
              value={specificAddress}
              onChange={(e) => handleInputChange(e, "specificAddress")}
            />
          </form>
        </div>
        <button
          className="button_register"
          onClick={handleRegisterClick}
          disabled={loading}
        >
          {loading ? (
            <RingLoader size={20} color={"#1C1C1C"} loading={loading} />
          ) : (
            "Register"
          )}
        </button>
      </div>
      <div className="card-left">
        <h1>ORON</h1>
        <p>Our redundancies other necessaries.</p>
        <span>Have an account?</span>
        <Link to="/login">
          <button>Login</button>
        </Link>
      </div>
      {showPopup && (
        <>
          <div className="overlay" onClick={handlePopupClose}></div>
          <div className="popup">
            <div className="popup-content">
              <span className="close" onClick={handlePopupClose}>
                &times;
              </span>
              <h2>Enter OTP Code</h2>
              <p>{`OTP available in ${countdown}s`}</p>
              <input
                type="text"
                placeholder="Enter code"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
              />
              <div className="button_AS">
                <button
                  className="Access_button"
                  onClick={handleAccessClick}
                  disabled={loadingAS}
                >
                  {loadingAS ? (
                    <RingLoader
                      size={20}
                      color={"#1C1C1C"}
                      loading={loadingAS}
                    />
                  ) : (
                    "access"
                  )}
                </button>
                <button
                  className="SendOTP_button"
                  onClick={handleSendOTPClick}
                  disabled={loadingOTP}
                >
                  {loadingOTP ? (
                    <RingLoader size={20} color={"#fff"} loading={loadingOTP} />
                  ) : (
                    "Send OTP Again"
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      <ToastContainer />
    </div>
  );
};

export default Register;
