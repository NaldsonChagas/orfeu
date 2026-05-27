import type { Album } from '../domain/album.js';
import type { AlbumSearchPort } from '../ports/album-search.port.js';
import type { AlbumTagsPort } from '../ports/album-tags.port.js';

export class AlbumSearchUseCase {
  constructor(
    private readonly albumSearch: AlbumSearchPort,
    private readonly albumTags: AlbumTagsPort,
  ) {}

  async execute(query: string): Promise<Album[]> {
    const albums = await this.albumSearch.search(query);

    const enriched = await Promise.all(
      albums.map(async (album) => {
        const tags = await this.albumTags.getTopTags(album.artist, album.name);
        return { ...album, tags };
      }),
    );

    return enriched;
  }
}
