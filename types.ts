
export type View = 'home' | 'discovery' | 'detail' | 'analysis' | 'admin' | 'recommendations' | 'education' | 'edit' | 'login';

export type UserRole = 'entrepreneur' | 'investor_natural' | 'investor_legal' | 'advisor' | 'none';

export interface User {
  name: string;
  role: UserRole;
  avatar?: string;
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
