import type { LibraryRepositoryPort } from '../../library/ports/library-repository.port.js';
import type { CollectCandidatesUseCase } from './collect-candidates.use-case.js';
import type { GetSimilarArtistsUseCase } from './get-similar-artists.use-case.js';
import { LibraryVectorService } from '../domain/library-vector-service.js';
import type { ScoredAlbum } from '../ports/scored-album.port.js';

export class GetRecommendationsByAlbumUseCase {
  constructor(
    private readonly libraryRepository: LibraryRepositoryPort,
    private readonly getSimilarArtists: GetSimilarArtistsUseCase,
    private readonly collectCandidates: CollectCandidatesUseCase,
    private readonly libraryVectorService: LibraryVectorService,
  ) {}

  async execute(albumName: string): Promise<ScoredAlbum[]> {
    const library = await this.libraryRepository.getAll();

    const album = library.find(
      (item) => item.name.toLowerCase() === albumName.toLowerCase(),
    );

    if (!album) {
      return [];
    }

    const similarArtists = await this.getSimilarArtists.execute(album.artist);

    const candidates = await this.collectCandidates.execute(similarArtists);

    return this.libraryVectorService.scoreCandidates(library, candidates);
  }
}
