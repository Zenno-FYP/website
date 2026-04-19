/* eslint-disable no-undef */
importScripts(
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js',
);

firebase.initializeApp({
  apiKey: self.__FIREBASE_CONFIG__?.apiKey ?? '',
  authDomain: self.__FIREBASE_CONFIG__?.authDomain ?? '',
  projectId: self.__FIREBASE_CONFIG__?.projectId ?? '',
  storageBucket: self.__FIREBASE_CONFIG__?.storageBucket ?? '',
  messagingSenderId: self.__FIREBASE_CONFIG__?.messagingSenderId ?? '',
  appId: self.__FIREBASE_CONFIG__?.appId ?? '',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification ?? {};
  if (!title) return;

  const data = payload.data ?? {};
  self.registration.showNotification(title, {
    body: body ?? '',
    icon: '/icon-192.png',
    data,
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const data = event.notification.data ?? {};
  let url = '/notifications';
  if (data.type === 'chat_message' && data.conversationId) {
    url = `/chats`;
  }
  event.waitUntil(clients.openWindow(url));
});
