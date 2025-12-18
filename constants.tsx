
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
    image: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&q=80&w=800',
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
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
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
    image: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=800',
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

export const MOCK_NEWS = [
  {
    id: 1,
    title: "Nueva planta de reciclaje fotovoltaico en Pozo Almonte",
    category: "Tecnología",
    tag: "Energía",
    image: "https://images.unsplash.com/photo-1509391366360-fe5bb6583e2c?auto=format&fit=crop&q=80&w=800",
    date: "12 Oct, 2024",
    excerpt: "Consorcio público-privado inaugura la primera planta de tratamiento de paneles solares en desuso de la región."
  },
  {
    id: 2,
    title: "UNAP lanza programa de mentoría para startups circulares",
    category: "Academia",
    tag: "Educación",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800",
    date: "08 Oct, 2024",
    excerpt: "La Universidad Arturo Prat abre convocatoria para proyectos que busquen resolver brechas en la logística inversa."
  },
  {
    id: 3,
    title: "Gremio de Hotelería de Iquique elimina plásticos de un solo uso",
    category: "Emprendimiento",
    tag: "Turismo",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
    date: "05 Oct, 2024",
    excerpt: "Más de 30 establecimientos se suman a la red de 'Hoteles Smart' con certificación de residuos cero."
  }
];

export const MAP_ACTORS = [
  { id: 1, name: "Puerto Iquique Sostenible", type: "Privado", x: "45%", y: "40%", icon: "directions_boat" },
  { id: 2, name: "UNAP Innovación", type: "Académico", x: "52%", y: "48%", icon: "school" },
  { id: 3, name: "ZOFRI Circular", type: "Gremio", x: "48%", y: "35%", icon: "inventory_2" },
  { id: 4, name: "Gobernación Regional", type: "Público", x: "50%", y: "55%", icon: "account_balance" },
  { id: 5, name: "Hub Tecnológico Tarapacá", type: "ONG", x: "55%", y: "60%", icon: "hub" },
];
