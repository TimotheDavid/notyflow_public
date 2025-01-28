// Import and configure the Firebase SDK
// These scripts are made available when the app is served or deployed on Firebase Hosting
// If you do not serve/host your project using Firebase Hosting see https://firebase.google.com/docs/web/setup

importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js');




firebase.initializeApp({
  apiKey: "AIzaSyCCL-xbmVszB4osFE8qlrQW8IZM__5HjVQ",
  authDomain: "spush-35d6a.firebaseapp.com",
  projectId: "spush-35d6a",
  storageBucket: "spush-35d6a.firebasestorage.app",
  messagingSenderId: "316988662055",
  appId: "1:316988662055:web:0660538cd7e0976bb04902",
  measurementId: "G-M18SSDXF78",
});

const messaging = firebase.messaging();

// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// Keep in mind that FCM will still show notification messages automatically
// and you should use data messages for custom notifications.
// For more info see:
// https://firebase.google.com/docs/cloud-messaging/concept-options
messaging.onBackgroundMessage(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: payload.data.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});


