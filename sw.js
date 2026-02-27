const CACHE_NAME = 'river-war-v12-final';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './player_jet.png',
  './bullet.png',
  './enemy_jet.png',
  './enemy_heli.png',
  './enemy_boat.png',
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

// Dosyaları yükleme aşaması
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // addAll yerine tek tek ekliyoruz ki tek bir dosya hatalıysa bile diğerleri yüklensin
      return Promise.allSettled(
        ASSETS_TO_CACHE.map(url => 
          cache.add(url).catch(err => console.log('Yüklenemedi: ' + url, err))
        )
      );
    })
  );
});

// Eski versiyonları temizleme
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
});

// Dosyaları sunma
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
