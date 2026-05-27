import type {
  SimilarArtistsPort,
  SimilarArtist,
} from '../ports/similar-artists.port.js';
import type { LibraryRepositoryPort } from '../../library/ports/library-repository.port.js';

export class GetSimilarArtistsUseCase {
  constructor(
    private readonly similarArtists: SimilarArtistsPort,
    private readonly libraryRepository: LibraryRepositoryPort,
  ) {}

  async execute(artist: string): Promise<SimilarArtist[]> {
    const [similar, library] = await Promise.all([
      this.similarArtists.getSimilar(artist),
      this.libraryRepository.getAll(),
    ]);

    const libraryArtistNames = new Set(
      library.map((item) => item.artist.toLowerCase()),
    );

    return similar.filter((s) => !libraryArtistNames.has(s.name.toLowerCase()));
  }
}
