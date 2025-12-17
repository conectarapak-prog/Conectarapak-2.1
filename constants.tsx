
import React from 'react';
import { Project, Incident } from './types';

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'P1',
    title: 'HydroHome: Huerto inteligente autosustentable',
    category: 'Ecología Circular',
    description: 'Cultiva tus propios vegetales orgánicos en casa con un sistema que usa 90% menos agua.',
    fundedPercentage: 85,
    raised: 12500,
    goal: 15000,
    daysLeft: 5,
    image: 'https://picsum.photos/seed/hydro/800/600',
    author: 'EcoSolutions Lab',
    tags: ['IA Verified', 'Sostenible']
  },
  {
    id: 'P2',
    title: 'SecureNet: Privacidad descentralizada',
    category: 'Tecnología',
    description: 'Recupera tu privacidad en línea con una red construida por la comunidad.',
    fundedPercentage: 32,
    raised: 5200,
    goal: 20000,
    daysLeft: 21,
    image: 'https://picsum.photos/seed/secure/800/600',
    author: 'CyberGuardians',
    tags: ['Blockchain', 'Privacy']
  },
  {
    id: 'P3',
    title: 'EcoCycle: Compostaje Urbano',
    category: 'Diseño Sostenible',
    description: 'Compostaje doméstico inodoro que convierte residuos en tierra en 24h.',
    fundedPercentage: 112,
    raised: 45000,
    goal: 40000,
    daysLeft: 12,
    image: 'https://picsum.photos/seed/compost/800/600',
    author: 'Jane Doe',
    tags: ['Circular']
  }
];

export const MOCK_INCIDENTS: Incident[] = [
  {
    id: 'INC-2049',
    title: 'Fraude Financiero: Smurfing',
    risk: 'High',
    description: 'Detectado patrón de lavado de dinero en micro-transacciones.',
    confidence: 98,
    timestamp: 'Hace 2m',
    authorId: '8932'
  },
  {
    id: 'INC-2050',
    title: 'Greenwashing detectado',
    risk: 'Medium',
    description: 'Certificaciones inconsistentes con la base de datos oficial.',
    confidence: 75,
    timestamp: 'Hace 15m',
    authorId: '1204'
  }
];
