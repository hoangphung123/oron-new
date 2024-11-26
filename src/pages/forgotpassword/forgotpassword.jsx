import { Link, useNavigate } from "react-router-dom";
import "./forgotpassword.scss";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as userservice from "../../server/userstore";
import { RingLoader } from "react-spinners";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [countdown, setCountdown] = useState(300);
  const [otpCode, setOtpCode] = useState("");
  const [loadingAS, setLoadingAS] = useState(false);
  const [loadingOTP, setLoadingOTP] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const { sendForgotPasswordVerificationMail } = useContext(AuthContext);

  const handlePopupClose = () => {
    setShowPopup(false);
    setCountdown(300)
  };

  const resetCountdown = () => {
    setCountdown(300);
  };

  useEffect(() => {
    let timer;

    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      // Handle timeout if needed
    }

    return () => {
      clearTimeout(timer);
    };
  }, [countdown]);

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
  
      await userservice.ResendVerifyCode(verificationDataResends);
      resetCountdown();
      toast.success("Verification code resent successfully");
    } catch (error) {
      console.error("Error resending verification code:", error);
      toast.error(`Error: ${error.response?.data?.message || "Unknown error"}`);
    } finally {
      setLoadingOTP(false);
    }
  };
  

  const handleAccessClick = async () => {
    try {
      setLoadingAS(true);
      
  
      if (!userId) {
        toast.error("User ID not found in localStorage");
        return;
      }
  
      const verificationData = {
        id: userId,
        verificationCode: otpCode,
      };
  
      const verifiedUser = await userservice.verifyForgotPassword(verificationData);
  
      console.log("User verified successfully:", verifiedUser);
  
      
  
      // Do something after successful verification, e.g., redirect to the login page
      navigate("/login");
      setCountdown(300)
      setShowPopup(false);
    } catch (error) {
      console.error("Error verifying user:", error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoadingAS(false);
    }
  };
  
  

  const handleForgotpassword = async () => {
    const userData = {
      email: email,
    };
    try {
      const response = await userservice.forgotpassword(userData);
      setUserId(response.data.userId)
      toast.success('Success');
      setShowPopup(true);
      setCountdown(300)
    } catch (err) {
      toast.error(`Error: ${err.response.data.message}`);
    }
  };

  const handleInputChange = (e, inputField) => {
    const value = e.target.value;
    switch (inputField) {
      case "email":
        setEmail(value);
        break;
      default:
        break;
    }
  };

  return (
    <div className="forgotpassword">
      <div className="card">
        <div className="left">
          <h1>ORON</h1>
          <p>
            Our redundances other necessaries.
          </p>
          <span>You want to go to login! Click now!</span>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
        <div className="right">
          <h1>Input your mail!!</h1>
          <form>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => handleInputChange(e, "email")}
            />
            <button type="button" onClick={handleForgotpassword}>
              Send OTP
            </button>
          </form>
        </div>
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
                    <RingLoader size={20} color={"#1C1C1C"} loading={loadingAS} />
                  ) : (
                    "Access"
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

export default ForgotPassword;
