const CACHE_NAME = 'river-war-v4';

// STRICTLY LOWERCASE PATHS
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

// Install Event: Cache assets robustly (won't crash on one missing file)
self.addEventListener('install', event => {
  // Force new service worker to take control immediately
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Opened cache:', CACHE_NAME);
        // Robust caching: If one fails, others still get cached
        // We use map to create an array of promises, but we handle catch individually
        const cachePromises = ASSETS_TO_CACHE.map(url => {
            return cache.add(url).catch(err => {
              console.warn('[SW] Failed to cache asset (skipping):', url, err);
              // We resolve successfully even if it failed, so Promise.all doesn't reject
              return Promise.resolve(); 
            });
        });
        
        return Promise.all(cachePromises);
      })
  );
});

// Activate Event: Cleanup old caches & Take Control
self.addEventListener('activate', event => {
  // Take control of all pages immediately
  event.waitUntil(clients.claim());
  
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
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
        // Cache hit - return response
        if (response) {
          return response;
        }
        // Clone the request because it's a stream and can only be consumed once
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          response => {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                // Only cache GET requests
                if (event.request.method === 'GET') {
                    cache.put(event.request, responseToCache);
                }
              });

            return response;
          }
        ).catch(err => {
            console.log('[SW] Fetch failed (offline?):', err);
        });
      })
  );
});