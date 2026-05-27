import type { AlbumDTO } from '@/types';
import AlbumCard from './AlbumCard';

interface LibraryGridProps {
  albums: AlbumDTO[];
  isLoading: boolean;
  onRemove: (albumId: string) => void;
}

function LibraryGrid({ albums, isLoading, onRemove }: LibraryGridProps) {
  if (isLoading) {
    return (
      <section className="w-full max-w-2xl flex flex-col items-center justify-center py-xl">
        <p className="font-body-md text-body-md text-secondary text-center">
          Carregando sua biblioteca...
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
          library_music
        </span>
        <h2 className="font-title-md text-title-md text-primary mb-xs">
          Sua biblioteca está vazia
        </h2>
        <p className="font-body-md text-body-md text-secondary text-center max-w-sm">
          Adicione álbuns na sua biblioteca para começar a receber recomendações
          precisas.
        </p>
      </section>
    );
  }

  return (
    <section className="w-full max-w-2xl">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-sm">
        {albums.map((album) => (
          <AlbumCard key={album.id} album={album} onRemove={onRemove} />
        ))}
      </div>
    </section>
  );
}

export default LibraryGrid;
