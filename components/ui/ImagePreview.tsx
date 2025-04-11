import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { Image } from '~/form/ui';

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
            <Image height={height} width={width} src={imageUrl} alt="preview" className="max-w-[90vw] max-h-[90vh]" hasPreview={false} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ImagePreview;
