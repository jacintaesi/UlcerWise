import React from 'react';
import { LogEntry } from '../types';
import { COLORS } from '../constants';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell } from 'recharts';
import { Trash2, AlertCircle } from 'lucide-react';

interface JournalProps {
  logs: LogEntry[];
  onDeleteLog: (id: string) => void;
}

export const Journal: React.FC<JournalProps> = ({ logs, onDeleteLog }) => {
  
  // Group logs by day for the chart (last 7 days)
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayStr = d.toLocaleDateString('en-US', { weekday: 'short' });
    
    // Sum risk score impacts for that day
    const dayStart = d.setHours(0,0,0,0);
    const dayEnd = d.setHours(23,59,59,999);
    
    const dayLogs = logs.filter(l => l.timestamp >= dayStart && l.timestamp <= dayEnd);
    const riskSum = dayLogs.reduce((acc, curr) => acc + (curr.riskScoreImpact > 0 ? curr.riskScoreImpact : 0), 0);
    
    return { name: dayStr, risk: Math.round(riskSum * 100) };
  });

  return (
    <div className="pb-24 pt-6 px-4 space-y-6 min-h-screen">
       <div>
        <h1 className="text-2xl font-bold" style={{ color: COLORS.text }}>Your Patterns</h1>
        <p className="text-sm font-medium" style={{ color: COLORS.textLight }}>See what triggers your symptoms.</p>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 h-72">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-slate-700">Weekly Risk Trends</h3>
            <div className="flex gap-2 text-[10px] font-bold">
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-600"></div> Safe</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.secondary }}></div> High</span>
            </div>
        </div>
        <ResponsiveContainer width="100%" height="80%">
            <BarChart data={chartData}>
                <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 12, fill: '#64748B', fontWeight: 500}} 
                    dy={10}
                />
                <Tooltip 
                    cursor={{fill: '#F1F5F9', radius: 8}} 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', color: '#1E293B', fontWeight: 'bold'}}
                />
                <Bar dataKey="risk" radius={[6, 6, 6, 6]} barSize={24}>
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.risk > 40 ? COLORS.secondary : COLORS.primary} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Log List */}
      <div>
        <h3 className="font-bold text-lg mb-3" style={{ color: COLORS.text }}>History</h3>
        <div className="space-y-3">
             {logs.sort((a,b) => b.timestamp - a.timestamp).map(log => (
                <div key={log.id} className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center border border-slate-100 group">
                    <div>
                         <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded mr-2 
                            ${log.type === 'meal' ? 'bg-orange-100 text-orange-600' : 
                              log.type === 'symptom' ? 'bg-red-100 text-red-600' :
                              'bg-slate-100 text-slate-600'}`}>
                            {log.type}
                         </span>
                         <span className="font-bold text-slate-700 text-sm">{log.title}</span>
                         <div className="text-xs text-slate-400 mt-1 font-medium">
                            {new Date(log.timestamp).toLocaleDateString()} • {new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                         </div>
                    </div>
                    <button 
                        onClick={() => onDeleteLog(log.id)}
                        className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all active:scale-90"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
             ))}
              {logs.length === 0 && (
                <div className="text-center py-12 flex flex-col items-center justify-center text-slate-400">
                    <div className="bg-slate-100 p-4 rounded-full mb-3">
                        <AlertCircle size={24} />
                    </div>
                    <span className="font-medium">No logs yet.</span>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};