import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Cropper from 'react-easy-crop';
import { useFormContext } from 'react-hook-form';
import { FaPen } from 'react-icons/fa';
import { SimpleDialog } from '~/components/ui/SimpleDialog';

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
  imageUrl,
}) => {
  const { setValue, watch } = useFormContext();
  const [preview, setPreview] = useState<string | null>(imageUrl || null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(defaultZoom);
  const [fileError, setFileError] = useState<string | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(imageUrl || null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);

  useEffect(() => {
    const imageUrl = watch(name);
    if (imageUrl) {
      setPreview(imageUrl);
      setImageSrc(imageUrl);
    }
  }, [watch, name]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setOriginalFile(file);
      const imageURL = URL.createObjectURL(file);
      setImageSrc(imageURL);
      setIsCropping(true);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/png': [], 'image/jpeg': [] },
    onDropRejected: () => {
      setFileError(fileNotSupportedText);
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

    canvas.toBlob((blob) => {
      if (blob) {
        const croppedFile = new File([blob], originalFile.name, { type: originalFile.type });
        setPreview(URL.createObjectURL(croppedFile));
        setValue(name, croppedFile, { shouldValidate: isRequired });
        setIsCropping(false);
      }
    }, originalFile.type);
  };

  return (
    <div className={`flex flex-col ${className}`} key={name}>
      {label && (
        <label className={`text-[var(--font)] ${labelClassName}`} htmlFor={name}>
          {label}
          {isRequired && ' *'}
        </label>
      )}

      <div
        {...getRootProps()}
        className="border border-[var(--border)] rounded-lg bg-[var(--background)] flex justify-center items-center cursor-pointer relative"
        style={{ width: sizeX, height: sizeY }}
      >
        <input {...getInputProps()} required={isRequired} />
        {isDragActive ? (
          <span className="text-[var(--font)] text-sm">{draggText}</span>
        ) : preview ? (
          <img src={preview} alt="preview" className="w-full h-full object-cover rounded-lg" />
        ) : watch(name) ? (
          <img src={watch(name)} alt="preview" className="w-full h-full object-cover rounded-lg" />
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
      {fileError && <span className="text-[var(--error)] text-sm">{fileError}</span>}

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
