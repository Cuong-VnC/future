
import React from 'react';
import { SettingsIcon } from './icons/SettingsIcon';

interface HeaderProps {
  onSettingsClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSettingsClick }) => (
  <header className="bg-gray-900/50 backdrop-blur-sm shadow-lg sticky top-0 z-10">
    <div className="container mx-auto px-4 py-4 max-w-5xl relative flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
          Chuyên Gia Tài Chính AI
        </h1>
        <p className="text-gray-400 mt-1">
          Phân tích và đề xuất chiến lược đầu tư thông minh
        </p>
      </div>
      <button 
        onClick={onSettingsClick} 
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
        aria-label="Cài đặt"
      >
        <SettingsIcon className="h-6 w-6" />
      </button>
    </div>
  </header>
);
