class CacheManager<T> {
  private cache: Map<string, { data: T; expiration: number }>;

  constructor() {
    this.cache = new Map();
  }

  set(key: string, data: T, expiration: number = 60000) {
    const expirationTime = Date.now() + expiration;
    this.cache.set(key, { data, expiration: expirationTime });
  }

  get(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && cached.expiration > Date.now()) {
      return cached.data;
    }
    return null;
  }

  clear() {
    this.cache.clear();
  }
}

export const cacheManager = new CacheManager<unknown>();
