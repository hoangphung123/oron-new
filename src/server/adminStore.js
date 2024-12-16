import axios from "axios";

const api_url = "http://127.0.0.1:3500/api/v1";

export const loginAdmin = async (loginData) => {
  try {
    const response = await axios.post(`${api_url}/auth/login`, loginData);
    const loggedInAdmin = response.data;
    return loggedInAdmin;
  } catch (error) {
    console.error("Error while logging in:", error.message);
    throw error;
  }
};

export const getAllUsers = async (accessToken) => {
  try {
    const response = await axios.get(`${api_url}/user/filter`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const users = response.data;
    return users;
  } catch (error) {
    console.error("Error while fetching users:", error.message);
    throw error;
  }
};

// Get reports by admin API
export const getReportsByAdmin = async (accessToken) => {
  try {
    const response = await axios.get(`${api_url}/report/filter`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const reports = response.data;
    return reports;
  } catch (error) {
    console.error("Error while fetching reports:", error.message);
    throw error;
  }
};

export const deletePost = async (id, accessToken) => {
  try {
    const response = await axios.delete(`${api_url}/report/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("Post deleted successfully");
    return response.data;
  } catch (error) {
    console.error("Error while deleting the post:", error.message);
    throw error;
  }
};

