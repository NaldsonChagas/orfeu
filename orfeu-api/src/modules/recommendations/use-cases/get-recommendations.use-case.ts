import type { LibraryRepositoryPort } from '../../library/ports/library-repository.port.js';
import type { CollectCandidatesUseCase } from './collect-candidates.use-case.js';
import type { GetSimilarArtistsUseCase } from './get-similar-artists.use-case.js';
import { LibraryVectorService } from '../domain/library-vector-service.js';
import type { ScoredAlbum } from '../ports/scored-album.port.js';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export class GetRecommendationsUseCase {
  constructor(
    private readonly libraryRepository: LibraryRepositoryPort,
    private readonly getSimilarArtists: GetSimilarArtistsUseCase,
    private readonly collectCandidates: CollectCandidatesUseCase,
    private readonly libraryVectorService: LibraryVectorService,
  ) {}

  execute(): Observable<ScoredAlbum> {
    return from(this.libraryRepository.getAll()).pipe(
      switchMap((library) => {
        const uniqueArtists = [...new Set(library.map((item) => item.artist))];

        return from(
          Promise.all(
            uniqueArtists.map((artist) =>
              this.getSimilarArtists.execute(artist),
            ),
          ),
        ).pipe(
          map((artistsNested) => {
            const seen = new Set<string>();
            const flat: { name: string }[] = [];
            for (const list of artistsNested) {
              for (const artist of list) {
                const key = artist.name.toLowerCase();
                if (!seen.has(key)) {
                  seen.add(key);
                  flat.push(artist);
                }
              }
            }
            return flat;
          }),
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
