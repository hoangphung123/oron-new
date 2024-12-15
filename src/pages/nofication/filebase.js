import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";


// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDML8UKIl3rHxz_tLVjUIDJR3VzOIAbRQA",
  authDomain: "oron-service.firebaseapp.com",
  projectId: "oron-service",
  storageBucket: "oron-service.firebasestorage.app",
  messagingSenderId: "769174652499",
  appId: "1:769174652499:web:2bc06961b9d88ba92768a6",
  measurementId: "G-FWY5EQWFFN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get a reference to the service
export const messaging = getMessaging(app);

// Access token for authorization
const accessToken = JSON.parse(localStorage.getItem("access_token"));
const authorization = `Bearer ${accessToken}`;

// Function to get and send FCM token to the backend
export const getAndSendTokenToBackend = async () => {
  const vapidKey = "BG9rfGGSzMchf_v8u3UIExBRsncMF2HCPyV3gsk7bXbofDYqYwapbeBaN6e_mQVLXvS8Ot8rWUaW-N1Q5UFUALo"; // Replace with your VAPID key

  try {
    const currentToken = await getToken(messaging, { vapidKey });

    if (currentToken) {
      console.log("FCM Token:", currentToken);

      // Define API endpoint and payload
      const url = "http://127.0.0.1:3500/api/v1/fcm-token";
      const data = {
        deviceToken: currentToken,
      };

      // Send token to the backend
      // const response = await fetch(url, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: authorization,
      //   },
      //   body: JSON.stringify(data),
      // });

      // if (!response.ok) {
      //   throw new Error("Network response was not ok");
      // }

      // const responseData = await response.json();
      // console.log("Success:", responseData); // Handle response data
    } else {
      console.log(
        "No registration token available. Request permission to generate one."
      );
    }
  } catch (error) {
    console.error("An error occurred while sending token:", error);
  }
};
