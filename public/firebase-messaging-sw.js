/* eslint-disable no-undef */
importScripts(
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js',
);

// Firebase config is injected at registration time via URL query string.
// The client passes it like:
//   navigator.serviceWorker.register('/firebase-messaging-sw.js?apiKey=...&authDomain=...')
const params = new URL(self.location.href).searchParams;
const firebaseConfig = {
  apiKey: params.get('apiKey') || '',
  authDomain: params.get('authDomain') || '',
  projectId: params.get('projectId') || '',
  storageBucket: params.get('storageBucket') || '',
  messagingSenderId: params.get('messagingSenderId') || '',
  appId: params.get('appId') || '',
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.warn(
    '[firebase-messaging-sw] Firebase config missing from registration query string; background notifications disabled.',
  );
} else {
  firebase.initializeApp(firebaseConfig);
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
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const data = event.notification.data ?? {};
  let url = '/notifications';
  if (data.type === 'chat_message') {
    url = '/chats';
  } else if (data.type === 'new_project' && data.projectName) {
    url = `/projects/${encodeURIComponent(data.projectName)}`;
  }
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    }),
  );
});
