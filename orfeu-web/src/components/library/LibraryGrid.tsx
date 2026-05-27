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
      <section className="empty-state">
        <span className="material-symbols-outlined empty-state-icon">
          library_music
        </span>
        <h2 className="empty-state-title">Sua biblioteca está vazia</h2>
        <p className="empty-state-description">
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
