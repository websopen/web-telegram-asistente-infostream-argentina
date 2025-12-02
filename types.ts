export enum Tab {
  YOUTUBE = 'YOUTUBE',
  X = 'X',
  FINANCE = 'FINANCE'
}

export interface VideoTimestamp {
  time: string;
  seconds: number;
  emoji: string;
  title: string;
  description: string;
}

export interface VideoSummary {
  id: string;
  title: string;
  channel: string;
  videoUrl: string;
  thumbnailUrl: string;
  timestamps: VideoTimestamp[];
}

export interface Tweet {
  id: string;
  authorName: string;
  authorHandle: string;
  avatarUrl: string;
  content: string;
  likes: number;
  retweets: number;
  timestamp: string;
  isVerified: boolean;
  analysis: string; // New field for the mini-analysis
}

export interface FinanceIndicator {
  name: string;
  buy: number;
  sell: number;
  variation: number; // percentage
  isUp: boolean;
}

export interface ChartDataPoint {
  time: string;
  value: number;
}

export interface FinanceNews {
  id: string;
  title: string;
  source: string;
  time: string;
  url: string;
}