import React, { useState } from "react";
import { useFormContext } from "react-hook-form";

interface ImageUploadFieldProps {
  name: string;
  label?: string;
  className?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  name,
  label,
  className,
}) => {
  const { setValue } = useFormContext();
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue(name, file, { shouldValidate: true });
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <label className="text-white font-semibold">{label}</label>}

      <div className="border border-gray-600 rounded-lg p-4 bg-gray-900 relative flex justify-center items-center">
        {preview ? (
          <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
        ) : (
          <span className="text-gray-400 text-sm">Tap to upload</span>
        )}
        <input
          type="file"
          accept="image/png, image/jpeg"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};
