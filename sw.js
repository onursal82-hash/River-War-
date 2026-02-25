const CACHE_NAME = 'river-war-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './assets/player_jet.png',
  './assets/bullet.png',
  './assets/enemy_jet.png',
  './assets/enemy_heli.png',
  './assets/enemy_carrier.png',
  './assets/explosion.png',
  './assets/fuelstation.png',
  './assets/fuelbar.png',
  './assets/click.mp3',
  './assets/explosion_1.mp3',
  './assets/explosion_2.mp3',
  './assets/powerup.mp3',
  './assets/jump.mp3',
  './assets/engine.mp3'
];

// Install Event: Cache assets robustly
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Robust caching: If one fails, others still get cached
        return Promise.all(
          ASSETS_TO_CACHE.map(url => {
            return cache.add(url).catch(err => {
              console.warn('Failed to cache asset:', url, err);
            });
          })
        );
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