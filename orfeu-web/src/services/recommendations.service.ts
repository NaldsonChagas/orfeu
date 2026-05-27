import type { ScoredAlbumDTO } from '@/types';

const BASE_URL = import.meta.env.ORFEU_API_URL ?? '/api/v1';

export function subscribeRecommendations(
  onRecommendation: (album: ScoredAlbumDTO) => void,
): () => void {
  const eventSource = new EventSource(
    `${BASE_URL}/api/v1/albums/recommendations`,
  );

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data) as ScoredAlbumDTO;
      onRecommendation(data);
    } catch {
      // skip malformed JSON lines
    }
  };


  return () => {
    eventSource.close();
  };
}