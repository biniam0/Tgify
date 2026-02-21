import { TelegramPost } from '../types';
import { isWithinInterval } from 'date-fns';
import axios from 'axios';

export const fetchTelegramPosts = async (
  channelUrl: string,
  startDate: Date,
  endDate: Date
): Promise<TelegramPost[]> => {
  // Extract username from URL (e.g., https://t.me/ja_stler -> ja_stler)
  // Handle various formats: t.me/username, telegram.me/username, @username, or just username
  let username = channelUrl.trim();
  
  if (username.startsWith('https://')) {
    const urlParts = username.split('/');
    username = urlParts[urlParts.length - 1];
  } else if (username.startsWith('@')) {
    username = username.substring(1);
  }

  if (!username) {
    throw new Error("Invalid Telegram URL");
  }

  // Use a CORS proxy to fetch the public channel preview page
  // We use the /s/ version of the URL which is the "preview" mode that loads more content statically
  // Try multiple proxies for reliability
  const targetUrl = `https://t.me/s/${username}`;
  
  const proxies = [
    `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`,
    `https://thingproxy.freeboard.io/fetch/${targetUrl}`
  ];

  let html = '';
  let lastError;

  for (const proxyUrl of proxies) {
    try {
      const response = await axios.get(proxyUrl);
      if (response.data) {
        html = response.data;
        break; // Success, exit loop
      }
    } catch (error) {
      console.warn(`Proxy failed: ${proxyUrl}`, error);
      lastError = error;
      // Continue to next proxy
    }
  }

  if (!html) {
    throw new Error(lastError?.message || "Failed to fetch channel content from all proxies.");
  }

  try {
    // Parse HTML using DOMParser
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Find all message elements
    const messageElements = doc.querySelectorAll('.tgme_widget_message');
    const posts: TelegramPost[] = [];

    messageElements.forEach((element) => {
      // Extract text content
      const textElement = element.querySelector('.tgme_widget_message_text');
      // If no text content (e.g. just an image), skip or handle accordingly
      if (!textElement) return;
      
      const content = textElement.textContent || '';

      // Extract date
      const timeElement = element.querySelector('.tgme_widget_message_date time');
      const dateStr = timeElement?.getAttribute('datetime');
      
      // Extract ID/Link
      const linkElement = element.querySelector('.tgme_widget_message_date');
      const postLink = linkElement?.getAttribute('href') || '';
      // postLink is usually like "https://t.me/username/123"
      const id = postLink.split('/').pop() || Math.random().toString(36).substring(7);

      if (content && dateStr) {
        const postDate = new Date(dateStr);
        
        // Only add if it is within range
        if (isWithinInterval(postDate, { start: startDate, end: endDate })) {
          posts.push({
            id,
            content: content.trim(),
            date: postDate,
            url: `${username}/${id}`
          });
        }
      }
    });

    return posts;

  } catch (error: any) {
    console.error("Error parsing Telegram posts:", error);
    throw new Error("Failed to parse channel content. The channel layout might have changed.");
  }
};
