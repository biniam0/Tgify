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
  model: 'gpt' | 'gemini' | 'deepseek' | 'grok';
}

export interface SummaryResult {
  summary: string;
  sourcePosts: TelegramPost[];
}
