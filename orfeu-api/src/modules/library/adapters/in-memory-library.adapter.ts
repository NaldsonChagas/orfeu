import { Injectable } from '@nestjs/common';
import type { LibraryItem } from '../domain/library-item.js';
import type { LibraryRepositoryPort } from '../ports/library-repository.port.js';

@Injectable()
export class InMemoryLibraryAdapter implements LibraryRepositoryPort {
  private readonly store: Map<string, LibraryItem> = new Map();

  add(item: LibraryItem): Promise<void> {
    this.store.set(item.id, item);
    return Promise.resolve();
  }

  remove(albumId: string): Promise<boolean> {
    return Promise.resolve(this.store.delete(albumId));
  }

  getAll(): Promise<LibraryItem[]> {
    return Promise.resolve(Array.from(this.store.values()));
  }

  exists(albumId: string): Promise<boolean> {
    return Promise.resolve(this.store.has(albumId));
  }
}
