import type { AlbumDTO } from '@/types';
import { removeFromLibrary } from '@/services/library.service';
import { useState } from 'react';

interface AlbumCardProps {
  album: AlbumDTO;
  onRemove: (albumId: string) => void;
}

function AlbumCard({ album, onRemove }: AlbumCardProps) {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await removeFromLibrary(album.id);
      onRemove(album.id);
    } catch {
      setIsRemoving(false);
    }
  };

  return (
    <article className="flex flex-col bg-surface-container-lowest rounded-xl border border-surface-variant overflow-hidden transition-shadow hover:shadow-sm">
      <img
        src={album.imageUrl}
        alt={`Capa do álbum ${album.name}`}
        className="w-full aspect-square object-cover"
      />
      <div className="flex flex-col p-sm gap-sm flex-1">
        <div className="flex-1 min-w-0">
          <h3 className="font-title-md text-title-md text-on-surface truncate">
            {album.name}
          </h3>
          <p className="font-body-md text-body-md text-secondary truncate">
            {album.artist}
          </p>
        </div>
        <button
          type="button"
          className={`flex items-center justify-center gap-0.5 font-label-sm text-label-sm px-sm py-xs rounded-lg transition-colors w-full ${
            isRemoving
              ? 'bg-surface-container text-on-surface-variant cursor-not-allowed'
              : 'bg-error-container text-on-error-container hover:bg-error hover:text-on-error'
          }`}
          disabled={isRemoving}
          onClick={handleRemove}
        >
          <span className="material-symbols-outlined text-sm">
            {isRemoving ? 'hourglass_empty' : 'remove_circle'}
          </span>
          {isRemoving ? 'Removendo...' : 'Remover'}
        </button>
      </div>
    </article>
  );
}

export default AlbumCard;
