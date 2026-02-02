import React from 'react';
import { COLORS } from '../constants';

interface RiskMeterProps {
  score: number; // 0 to 100
}

export const RiskMeter: React.FC<RiskMeterProps> = ({ score }) => {
  // Determine color based on score
  let color = COLORS.success;
  let label = "Low Risk";
  
  if (score > 33) {
    color = COLORS.warning; // Orange for medium
    label = "Medium Risk";
  }
  if (score > 66) {
    color = COLORS.danger; // Red for high
    label = "High Risk";
  }

  // Calculate SVG stroke Dasharray for semi-circle
  const radius = 80;
  const circumference = Math.PI * radius; // Semi-circle circumference
  const progress = (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center py-6 cursor-pointer hover:opacity-90 transition-opacity">
      <div className="relative w-64 h-32 overflow-hidden flex justify-center items-end">
        <svg className="w-64 h-32">
           {/* Background Track */}
          <path
            d="M 32 128 A 96 96 0 0 1 224 128"
            fill="none"
            stroke={COLORS.background}
            strokeWidth="20"
            strokeLinecap="round"
            className="drop-shadow-inner"
          />
           <path
            d="M 32 128 A 96 96 0 0 1 224 128"
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="20"
            strokeLinecap="round"
          />
          {/* Progress Track */}
          <path
            d="M 32 128 A 96 96 0 0 1 224 128"
            fill="none"
            stroke={color}
            strokeWidth="20"
            strokeLinecap="round"
            strokeDasharray={`${progress} ${circumference}`}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute bottom-0 flex flex-col items-center mb-2">
            <span className="text-5xl font-bold" style={{ color: COLORS.text }}>{score}</span>
        </div>
      </div>
      <p className="mt-2 text-lg font-bold" style={{ color: color }}>
        {label}
      </p>
      <p className="text-sm mt-1" style={{ color: COLORS.textLight }}>Daily Gut Health Score</p>
    </div>
  );
};