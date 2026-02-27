const CACHE_NAME = 'river-war-v99-final';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './player_jet.png',
  './bullet.png',
  './enemy_jet.png',
  './enemy_heli.png',
  './enemy_carrier.png',
  './explosion.png',
  './fuelstation.png',
  './fuelbar.png',
  './click.mp3',
  './explosion_1.mp3',
  './explosion_2.mp3',
  './powerup.mp3',
  './jump.mp3',
  './engine.mp3'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then(c => Promise.allSettled(ASSETS_TO_CACHE.map(url => c.add(url)))));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE_NAME ? caches.delete(k) : null))));
});

self.addEventListener('fetch', e => e.respondWith(caches.match(e.request).then(res => res || fetch(e.request))));