// Multiplicity Design System
// Dark canvas, intelligent light
// Crown gradient accent

export const colors = {
  // Background / Canvas
  canvas: {
    primary: '#0a0a0f',
    secondary: '#12121a',
    tertiary: '#1a1a24',
  },
  
  // Accent (Crown Gradient)
  accent: {
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    primary: '#667eea',
    secondary: '#764ba2',
    cyan: '#06b6d4',
  },
  
  // Status Colors
  success: '#10b981',
  warning: '#f59e0b',
  risk: '#ef4444',
  
  // Text
  text: {
    primary: '#ffffff',
    secondary: '#9ca3af',
    tertiary: '#6b7280',
  },
  
  // Borders
  border: {
    subtle: 'rgba(255, 255, 255, 0.05)',
    default: 'rgba(255, 255, 255, 0.1)',
    strong: 'rgba(255, 255, 255, 0.2)',
  },
};

export const typography = {
  h1: 'text-4xl font-bold',
  h2: 'text-3xl font-bold',
  h3: 'text-2xl font-semibold',
  h4: 'text-xl font-semibold',
  body: 'text-base',
  caption: 'text-sm text-gray-400',
  numeric: 'font-mono font-bold',
};

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
};

// MEDDICC Icons & Colors
export const meddicc = {
  Metrics: { emoji: '📊', color: '#06b6d4' },
  'Economic Buyer': { emoji: '👔', color: '#8b5cf6' },
  'Decision Criteria': { emoji: '✓', color: '#10b981' },
  'Decision Process': { emoji: '⚙️', color: '#f59e0b' },
  'Identify Pain': { emoji: '🎯', color: '#ef4444' },
  Champion: { emoji: '👑', color: '#f59e0b' },
  Competition: { emoji: '⚔️', color: '#6366f1' },
};

// Challenger Icons
export const challenger = {
  Teach: { emoji: '🎓', color: '#06b6d4' },
  Tailor: { emoji: '✂️', color: '#8b5cf6' },
  'Take Control': { emoji: '🎯', color: '#f59e0b' },
};
