import { albumNotFoundError } from '../errors/index.js';
import type { LibraryRepositoryPort } from '../ports/library-repository.port.js';

export class RemoveFromLibraryUseCase {
  constructor(private readonly repository: LibraryRepositoryPort) {}

  async execute(albumId: string): Promise<void> {
    const removed = await this.repository.remove(albumId);
    if (!removed) {
      throw albumNotFoundError(albumId);
    }
  }
}
