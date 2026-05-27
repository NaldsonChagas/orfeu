import type { LibraryItem } from '../domain/library-item.js';
import type { LibraryRepositoryPort } from '../ports/library-repository.port.js';

export class GetLibraryUseCase {
  constructor(private readonly repository: LibraryRepositoryPort) {}

  async execute(): Promise<LibraryItem[]> {
    return this.repository.getAll();
  }
}
