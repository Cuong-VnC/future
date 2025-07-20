
import React, { useState } from 'react';
import { InvestmentType, type UserInputData, type ImageFile, type TextFile } from '../types';
import { ImageUploader } from './ImageUploader';
import { FileUploader } from './FileUploader';

interface InputFormProps {
  onSubmit: (data: UserInputData) => void;
  isLoading: boolean;
  isApiKeySet: boolean;
}

const chartLabels = ['Biểu đồ 5 phút', 'Biểu đồ 15 phút', 'Biểu đồ 1 giờ', 'Biểu đồ 4 giờ', 'Biểu đồ 6 giờ'];

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading, isApiKeySet }) => {
  const [investmentType, setInvestmentType] = useState<InvestmentType>(InvestmentType.Future);
  const [capital, setCapital] = useState<number>(1000);
  const [holdingTime, setHoldingTime] = useState<string>('1 giờ');
  const [chartImages, setChartImages] = useState<(ImageFile | null)[]>(Array(5).fill(null));
  const [interfaceImage, setInterfaceImage] = useState<ImageFile | null>(null);
  const [document, setDocument] = useState<TextFile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (index: number, file: ImageFile | null) => {
    const newImages = [...chartImages];
    newImages[index] = file;
    setChartImages(newImages);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validChartImages = chartImages.filter(img => img !== null) as ImageFile[];
    if (validChartImages.length !== 5) {
      setError("Vui lòng tải lên đủ 5 ảnh biểu đồ giá.");
      return;
    }
    if (!interfaceImage) {
        setError("Vui lòng tải lên ảnh chụp giao diện đặt lệnh.");
        return;
    }
    if (capital <= 0) {
        setError("Số vốn phải là một số dương.");
        return;
    }

    onSubmit({
      investmentType,
      capital,
      holdingTime,
      chartImages: validChartImages,
      interfaceImage,
      document,
    });
  };

  const isSubmitDisabled = isLoading || !isApiKeySet;
  const submitButtonText = isLoading ? 'Đang phân tích...' : (isApiKeySet ? 'Nhận Gợi Ý Lệnh' : 'Vui lòng cài đặt API Key');

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-gray-800/50 p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-blue-300 mb-4 border-b border-gray-700 pb-2">Thông tin cơ bản</h2>
        <div className="space-y-4">
            <div>
                <label htmlFor="investmentType" className="block text-sm font-medium text-gray-300 mb-1">Loại hình đầu tư</label>
                <select id="investmentType" value={investmentType} onChange={(e) => setInvestmentType(e.target.value as InvestmentType)} className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value={InvestmentType.Future}>Future</option>
                    <option value={InvestmentType.Stocks}>Chứng khoán</option>
                </select>
            </div>
            <div>
                <label htmlFor="capital" className="block text-sm font-medium text-gray-300 mb-1">Số vốn hiện có (USD)</label>
                <input type="number" id="capital" value={capital} onChange={(e) => setCapital(parseFloat(e.target.value))} className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
                <label htmlFor="holdingTime" className="block text-sm font-medium text-gray-300 mb-1">Thời gian kỳ vọng giữ lệnh</label>
                <input type="text" id="holdingTime" value={holdingTime} onChange={(e) => setHoldingTime(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
        </div>
      </div>
      
      <div className="bg-gray-800/50 p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-blue-300 mb-4 border-b border-gray-700 pb-2">Tải lên dữ liệu</h2>
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium text-gray-300 mb-3">5 Biểu đồ giá thị trường</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {chartLabels.map((label, index) => (
                        <ImageUploader key={index} id={`chart-${index}`} label={label} onFileSelect={(file) => handleImageChange(index, file)} />
                    ))}
                </div>
            </div>
             <div>
                <h3 className="text-lg font-medium text-gray-300 mb-3">Giao diện đặt lệnh & Tài liệu</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ImageUploader id="interface-image" label="Ảnh giao diện đặt lệnh" onFileSelect={setInterfaceImage} />
                    <FileUploader id="document-upload" label="Tài liệu phân tích (.txt)" onFileSelect={setDocument} />
                 </div>
            </div>
        </div>
      </div>

      {error && <p className="text-red-400 text-center">{error}</p>}

      <button type="submit" disabled={isSubmitDisabled} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300">
        {submitButtonText}
      </button>
    </form>
  );
};
