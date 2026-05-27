import { useState } from 'react';

interface RecommendationCardImageProps {
  src: string;
  alt: string;
}

function RecommendationCardImage({ src, alt }: RecommendationCardImageProps) {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
  };

  if (hasError || !src) {
    return (
      <div className="w-full aspect-square bg-surface-container flex flex-col items-center justify-center">
        <span className="material-symbols-outlined text-secondary mb-xs">
          broken_image
        </span>
        <p className="font-label-sm text-label-sm text-secondary text-center max-w-[120px]">
          Não foi possível carregar a capa do álbum
        </p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-full aspect-square object-cover"
      onError={handleError}
    />
  );
}

export default RecommendationCardImage;