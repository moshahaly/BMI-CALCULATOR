importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDQIeBgqw4b5iSTN7_cQFp0y26QhNQoR64",
  authDomain: "bmi-calc-moshahaly-49e60.firebaseapp.com",
  projectId: "bmi-calc-moshahaly-49e60",
  storageBucket: "bmi-calc-moshahaly-49e60.firebasestorage.app",
  messagingSenderId: "734728219336",
  appId: "1:734728219336:web:fd9a508ec86492727693fd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'icon-192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});