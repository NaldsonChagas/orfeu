import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from '../../shared/shared.module.js';
import { RecommendationsController } from './recommendations.controller.js';
import { LastFMSimilarArtistsAdapter } from './adapters/lastfm-similar-artists.adapter.js';
import { GetSimilarArtistsUseCase } from './use-cases/get-similar-artists.use-case.js';
import { SIMILAR_ARTISTS_PORT } from './ports/similar-artists.port.js';
import type { SimilarArtistsPort } from './ports/similar-artists.port.js';
import { LibraryModule } from '../library/library.module.js';
import { LIBRARY_REPOSITORY_PORT } from '../library/ports/library-repository.port.js';
import type { LibraryRepositoryPort } from '../library/ports/library-repository.port.js';

@Module({
  imports: [HttpModule, ConfigModule, SharedModule, LibraryModule],
  controllers: [RecommendationsController],
  providers: [
    {
      provide: GetSimilarArtistsUseCase,
      useFactory: (
        similarArtists: SimilarArtistsPort,
        libraryRepository: LibraryRepositoryPort,
      ) => new GetSimilarArtistsUseCase(similarArtists, libraryRepository),
      inject: [SIMILAR_ARTISTS_PORT, LIBRARY_REPOSITORY_PORT],
    },
    {
      provide: SIMILAR_ARTISTS_PORT,
      useClass: LastFMSimilarArtistsAdapter,
    },
  ],
})
export class RecommendationsModule {}
