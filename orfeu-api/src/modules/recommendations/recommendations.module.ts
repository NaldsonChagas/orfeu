import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from '../../shared/shared.module.js';
import { AlbumsModule } from '../albums/albums.module.js';
import { RecommendationsAlbumsController } from './recommendations-albums.controller.js';
import { LastFMSimilarArtistsAdapter } from './adapters/lastfm-similar-artists.adapter.js';
import { LastFMTopAlbumsAdapter } from './adapters/lastfm-top-albums.adapter.js';
import { GetSimilarArtistsUseCase } from './use-cases/get-similar-artists.use-case.js';
import { CollectCandidatesUseCase } from './use-cases/collect-candidates.use-case.js';
import { GetRecommendationsUseCase } from './use-cases/get-recommendations.use-case.js';
import { SIMILAR_ARTISTS_PORT } from './ports/similar-artists.port.js';
import type { SimilarArtistsPort } from './ports/similar-artists.port.js';
import { TOP_ALBUMS_PORT } from './ports/top-albums.port.js';
import type { TopAlbumsPort } from './ports/top-albums.port.js';
import { ALBUM_TAGS_PORT } from '../albums/ports/album-tags.port.js';
import type { AlbumTagsPort } from '../albums/ports/album-tags.port.js';
import { LibraryModule } from '../library/library.module.js';
import { LIBRARY_REPOSITORY_PORT } from '../library/ports/library-repository.port.js';
import type { LibraryRepositoryPort } from '../library/ports/library-repository.port.js';
import { TagVectorBuilder } from './domain/tag-vector-builder.js';
import { CosineSimilarityCalculator } from './domain/cosine-similarity-calculator.js';
import { LibraryVectorService } from './domain/library-vector-service.js';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    SharedModule,
    LibraryModule,
    AlbumsModule,
  ],
  controllers: [RecommendationsAlbumsController],
  providers: [
    {
      provide: TagVectorBuilder,
      useFactory: (albumTags: AlbumTagsPort) => new TagVectorBuilder(albumTags),
      inject: [ALBUM_TAGS_PORT],
    },
    {
      provide: CosineSimilarityCalculator,
      useFactory: () => new CosineSimilarityCalculator(),
    },
    {
      provide: LibraryVectorService,
      useFactory: (
        tagVectorBuilder: TagVectorBuilder,
        cosineSimilarity: CosineSimilarityCalculator,
      ) => new LibraryVectorService(tagVectorBuilder, cosineSimilarity),
      inject: [TagVectorBuilder, CosineSimilarityCalculator],
    },
    {
      provide: GetSimilarArtistsUseCase,
      useFactory: (
        similarArtists: SimilarArtistsPort,
        libraryRepository: LibraryRepositoryPort,
      ) => new GetSimilarArtistsUseCase(similarArtists, libraryRepository),
      inject: [SIMILAR_ARTISTS_PORT, LIBRARY_REPOSITORY_PORT],
    },
    {
      provide: CollectCandidatesUseCase,
      useFactory: (
        topAlbums: TopAlbumsPort,
        libraryRepository: LibraryRepositoryPort,
      ) => new CollectCandidatesUseCase(topAlbums, libraryRepository),
      inject: [TOP_ALBUMS_PORT, LIBRARY_REPOSITORY_PORT],
    },
    {
      provide: GetRecommendationsUseCase,
      useFactory: (
        libraryRepository: LibraryRepositoryPort,
        getSimilarArtists: GetSimilarArtistsUseCase,
        collectCandidates: CollectCandidatesUseCase,
        libraryVectorService: LibraryVectorService,
      ) =>
        new GetRecommendationsUseCase(
          libraryRepository,
          getSimilarArtists,
          collectCandidates,
          libraryVectorService,
        ),
      inject: [
        LIBRARY_REPOSITORY_PORT,
        GetSimilarArtistsUseCase,
        CollectCandidatesUseCase,
        LibraryVectorService,
      ],
    },
    {
      provide: SIMILAR_ARTISTS_PORT,
      useClass: LastFMSimilarArtistsAdapter,
    },
    {
      provide: TOP_ALBUMS_PORT,
      useClass: LastFMTopAlbumsAdapter,
    },
  ],
})
export class RecommendationsModule {}
