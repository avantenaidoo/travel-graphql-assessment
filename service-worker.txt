// Note: This is a basic service worker script that caches assets for offline use 
// Update public folder for the complete service worker script to work in deployment and dev mode
// Not to be used with the backend server

const cachesName = 'weather-app-cache-v1';
const urlsToCache = [
  '/',                        
  '/index.html',              
  '/assets/index.css',        
  '/images/favicon.jpeg',     
  '/images/clouds.png',       
  // Add other assets if needed
];

// Install the service worker and cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cachesName).then((cache) => {
      return cache.addAll(urlsToCache); // Pre-cache assets for offline use
    })
  );
});

// Activate the service worker and remove old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [cachesName];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName); // Clean up old caches
          }
        })
      );
    })
  );
});

// Fetch assets from the cache or network (with stale-while-revalidate)

// Helper function to handle caching logic
function handleCaching(event, urlWithoutAPIKey) {
  return caches.match(urlWithoutAPIKey).then((cachedResponse) => {
    const networkFetch = fetch(event.request).then((response) => {
      const responseClone = response.clone(); // Clone the response before caching

      // Cache the new response (without API key) if it's valid
      if (response.ok) {
        caches.open(cachesName).then((cache) => {
          cache.put(urlWithoutAPIKey, responseClone); // Cache the response without the API key
        });
      }

      return response; // Return the network response to the client
    });

    // Return cached response immediately (stale) and revalidate in the background
    return cachedResponse || networkFetch; // If no cached data, fetch from network
  }).catch(() => {
    return caches.match(event.request); // If both network and cache fail, show a fallback message
  });
}

// Listen for the fetch event
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  if (event.request.url.includes('api.weatherstack.com')) {
    // Strip the API key for weatherstack.com and create the URL without the key
    url.searchParams.delete('access_key'); // Safely delete the API key parameter
    let urlWithoutAPIKey = url.toString().toLowerCase(); // Build the URL without API key

    event.respondWith(handleCaching(event, urlWithoutAPIKey)); // Use the helper function

  } else if (event.request.url.includes('weather.visualcrossing.com')) {
    // Strip the API key for visualcrossing.com and create the URL without the key
    url.searchParams.delete('key'); // Safely delete the API key parameter
    let urlWithoutAPIKey = url.toString().toLowerCase(); // Build the URL without API key

    event.respondWith(handleCaching(event, urlWithoutAPIKey)); // Use the helper function

  } else {
    // Handle non-API requests (images, CSS, HTML, etc.)
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        // Return cached response if available or fetch from network
        return cachedResponse || fetch(event.request).then((response) => {
          return caches.open(cachesName).then((cache) => {
            cache.put(event.request, response.clone()); // Cache new response
            return response;
          });
        }).catch(() => {
          return caches.match(event.request); // If offline, return cached version
        });
      })
    );
  }
});