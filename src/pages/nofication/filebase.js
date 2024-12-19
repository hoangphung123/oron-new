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
  const vapidKey =
    "BG9rfGGSzMchf_v8u3UIExBRsncMF2HCPyV3gsk7bXbofDYqYwapbeBaN6e_mQVLXvS8Ot8rWUaW-N1Q5UFUALo"; // VAPID key

  try {
    const currentToken = await getToken(messaging, { vapidKey });

    if (currentToken) {
      console.log("FCM Token generated:", currentToken);

      // Step 1: Check token in localStorage
      const storedToken = localStorage.getItem("fcm_token");

      if (!storedToken) {
        // No token in localStorage, send POST
        console.log("No FCM token in localStorage, sending POST...");

        const postUrl = "http://127.0.0.1:3500/api/v1/fcm-token";
        const postData = {
          deviceToken: currentToken,
        };

        const postResponse = await fetch(postUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authorization,
          },
          body: JSON.stringify(postData),
        });

        if (!postResponse.ok) {
          throw new Error("Failed to send token via POST.");
        }

        const postResponseData = await postResponse.json();
        console.log("Token sent via POST:", postResponseData);

        // Save token to localStorage after successful POST
        localStorage.setItem("fcm_token", currentToken);
      } else if (storedToken !== currentToken) {
        // Token in localStorage differs, send PATCH
        console.log("Stored token differs, sending PATCH...");

        const patchUrl = "http://127.0.0.1:3500/api/v1/fcm-token";
        const patchData = {
          deviceToken: currentToken,
        };

        const patchResponse = await fetch(patchUrl, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: authorization,
          },
          body: JSON.stringify(patchData),
        });

        if (!patchResponse.ok) {
          throw new Error("Failed to update token via PATCH.");
        }

        const patchResponseData = await patchResponse.json();
        console.log("Token updated via PATCH:", patchResponseData);

        // Update token in localStorage after successful PATCH
        localStorage.setItem("fcm_token", currentToken);
      } else {
        // Token in localStorage matches current token
        console.log(
          "Token in localStorage matches current token. No action needed."
        );
      }
    } else {
      console.log(
        "No registration token available. Request permission to generate one."
      );
    }
  } catch (error) {
    console.error("An error occurred while processing token:", error);
  }
};
