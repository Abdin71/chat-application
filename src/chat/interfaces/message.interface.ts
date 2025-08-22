export interface ChatMessage {
  username: string;
  message: string;
  timestamp: string;
  type: 'public' | 'private' | 'ai';
  to?: string; // for private messages
}
