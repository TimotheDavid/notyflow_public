importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const DB_NAME = 'NOTYFLOW';
const STORE_NAME = 'user_id';
const USER_ID_KEY = 'userId';
let userId = null;

// Initialize empty firebase config
let firebaseConfig = null;

// Handle background messages
self.addEventListener('push', function(event) {
  if (!event.data) return;

  const payload = event.data.json();
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };

  event.waitUntil(
    self.registration.showNotification(notificationTitle, notificationOptions)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  // Add your click handling logic here
  const clickedNotification = event.notification;
  // You can add custom click handling here
});

self.addEventListener('pushsubscriptionchange', function(event) {
  // Handle subscription change
  console.log('Subscription changed', event);
});

async function getUserIdFromDB() {
  const db = await new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(USER_ID_KEY);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

async function initializeFirebase() {
  if (userId) {
    try {
      const response = await fetch('http://localhost:4000/public/credentials', {
        method: 'POST',
        body: JSON.stringify({ userId }),
      });
      const result = await response.json();
      firebaseConfig = result.data;
      
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }
    } catch (error) {
      console.error('Failed to initialize Firebase:', error);
    }
  }
}

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    getUserIdFromDB()
      .then(storedUserId => {
        if (storedUserId) {
          userId = storedUserId;
          return initializeFirebase();
        }
      })
  );
});

// Activate event
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

// Message handler
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SET_USER_ID') {
    userId = event.data.userId;
    event.waitUntil(initializeFirebase());
  }
});
