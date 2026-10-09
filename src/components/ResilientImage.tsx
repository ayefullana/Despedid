import React, { useState } from 'react';
import { Cat, Music, Sparkles } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackType?: 'gato' | 'humano' | 'hero';
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = '',
  fallbackType = 'hero',
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-zinc-900 border border-zinc-700 text-zinc-200 p-4 ${className}`}
        role="img"
        aria-label={alt}
      >
        {fallbackType === 'gato' && <Cat className="w-10 h-10 text-zinc-200 mb-2" />}
        {fallbackType === 'humano' && <Music className="w-10 h-10 text-zinc-200 mb-2" />}
        {fallbackType === 'hero' && <Sparkles className="w-12 h-12 text-zinc-200 mb-2" />}
        <span className="text-xs text-zinc-400 text-center font-medium">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
