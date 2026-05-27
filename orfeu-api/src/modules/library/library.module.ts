import { Module } from '@nestjs/common';
import { LibraryController } from './library.controller.js';
import { InMemoryLibraryAdapter } from './adapters/in-memory-library.adapter.js';
import { AddToLibraryUseCase } from './use-cases/add-to-library.use-case.js';
import { RemoveFromLibraryUseCase } from './use-cases/remove-from-library.use-case.js';
import { GetLibraryUseCase } from './use-cases/get-library.use-case.js';
import { LIBRARY_REPOSITORY_PORT } from './ports/library-repository.port.js';
import type { LibraryRepositoryPort } from './ports/library-repository.port.js';

@Module({
  controllers: [LibraryController],
  providers: [
    {
      provide: AddToLibraryUseCase,
      useFactory: (repository: LibraryRepositoryPort) =>
        new AddToLibraryUseCase(repository),
      inject: [LIBRARY_REPOSITORY_PORT],
    },
    {
      provide: RemoveFromLibraryUseCase,
      useFactory: (repository: LibraryRepositoryPort) =>
        new RemoveFromLibraryUseCase(repository),
      inject: [LIBRARY_REPOSITORY_PORT],
    },
    {
      provide: GetLibraryUseCase,
      useFactory: (repository: LibraryRepositoryPort) =>
        new GetLibraryUseCase(repository),
      inject: [LIBRARY_REPOSITORY_PORT],
    },
    {
      provide: LIBRARY_REPOSITORY_PORT,
      useClass: InMemoryLibraryAdapter,
    },
  ],
  exports: [LIBRARY_REPOSITORY_PORT],
})
export class LibraryModule {}
