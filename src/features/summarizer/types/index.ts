export interface TelegramPost {
  id: string;
  content: string;
  date: Date;
  url: string;
}

export interface SummaryRequest {
  channelId: string;
  startDate: Date;
  endDate: Date;
  apiKey: string;
  model: 'deepseek' | 'gemini';
  customPrompt?: string;
}

export interface SummaryResult {
  summary: string;
  sourcePosts: TelegramPost[];
}
