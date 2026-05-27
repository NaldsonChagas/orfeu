import type {
  TopAlbumsPort,
  CandidateAlbum,
} from '../ports/top-albums.port.js';
import type { LibraryRepositoryPort } from '../../library/ports/library-repository.port.js';

export class CollectCandidatesUseCase {
  constructor(
    private readonly topAlbums: TopAlbumsPort,
    private readonly libraryRepository: LibraryRepositoryPort,
  ) {}

  async execute(artists: { name: string }[]): Promise<CandidateAlbum[]> {
    const [albumsNested, library] = await Promise.all([
      Promise.all(
        artists.map((artist) => this.topAlbums.getTopAlbums(artist.name)),
      ),
      this.libraryRepository.getAll(),
    ]);

    const libraryKeys = new Set(
      library.map(
        (item) => `${item.artist.toLowerCase()}::${item.name.toLowerCase()}`,
      ),
    );

    const seen = new Set<string>();
    const result: CandidateAlbum[] = [];

    for (const albumList of albumsNested) {
      for (const album of albumList) {
        const key = `${album.artist.toLowerCase()}::${album.name.toLowerCase()}`;
        if (libraryKeys.has(key) || seen.has(key)) {
          continue;
        }
        seen.add(key);
        result.push(album);
      }
    }

    return result;
  }
}
