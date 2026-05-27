import type { AlbumDTO } from '@/types';
import { api } from './api';

export function getLibrary(): Promise<AlbumDTO[]> {
  return api.get<AlbumDTO[]>('/api/v1/library');
}

export function addToLibrary(
  album: Omit<AlbumDTO, 'tags'> & { tags: string[] },
): Promise<void> {
  return api.post<void>('/api/v1/library', album);
}

export function removeFromLibrary(id: string): Promise<void> {
  return api.delete<void>(`/api/v1/library/${encodeURIComponent(id)}`);
}