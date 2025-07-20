
import { GoogleGenAI, Type } from "@google/genai";
import { type UserInputData, type AIResult } from '../types';

const getGoogleAI = (): GoogleGenAI => {
    const apiKey = localStorage.getItem('gemini-api-key');
    if (!apiKey) {
        throw new Error("API Key chưa được cài đặt. Vui lòng vào cài đặt để thêm API Key của bạn.");
    }
    return new GoogleGenAI({ apiKey });
};

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        shouldTrade: {
            type: Type.BOOLEAN,
            description: "True nếu có cơ hội giao dịch, ngược lại là false."
        },
        recommendation: {
            type: Type.OBJECT,
            description: "Chi tiết đề xuất giao dịch. Chỉ điền nếu shouldTrade là true.",
            nullable: true,
            properties: {
                orderType: { type: Type.STRING, description: "Loại lệnh: Long/Short (Future) hoặc Mua/Bán (Chứng khoán)." },
                entryPoint: { type: Type.STRING, description: "Điểm vào lệnh đề xuất (Entry)." },
                stopLoss: { type: Type.STRING, description: "Điểm cắt lỗ (Stop Loss)." },
                takeProfit: { type: Type.STRING, description: "Điểm chốt lời (Take Profit)." },
                capitalAllocation: { type: Type.STRING, description: "Phần trăm hoặc số vốn nên vào lệnh." },
                reasoning: { type: Type.STRING, description: "Lý do chi tiết, phân tích tổng hợp để đưa ra lệnh này." },
                profitEstimate: { type: Type.STRING, description: "Ước tính lợi nhuận dự kiến (ví dụ: +5% hoặc +50 USD)." },
                riskEstimate: { type: Type.STRING, description: "Ước tính rủi ro dự kiến (ví dụ: -2% hoặc -20 USD)." },
                holdingTime: { type: Type.STRING, description: "Thời gian khuyến nghị giữ lệnh." }
            },
        },
        noTradeReason: {
            type: Type.STRING,
            description: "Lý do không nên giao dịch, ví dụ: 'Không nên vào lệnh lúc này. Hãy chờ thêm tín hiệu rõ ràng hơn.' Chỉ điền nếu shouldTrade là false.",
            nullable: true,
        }
    },
    required: ['shouldTrade']
};

export const analyzeInvestment = async (data: UserInputData): Promise<AIResult> => {
  const { investmentType, capital, holdingTime, chartImages, interfaceImage, document } = data;

  const systemInstruction = `
    Bạn là một chuyên gia tài chính AI ưu tú, có nhiệm vụ phân tích và đưa ra các chiến lược đầu tư có lợi nhuận cao nhất nhưng vẫn đảm bảo an toàn vốn cho người dùng.
    
    QUY TẮC BẮT BUỘC:
    1.  **Ưu tiên an toàn vốn**: Rủi ro của lệnh không bao giờ được vượt quá số vốn người dùng cung cấp. Gợi ý cắt lỗ (Stop Loss) phải được tính toán để đảm bảo tài khoản không bị "cháy".
    2.  **Xác suất cao**: Chỉ đề xuất lệnh nếu bạn đánh giá có ít nhất 70% xác suất thành công dựa trên tổng hợp các tín hiệu.
    3.  **Từ chối nếu không chắc chắn**: Nếu không tìm thấy cơ hội giao dịch rõ ràng hoặc thị trường quá rủi ro, hãy trả về 'shouldTrade: false' và nêu lý do trong 'noTradeReason'.
    4.  **Phân tích toàn diện**: Kết hợp phân tích kỹ thuật từ biểu đồ, tín hiệu từ giao diện đặt lệnh, thông tin từ tài liệu, và dữ liệu thị trường mới nhất để đưa ra quyết định.
    5.  **Kết quả chi tiết**: Luôn trả về đầy đủ các trường thông tin được yêu cầu trong schema JSON.
  `;
  
  const userPrompt = `
    Vui lòng phân tích dữ liệu sau và cung cấp một đề xuất giao dịch chi tiết.

    **Thông tin người dùng:**
    - **Loại hình đầu tư**: ${investmentType}
    - **Số vốn hiện có**: ${capital.toLocaleString()} USD
    - **Thời gian kỳ vọng giữ lệnh**: ${holdingTime}

    **Phân tích dựa trên các dữ liệu đính kèm:**
    - **5 biểu đồ giá**: Phân tích xu hướng, mô hình nến, chỉ báo kỹ thuật (RSI, MACD, Bollinger Bands, etc.) trên các khung thời gian.
    - **1 ảnh giao diện đặt lệnh**: Xác định các vùng giá quan trọng, hỗ trợ/kháng cự từ sổ lệnh hoặc các chỉ báo trên màn hình.
    - **1 tài liệu phân tích**: Trích xuất các thông tin quan trọng, tin tức, hoặc phân tích có sẵn trong tài liệu.

    **Yêu cầu đầu ra:**
    Dựa trên phân tích tổng hợp, hãy đưa ra một gợi ý lệnh duy nhất, tối ưu nhất theo các tiêu chí đã nêu. Trả về kết quả theo đúng định dạng JSON đã được cung cấp.
  `;

  const imageParts = [
    ...chartImages.map(img => ({ inlineData: { mimeType: img.mimeType, data: img.base64 } })),
    ...(interfaceImage ? [{ inlineData: { mimeType: interfaceImage.mimeType, data: interfaceImage.base64 } }] : [])
  ];

  const textParts = [
      { text: userPrompt },
      ...(document ? [{ text: `\n\n--- NỘI DUNG TÀI LIỆU ĐÍNH KÈM ---\n${document.content}` }] : [])
  ];

  try {
    const ai = getGoogleAI();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [...textParts, ...imageParts] },
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        }
    });
    
    const jsonText = response.text.trim();
    const parsedResult = JSON.parse(jsonText) as AIResult;
    
    return parsedResult;

  } catch (error) {
    console.error("Lỗi từ Gemini API:", error);
    if (error instanceof Error) {
        if (error.message.includes("API Key chưa được cài đặt")) {
            throw error;
        }
        if (error.message.toLowerCase().includes("api key not valid")) {
            throw new Error("API Key không hợp lệ. Vui lòng kiểm tra lại trong phần cài đặt.");
        }
         if (error.message.includes("SAFETY")) {
            throw new Error("Phản hồi bị chặn vì lý do an toàn. Vui lòng thử với dữ liệu khác.");
        }
    }
    throw new Error("Không thể nhận được phản hồi từ AI. Vui lòng kiểm tra API Key và kết nối mạng.");
  }
};
