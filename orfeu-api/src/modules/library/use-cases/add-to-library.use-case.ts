import type { LibraryItem } from '../domain/library-item.js';
import { albumAlreadyExistsError } from '../errors/index.js';
import type { LibraryRepositoryPort } from '../ports/library-repository.port.js';

export class AddToLibraryUseCase {
  constructor(private readonly repository: LibraryRepositoryPort) {}

  async execute(item: LibraryItem): Promise<void> {
    const alreadyExists = await this.repository.exists(item.id);
    if (alreadyExists) {
      throw albumAlreadyExistsError(item.id);
    }
    await this.repository.add(item);
  }
}
