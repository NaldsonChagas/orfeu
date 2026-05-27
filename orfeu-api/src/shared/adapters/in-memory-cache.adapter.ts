import { Injectable } from '@nestjs/common';
import type { CachePort } from '../ports/cache.port.js';

@Injectable()
export class InMemoryCacheAdapter implements CachePort {
  private readonly store = new Map<
    string,
    { value: unknown; expiresAt: number }
  >();

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry || Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value as T;
  }

  set<T>(key: string, value: T, ttlMs: number): void {
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  delete(key: string): void {
    this.store.delete(key);
  }
}
