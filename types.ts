
export type View = 'home' | 'discovery' | 'detail' | 'analysis' | 'admin' | 'recommendations' | 'education' | 'edit' | 'login' | 'dashboard' | 'contact' | 'feed' | 'settings';

export type UserRole = 'entrepreneur' | 'investor_natural' | 'investor_legal' | 'advisor' | 'none';

export type DocumentType = 'RUT' | 'DNI' | 'PASSPORT' | 'OTHER';

export interface User {
  name: string;
  role: UserRole;
  avatar?: string;
  identifier?: string; // Email
  phone?: string;
  documentId?: string;
  documentType?: DocumentType;
  isVerified?: boolean;
}

export interface NewsItem {
  id: number | string;
  title: string;
  category: string;
  tag: string;
  image: string;
  date: string;
  excerpt: string;
  isAI?: boolean;
  facts?: string;
  interpretation?: string;
  authorName?: string;
  authorAvatar?: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  fundedPercentage: number;
  raised: number;
  goal: number;
  daysLeft: number;
  image: string;
  author: string;
  tags: string[];
}

export interface Incident {
  id: string;
  title: string;
  risk: 'High' | 'Medium' | 'Low';
  description: string;
  confidence: number;
  timestamp: string;
  authorId: string;
}
