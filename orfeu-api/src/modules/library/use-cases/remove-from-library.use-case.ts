import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { LIBRARY_REPOSITORY_PORT } from '../ports/library-repository.port.js';
import type { LibraryRepositoryPort } from '../ports/library-repository.port.js';

@Injectable()
export class RemoveFromLibraryUseCase {
  constructor(
    @Inject(LIBRARY_REPOSITORY_PORT)
    private readonly repository: LibraryRepositoryPort,
  ) {}

  async execute(albumId: string): Promise<void> {
    const removed = await this.repository.remove(albumId);
    if (!removed) {
      throw new NotFoundException('Album not found in library');
    }
  }
}
