// Self-destruct: unregister any installed service worker
self.addEventListener('install', () => {
  self.skipWaiting();
});
self.addEventListener('activate', () => {
  self.registration.unregister()
    .then(() => console.log('SW unregistered'));
});
