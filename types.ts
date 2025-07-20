
export enum InvestmentType {
  Future = "Future",
  Stocks = "Chứng khoán"
}

export interface ImageFile {
  name: string;
  base64: string;
  mimeType: string;
}

export interface TextFile {
    name: string;
    content: string;
}

export interface UserInputData {
  investmentType: InvestmentType;
  capital: number;
  holdingTime: string;
  chartImages: ImageFile[];
  interfaceImage: ImageFile | null;
  document: TextFile | null;
}

export interface Recommendation {
  orderType: string;
  entryPoint: string;
  stopLoss: string;
  takeProfit: string;
  capitalAllocation: string;
  reasoning: string;
  profitEstimate: string;
  riskEstimate: string;
  holdingTime: string;
}

export interface AIResult {
  shouldTrade: boolean;
  recommendation: Recommendation | null;
  noTradeReason: string | null;
}
