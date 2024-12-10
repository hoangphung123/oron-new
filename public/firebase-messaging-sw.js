/* eslint-env worker */
/* global firebase */
/* eslint-env worker */
// Import the Firebase scripts required for Firebase Messaging
importScripts(
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js"
);

// Firebase configuration (replace with your config)
const firebaseConfig = {
  apiKey: "AIzaSyDML8UKIl3rHxz_tLVjUIDJR3VzOIAbRQA",
  authDomain: "oron-service.firebaseapp.com",
  projectId: "oron-service",
  storageBucket: "oron-service.firebasestorage.app",
  messagingSenderId: "769174652499",
  appId: "1:769174652499:web:2bc06961b9d88ba92768a6",
  measurementId: "G-FWY5EQWFFN",
};

// Initialize Firebase app in the Service Worker
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message: ",
    payload
  );

  // Customize the notification
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || "/firebase-logo.png", // Optional icon
  };

  return self.registration.showNotification(notificationTitle, notificationOptions); // eslint-disable-line no-restricted-globals
});
