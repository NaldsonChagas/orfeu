export const SIMILAR_ARTISTS_PORT = 'SIMILAR_ARTISTS_PORT';

export interface SimilarArtist {
  name: string;
  match: number;
}

export interface SimilarArtistsPort {
  getSimilar(artist: string): Promise<SimilarArtist[]>;
}
