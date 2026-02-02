import React, { useState } from 'react';
import { MOCK_PHARMACIES, COLORS } from '../constants';
import { MapPin, Phone, Clock, MessageCircle, Search, ExternalLink } from 'lucide-react';

export const Care: React.FC = () => {
  const [search, setSearch] = useState('');

  const filteredPharmacies = MOCK_PHARMACIES.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleMoMoClick = () => {
    alert("Mobile Money Integration: This would open your MoMo app or USSD prompt to pay for delivery.");
  };

  const handleOrderClick = (pharmacyName: string) => {
    alert(`Starting order with ${pharmacyName}. In the full version, this opens a WhatsApp chat or Order Form.`);
  };

  const handleCallClick = (phone: string) => {
    alert(`Dialing ${phone}...`);
  };

  return (
    <div className="pb-24 pt-6 px-4 space-y-6 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: COLORS.text }}>Find Care</h1>
        <p className="text-sm font-medium" style={{ color: COLORS.textLight }}>Trusted pharmacies near you</p>
      </div>

      {/* Search */}
      <div className="relative group">
        <input 
            type="text" 
            placeholder="Search pharmacy or location..." 
            className="w-full pl-10 pr-4 py-4 rounded-2xl bg-white border border-slate-200 shadow-sm focus:ring-2 outline-none transition-all placeholder:text-slate-400"
            style={{ '--tw-ring-color': COLORS.primary } as React.CSSProperties}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />
        <Search className="absolute left-3 top-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
      </div>

      {/* MoMo Banner - Clickable */}
      <div 
        onClick={handleMoMoClick}
        className="bg-teal-50 border border-teal-200 rounded-2xl p-4 flex items-center justify-between shadow-sm cursor-pointer hover:bg-teal-100 active:scale-[0.98] transition-all"
      >
         <div className="flex flex-col">
            <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wide flex items-center gap-1">
                New Feature <ExternalLink size={10} />
            </span>
            <span className="font-bold text-slate-800 text-sm mt-1">Pay with Mobile Money</span>
         </div>
         <div className="h-10 w-14 bg-teal-500 rounded-lg flex items-center justify-center font-black text-xs text-white shadow-md">
            MoMo
         </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {filteredPharmacies.map(pharmacy => (
            <div key={pharmacy.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 transition-all hover:shadow-md">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg">{pharmacy.name}</h3>
                        <div className="flex items-center gap-1 text-slate-500 text-xs mt-1 font-medium">
                            <MapPin size={14} />
                            {pharmacy.location}
                        </div>
                    </div>
                    {pharmacy.isOpen ? (
                        <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-green-200">OPEN</span>
                    ) : (
                        <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-red-200">CLOSED</span>
                    )}
                </div>
                
                <div className="flex gap-3 mt-5">
                    <button 
                        onClick={() => handleCallClick(pharmacy.phone)}
                        className="flex-1 bg-slate-50 py-3 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-2 border border-slate-200 active:bg-slate-200 transition-colors hover:bg-slate-100"
                    >
                        <Phone size={16} /> Call
                    </button>
                    {pharmacy.offersDelivery && (
                         <button 
                            onClick={() => handleOrderClick(pharmacy.name)}
                            className="flex-1 py-3 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 shadow-md shadow-blue-200 active:opacity-90 active:scale-95 transition-all hover:brightness-110"
                            style={{ backgroundColor: COLORS.primary }}
                        >
                            <MessageCircle size={16} /> Order
                        </button>
                    )}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};