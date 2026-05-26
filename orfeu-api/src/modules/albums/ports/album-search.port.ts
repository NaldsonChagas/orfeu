import { Album } from '../domain/album.js';

export const ALBUM_SEARCH_PORT = 'ALBUM_SEARCH_PORT';

export interface AlbumSearchPort {
  search(query: string): Promise<Album[]>;
}
