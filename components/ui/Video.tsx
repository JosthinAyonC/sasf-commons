import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { FaEye } from 'react-icons/fa';

interface VideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  width?: number;
  height?: number;
  fallback?: string;
  previewLabel?: string;
  widthPreview?: number;
  heightPreview?: number;
  hasPreview?: boolean;
  className?: string;
}

export const Video: React.FC<VideoProps> = ({
  src,
  fallback = '',
  width = 300,
  height = 200,
  widthPreview = 500,
  heightPreview = 300,
  previewLabel = 'Previsualización',
  hasPreview = false,
  className,
  ...props
}) => {
  const [videoSrc, setVideoSrc] = useState<string>(src || fallback);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOpenPreview, setIsOpenPreview] = useState<boolean>(false);

  useEffect(() => {
    setVideoSrc(src || fallback);
    setIsLoading(true);
  }, [src, fallback]);

  return (
    <div className={`relative rounded-sm group overflow-hidden ${className || ''}`} style={{ width: `${width}px`, height: `${height}px` }}>
      <VideoPreview isOpen={isOpenPreview} onClose={() => setIsOpenPreview(false)} videoUrl={videoSrc} width={widthPreview} height={heightPreview} />

      {isLoading && <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg"></div>}

      <video
        src={videoSrc}
        onLoadedData={() => setIsLoading(false)}
        onError={() => {
          setVideoSrc(fallback);
          setIsLoading(false);
        }}
        className={`w-full h-full object-cover rounded-lg ${isLoading ? 'invisible' : 'visible'}`}
        width={width}
        height={height}
        muted
        playsInline
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

interface VideoPreviewProps {
  isOpen: boolean;
  videoUrl: string | null;
  onClose: () => void;
  width?: number;
  height?: number;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ isOpen, videoUrl, onClose, width = 600, height = 400 }) => {
  return (
    <AnimatePresence>
      {isOpen && videoUrl && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-25 z-50" onClick={onClose}>
          <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 bg-gray-800 text-white rounded-full flex items-center justify-center z-50">
            <FontAwesomeIcon icon={faClose} className="text-xl" />
          </button>

          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <video src={videoUrl} controls autoPlay width={width} height={height} className="rounded-lg max-w-[90vw] max-h-[90vh]" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
