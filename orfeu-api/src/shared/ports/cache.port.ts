export const CACHE_PORT = 'CACHE_PORT';

export interface CachePort {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T, ttlMs: number): void;
  delete(key: string): void;
}
