
import React from 'react';
import { type AIResult } from '../types';
import { Loader } from './Loader';

interface ResultDisplayProps {
  result: AIResult | null;
  isLoading: boolean;
  error: string | null;
}

const ResultCard: React.FC<{ title: string; value: string | undefined; className?: string }> = ({ title, value, className }) => (
    <div className={`bg-gray-800 p-4 rounded-lg ${className}`}>
        <h4 className="text-sm font-medium text-gray-400">{title}</h4>
        <p className="text-lg font-semibold text-white">{value || '---'}</p>
    </div>
);

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, isLoading, error }) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <Loader />
          <p className="mt-4 text-lg text-blue-300 animate-pulse">AI đang phân tích dữ liệu...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center bg-red-900/20 border border-red-500 rounded-lg p-6">
          <p className="text-red-400 font-semibold">Đã xảy ra lỗi</p>
          <p className="text-gray-300 mt-2">{error}</p>
        </div>
      );
    }

    if (!result) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center bg-gray-800/50 rounded-lg p-6">
          <p className="text-gray-400">Kết quả phân tích sẽ được hiển thị ở đây.</p>
        </div>
      );
    }

    if (!result.shouldTrade) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center bg-yellow-900/20 border border-yellow-500 rounded-lg p-6">
                <p className="text-xl font-bold text-yellow-300">Cảnh báo</p>
                <p className="text-gray-300 mt-2">{result.noTradeReason || "Không nên vào lệnh lúc này. Hãy chờ thêm tín hiệu rõ ràng hơn."}</p>
            </div>
        );
    }
    
    const { recommendation } = result;

    if (!recommendation) return null;

    return (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-center text-blue-300">Đề xuất giao dịch</h2>
            
            <div className="grid grid-cols-2 gap-4">
                <ResultCard title="Loại Lệnh" value={recommendation.orderType} className="col-span-2 bg-blue-900/30" />
                <ResultCard title="Điểm vào lệnh (Entry)" value={recommendation.entryPoint} className="bg-green-900/30" />
                <ResultCard title="Vốn vào lệnh" value={recommendation.capitalAllocation} />
                <ResultCard title="Cắt lỗ (Stop Loss)" value={recommendation.stopLoss} className="bg-red-900/30" />
                <ResultCard title="Chốt lời (Take Profit)" value={recommendation.takeProfit} className="bg-green-900/30" />
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-400">Lý do đề xuất</h4>
                <p className="text-base text-gray-300 mt-1 whitespace-pre-wrap">{recommendation.reasoning}</p>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ResultCard title="Ước tính Lợi nhuận" value={recommendation.profitEstimate} />
                <ResultCard title="Ước tính Rủi ro" value={recommendation.riskEstimate} />
            </div>
             <ResultCard title="Thời gian giữ lệnh khuyến nghị" value={recommendation.holdingTime} className="col-span-2" />
        </div>
    );
  };
  
  return (
    <div className="bg-gray-800/50 p-6 rounded-xl shadow-md min-h-[500px] sticky top-28">
        {renderContent()}
    </div>
  );
};
