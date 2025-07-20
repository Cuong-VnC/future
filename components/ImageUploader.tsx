
import React, { useState, useRef } from 'react';
import { type ImageFile } from '../types';
import { ImageIcon } from './icons/ImageIcon';

interface ImageUploaderProps {
  id: string;
  label: string;
  onFileSelect: (file: ImageFile | null) => void;
}

const fileToDataUrl = (file: File): Promise<ImageFile> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      if (base64String) {
          resolve({ name: file.name, base64: base64String, mimeType: file.type });
      } else {
          reject(new Error("Failed to read file as base64"));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const ImageUploader: React.FC<ImageUploaderProps> = ({ id, label, onFileSelect }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if(file.size > 4 * 1024 * 1024) { // 4MB limit for Gemini inline data
        alert("Kích thước tệp quá lớn. Vui lòng chọn tệp nhỏ hơn 4MB.");
        return;
      }
      setFileName(file.name);
      setPreview(URL.createObjectURL(file));
      try {
        const imageFile = await fileToDataUrl(file);
        onFileSelect(imageFile);
      } catch (error) {
        console.error("Error converting file:", error);
        onFileSelect(null);
      }
    } else {
      setPreview(null);
      setFileName(null);
      onFileSelect(null);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
      <div
        onClick={handleClick}
        className="mt-1 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md cursor-pointer hover:border-blue-500 transition-colors"
      >
        <div className="space-y-1 text-center">
          {preview ? (
            <img src={preview} alt="Preview" className="mx-auto h-20 w-auto object-contain rounded-md" />
          ) : (
            <ImageIcon className="mx-auto h-12 w-12 text-gray-500" />
          )}
          <div className="flex text-sm text-gray-500">
            <p className="pl-1">{fileName || 'Chọn một tệp ảnh'}</p>
          </div>
          <p className="text-xs text-gray-600">PNG, JPG, GIF tối đa 4MB</p>
        </div>
        <input id={id} name={id} type="file" ref={fileInputRef} className="sr-only" accept="image/*" onChange={handleFileChange} />
      </div>
    </div>
  );
};
