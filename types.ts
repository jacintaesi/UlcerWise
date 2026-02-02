export type Tab = 'home' | 'journal' | 'care' | 'profile';

export type RiskLevel = 'low' | 'medium' | 'high';

export interface LogEntry {
  id: string;
  timestamp: number;
  type: 'meal' | 'symptom' | 'med' | 'stress';
  title: string;
  details?: string;
  riskScoreImpact: number; // -0.1 to 0.2
}

export interface UserProfile {
  name: string;
  email: string;
  language: 'en' | 'twi' | 'ga';
  hasDiagnosis: boolean;
  receiveReminders: boolean;
}

export interface Pharmacy {
  id: string;
  name: string;
  location: string;
  isOpen: boolean;
  offersDelivery: boolean;
  phone: string;
}

export interface FoodItem {
  name: string;
  risk: RiskLevel;
  calories?: number;
}