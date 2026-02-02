import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { Navigation } from './components/Navigation';
import { Journal } from './components/Journal';
import { Care } from './components/Care';
import { Tab, LogEntry, UserProfile } from './types';
import { COLORS, LOCAL_FOODS, COMMON_SYMPTOMS, APP_COPYRIGHT, SUPPORT_EMAIL } from './constants';
import { X, Sparkles, Loader2, Mail, LogOut, ChevronRight, Bell, Shield, User as UserIcon, CheckCircle, ArrowRight } from 'lucide-react';
import { analyzeFoodRisk } from './services/geminiService';

const App: React.FC = () => {
  // Authentication State
  const [view, setView] = useState<'disclaimer' | 'auth' | 'app'>('disclaimer');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [user, setUser] = useState<UserProfile | null>(null);

  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  
  // App State
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '1', timestamp: Date.now() - 3600000, type: 'meal', title: 'Boiled Yam + Kontomire', riskScoreImpact: 0.05 },
    { id: '2', timestamp: Date.now() - 7200000, type: 'med', title: 'Antacid', riskScoreImpact: -0.1 }
  ]);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  
  // Log Modal State
  const [logType, setLogType] = useState<'meal' | 'symptom' | 'med'>('meal');
  const [selectedFood, setSelectedFood] = useState('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Auth Form State
  const [loginName, setLoginName] = useState('');
  const [loginEmail, setLoginEmail] = useState('');

  const handleAgreeToDisclaimer = () => {
    setView('auth');
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginName) return;
    // Simulate sending OTP
    setOtpSent(true);
    alert(`[SIMULATION] Your verification code is: 1234`);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput === '1234') {
        completeLogin();
    } else {
        alert("Invalid code. Please use 1234");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would check credentials. Here we just mock it.
    completeLogin();
  };

  const completeLogin = () => {
     setUser({
        name: loginName,
        email: loginEmail,
        language: 'en',
        hasDiagnosis: false,
        receiveReminders: true
      });
      setView('app');
  };

  const handleLogout = () => {
    setUser(null);
    setLoginName('');
    setLoginEmail('');
    setOtpSent(false);
    setOtpInput('');
    setActiveTab('home');
    setView('disclaimer'); // Reset to start
  };

  const toggleReminders = () => {
    if (user) {
        setUser({ ...user, receiveReminders: !user.receiveReminders });
    }
  };

  const handleAddLog = () => {
    if (!selectedFood) return;

    let risk = 0.1; // Default
    
    // Risk logic only applies to meals primarily for this demo
    if (logType === 'meal') {
         const foodDetails = LOCAL_FOODS.find(f => f.name.toLowerCase() === selectedFood.toLowerCase());
         if (foodDetails) {
            if (foodDetails.risk === 'low') risk = 0;
            if (foodDetails.risk === 'medium') risk = 0.15;
            if (foodDetails.risk === 'high') risk = 0.3;
        }
    }

    if (logType === 'med') risk = -0.15; // Meds generally reduce risk/pain
    if (logType === 'symptom') risk = 0.2; // Symptoms indicate higher risk state

    const newLog: LogEntry = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        type: logType,
        title: selectedFood,
        riskScoreImpact: risk,
    };

    setLogs(prev => [newLog, ...prev]);
    setIsLogModalOpen(false);
    setSelectedFood('');
    setAnalysis(null);
  };

  const handleAnalyzeWithAI = async () => {
    if (!selectedFood) return;
    setIsAnalyzing(true);
    const result = await analyzeFoodRisk(selectedFood);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  const deleteLog = (id: string) => {
    setLogs(prev => prev.filter(l => l.id !== id));
  };

  // ---------------- VIEW: DISCLAIMER ----------------
  if (view === 'disclaimer') {
    return (
        <div className="min-h-screen bg-blue-50 flex flex-col justify-center px-6 py-12 font-sans text-slate-800">
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-blue-100 border border-slate-100">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6 text-red-600 mx-auto">
                    <Shield size={32} />
                </div>
                <h1 className="text-2xl font-bold text-center mb-4">Medical Disclaimer</h1>
                
                <div className="prose prose-sm text-slate-600 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="mb-2 font-bold text-slate-800">Please read carefully:</p>
                    <ul className="list-disc pl-4 space-y-2">
                        <li><strong>UlcerWise is NOT a doctor.</strong> We do not provide medical diagnosis or treatment.</li>
                        <li>This app uses Artificial Intelligence which may occasionally provide inaccurate information.</li>
                        <li>Always consult a qualified healthcare professional before changing your diet or medication.</li>
                        <li>If you experience severe pain, vomiting blood, or other emergency symptoms, seek immediate medical help.</li>
                    </ul>
                </div>

                <button 
                    onClick={handleAgreeToDisclaimer}
                    className="w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
                    style={{ backgroundColor: COLORS.primary }}
                >
                    I Agree & Continue <ArrowRight size={20} />
                </button>
            </div>
            <p className="text-center text-xs text-slate-400 mt-6">{APP_COPYRIGHT}</p>
        </div>
    );
  }

  // ---------------- VIEW: AUTH (Login / Signup) ----------------
  if (view === 'auth') {
    return (
      <div className="min-h-screen bg-white text-slate-800 font-sans max-w-md mx-auto relative shadow-2xl flex flex-col justify-center px-8">
        <div className="mb-8 text-center">
            <div className="w-20 h-20 bg-blue-600 rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-xl shadow-blue-200">
                <Shield size={40} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">UlcerWise</h1>
            <p className="text-slate-500">Your companion for a healthier gut.</p>
        </div>

        {/* Auth Mode Tabs */}
        <div className="flex bg-blue-50 rounded-xl p-1 mb-6">
            <button 
                onClick={() => { setAuthMode('signup'); setOtpSent(false); }}
                className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${authMode === 'signup' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
            >
                Create Account
            </button>
            <button 
                onClick={() => { setAuthMode('login'); setOtpSent(false); }}
                className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${authMode === 'login' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
            >
                Log In
            </button>
        </div>

        {authMode === 'signup' ? (
            !otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Your Name</label>
                        <input 
                            type="text" 
                            value={loginName}
                            onChange={(e) => setLoginName(e.target.value)}
                            className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 focus:outline-none focus:border-blue-500 transition-all font-medium"
                            placeholder="Ama Mensah"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Email / Phone</label>
                        <input 
                            type="text" 
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 focus:outline-none focus:border-blue-500 transition-all font-medium"
                            placeholder="ama@example.com"
                            required
                        />
                    </div>
                    <button 
                        type="submit"
                        className="w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg shadow-teal-200 mt-6 active:scale-95 transition-transform"
                        style={{ backgroundColor: COLORS.secondary }}
                    >
                        Verify & Sign Up
                    </button>
                </form>
            ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in slide-in-from-right-10 duration-300">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center mb-4">
                        <p className="text-sm text-blue-800">We sent a code to <span className="font-bold">{loginEmail}</span></p>
                        <p className="text-xs text-blue-500 mt-1">(Hint: use 1234)</p>
                    </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Enter Verification Code</label>
                        <input 
                            type="text" 
                            value={otpInput}
                            onChange={(e) => setOtpInput(e.target.value)}
                            className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 focus:outline-none focus:border-blue-500 text-center text-2xl tracking-widest font-bold"
                            placeholder="0000"
                            maxLength={4}
                            required
                        />
                    </div>
                    <button 
                        type="submit"
                        className="w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg shadow-blue-200 mt-6 active:scale-95 transition-transform"
                        style={{ backgroundColor: COLORS.primary }}
                    >
                        Confirm Code
                    </button>
                    <button type="button" onClick={() => setOtpSent(false)} className="w-full text-sm text-slate-400 font-bold mt-4">
                        Change Email
                    </button>
                </form>
            )
        ) : (
            <form onSubmit={handleLogin} className="space-y-4">
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Email / Phone</label>
                    <input 
                        type="text" 
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 focus:outline-none focus:border-blue-500 transition-all font-medium"
                        placeholder="ama@example.com"
                        required
                    />
                </div>
                <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Password</label>
                     <input 
                        type="password" 
                        className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 focus:outline-none focus:border-blue-500 transition-all font-medium"
                        placeholder="••••••••"
                        required
                    />
                </div>
                <button 
                    type="submit"
                    className="w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg shadow-blue-200 mt-6 active:scale-95 transition-transform"
                    style={{ backgroundColor: COLORS.primary }}
                >
                    Log In
                </button>
            </form>
        )}
      </div>
    );
  }

  // ---------------- VIEW: APP ----------------
  const renderContent = () => {
    // Safety check
    if (!user) return null;

    switch (activeTab) {
      case 'home':
        return <Dashboard logs={logs} userName={user.name} onViewAllLogs={() => setActiveTab('journal')} />;
      case 'journal':
        return <Journal logs={logs} onDeleteLog={deleteLog} />;
      case 'care':
        return <Care />;
      case 'profile':
        return (
            <div className="p-6 pt-12 flex flex-col items-center min-h-screen bg-blue-50 pb-24">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden mb-4">
                     <img src={`https://ui-avatars.com/api/?name=${user.name}&background=0D9488&color=fff&size=200`} alt="Profile" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
                <p className="text-sm text-slate-400 mb-8">{user.email}</p>

                <div className="w-full space-y-4">
                    {/* Account Settings */}
                    <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-center p-4 border-b border-slate-50">
                             <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><UserIcon size={18}/></div>
                                <span className="font-semibold text-slate-700">Language</span>
                             </div>
                            <span className="text-sm font-bold text-slate-400">English (GH)</span>
                        </div>
                        <div className="flex justify-between items-center p-4">
                             <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-50 rounded-lg text-green-600"><Shield size={18}/></div>
                                <span className="font-semibold text-slate-700">Offline Mode</span>
                             </div>
                            <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-md">ACTIVE</span>
                        </div>
                    </div>

                    {/* Preferences & Support */}
                    <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                         <div 
                            onClick={toggleReminders}
                            className="flex justify-between items-center p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors select-none"
                         >
                             <div className="flex items-center gap-3">
                                <div className="p-2 bg-teal-50 rounded-lg text-teal-600"><Bell size={18}/></div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-slate-700">Email Reminders</span>
                                    <span className="text-xs text-slate-400">
                                        {user.receiveReminders ? 'Enabled (Daily)' : 'Disabled'}
                                    </span>
                                </div>
                             </div>
                            <div className={`w-10 h-6 rounded-full p-1 transition-colors ${user.receiveReminders ? 'bg-teal-600' : 'bg-slate-200'}`}>
                                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${user.receiveReminders ? 'translate-x-4' : ''}`}></div>
                            </div>
                        </div>

                         <button 
                            onClick={() => window.open(`mailto:${SUPPORT_EMAIL}`)}
                            className="flex justify-between items-center p-4 w-full cursor-pointer hover:bg-slate-50 transition-colors"
                        >
                             <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><Mail size={18}/></div>
                                <span className="font-semibold text-slate-700">Send Complaints / Feedback</span>
                             </div>
                            <ChevronRight size={18} className="text-slate-300"/>
                        </button>
                    </div>
                </div>

                <button 
                    onClick={handleLogout}
                    className="mt-8 flex items-center gap-2 text-red-500 font-bold px-6 py-3 rounded-xl hover:bg-red-50 transition-colors"
                >
                    <LogOut size={18} /> Log Out
                </button>

                <div className="mt-auto pt-10 text-center">
                    <p className="text-xs text-slate-400 font-medium">{APP_COPYRIGHT}</p>
                </div>
            </div>
        );
      default:
        return <Dashboard logs={logs} userName={user.name} onViewAllLogs={() => setActiveTab('journal')} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#EFF6FF] text-slate-800 font-sans max-w-md mx-auto relative shadow-2xl overflow-hidden">
      
      {renderContent()}

      {user && (
        <Navigation 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            onAddPress={() => setIsLogModalOpen(true)} 
        />
      )}

      {/* Log Modal */}
      {isLogModalOpen && (
        <div className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
            <div className="bg-white w-full rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-300">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">New Entry</h2>
                        <p className="text-xs text-slate-400">Track your meals or symptoms</p>
                    </div>
                    <button onClick={() => setIsLogModalOpen(false)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
                        <X size={20} className="text-slate-600"/>
                    </button>
                </div>

                {/* Type Switcher */}
                <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
                    {(['meal', 'symptom', 'med'] as const).map(t => (
                        <button 
                            key={t}
                            onClick={() => { setLogType(t); setSelectedFood(''); setAnalysis(null); }}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-bold capitalize transition-all ${logType === t ? 'bg-white shadow-sm text-teal-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                            {logType === 'meal' ? 'What did you eat?' : logType === 'med' ? 'Medication Name (Consult Doctor)' : 'Symptom Description'}
                        </label>
                        
                        {/* Custom Input with Type-Specific Datalist */}
                        <div className="relative">
                            <input 
                                list={logType === 'med' ? undefined : "suggestions"} // No list for meds to avoid prescribing
                                type="text"
                                value={selectedFood}
                                onChange={(e) => setSelectedFood(e.target.value)}
                                placeholder={
                                    logType === 'meal' ? "e.g., Banku with pepper" : 
                                    logType === 'med' ? "e.g., Antacid (Prescribed)" : 
                                    "e.g., Heartburn"
                                }
                                className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all font-medium text-slate-800"
                            />
                            {logType !== 'med' && (
                                <datalist id="suggestions">
                                    {logType === 'meal' && LOCAL_FOODS.map(f => <option key={f.name} value={f.name} />)}
                                    {logType === 'symptom' && COMMON_SYMPTOMS.map(s => <option key={s} value={s} />)}
                                </datalist>
                            )}
                        </div>
                        {logType === 'med' ? (
                            <p className="text-[10px] text-red-400 mt-2 ml-1 font-semibold flex items-center gap-1">
                                <Shield size={10} /> Note: Only record medications prescribed by a doctor.
                            </p>
                        ) : (
                            <p className="text-[10px] text-slate-400 mt-2 ml-1">
                                💡 Tip: You can type anything, even if it's not in the list.
                            </p>
                        )}
                    </div>

                    {/* AI Analysis Button (Only for meals) */}
                    {logType === 'meal' && selectedFood.length > 2 && (
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                            {!analysis ? (
                                <button 
                                    onClick={handleAnalyzeWithAI}
                                    disabled={isAnalyzing}
                                    className="w-full flex items-center justify-center gap-2 text-blue-700 font-bold text-sm hover:underline"
                                >
                                    {isAnalyzing ? <Loader2 className="animate-spin" size={16}/> : <Sparkles size={16} />}
                                    {isAnalyzing ? 'Asking UlcerWise AI...' : 'Analyze Risk with AI'}
                                </button>
                            ) : (
                                <div>
                                    <div className="flex items-center gap-2 mb-1 text-blue-800 font-bold text-sm">
                                        <Sparkles size={14} /> AI Insight
                                    </div>
                                    <p className="text-sm text-blue-900 leading-relaxed font-medium">{analysis}</p>
                                </div>
                            )}
                        </div>
                    )}

                    <button 
                        onClick={handleAddLog}
                        className="w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg shadow-teal-200/50 mt-4 active:scale-95 transition-transform hover:opacity-90"
                        style={{ backgroundColor: COLORS.primary }}
                    >
                        Save Entry
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default App;