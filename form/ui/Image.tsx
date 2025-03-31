import React, { useEffect, useState } from 'react';

import { ImageProps } from './types';

export const Image: React.FC<ImageProps> = ({
  src,
  fallback = 'https://omniarchivos.blob.core.windows.net/omniarchivos/7254461741893878347-imageSkeleton.jpeg',
  alt,
  width = 300,
  height = 200,
  className,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src || fallback);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setImgSrc(src || fallback);
    setIsLoading(true);
  }, [src, fallback]);

  return (
    <div className={`relative border rounded-sm ${className || ''}`} style={{ width: `${width}px`, height: `${height}px` }}>
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
    </div>
  );
};
