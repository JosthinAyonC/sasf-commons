import React, { useEffect, useState } from 'react';
import { FaEye } from 'react-icons/fa';
import ImagePreview from '~/components/ui/ImagePreview';

import { ImageProps } from './types';

export const Image: React.FC<ImageProps> = ({
  src,
  fallback = 'https://omniarchivos.blob.core.windows.net/omniarchivos/7254461741893878347-imageSkeleton.jpeg',
  alt,
  width = 300,
  height = 200,
  widthPreview = 300,
  heightPreview = 200,
  previewLabel = 'Previsualización',
  hasPreview = false,
  className,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src || fallback);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOpenPreview, setIsOpenPreview] = useState<boolean>(false);

  useEffect(() => {
    setImgSrc(src || fallback);
    setIsLoading(true);
  }, [src, fallback]);

  return (
    <div className={`relative rounded-sm group overflow-hidden ${className || ''}`} style={{ width: `${width}px`, height: `${height}px` }}>
      <ImagePreview isOpen={isOpenPreview} onClose={() => setIsOpenPreview(false)} imageUrl={imgSrc} width={widthPreview} height={heightPreview} />

      {isLoading && <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg"></div>}

      <img
        src={imgSrc}
        alt={alt}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImgSrc(fallback);
          setIsLoading(false);
        }}
        className={`w-full h-full object-cover rounded-lg ${isLoading ? 'invisible' : 'visible'}`}
        width={width}
        height={height}
        {...props}
      />

      {hasPreview && (
        <div
          onClick={() => setIsOpenPreview(true)}
          className="absolute inset-0 bg-black/30 backdrop-blur-sm text-white flex items-center justify-center flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
        >
          <FaEye className="w-6 h-6" />
          <span className="text-sm font-medium">{previewLabel}</span>
        </div>
      )}
    </div>
  );
};
