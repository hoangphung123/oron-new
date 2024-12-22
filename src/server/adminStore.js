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

export const updateReport = async (id, status, accessToken) => {
  try {
    const response = await axios.patch(
      `${api_url}/report/${id}`,
      { status: status.toString() },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("Report updated successfully");
    return response.data;
  } catch (error) {
    console.error("Error while updating the report:", error.message);
    throw error;
  }
};

export const getBanner = async (accessToken) => {
  try {
    const response = await axios.get(
      `${api_url}/advertisement-banner/contract/filter`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("Banner data retrieved successfully");
    return response.data;
  } catch (error) {
    console.error("Error while fetching banner data:", error.message);
    throw error;
  }
};

export const getInfomationUser = async (accessToken) => {
  try {
    const response = await axios.get(
      `${api_url}/user/age-group`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("Banner data retrieved successfully");
    return response.data;
  } catch (error) {
    console.error("Error while fetching banner data:", error.message);
    throw error;
  }
};


export const getInfomationUserv2 = async (accessToken) => {
  try {
    const year = 2024; // Năm cố định
    const url = `${api_url}/user/monthly/${year}`; // Thay thế :year bằng năm 2024
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("User growth data for 2024 retrieved successfully");
    return response.data;
  } catch (error) {
    console.error("Error while fetching user growth data:", error.message);
    throw error;
  }
};
