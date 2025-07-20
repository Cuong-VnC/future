
import React, { useState, useRef } from 'react';
import { type TextFile } from '../types';
import { DocumentIcon } from './icons/DocumentIcon';

interface FileUploaderProps {
  id: string;
  label: string;
  onFileSelect: (file: TextFile | null) => void;
}

const fileToString = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsText(file);
    });
}

export const FileUploader: React.FC<FileUploaderProps> = ({ id, label, onFileSelect }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      try {
        const content = await fileToString(file);
        onFileSelect({ name: file.name, content });
      } catch (error) {
        console.error("Error reading file:", error);
        onFileSelect(null);
      }
    } else {
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
          <DocumentIcon className="mx-auto h-12 w-12 text-gray-500" />
          <div className="flex text-sm text-gray-500">
            <p className="pl-1">{fileName || 'Chọn một tệp'}</p>
          </div>
          <p className="text-xs text-gray-600">TXT, DOCX, PDF</p>
        </div>
        <input id={id} name={id} type="file" ref={fileInputRef} className="sr-only" accept=".txt,.pdf,.docx" onChange={handleFileChange} />
      </div>
    </div>
  );
};
