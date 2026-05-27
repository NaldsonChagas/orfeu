export const TOP_ALBUMS_PORT = 'TOP_ALBUMS_PORT';

export interface CandidateAlbum {
  name: string;
  artist: string;
  imageUrl: string;
}

export interface TopAlbumsPort {
  getTopAlbums(artist: string): Promise<CandidateAlbum[]>;
}
