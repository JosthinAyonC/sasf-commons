import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { FaEye } from 'react-icons/fa';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  fallback?: string;
  alt: string;
  width?: number;
  height?: number;
  widthPreview?: number;
  heightPreview?: number;
  hasPreview?: boolean;
  previewLabel?: string;
}

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

  useEffect(() => {
    const img = new window.Image();
    img.src = src || fallback;

    img.onload = () => {
      setImgSrc(img.src);
      setIsLoading(false);
    };

    img.onerror = () => {
      setImgSrc(fallback);
      setIsLoading(false);
    };
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

interface ImagePreviewProps {
  isOpen: boolean;
  imageUrl: string | null;
  onClose: () => void;
  width?: number;
  height?: number;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ isOpen, imageUrl, onClose, width = 400, height = 400 }) => {
  return (
    <AnimatePresence>
      {isOpen && imageUrl && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-25 z-50" onClick={onClose}>
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-gray-800 text-white rounded-full flex items-center justify-center z-50"
          >
            <FontAwesomeIcon icon={faClose} className="text-xl" />
          </button>
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image height={height} width={width} src={imageUrl} alt="preview" className="max-w-[90vw] max-h-[90vh]" hasPreview={false} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
