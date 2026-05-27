import RecommendationCardImage from './RecommendationCardImage';
import type { ScoredAlbumDTO } from '@/types';

interface RecommendationCardProps {
  album: ScoredAlbumDTO;
}

function RecommendationCard({ album }: RecommendationCardProps) {
  const scorePercent = Math.round(album.score * 100);

  return (
    <article className="flex flex-col bg-surface-container-lowest rounded-xl border border-surface-variant overflow-hidden transition-shadow hover:shadow-sm">
      <RecommendationCardImage
        src={album.imageUrl}
        alt={`Capa do álbum ${album.name}`}
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
        <div className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
          <span>match</span>
          <span>{scorePercent}% similar</span>
        </div>
      </div>
    </article>
  );
}

export default RecommendationCard;
