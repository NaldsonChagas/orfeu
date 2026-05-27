import type { AlbumDTO } from '@/types';
import { api } from './api';

export function getLibrary(): Promise<AlbumDTO[]> {
  return api.get<AlbumDTO[]>('/library');
}

export function addToLibrary(
  album: Omit<AlbumDTO, 'tags'> & { tags: string[] },
): Promise<void> {
  return api.post<void>('/library', album);
}

export function removeFromLibrary(id: string): Promise<void> {
  return api.delete<void>(`/library/${encodeURIComponent(id)}`);
}