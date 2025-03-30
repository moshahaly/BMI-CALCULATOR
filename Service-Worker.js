// Add this to the top of your service-worker.js
self.addEventListener('push', (event) => {
  const data = event.data?.json();
  const title = data?.title || 'BMI Calculator';
  const options = {
    body: data?.body || 'You have a new notification from BMI Calculator',
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    data: {
      url: data?.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow(event.notification.data.url);
    })
  );
});