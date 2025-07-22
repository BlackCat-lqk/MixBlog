import axios from 'axios';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatCompletionParams {
  model?: string;
  messages: Message[];
  temperature?: number;
  max_tokens?: number;
}

export const chatWithDeepSeek = async (params: ChatCompletionParams) => {
  try {
    const response = await axios.post('/api/chat', params);
    return response.data;
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
};

// 流式聊天
export const streamChatWithDeepSeek = async (
  params: ChatCompletionParams,
  onData: (chunk: string) => void
) => {
  try {
    const response = await fetch('/api/chat/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.body) throw new Error('No response body');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data:')) {
          try {
            const data = JSON.parse(line.substring(5));
            onData(data.content);
          } catch (e) {
            console.error('Error parsing stream data:', e);
          }
        }
      }
    }
  } catch (error) {
    console.error('Stream error:', error);
    throw error;
  }
};
