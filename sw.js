const CACHE_NAME = 'river-war-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './assets/player_jet.png',
  './assets/Bullet.png',
  './assets/Enemy_Jet.png',
  './assets/Enemy_Heli.png',
  './assets/Enemy_Boat.png',
  './assets/Enemy_Carrier.png',
  './assets/explosion.png',
  './assets/FuelStation.png',
  './assets/FuelBar.png',
  './assets/click.mp3',
  './assets/explosion_1.mp3',
  './assets/explosion_2.mp3',
  './assets/powerup.mp3',
  './assets/jump.mp3',
  './assets/engine.mp3'
];

// Install Event: Cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// Fetch Event: Serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Activate Event: Cleanup old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});