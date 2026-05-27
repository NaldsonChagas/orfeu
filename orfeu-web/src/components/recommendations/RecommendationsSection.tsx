import { useState, useEffect } from 'react';
import type { ScoredAlbumDTO } from '@/types';
import { subscribeRecommendations } from '@/services/recommendations.service';
import RecommendationCard from './RecommendationCard';

function RecommendationsSection() {
  const [albums, setAlbums] = useState<ScoredAlbumDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeRecommendations(
      (album) => {
        setAlbums((prev) => {
          const albumExists = prev.some(
            (a) => a.name === album.name && a.artist === album.artist,
          );
          if (albumExists || prev.length >= 50) {
            return prev;
          }
          return [...prev, album];
        });
        if (isLoading) {
          setIsLoading(false);
        }
      },
      (errorMessage) => {
        setError(errorMessage);
        setIsLoading(false);
      },
      () => {
        setIsLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  if (isLoading) {
    return (
      <section className="w-full max-w-2xl flex flex-col items-center justify-center py-xl">
        <p className="font-body-md text-body-md text-secondary text-center">
          Carregando recomendações...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full max-w-2xl flex flex-col items-center justify-center py-xl">
        <p className="font-body-md text-body-md text-secondary text-center">
          {error}
        </p>
      </section>
    );
  }

  if (albums.length === 0) {
    return (
      <section className="w-full max-w-2xl flex flex-col items-center justify-center py-xl border border-surface-variant rounded-xl bg-surface-container-low/30 backdrop-blur-sm">
        <span
          className="material-symbols-outlined text-secondary mb-md"
          style={{ fontSize: 48, fontVariationSettings: "'wght' 200" }}
        >
          music_note
        </span>
        <h2 className="font-title-md text-title-md text-primary mb-xs">
          Nenhuma recomendação ainda
        </h2>
        <p className="font-body-md text-body-md text-secondary text-center max-w-sm">
          Adicione mais álbuns à sua biblioteca para receber recomendações
          personalizadas.
        </p>
      </section>
    );
  }

  return (
    <section className="w-full max-w-2xl">
      <h2 className="font-title-lg text-title-lg text-on-surface mb-sm">
        Recomendações para você
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-sm">
        {albums.map((album) => (
          <RecommendationCard
            key={`${album.name}-${album.artist}`}
            album={album}
          />
        ))}
      </div>
    </section>
  );
}

export default RecommendationsSection;