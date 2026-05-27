import { Injectable, Inject } from '@nestjs/common';
import type { LibraryItem } from '../domain/library-item.js';
import { LIBRARY_REPOSITORY_PORT } from '../ports/library-repository.port.js';
import type { LibraryRepositoryPort } from '../ports/library-repository.port.js';

@Injectable()
export class GetLibraryUseCase {
  constructor(
    @Inject(LIBRARY_REPOSITORY_PORT)
    private readonly repository: LibraryRepositoryPort,
  ) {}

  async execute(): Promise<LibraryItem[]> {
    return this.repository.getAll();
  }
}
