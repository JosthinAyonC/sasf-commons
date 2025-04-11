import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Cropper from 'react-easy-crop';
import { FieldError, useFormContext } from 'react-hook-form';
import { FaPen } from 'react-icons/fa';
import { SimpleDialog } from '~/components/ui/SimpleDialog';
import { base64ToBlob } from '~/utils/Functions';

import { Image as ImageUi } from '../../components/ui';
import { Button } from './Button';
import { ImageUploadFieldProps } from './types';

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  name,
  label,
  labelClassName,
  className,
  sizeX = 300,
  sizeY = 200,
  isRequired = false,
  defaultZoom = 1,
  maxZoom = 3,
  cropLabel = 'Recortar Imagen',
  cancelLabel = 'Cancelar',
  saveLabel = 'Guardar',
  placeholder = 'Arrastra o haz clic para subir',
  draggText = 'Suelta la imagen',
  fileNotSupportedText = 'Solo se permiten imágenes en formato PNG o JPEG',
  defaultSrc,
  requiredMsg,
  maxFileSize = 1 * 1024 * 1024,
}) => {
  const {
    setValue,
    watch,
    register,
    formState: { errors },
  } = useFormContext();
  const error = errors[name] as FieldError | undefined;
  const [preview, setPreview] = useState<string | null>(defaultSrc || null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(defaultZoom);
  const [fileError, setFileError] = useState<string | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(defaultSrc || null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);

  useEffect(() => {
    register(name, { required: isRequired ? requiredMsg || 'La imagen es obligatoria' : false });
  }, [register, name, isRequired, requiredMsg]);

  useEffect(() => {
    const defaultSrc = watch(name);
    if (defaultSrc) {
      setPreview(defaultSrc);
      setImageSrc(defaultSrc);
    }
  }, [watch, name]);

  useEffect(() => {
    if (defaultSrc?.startsWith('data:image/')) {
      const blob = base64ToBlob(defaultSrc);
      const file = new File([blob], 'imagen-cargada.png', { type: blob.type });
      setPreview(URL.createObjectURL(file));
      setValue(name, file, { shouldValidate: isRequired });
    }
  }, [defaultSrc, setValue, name, isRequired]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setOriginalFile(file);
      const defaultSrc = URL.createObjectURL(file);
      setImageSrc(defaultSrc);
      setIsCropping(true);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/png': [], 'image/jpeg': [], 'image/svg+xml': [] },
    maxSize: maxFileSize,
    onDropRejected: (fileRejections) => {
      const rejectedBySize = fileRejections.find((rejection) => rejection.file.size > maxFileSize);

      if (rejectedBySize) {
        setFileError(`El archivo es demasiado grande. Tamaño máximo permitido: ${(maxFileSize / (1024 * 1024)).toFixed(2)}MB`);
      } else {
        setFileError(fileNotSupportedText);
      }
      setIsDragActive(false);
    },
    multiple: false,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    onDropAccepted: () => {
      setIsDragActive(false);
      setFileError(null);
    },
  });

  const getCroppedImg = async () => {
    if (!imageSrc || !croppedAreaPixels || !originalFile) return;

    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve) => (image.onload = resolve));

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    canvas.toBlob(async (blob) => {
      if (blob) {
        const croppedFile = new File([blob], originalFile.name, { type: originalFile.type });
        setPreview(URL.createObjectURL(croppedFile));
        setImageSrc(URL.createObjectURL(croppedFile));
        setValue(name, croppedFile, { shouldValidate: isRequired });
        setIsCropping(false);
      }
    }, originalFile.type);
  };

  return (
    <div className={`flex flex-col ${className}`} key={name}>
      {label && (
        <label className={`text-neutral-700 ${labelClassName}`} htmlFor={name}>
          {label} {isRequired && <span className="text-[var(--error)]">*</span>}
        </label>
      )}

      <div
        {...getRootProps()}
        className="border border-[var(--border)] rounded-lg bg-[var(--background)] flex justify-center items-center cursor-pointer relative"
        style={{ width: sizeX, height: sizeY }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <span className="text-[var(--font)] text-sm">{draggText}</span>
        ) : preview ? (
          <ImageUi src={preview} alt="preview" className="w-full h-full object-cover rounded-lg" />
        ) : watch(name) ? (
          <ImageUi src={watch(name)} alt="preview" className="w-full h-full object-cover rounded-lg" />
        ) : (
          <span className="text-[var(--font)] text-sm">{placeholder}</span>
        )}
        {(preview || watch(name)) && (
          <div
            className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 
               p-1.5 rounded-full cursor-pointer bg-[var(--secondaryalt)] 
               hover:bg-[var(--secondaryalthover)] shadow-lg"
          >
            <FaPen className="text-[var(--font)] text-xs" />
          </div>
        )}
      </div>
      {fileError && (
        <span className="text-[var(--error)] text-sm">
          <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
          {fileError}
        </span>
      )}
      {error && (
        <span className="text-[var(--error)] text-xs">
          <FontAwesomeIcon icon={faExclamationCircle} className="mr-2 mt-1" />
          {error.message}
        </span>
      )}

      <SimpleDialog isOpen={isCropping} onClose={() => setIsCropping(false)}>
        <h2 className="text-[var(--font)] font-semibold mb-2 text-center">{cropLabel}</h2>
        <div className="relative w-full h-64 bg-black/60 rounded-lg overflow-hidden">
          <Cropper
            image={imageSrc || undefined}
            crop={crop}
            zoom={zoom}
            aspect={sizeX / sizeY}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels)}
            minZoom={1}
            maxZoom={maxZoom}
          />
        </div>
        <div className="flex flex-col mt-4">
          <input type="range" min={1} max={maxZoom} step={0.1} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="w-full" />
          <div className="flex justify-between mt-4">
            <Button variant="danger" onClick={() => setIsCropping(false)}>
              {cancelLabel}
            </Button>
            <Button variant="primary" onClick={getCroppedImg}>
              {saveLabel}
            </Button>
          </div>
        </div>
      </SimpleDialog>
    </div>
  );
};
