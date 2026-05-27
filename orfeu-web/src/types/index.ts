export interface AlbumDTO {
  id: string;
  name: string;
  artist: string;
  imageUrl: string;
  tags: string[];
}

export interface ScoredAlbumDTO {
  name: string;
  artist: string;
  imageUrl: string;
  score: number;
}

export interface AddToLibraryDTO {
  id: string;
  name: string;
  artist: string;
  imageUrl: string;
  tags: string[];
}
