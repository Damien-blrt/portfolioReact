/**
 * Portfolio Theme - Anthropic-inspired design system
 * Warm cream backgrounds, elegant typography contrast, minimalist aesthetic
 */

import { Platform } from 'react-native';

// Palette dérivée de #453440 (Mauve/Plum Foncé)
export const Colors = {
  // Primary backgrounds (Tints of #453440)
  bgPrimary: '#FAF8F9',        // Très clair, presque blanc
  bgSecondary: '#EAE4E8',      // Nuance claire pour contraster avec le fond
  bgDark: '#30242D',           // Nuance plus sombre que la base pour les headers
  bgCard: '#FFFFFF',           // Blanc pur pour les cartes
  bgCardDark: '#453440',       // La couleur de base

  // Text colors
  textPrimary: '#2D222A',      // Très sombre
  textSecondary: '#5A4553',    // Plus clair que la base
  textMuted: '#897482',        // Gris-mauve
  textLight: '#FFFFFF',        // Blanc

  // Accent colors (La base et ses variantes lumineuses)
  accent: '#9A738F',           // Dérivé plus clair et lumineux de #453440 pour les boutons
  accentLight: '#B892AC',      // Plus clair pour les hover ou bg subtils
  accentSoft: '#D9BBD0',       // Pastel
  accentSubtle: 'rgba(154, 115, 143, 0.15)', // #9A738F avec 15% d'opacité

  // Borders & separators
  border: '#DCD5D9',           // Bordure douce
  borderSubtle: '#EAE4E8',     // Bordure très douce
  borderAccent: 'rgba(69, 52, 64, 0.2)', // Bordure accentuée

  // Status/role colors
  tagBg: '#F2ECED',           // Fond des tags (tech)
  tagBorder: '#E4DBDF',       // Bordure des tags
  tagText: '#5A4553',         // Texte des tags

  // Shadows
  shadowLight: 'rgba(69, 52, 64, 0.04)',
  shadowMedium: 'rgba(69, 52, 64, 0.12)',
  shadowDark: 'rgba(69, 52, 64, 0.20)',

  light: {
    text: '#2D222A',
    background: '#FAF8F9',
    tint: '#9A738F',
    icon: '#897482',
    tabIconDefault: '#897482',
    tabIconSelected: '#9A738F',
  },
  dark: {
    text: '#FAF8F9',
    background: '#30242D',
    tint: '#D9BBD0',
    icon: '#897482',
    tabIconDefault: '#897482',
    tabIconSelected: '#D9BBD0',
  },
};

export const Spacing = {
  xs: 6,
  sm: 12,
  md: 20,
  lg: 28,
  xl: 40,
  xxl: 54,
  xxxl: 80,
  section: 100,
};

export const BorderRadius = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  full: 9999,
};

export const FontSizes = {
  xs: 12,
  sm: 15,
  md: 17,
  lg: 20,
  xl: 26,
  xxl: 32,
  xxxl: 44,
  display: 54,
  hero: 68,
};

export const Fonts = Platform.select({
  ios: {
    sans: 'System',
    serif: 'Georgia',
    rounded: 'System',
    mono: 'Menlo',
  },
  android: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  default: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Inter', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Inter', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
});
