import type { ScoredAlbumDTO } from '@/types';
import { api } from './api';

export function getRecommendations(): Promise<ScoredAlbumDTO[]> {
  return api.get<ScoredAlbumDTO[]>('/albums/recommendations');
}