
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { ResultDisplay } from './components/ResultDisplay';
import { ApiKeyModal } from './components/ApiKeyModal';
import { analyzeInvestment } from './services/geminiService';
import { type AIResult, type UserInputData } from './types';

const API_KEY_STORAGE_KEY = 'gemini-api-key';

const App: React.FC = () => {
  const [result, setResult] = useState<AIResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (storedKey) {
      setApiKey(storedKey);
    } else {
      setIsApiKeyModalOpen(true);
    }
  }, []);

  const handleSaveApiKey = (key: string) => {
    localStorage.setItem(API_KEY_STORAGE_KEY, key);
    setApiKey(key);
    setIsApiKeyModalOpen(false);
    setError(null); // Xóa lỗi cũ khi lưu key mới
  };

  const handleAnalysis = useCallback(async (data: UserInputData) => {
    if (!apiKey) {
      setError("Vui lòng cài đặt API Key của bạn trước khi phân tích.");
      setIsApiKeyModalOpen(true);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const aiResponse = await analyzeInvestment(data);
      setResult(aiResponse);
    } catch (err) {
      if (err instanceof Error) {
        setError(`Lỗi phân tích: ${err.message}`);
        // Tự động mở modal nếu lỗi liên quan đến API Key
        if (err.message.includes("API Key")) {
            setIsApiKeyModalOpen(true);
        }
      } else {
        setError("Đã xảy ra lỗi không xác định. Vui lòng thử lại.");
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
       <ApiKeyModal 
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onSave={handleSaveApiKey}
        currentKey={apiKey}
      />
      <Header onSettingsClick={() => setIsApiKeyModalOpen(true)} />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="lg:pr-6">
            <InputForm onSubmit={handleAnalysis} isLoading={isLoading} isApiKeySet={!!apiKey} />
          </div>
          <div className="lg:pl-6">
            <ResultDisplay result={result} isLoading={isLoading} error={error} />
          </div>
        </div>
        <footer className="text-center text-gray-500 mt-16 pb-8">
            <p>Tuyên bố miễn trừ trách nhiệm: Thông tin chỉ mang tính chất tham khảo, không phải là lời khuyên đầu tư.</p>
            <p>&copy; 2024 Chuyên Gia Tài Chính AI. All Rights Reserved.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
