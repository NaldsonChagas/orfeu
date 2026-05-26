import { Injectable, Inject } from '@nestjs/common';
import type { Album } from '../domain/album.js';
import { ALBUM_SEARCH_PORT } from '../ports/album-search.port.js';
import type { AlbumSearchPort } from '../ports/album-search.port.js';
import { ALBUM_TAGS_PORT } from '../ports/album-tags.port.js';
import type { AlbumTagsPort } from '../ports/album-tags.port.js';

@Injectable()
export class AlbumSearchUseCase {
  constructor(
    @Inject(ALBUM_SEARCH_PORT)
    private readonly albumSearch: AlbumSearchPort,
    @Inject(ALBUM_TAGS_PORT)
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
