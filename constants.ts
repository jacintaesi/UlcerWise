import { FoodItem, Pharmacy } from './types';

export const COLORS = {
  primary: '#2563EB', // Blue 600 - Main Brand
  primaryDark: '#1E40AF', // Blue 800
  secondary: '#0D9488', // Teal 600 - Accent
  secondaryLight: '#CCFBF1', // Teal 100
  background: '#EFF6FF', // Blue 50 - New Light Blue Background
  surface: '#FFFFFF',
  success: '#10B981', // Emerald 500
  warning: '#F97316', // Orange 500
  danger: '#EF4444', // Red 500
  text: '#1E293B', // Slate 800
  textLight: '#64748B', // Slate 500
  white: '#FFFFFF',
  black: '#000000',
  border: '#DBEAFE' // Blue 100
};

export const SUPPORT_EMAIL = "help@ulcerwise.app";

export const DAILY_INSIGHTS = [
  "Eating smaller, more frequent meals can help prevent acid buildup compared to heavy meals.",
  "Sleeping on your left side can significantly reduce nighttime heartburn symptoms.",
  "Stress is a major trigger. Try 5 minutes of deep breathing before eating.",
  "Avoid lying down for at least 3 hours after a meal to keep acid down.",
  "Drinking warm water soothes the stomach lining better than ice-cold water.",
  "Chewing gum (non-mint) can increase saliva production and neutralize acid.",
  "Keep a food diary! Identifying your specific triggers is half the battle."
];

export const LOCAL_FOODS: FoodItem[] = [
  { name: 'Waakye (Plain)', risk: 'medium' },
  { name: 'Waakye + Shito', risk: 'high' },
  { name: 'Banku + Okro Stew', risk: 'low' },
  { name: 'Banku + Hot Pepper', risk: 'high' },
  { name: 'Fufu + Light Soup', risk: 'medium' },
  { name: 'Kenkey + Fried Fish', risk: 'medium' },
  { name: 'Boiled Yam + Kontomire', risk: 'low' },
  { name: 'Jollof Rice (Mild)', risk: 'medium' },
  { name: 'Jollof Rice (Spicy)', risk: 'high' },
  { name: 'Pawpaw (Papaya)', risk: 'low' },
  { name: 'Ripe Banana', risk: 'low' },
  { name: 'Oatmeal', risk: 'low' },
  { name: 'Light Soup (Plain)', risk: 'low' },
  { name: 'Hausa Koko', risk: 'medium' },
  { name: 'Beans and Plantain (Red Red)', risk: 'medium' },
];

export const COMMON_SYMPTOMS: string[] = [
  "Abdominal Pain (Upper)",
  "Burning Sensation",
  "Bloating",
  "Nausea",
  "Heartburn",
  "Loss of Appetite",
  "Burping",
  "Feeling Full Quickly",
  "Vomiting"
];

export const MOCK_PHARMACIES: Pharmacy[] = [
  { id: '1', name: 'AccraCare Pharmacy', location: 'Osu, Accra', isOpen: true, offersDelivery: true, phone: '+233 55 123 4567' },
  { id: '2', name: 'HealthPlus Chemist', location: 'East Legon', isOpen: true, offersDelivery: true, phone: '+233 24 987 6543' },
  { id: '3', name: 'Community Meds', location: 'Dansoman', isOpen: false, offersDelivery: false, phone: '+233 20 555 1212' },
  { id: '4', name: 'TopUp Pharmacy', location: 'Kumasi Central', isOpen: true, offersDelivery: true, phone: '+233 50 111 2222' },
];

export const APP_COPYRIGHT = "© 2025 Jacinta Amoawah Esi Badu. All rights reserved.";
