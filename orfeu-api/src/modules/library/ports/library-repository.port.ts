import type { LibraryItem } from '../domain/library-item.js';

export const LIBRARY_REPOSITORY_PORT = 'LIBRARY_REPOSITORY_PORT';

export interface LibraryRepositoryPort {
  add(item: LibraryItem): Promise<void>;
  remove(albumId: string): Promise<boolean>;
  getAll(): Promise<LibraryItem[]>;
  exists(albumId: string): Promise<boolean>;
}
