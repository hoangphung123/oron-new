import axios from 'axios';

const api_url = 'http://127.0.0.1:3500/api/v1';

export const getAllProvinces = async () => {
  try {
    const response = await axios.get(`${api_url}/address/provinces`);

    // Axios tự động kiểm tra response.ok
    const provinces = response.data;
    return provinces;
  } catch (error) {
    console.error('Error while fetching provinces:', error.message);
    throw error;
  }
}

export const getDistrictsByProvinceId = async (provinceId) => {
  try {
    const response = await axios.get(`${api_url}/address/districts/?provinceId=${provinceId}`);

    const districts = response.data; // Thay đổi đường dẫn tương ứng với cấu trúc API của bạn
    return districts;
  } catch (error) {
    console.error('Error while fetching districts:', error.message);
    throw error;
  }
}

export const getWardsByDistrictId = async (DistrictId) => {
  try {
    const response = await axios.get(`${api_url}/address/wards?districtId=${DistrictId}`);

    const wards = response.data; // Thay đổi đường dẫn tương ứng với cấu trúc API của bạn
    return wards;
  } catch (error) {
    console.error('Error while fetching districts:', error.message);
    throw error;
  }
}

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${api_url}/auth/register`, userData);

    // Axios tự động kiểm tra response.ok
    const registeredUser = response.data;
    return registeredUser;
  } catch (error) {
    console.error('Error while registering user:', error.message);
    throw error;
  }
}

export const verifyCode = async (verificationData) => {
  try {
    const response = await axios.post(`${api_url}/auth/verification-register`, verificationData);
    const verifiedUser = response.data;
    return verifiedUser;
  } catch (error) {
    console.error('Error while verifying code:', error.message);
    throw error;
  }
};

export const ResendVerifyCode = async (ResendverificationData) => {
  try {
    const response = await axios.post(`${api_url}/auth/resend-register-verification-mail`, ResendverificationData);
    const verifiedUserResends = response.data;
    return verifiedUserResends;
  } catch (error) {
    console.error('Error while verifying code:', error.message);
    throw error;
  }
};

export const loginUser = async (loginData) => {
  try {
    const response = await axios.post(`${api_url}/auth/login`, loginData);
    const loggedInUser = response.data;
    return loggedInUser;
  } catch (error) {
    console.error('Error while logging in:', error.message);
    throw error;
  }
};

export const getProfile = async (accessToken) => {
  try {
    const response = await axios.get(`${api_url}/user/profile`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userProfile = response.data;
    return userProfile;
  } catch (error) {
    console.error('Error while fetching user profile:', error.message);
    throw error;
  }
};

export const uploadPictureUser = async (accessToken, file) => {
  try {
    // Create FormData object to send files as multipart/form-data
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(
      `${api_url}/picture/upload/user-profile`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const uploadedPicture = response.data;
    return uploadedPicture;
  } catch (error) {
    console.error('Error while uploading user picture:', error.message);
    throw error;
  }
};

export const uploadToGoogleDrive = async (accessToken, file, alternativeText, relatedType, relatedId) => {
  try {
    // Tạo FormData để gửi multipart/form-data
    const formData = new FormData();
    formData.append("file", file);
    formData.append("alternativeText", alternativeText);
    formData.append("relatedType", relatedType);
    formData.append("relatedId", relatedId);

    // Gửi yêu cầu API
    const response = await axios.post(
      `${api_url}/google-drive/specific`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error("Error while uploading file to Google Drive:", error.message);
    throw error;
  }
};

export const uploadPictureUserCover = async (accessToken, file) => {
  try {
    // Create FormData object to send files as multipart/form-data
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(
      `${api_url}/picture/upload/user-background`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const uploadedPictureCover = response.data;
    return uploadedPictureCover;
  } catch (error) {
    console.error('Error while uploading user picture:', error.message);
    throw error;
  }
};


export const getUserPic = async (accessToken, fileName) => {
  try {
    const response = await axios.get(
      `${api_url}/picture/user-profile/${fileName}`, // Use URL parameter for fileName
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const userPic = response.data;
    return userPic;
  } catch (error) {
    console.error('Error while fetching user picture:', error.message);
    throw error;
  }
}

export const getFriends = async (accessToken) => {
  try {
    const response = await axios.get(`${api_url}/user/friends`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const friendsList = response.data;
    return friendsList;
  } catch (error) {
    console.error('Error while fetching friends list:', error.message);
    throw error;
  }
}


export const forgotpassword = async (userData) => {
  try {
    const response = await axios.post(`${api_url}/auth/sending-forgot-password-mail`, userData);

    // Axios tự động kiểm tra response.ok
    const forgotpassword = response.data;
    return forgotpassword;
  } catch (error) {
    console.error('Error while registering user:', error.message);
    throw error;
  }
}

export const verifyForgotPassword = async (userData) => {
  try {
    const response = await axios.post(`${api_url}/auth/verification-forgot-password-code`, userData);

    const verificationResult = response.data;

    if (verificationResult.error === false && verificationResult.message === "send_mail_successfully") {
      // Thành công
      return verificationResult.data;
    } else {
      // Xử lý lỗi (nếu có)
      throw new Error(`Verification error: ${verificationResult.message}`);
    }
  } catch (error) {
    console.error('Error while verifying forgot password:', error.message);
    throw error;
  }
}


export const getUserByUsername = async (accessToken, username) => {
  try {
    const response = await axios.get(
      `${api_url}/user/filter?keyword=${username}`, // Use URL parameters for username and limit
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const user = response.data;
    return user;
  } catch (error) {
    console.error('Error while fetching user by username:', error.message);
    throw error;
  }
}

export const getUserByUserId = async (accessToken, UserId) => {
  try {
    const response = await axios.get(
      `${api_url}/user/user-profile/${UserId}`, // Use URL parameters for username and limit
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const user = response.data;
    return user;
  } catch (error) {
    console.error('Error while fetching user by username:', error.message);
    throw error;
  }
}

export const getFollowings = async (accessToken) => {
  try {
    const response = await axios.get(
      `${api_url}/user/followings`, // Use URL parameter for userId
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const followings = response.data;
    return followings;
  } catch (error) {
    console.error('Error while fetching user followings:', error.message);
    throw error;
  }
}

export const createFollow = async (accessToken, userId) => {
  try {
    const response = await axios.post(
      `${api_url}/user/${userId}/follow`, // Use URL parameter for userId
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const followResult = response.data;
    return followResult;
  } catch (error) {
    console.error('Error while creating follow:', error.message);
    throw error;
  }
}

export const UnFollow = async (accessToken, userId) => {
  try {
    const response = await axios.delete(
      `${api_url}/user/${userId}/unfollow`, // Use URL parameter for userId
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const unfollowResult = response.data;
    return unfollowResult;
  } catch (error) {
    console.error('Error while creating follow:', error.message);
    throw error;
  }
}

export const changePassWord = async (accessToken, dataChange) => {
  try {
    const response = await axios.patch(
      `${api_url}/user/change-password`,
      dataChange,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const changePasswordResult = response.data;
    return changePasswordResult;
  } catch (error) {
    console.error('Error while changing password:', error.message);
    throw error;
  }
}

export const UpdateProfile = async (accessToken, dataChange) => {
  try {
    const response = await axios.patch(
      `${api_url}/user`,
      dataChange,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const updateDataResult = response.data;
    return updateDataResult;
  } catch (error) {
    console.error('Error while changing password:', error.message);
    throw error;
  }
}

export const getPosition = async (accessToken) => {
  try {
    const response = await axios.get(
      `${api_url}/advertisement-position/`, // Use URL parameter for fileName
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const position = response.data;
    return position;
  } catch (error) {
    console.error('Error while fetching user picture:', error.message);
    throw error;
  }
}

export const createDivertise = async (accessToken, dataAdvertise) => {
  try {
    const response = await axios.post(
      `${api_url}/advertisement-banner`,
      dataAdvertise,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const DataResultAdvertise = response.data;
    return DataResultAdvertise;
  } catch (error) {
    console.error('Error while changing password:', error.message);
    throw error;
  }
}

export const getBanner = async (accessToken) => {
  try {
    const response = await axios.get(
      `${api_url}/advertisement-banner/contract/filter`, // Use URL parameter for fileName
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const banner = response.data;
    return banner;
  } catch (error) {
    console.error('Error while fetching user picture:', error.message);
    throw error;
  }
}





