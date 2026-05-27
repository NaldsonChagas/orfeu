import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AlbumsController } from './albums.controller.js';
import { LastfmAlbumAdapter } from './adapters/lastfm-album.adapter.js';
import { AlbumSearchUseCase } from './use-cases/album-search.use-case.js';
import { ALBUM_SEARCH_PORT } from './ports/album-search.port.js';
import type { AlbumSearchPort } from './ports/album-search.port.js';
import { ALBUM_TAGS_PORT } from './ports/album-tags.port.js';
import type { AlbumTagsPort } from './ports/album-tags.port.js';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [AlbumsController],
  providers: [
    {
      provide: AlbumSearchUseCase,
      useFactory: (albumSearch: AlbumSearchPort, albumTags: AlbumTagsPort) =>
        new AlbumSearchUseCase(albumSearch, albumTags),
      inject: [ALBUM_SEARCH_PORT, ALBUM_TAGS_PORT],
    },
    {
      provide: ALBUM_SEARCH_PORT,
      useClass: LastfmAlbumAdapter,
    },
    {
      provide: ALBUM_TAGS_PORT,
      useClass: LastfmAlbumAdapter,
    },
  ],
})
export class AlbumsModule {}
