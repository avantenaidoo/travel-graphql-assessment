// cacheUtils.ts
const cachesName = 'weather-app-cache-v1';

export const checkCache = async <T>(url: URL): Promise<T | null> => {
  // Open the cache using the updated cache name
  const cache = await caches.open(cachesName);
  
  // Check if the response is already in the cache
  const cachedResponse = await cache.match(url);

  if (cachedResponse) {
    // If a cached response exists, return the cached data as the generic type T
    const cachedData: T = await cachedResponse.json();
    return cachedData;
  }

  // If no cache, return null
  return null;
};
