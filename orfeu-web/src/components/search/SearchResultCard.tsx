import type { AlbumDTO } from '@/types';

interface SearchResultCardProps {
  album: AlbumDTO;
  isInLibrary: boolean;
  isAdding?: boolean;
  onAdd: (album: AlbumDTO) => void;
}

function SearchResultCard({
  album,
  isInLibrary,
  isAdding,
  onAdd,
}: SearchResultCardProps) {
  const isDisabled = isInLibrary || isAdding;

  return (
    <article className="flex items-center gap-sm bg-surface-container-lowest rounded-xl border border-surface-variant p-sm transition-shadow hover:shadow-sm">
      {album.imageUrl && (
        <img
          src={album.imageUrl}
          alt={`Capa do álbum ${album.name}`}
          className="h-16 w-16 rounded-lg object-cover shrink-0"
        />
      )}
      <div className="flex-1 min-w-0">
        <h3 className="font-title-md text-title-md text-on-surface truncate">
          {album.name}
        </h3>
        <p className="font-body-md text-body-md text-secondary truncate">
          {album.artist}
        </p>
        {album.tags.length > 0 && (
          <div className="flex gap-1 mt-xs flex-wrap">
            {album.tags.map((tag) => (
              <span
                key={tag}
                className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container px-xs py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <button
        type="button"
        className={`flex items-center gap-0.5 font-label-sm text-label-sm px-sm py-xs rounded-lg transition-colors ${
          isDisabled
            ? 'bg-surface-container text-on-surface-variant cursor-not-allowed'
            : 'bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container'
        }`}
        disabled={isDisabled}
        onClick={() => onAdd(album)}
      >
        <span className="material-symbols-outlined text-sm">
          {isInLibrary ? 'check' : 'add'}
        </span>
        {isInLibrary ? 'Adicionado' : isAdding ? 'Adicionando...' : 'Adicionar'}
      </button>
    </article>
  );
}

export default SearchResultCard;
