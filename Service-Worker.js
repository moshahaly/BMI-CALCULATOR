// Cache name - increment version when updating
const CACHE_NAME = 'bmi-calculator-v2';

// Files to cache - ensure all resources are listed
const FILES_TO_CACHE = [
'/', // Root index.html
'/index.html', // Explicitly cache HTML
'/icon-192.png', // Icon for manifest
'/icon-512.png', // Larger icon for manifest
'/manifest.json' // Manifest file
];

// Install event - cache all files
self.addEventListener('install', (event) => {
console.log('Service Worker: Installing...');
event.waitUntil(
caches.open(CACHE_NAME).then((cache) => {
console.log('Service Worker: Caching files');
return cache.addAll(FILES_TO_CACHE)
.then(() => {
console.log('Service Worker: All files cached');
})
.catch((err) => {
console.error('Service Worker: Cache failed:', err);
});
})
);
self.skipWaiting(); // Activate immediately
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
console.log('Service Worker: Activating...');
event.waitUntil(
caches.keys().then((cacheNames) => {
return Promise.all(
cacheNames.map((cacheName) => {
if (cacheName !== CACHE_NAME) {
console.log('Service Worker: Deleting old cache:', cacheName);
return caches.delete(cacheName);
}
})
);
})
);
self.clients.claim(); // Take control of clients immediately
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
console.log('Service Worker: Fetching:', event.request.url);
event.respondWith(
caches.match(event.request).then((cachedResponse) => {
// Return cached response if available
if (cachedResponse) {
console.log('Service Worker: Serving from cache:', event.request.url);
return cachedResponse;
}

// Fetch from network if not in cache
return fetch(event.request).then((networkResponse) => {
// Only cache successful responses
if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
return networkResponse;
}

// Clone the response to cache it
const responseToCache = networkResponse.clone();
caches.open(CACHE_NAME).then((cache) => {
cache.put(event.request, responseToCache);
});

return networkResponse;
}).catch((err) => {
console.error('Service Worker: Fetch failed:', err);
// Optional: Return a custom offline page or fallback
return caches.match('/index.html'); // Fallback to cached HTML
});
})
);
});