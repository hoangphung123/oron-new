import { Link, useNavigate } from "react-router-dom";
import "./login.scss";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "./Logo.png";
import { getAndSendTokenToBackend } from "../nofication/filebase";
import * as UserServices from "../../server/userstore";

// const Login = () => {
//   const [inputs, setInputs] = useState({
//     username:"",
//     password:"",
//   });

//   const handleChange = (e) =>{
//     setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value}));
//   }
//   const { login} = useContext(AuthContext);

//   const handleLogin = async ()=>{
//     try{
//       await login(inputs);
//       toast.success('success')
//       navigate("/")
//     }catch (err) {
//       toast.error(`error: ${err.response.data.message}`)
//     }
//   }

//   return (
//     <div className="login">
//       <div className="card">
//             <div className="left">
//                     <h1>ORON</h1>
//                     <p>

//                       Our redundances other necessaries.
//                     </p>
//                     <span>Don't you have an account?</span>
//                     <Link to="/register">
//                     <button>Register</button>
//                     </Link>
//                     <Link to="/forgotpassword">
//                     <span1>Forgot your password?</span1>
//                     </Link>
//             </div>
//             <div className="right">
//                   <h1>Login</h1>
//                   <form >
//                     <input type="text" placeholder="Username" name="username" onChange={handleChange}/>
//                     <input type="password" placeholder="Password" name="password" onChange={handleChange} />
//                     <button type="button" onClick={handleLogin}>Login</button>
//                   </form>
//             </div>
//       </div>
//       <ToastContainer/>
//     </div>
//   )
// }

const Login = () => {
  const navigate = useNavigate();
  const { login, currentUser, setCurrentUser, setIsAuthenticating } = useContext(AuthContext);
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  // const handleLogin = async () => {
  //   try {
  //     const response = await UserServices.loginUser(inputs);
  //     if (response) {
  //       localStorage.setItem(
  //         "access_token",
  //         JSON.stringify(response.data.token)
  //       );

  //       navigate("/")
  //       const accessToken = response.data.token;
  //       if (!accessToken) {
  //         toast.error("Access token is missing. Login failed!");
  //         return;
  //       }
  //       // Call the getProfile function passing the token
  //       const profileUser = await UserServices.getProfile(accessToken);
  //       setCurrentUser(profileUser);
  //       localStorage.setItem("user", JSON.stringify(currentUser));

  //       console.log(profileUser.data.username);
  //     }
  //   } catch (error) {
  //     // Handle API error and show toast
  //     const errorMessage =
  //       error.response?.data?.message || "Login failed. Please try again!";
  //     toast.error(errorMessage);
  //     console.error("Login error:", error);
  //   }
  // };

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    console.log(e.target.value);
  };

  // const handleLogin = async () => {
  //   try {
  //     await login(inputs);
  //     // getAndSendTokenToBackend()
  //     console.log("OK");
  //     toast.success("success");
  //     navigate("/");
  //   } catch (err) {
  //     toast.error(`error when login`);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn trình duyệt tự tải lại trang

    const response = await login(inputs); // Thực hiện login
    if (response) {
      toast.success(response); 
    } else {
      setIsAuthenticating(true)
      toast.success("Login successful"); // Thông báo thành công
      console.log("OK");
      navigate("/");
    }
    // Chuyển hướng nếu login thành công
  };

  return (
    <div className="form-container">
      <div className="background-image"></div>
      <div className="form-box">
        <img src={Logo} alt="logo" className="Login-logo" />
        <form className="Form-login" onSubmit={handleSubmit}>
          <h2 className="title-login">Login to continue</h2>
          <input
            className="input-login"
            type="email"
            placeholder="Email"
            name="username"
            onChange={handleChange}
          />
          <input
            className="input-login"
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
          />
          <div className="remember-block">
            <label>
              {/* <input type="checkbox" />
              Remember me */}
            </label>
            <a href="/forgotpassword">Forgot password?</a>
          </div>
          <button className="button-login" type="submit">
            Sign in
          </button>
          {/* <div className="social-login">
            <a href="/">
              <i class="fa-brands fa-facebook" style={{ color: "#3398e6" }}></i>
            </a>
            <a href="/">
              <i class="fa-brands fa-google" style={{color: '#e26e6e'}}></i>
            </a>
          </div> */}
          <p className="acount">
            Don't have an account? <a href="/register">Sign up</a>
          </p>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
