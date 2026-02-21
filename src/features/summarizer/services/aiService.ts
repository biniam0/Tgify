import { TelegramPost } from '../types';
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

export async function summarizePosts(posts: TelegramPost[], apiKey: string, model: string, customPrompt?: string): Promise<string> {
  if (posts.length === 0) {
    return "No posts found in the selected date range.";
  }

  const postsContent = posts.map(p => 
    `Date: ${p.date.toLocaleDateString()}\nContent: ${p.content}`
  ).join('\n\n');

  const prompt = `
    You are a helpful assistant that summarizes Telegram channel posts.
    Please summarize the following posts from a Telegram channel.
    Focus on the main topics, key announcements, and interesting discussions.
    Group related topics together if possible.
    Provide the summary in a clear, bulleted list format.
    ${customPrompt ? `\nAdditional Instructions:\n${customPrompt}\n` : ''}
    
    Posts:
    ${postsContent}
  `;

  try {
    let aiModel;

    switch (model) {
      case 'deepseek':
        // DeepSeek is OpenAI compatible
        const deepseek = createOpenAI({ 
          baseURL: 'https://api.deepseek.com', 
          apiKey 
        });
        aiModel = deepseek('deepseek-chat');
        break;
      
      case 'grok':
        // Grok is OpenAI compatible
        const grok = createOpenAI({ 
          baseURL: 'https://api.x.ai/v1', 
          apiKey 
        });
        aiModel = grok('grok-2-1212');
        break;
        
      default:
        throw new Error(`Unsupported model: ${model}`);
    }

    const { text } = await generateText({
      model: aiModel as any,
      prompt: prompt,
    });

    return text;

  } catch (error: any) {
    console.error("AI Summarization Error:", error);
    return `Error generating summary: ${error.message || "Unknown error"}. Please check your API key and try again.`;
  }
}
