import type { LibraryRepositoryPort } from '../../library/ports/library-repository.port.js';
import type { CollectCandidatesUseCase } from './collect-candidates.use-case.js';
import { LibraryVectorService } from '../domain/library-vector-service.js';
import type { ScoredAlbum } from '../ports/scored-album.port.js';
import type { SimilarArtist } from '../ports/similar-artists.port.js';

export class GetRecommendationsUseCase {
  constructor(
    private readonly libraryRepository: LibraryRepositoryPort,
    private readonly collectCandidates: CollectCandidatesUseCase,
    private readonly libraryVectorService: LibraryVectorService,
  ) {}

  async execute(similarArtists: SimilarArtist[]): Promise<ScoredAlbum[]> {
    const [library, candidates] = await Promise.all([
      this.libraryRepository.getAll(),
      this.collectCandidates.execute(similarArtists),
    ]);

    return this.libraryVectorService.scoreCandidates(library, candidates);
  }
}