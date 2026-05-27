export interface AlbumDTO {
  id: string;
  name: string;
  artist: string;
  coverUrl: string;
}

export interface LibraryItemDTO {
  id: string;
  title: string;
  type: 'album' | 'playlist';
}

export interface RecommendationDTO {
  id: string;
  title: string;
  reason: string;
}
