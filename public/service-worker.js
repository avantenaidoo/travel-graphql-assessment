const version = 2;
const cachesName = `weather-app-cache-v${version}`;
const CACHE_MAX_AGE = 60 * 60 * 1000; // 1 hour

const urlsToCache = [
    '/vants_weather_app/',
    '/vants_weather_app/index.html',
    '/vants_weather_app/images/favicon.jpeg',
    '/vants_weather_app/images/clouds.png',
    '/vants_weather_app/images/site.webmanifest',
];

// Install the service worker and cache assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        (async () => {
            try {
                const cache = await caches.open(cachesName);
                await cache.addAll(urlsToCache); // Cache assets during install
                console.log('Service Worker: All assets cached successfully.');
            } catch (error) {
                console.error('Service Worker: Caching failed during install:', error);
            }
        })()
    );
    self.skipWaiting(); // Make sure to activate the new service worker immediately
});

// Activate the service worker and remove old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        (async () => {
            const cacheWhitelist = [cachesName];

            try {
                const cacheNames = await caches.keys();
                const cachesToDelete = cacheNames.filter((cacheName) => !cacheWhitelist.includes(cacheName));
                await Promise.all(cachesToDelete.map((cacheName) => caches.delete(cacheName))); // Delete old caches
                console.log('Service Worker: Old caches cleaned up.');
                await clients.claim(); // Allow new service worker to claim clients
                console.log('Service Worker: Clients claimed by new service worker.');
            } catch (error) {
                console.error('Service Worker: Error during cache cleanup in activate event:', error);
            }
        })()
    );
});

// Fetch event: check if URLs are in cache and fetch if missing
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    const isApiRequest = url.pathname.includes('/api/');

    event.respondWith(
        caches.match(event.request)
            .then((cacheResponse) => {
                console.log('Fetch intercepted:', event.request.url, 'API:', isApiRequest);
                if (!navigator.onLine) {
                    console.log('Offline, serving cache:', !!cacheResponse);
                    return cacheResponse || new Response('Offline and resource not found in cache', { status: 404 });
                }

                if (isApiRequest) {
                    console.log('API cache exists:', !!cacheResponse);
                    if (cacheResponse) {
                        const cachedTimestamp = cacheResponse.headers.get('date');
                        console.log('API cache timestamp:', cachedTimestamp);
                        if (cachedTimestamp) {
                            const cacheAge = Date.now() - new Date(cachedTimestamp).getTime();
                            console.log('API cache age:', cacheAge, 'vs', CACHE_MAX_AGE);
                            if (cacheAge < CACHE_MAX_AGE) {
                                console.log('Serving fresh API cache');
                                return cacheResponse;
                            }
                            console.log('API cache stale, deleting and fetching');
                            return caches.delete(event.request).then(() => {
                                return fetchAndCache(event.request);
                            });
                        }
                        console.log('API cache no timestamp, deleting and fetching');
                        return caches.delete(event.request).then(() => {
                            return fetchAndCache(event.request);
                        });
                    }
                    console.log('No API cache, fetching');
                    return fetchAndCache(event.request);
                } else {
                    console.log('Non-API cache exists:', !!cacheResponse);
                    if (cacheResponse) {
                        const cachedTimestamp = cacheResponse.headers.get('date');
                        console.log('Non-API cache timestamp:', cachedTimestamp);
                        if (cachedTimestamp) {
                            const cacheAge = Date.now() - new Date(cachedTimestamp).getTime();
                            console.log('Non-API cache age:', cacheAge, 'vs', CACHE_MAX_AGE);
                            if (cacheAge < CACHE_MAX_AGE) {
                                console.log('Serving fresh non-API cache');
                                return cacheResponse;
                            }
                        }
                        console.log('Non-API stale or no timestamp, fetching');
                        return fetchAndCache(event.request);
                    }
                    console.log('No non-API cache, fetching');
                    return fetchAndCache(event.request);
                }
            })
            .catch((error) => {
                console.log('Fetch error:', error);
                return new Response('Error during fetch process', { status: 502 });
            })
    );
});

// Function to fetch and cache a request
async function fetchAndCache(request) {
    try {
        const fetchResponse = await fetch(request);
        const cache = await caches.open(cachesName);
        const fetchResponseClone = fetchResponse.clone();
        await cache.put(request, fetchResponseClone); // Cache the fresh response
        checkAndCacheAssets(); // Check and cache missing assets in the background
        return fetchResponse; // Return fresh network data
    } catch (err) {
        const url = new URL(request.url);
        const isApiRequest = url.pathname.startsWith('/api/');
        if (isApiRequest) {
            return new Response('Network request failed for /api/, try again', { status: 502 });
        } else {
            return new Response('Network request failed for assets', { status: 502 });
        }

    }
}

// Check and cache missing assets from urlsToCache (background caching)
async function checkAndCacheAssets() {
    const cache = await caches.open(cachesName);
    for (const url of urlsToCache) {
        const cachedAsset = await cache.match(url);
        if (!cachedAsset) {
            try {
                const response = await fetch(url);
                if (response.ok) {
                    await cache.put(url, response.clone()); // Cache the missing asset
                }
            } catch (err) {
                console.error(`Failed to fetch and cache ${url}:`, err);
            }
        }
    }
}