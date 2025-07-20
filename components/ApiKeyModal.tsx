
import React, { useState, useEffect } from 'react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string) => void;
  currentKey: string;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSave, currentKey }) => {
  const [apiKey, setApiKey] = useState(currentKey);

  useEffect(() => {
    setApiKey(currentKey);
  }, [currentKey, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (apiKey.trim()) {
      onSave(apiKey.trim());
    }
  };

  return (
    <div 
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 transition-opacity" 
        aria-modal="true" 
        role="dialog"
        onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md space-y-4 transform transition-all" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-blue-300">Cài đặt API Key</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
        </div>
        <p className="text-sm text-gray-400">
          Vui lòng nhập Google AI API Key của bạn để sử dụng ứng dụng. Key của bạn sẽ được lưu trữ an toàn trong bộ nhớ cục bộ của trình duyệt.
        </p>
        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-1">Google AI API Key</label>
          <input
            type="password"
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập API key của bạn tại đây"
          />
        </div>
        <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline">
          Lấy API Key của bạn từ Google AI Studio
        </a>
        <div className="pt-2">
          <button
            onClick={handleSave}
            disabled={!apiKey.trim()}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Lưu và Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
