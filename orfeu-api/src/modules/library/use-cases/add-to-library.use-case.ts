import { Injectable, Inject, ConflictException } from '@nestjs/common';
import type { LibraryItem } from '../domain/library-item.js';
import { LIBRARY_REPOSITORY_PORT } from '../ports/library-repository.port.js';
import type { LibraryRepositoryPort } from '../ports/library-repository.port.js';

@Injectable()
export class AddToLibraryUseCase {
  constructor(
    @Inject(LIBRARY_REPOSITORY_PORT)
    private readonly repository: LibraryRepositoryPort,
  ) {}

  async execute(item: LibraryItem): Promise<void> {
    const alreadyExists = await this.repository.exists(item.id);
    if (alreadyExists) {
      throw new ConflictException('Album already exists in library');
    }
    await this.repository.add(item);
  }
}
