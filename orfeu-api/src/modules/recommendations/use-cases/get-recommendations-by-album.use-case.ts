import type { LibraryRepositoryPort } from '../../library/ports/library-repository.port.js';
import type { CollectCandidatesUseCase } from './collect-candidates.use-case.js';
import type { GetSimilarArtistsUseCase } from './get-similar-artists.use-case.js';
import { LibraryVectorService } from '../domain/library-vector-service.js';
import type { ScoredAlbum } from '../ports/scored-album.port.js';
import { EMPTY, from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export class GetRecommendationsByAlbumUseCase {
  constructor(
    private readonly libraryRepository: LibraryRepositoryPort,
    private readonly getSimilarArtists: GetSimilarArtistsUseCase,
    private readonly collectCandidates: CollectCandidatesUseCase,
    private readonly libraryVectorService: LibraryVectorService,
  ) {}

  execute(albumName: string): Observable<ScoredAlbum> {
    return from(this.libraryRepository.getAll()).pipe(
      switchMap((library) => {
        const album = library.find(
          (item) => item.name.toLowerCase() === albumName.toLowerCase(),
        );

        if (!album) {
          return EMPTY;
        }

        return from(this.getSimilarArtists.execute(album.artist)).pipe(
          switchMap((artists) => from(this.collectCandidates.execute(artists))),
          switchMap((candidates) =>
            this.libraryVectorService.scoreCandidatesStream(
              library,
              candidates,
            ),
          ),
        );
      }),
    );
  }
}
