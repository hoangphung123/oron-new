import React, { useState } from 'react';
import "./LoginAdmin.scss";
import * as AdminService from '../../../server/adminStore';
import Notification from "../../../components/notification/Notification";
import { Link, useNavigate } from "react-router-dom"

function LoginAdmin() {
  const [username, setUseName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('');

  const clearNotification = () => {
    setMessage('');
  };

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const loginData = {
        username,
        password,
      };
      const response = await AdminService.loginAdmin(loginData);
      localStorage.setItem("access_token_admin", JSON.stringify(response.data.token));
      setMessage('Post saved successfully!');
      setType('success');
      navigate("/admin")
      // Handle success (e.g., navigate to the admin dashboard or store token)
    } catch (error) {
        setMessage('Login Fall');
        setType('danger');
    }
  };

  return (
    <div className="containers">
      <div className="top"></div>
      <div className="bottom"></div>
      <div className="centers">
        <h2>Please Sign In</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUseName(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <h2>&nbsp;</h2>
      </div>
      <Notification message={message} type={type} clearNotification={clearNotification} />
    </div>
  );
}

export default LoginAdmin;
