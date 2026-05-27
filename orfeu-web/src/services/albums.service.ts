import type { AlbumDTO } from '@/types';
import { api } from './api';

export function searchAlbums(query: string): Promise<AlbumDTO[]> {
  return api.get<AlbumDTO[]>(`/api/v1/albums/search?q=${encodeURIComponent(query)}`);
}