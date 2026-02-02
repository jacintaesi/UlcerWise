import React, { useMemo } from 'react';
import { RiskMeter } from './RiskMeter';
import { LogEntry } from '../types';
import { COLORS, DAILY_INSIGHTS } from '../constants';
import { ArrowRight, Droplet, Moon, Utensils, Info } from 'lucide-react';

interface DashboardProps {
  logs: LogEntry[];
  userName: string;
  onViewAllLogs: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ logs, userName, onViewAllLogs }) => {
  
  // Calculate today's risk score
  const todayScore = useMemo(() => {
    let base = 20; // Start low
    // Calculate impact of today's logs
    const todayLogs = logs.filter(l => {
       const today = new Date().setHours(0,0,0,0);
       return l.timestamp >= today;
    });

    todayLogs.forEach(log => {
        base += (log.riskScoreImpact * 100);
    });

    return Math.min(Math.max(Math.round(base), 0), 100);
  }, [logs]);

  // Select a dynamic insight based on the day of the month
  const dailyInsight = useMemo(() => {
    const dayOfMonth = new Date().getDate();
    const index = dayOfMonth % DAILY_INSIGHTS.length;
    return DAILY_INSIGHTS[index];
  }, []);

  return (
    <div className="pb-24 pt-4 px-4 space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center mt-2">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: COLORS.text }}>Hello, {userName}</h1>
          <p className="text-sm font-medium" style={{ color: COLORS.textLight }}>Let's keep your gut happy today.</p>
        </div>
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 shadow-sm" style={{ borderColor: COLORS.primary }}>
            <img src={`https://ui-avatars.com/api/?name=${userName}&background=2563EB&color=fff`} alt="Profile" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Risk Card */}
      <div className="bg-white rounded-3xl shadow-lg shadow-blue-900/5 border border-slate-100 p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: COLORS.primary }}></div>
        <RiskMeter score={todayScore} />
        
        {/* Daily Tip */}
        <div className="mt-4 bg-teal-50 p-4 rounded-xl border border-teal-100 flex items-start gap-3 cursor-pointer hover:bg-teal-100 transition-colors">
            <div className="p-2 rounded-full bg-teal-600 text-white shrink-0">
                <Info size={18} />
            </div>
            <div>
                <h3 className="font-bold text-teal-900 text-sm">Daily Insight</h3>
                <p className="text-xs text-teal-700 mt-1 leading-relaxed">{dailyInsight}</p>
            </div>
        </div>
      </div>

      {/* Quick Stats / Highlights */}
      <div className="grid grid-cols-2 gap-4">
         <div className="bg-white p-5 rounded-2xl shadow-md shadow-slate-200 border border-slate-50 flex flex-col justify-between h-36 cursor-pointer hover:scale-[1.02] transition-transform active:scale-95">
            <div className="flex justify-between items-start">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Last Meal</span>
                <div className="p-1.5 bg-orange-100 text-orange-600 rounded-lg">
                    <Utensils size={16} />
                </div>
            </div>
            <div>
                <span className="text-lg font-bold text-slate-800 line-clamp-1">Waakye</span>
                <p className="text-xs font-semibold text-orange-500 mt-1">Medium Risk</p>
            </div>
         </div>

         <div className="bg-white p-5 rounded-2xl shadow-md shadow-slate-200 border border-slate-50 flex flex-col justify-between h-36 cursor-pointer hover:scale-[1.02] transition-transform active:scale-95">
            <div className="flex justify-between items-start">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Sleep</span>
                <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">
                    <Moon size={16} />
                </div>
            </div>
            <div>
                <span className="text-lg font-bold text-slate-800">6.5 hrs</span>
                <p className="text-xs font-semibold text-slate-400 mt-1">Target: 8 hrs</p>
            </div>
         </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-lg" style={{ color: COLORS.text }}>Today's Activity</h3>
            <button 
                onClick={onViewAllLogs}
                className="text-xs font-bold flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors" 
                style={{ color: COLORS.primary }}
            >
                View All <ArrowRight size={14} />
            </button>
        </div>
        
        <div className="space-y-3">
            {logs.slice(0, 3).map(log => (
                <div key={log.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center cursor-pointer active:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm
                            ${log.type === 'meal' ? 'bg-orange-50 text-orange-500' : 
                              log.type === 'med' ? 'bg-blue-50 text-blue-500' : 
                              log.type === 'symptom' ? 'bg-red-50 text-red-500' : 'bg-purple-50 text-purple-500'}`}>
                            {log.type === 'meal' && <Utensils size={20} />}
                            {log.type === 'med' && <Droplet size={20} />}
                            {log.type === 'symptom' && <div className="font-black text-xl">!</div>}
                            {log.type === 'stress' && <Moon size={20} />}
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-sm">{log.title}</h4>
                            <p className="text-xs text-slate-400 font-medium">{new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        </div>
                    </div>
                    {log.riskScoreImpact > 0 && (
                        <span className="text-xs font-bold bg-red-100 text-red-600 px-2 py-1 rounded-md">+{Math.round(log.riskScoreImpact * 100)} Risk</span>
                    )}
                     {log.riskScoreImpact < 0 && (
                        <span className="text-xs font-bold bg-green-100 text-green-600 px-2 py-1 rounded-md">Good</span>
                    )}
                </div>
            ))}
            {logs.length === 0 && (
                <div className="text-center py-10 text-slate-400 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                    <p>No activity yet today.</p>
                    <p className="text-xs mt-1">Tap the + button to log.</p>
                </div>
            )}
        </div>
      </div>

    </div>
  );
};