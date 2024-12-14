import axios from "axios";

const api_url = "http://127.0.0.1:3500/api/v1";

export const getCategory = async (status) => {
  try {
    const response = await axios.get(
      `${api_url}/category/filter?status=${status}`
    );

    const categories = response.data; // Update this line based on your API response structure
    return categories;
  } catch (error) {
    console.error("Error while fetching categories:", error.message);
    throw error;
  }
};

export const createPost = async (accessToken, createData) => {
  try {
    const response = await axios.post(`${api_url}/post`, createData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Axios tự động kiểm tra response.ok
    const registeredUser = response.data;
    return registeredUser;
  } catch (error) {
    console.error("Error while registering user:", error.message);
    throw error;
  }
};

export const uploadPost = async (accessToken, file, id) => {
  try {
    // Create FormData object to send files as multipart/form-data
    const formData = new FormData();
    formData.append("file", file);

    // Use the 'id' parameter in the URL
    const response = await axios.post(
      `${api_url}/picture/upload/post/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const uploadedPicture = response.data;
    return uploadedPicture;
  } catch (error) {
    console.error("Error while uploading user picture:", error.message);
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


export const getAllPost = async (accessToken, limit, categoryId) => {
  try {
    const response = await axios.get(`${api_url}/post/filter?limit=${limit}&status=1&categoryId=${categoryId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const posts = response.data; // Cập nhật dòng này dựa trên cấu trúc phản hồi của API của bạn
    return posts;
  } catch (error) {
    console.error("Error while fetching posts:", error.message);
    throw error;
  }
};


export const getPostByUserId = async (accessToken, userId, limit) => {
  try {
    const response = await axios.get(
      `${api_url}/post/filter?limit=${limit}&userId=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const posts = response.data; // Update this line based on your API response structure
    return posts;
  } catch (error) {
    console.error(
      `Error while fetching posts for user with id ${userId}:`,
      error.message
    );
    throw error;
  }
};

export const getPostByUserIdStattus = async (accessToken, userId) => {
  try {
    const response = await axios.get(
      `${api_url}/post/filter?userId=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const posts = response.data; // Update this line based on your API response structure
    return posts;
  } catch (error) {
    console.error(
      `Error while fetching posts for user with id ${userId}:`,
      error.message
    );
    throw error;
  }
};

export const getCommentByPostId = async (postId) => {
  try {
    const response = await axios.get(`${api_url}/comment/post/${postId}`);
    const comments = response.data; // Cập nhật dòng này dựa trên cấu trúc dữ liệu trả về từ API của bạn
    return comments;
  } catch (error) {
    console.error(
      `Error while fetching comments for post with id ${postId}:`,
      error.message
    );
    throw error;
  }
};

export const uploadComment = async (accessToken, formData) => {
  try {
    const response = await axios.post(`${api_url}/comment`, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const uploadedComment = response.data;
    return uploadedComment;
  } catch (error) {
    console.error("Error while uploading user picture:", error.message);
    throw error;
  }
};

export const postRegistration = async (accessToken, registrationData) => {
  try {
    const response = await axios.post(
      `${api_url}/post-registration`,
      registrationData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const registrationResult = response.data;
    return registrationResult;
  } catch (error) {
    console.error("Error while posting registration:", error.message);
    throw error;
  }
};

export const getPostRegistrationByUserId = async (
  accessToken,
  creatorId,
  limit,
  status
) => {
  try {
    const response = await axios.get(
      `${api_url}/post-registration/filter?status=${status}&creatorId=${creatorId}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const postRegistrations = response.data; // Cập nhật dòng này dựa trên cấu trúc dữ liệu trả về từ API của bạn
    return postRegistrations;
  } catch (error) {
    console.error(
      `Error while fetching post registrations for user with id ${creatorId}:`,
      error.message
    );
    throw error;
  }
};

export const getPostRegistrationByUserIds = async (
  accessToken,
  creatorId,
  limit,
) => {
  try {
    const response = await axios.get(
      `${api_url}/post-registration/filter?&creatorId=${creatorId}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const postRegistrations = response.data; // Cập nhật dòng này dựa trên cấu trúc dữ liệu trả về từ API của bạn
    return postRegistrations;
  } catch (error) {
    console.error(
      `Error while fetching post registrations for user with id ${creatorId}:`,
      error.message
    );
    throw error;
  }
};

export const getPostRegistrationByPostownerId = async (
  accessToken,
  postOwnerId,
  limit,
  status
) => {
  try {
    const response = await axios.get(
      `${api_url}/post-registration/filter?status=${status}&limit=${limit}&postOwnerId=${postOwnerId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const postRegistrations = response.data; // Cập nhật dòng này dựa trên cấu trúc dữ liệu trả về từ API của bạn
    return postRegistrations;
  } catch (error) {
    console.error(
      `Error while fetching post registrations for user with id ${postOwnerId}:`,
      error.message
    );
    throw error;
  }
};

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
    console.error("Error while fetching friends list:", error.message);
    throw error;
  }
};

export const getFollowing = async (accessToken) => {
  try {
    const response = await axios.get(`${api_url}/user/followings`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const followingList = response.data;
    return followingList;
  } catch (error) {
    console.error("Error while fetching friends list:", error.message);
    throw error;
  }
};

export const getFollower = async (accessToken) => {
  try {
    const response = await axios.get(`${api_url}/user/followers`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const followerList = response.data;
    return followerList;
  } catch (error) {
    console.error("Error while fetching friends list:", error.message);
    throw error;
  }
};

export const savePost = async (accessToken, postId) => {
  try {
    const response = await axios.post(
      `${api_url}/post/${postId}/save`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const savedPost = response.data;
    return savedPost;
  } catch (error) {
    console.error(`Error while saving post with id ${postId}:`, error.message);
    throw error;
  }
};

export const getSavedPostsByUser = async (accessToken) => {
  try {
    const response = await axios.get(`${api_url}/post/saved/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const savedPosts = response.data; // Cập nhật dòng này dựa trên cấu trúc dữ liệu trả về từ API của bạn
    return savedPosts;
  } catch (error) {
    console.error("Error while fetching saved posts:", error.message);
    throw error;
  }
};

export const getRegistrationsByPostId = async (accessToken, postId) => {
  try {
    const response = await axios.get(
      `${api_url}/post-registration/filter?postId=${postId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const registrations = response.data; // Update this line based on your API response structure
    return registrations;
  } catch (error) {
    console.error(
      `Error while fetching registrations for post with id ${postId}:`,
      error.message
    );
    throw error;
  }
};

export const getPostRegisByPostOwnerId = async (
  accessToken,
  postOwnerId,
  status
) => {
  try {
    const response = await axios.get(
      `${api_url}/post-registration/filter?status=${status}&postOwnerId=${postOwnerId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const postRegistrations = response.data; // Cập nhật dòng này dựa trên cấu trúc dữ liệu trả về từ API của bạn
    return postRegistrations;
  } catch (error) {
    console.error(
      `Error while fetching post registrations for post with id ${postOwnerId} and status ${status}:`,
      error.message
    );
    throw error;
  }
};

export const deleteRegisById = async (accessToken, regisId, data) => {
  try {
    const response = await axios.patch(
      `${api_url}/post-registration/${regisId}`,
      data, // Dữ liệu body được truyền vào PATCH
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const deletedRegis = response.data;
    return deletedRegis;
  } catch (error) {
    console.error(
      `Error while deleting registration with id ${regisId}:`,
      error.message
    );
    throw error;
  }
};

export const deleteRegisByIds = async (accessToken, regisId) => {
  try {
    const response = await axios.delete(
      `${api_url}/post-registration/${regisId}`, // Dữ liệu body được truyền vào PATCH
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const deletedRegis = response.data;
    return deletedRegis;
  } catch (error) {
    console.error(
      `Error while deleting registration with id ${regisId}:`,
      error.message
    );
    throw error;
  }
};

export const deletePost = async (accessToken, postId) => {
  try {
    const response = await axios.delete(`${api_url}/post/${postId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const deletedPost = response.data; // Update this line based on your API response structure
    return deletedPost;
  } catch (error) {
    console.error(
      `Error while deleting post with id ${postId}:`,
      error.message
    );
    throw error;
  }
};

export const updatePost = async (accessToken, postId, updateData) => {
  try {
    const response = await axios.patch(
      `${api_url}/post/${postId}`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const updatedPost = response.data; // Update this line based on your API response structure
    return updatedPost;
  } catch (error) {
    console.error(
      `Error while updating post with id ${postId}:`,
      error.message
    );
    throw error;
  }
}

export const updateStatusRegis = async (accessToken, regisId, status) => {
  try {
    const response = await axios.patch(
      `${api_url}/post-registration/${regisId}`,
      { status }, // Dữ liệu body được truyền vào PATCH
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const updatedRegis = response.data;
    return updatedRegis;
  } catch (error) {
    console.error(
      `Error while updating registration with id ${regisId}:`,
      error.message
    );
    throw error;
  }
}

export const CreateReview = async (accessToken, reviewData) => {
  try {
    const response = await axios.post(`${api_url}/review`, reviewData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const createdReview = response.data; // Update this line based on your API response structure
    return createdReview;
  } catch (error) {
    console.error("Error while creating review:", error.message);
    throw error;
  }
}

export const getReviewByPost = async (postId) => {
  try {
    const response = await axios.get(`${api_url}/review/filter?postId=${postId}`);
    const reviews = response.data; // Update this line based on your API response structure
    return reviews;
  } catch (error) {
    console.error(`Error while fetching reviews for post with id ${postId}:`, error.message);
    throw error;
  }
}

export const getPostByPostId = async (accessToken, postId) => {
  try {
    const response = await axios.get(`${api_url}/post/${postId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const PostById = response.data; // Cập nhật dòng này dựa trên cấu trúc dữ liệu trả về từ API của bạn
    return PostById;
  } catch (error) {
    console.error(
      `Error while fetching comments for post with id ${postId}:`,
      error.message
    );
    throw error;
  }
}

export const updateComment = async (accessToken, commentId, updateData) => {
  try {
    const response = await axios.patch(
      `${api_url}/comment/${commentId}`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const updatedComment = response.data;
    return updatedComment;
  } catch (error) {
    console.error(
      `Error while updating comment with id ${commentId}:`,
      error.message
    );
    throw error;
  }
}


export const deleteReview = async (accessToken, reviewId) => {
  try {
    const response = await axios.delete(`${api_url}/review/${reviewId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const deletedReview = response.data; // Update this line based on your API response structure
    return deletedReview;
  } catch (error) {
    console.error(`Error while deleting review with id ${reviewId}:`, error.message);
    throw error;
  }
}

export const updateReview = async (accessToken, reviewId, updateData) => {
  try {
    const response = await axios.patch(
      `${api_url}/review/${reviewId}`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const updatedReview = response.data; // Update this line based on your API response structure
    return updatedReview;
  } catch (error) {
    console.error(`Error while updating review with id ${reviewId}:`, error.message);
    throw error;
  }
}

export const deleteComment = async (accessToken, commentId) => {
  try {
    const response = await axios.delete(`${api_url}/comment/${commentId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const deletedComment = response.data; // Update this line based on your API response structure
    return deletedComment;
  } catch (error) {
    console.error(`Error while deleting comment with id ${commentId}:`, error.message);
    throw error;
  }
}

export const createReaction = async (accessToken, reactionData) => {
  try {
    const response = await axios.post(`${api_url}/reaction`, reactionData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // You can handle the response here if needed
    return response.data;
  } catch (error) {
    // Handle error, show a notification, or perform other actions
    throw new Error(`Error creating reaction: ${error.message}`);
  }
}

export const createReportByPostId = async (accessToken, reportData) => {
  try {
    const response = await axios.post(`${api_url}/report`, reportData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // You can handle the response here if needed
    return response.data;
  } catch (error) {
    // Handle error, show a notification, or perform other actions
    throw new Error(`Error creating reaction: ${error.message}`);
  }
}

export const getAllReaction = async (postId) => {
  try {
    const response = await axios.get(`${api_url}/reaction/post/${postId}`);
    const reactions = response.data; // Update this line based on your API response structure
    return reactions;
  } catch (error) {
    console.error(`Error while fetching reactions for post with id ${postId}:`, error.message);
    throw error;
  }
}

export const unsavePost = async (accessToken, postId) => {
  try {
    const response = await axios.delete(
      `${api_url}/post/${postId}/unsave`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const unsavedPost = response.data;
    return unsavedPost;
  } catch (error) {
    console.error(`Error while unsaving post with id ${postId}:`, error.message);
    throw error;
  }
}

export const getTopUser = async (weekNumber, accessToken) => {
  try {
    const response = await axios.get(`${api_url}/user/top?weekNumber=${weekNumber}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const topUsers = response.data; // Update this line based on your API response structure
    return topUsers;
  } catch (error) {
    console.error(`Error while fetching top users for week ${weekNumber}:`, error.message);
    throw error;
  }
}

export const getPostByCategoryId = async (categoryId, accessToken, limit) => {
  try {
    // Make a GET request to the API endpoint
    const response = await axios.get(
      `${api_url}/post/filter?categoryId=${categoryId}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Extract and return the data from the response
    const postsByCategoryId = response.data;
    return postsByCategoryId;
  } catch (error) {
    // Handle errors, log them, and throw the error
    console.error(`Error while fetching posts for category with id ${categoryId}:`, error.message);
    throw error;
  }
};

export const getchildByParentId = async (parentId) => {
  try {
    const response = await axios.get(`${api_url}/comment/parent/${parentId}`);
    const ParentId = response.data; // Cập nhật dòng này dựa trên cấu trúc dữ liệu trả về từ API của bạn
    return ParentId;
  } catch (error) {
    console.error(
      `Error while fetching comments for post with id ${parentId}:`,
      error.message
    );
    throw error;
  }
};

export const createNoficationRegisPost = async (accessToken, NoficationData) => {
  try {
    const response = await axios.post(`${api_url}/notification`, NoficationData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // You can handle the response here if needed
    return response.data;
  } catch (error) {
    // Handle error, show a notification, or perform other actions
    throw new Error(`Error creating reaction: ${error.message}`);
  }
}

export const getNofication = async (accessToken) => {
  try {
    const response = await axios.get(`${api_url}/notification/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const NoficationUser = response.data; // Cập nhật dòng này dựa trên cấu trúc dữ liệu trả về từ API của bạn
    return NoficationUser;
  } catch (error) {
    console.error("Error while fetching saved posts:", error.message);
    throw error;
  }
};
