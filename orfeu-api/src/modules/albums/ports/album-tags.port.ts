export const ALBUM_TAGS_PORT = 'ALBUM_TAGS_PORT';

export interface AlbumTagsPort {
  getTopTags(artist: string, album: string): Promise<string[]>;
}
