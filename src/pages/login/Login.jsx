import { Link, useNavigate } from "react-router-dom"
import "./login.scss"
import { useContext, useState  } from "react"
import { AuthContext } from "../../context/authContext"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// const Login = () => {
//   const [inputs, setInputs] = useState({
//     username:"",
//     password:"",
//   });

//   const navigate = useNavigate();

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
  const [inputs, setInputs] = useState({
    username:"",
    password:"",
  });

  const navigate = useNavigate();

  const handleChange = (e) =>{
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value}));
  }
  const { login} = useContext(AuthContext);
  
  const handleLogin = async ()=>{
    try{
      await login(inputs);
      console.log("OK")
      toast.success('success')
      navigate("/")
    }catch (err) {
      toast.error(`error: ${err.response.data.message}`)
    }
  }
  return (
    <div className="form-container">
      <div className="background-image"></div>
      <div className="form-box">
        <form className="Form-login">
          <h2 className="title-login">Login to continue</h2>
          <input className="input-login" type="email" placeholder="Email" name="username" onChange={handleChange} />
          <input className="input-login" type="password" placeholder="Password" name="password" onChange={handleChange} />
          <div className="remember-block">
            <label>
              <input type="checkbox" />
              Remember me
            </label>
            <a href="/">Forgot password?</a>
          </div>
          <button className="button-login" type="button" onClick={handleLogin}>
            Sign in
          </button>
          <div className="social-login">
            <a href="/">
              <i class="fa-brands fa-facebook" style={{ color: "#3398e6" }}></i>
            </a>
            <a href="/">
              <i class="fa-brands fa-google" style={{color: '#e26e6e'}}></i>
            </a>
          </div>
          <p className="acount">
            Don't have an account? <a href="/register">Sign up</a>
          </p>
        </form>
      </div>
      <ToastContainer/>
    </div>
  );
}

export default Login