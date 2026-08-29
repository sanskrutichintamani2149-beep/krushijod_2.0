import React from 'react';
import { useApp } from '../context/AppContext';
import { Store, Phone, ShieldCheck, Tag, ArrowRight, MessageSquare } from 'lucide-react';

export const DealerPage = () => {
  const { t, dealerList, startChatWithUser } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 rounded-3xl p-8 text-white shadow-xl space-y-3 relative overflow-hidden">
        <div className="inline-flex items-center space-x-2 bg-purple-800/80 border border-purple-400/40 text-purple-200 text-xs font-bold px-3 py-1 rounded-full">
          <Store className="w-3.5 h-3.5 text-amber-300" />
          <span>Authorized OEM Brand Dealers • नवीन यंत्र खरेदी</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black font-serif tracking-tight">
          {t.dealerTitle}
        </h1>
        <p className="text-xs sm:text-sm text-purple-200/90 max-w-2xl leading-relaxed">
          {t.dealerSub} Purchase factory-fresh tractors, harvesters, and specialized tillage implements directly with official manufacturer warranties.
        </p>

        <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-purple-200">
          <span>✓ Authorized Mahindra, Sonalika & Escorts Showrooms</span>
          <span>✓ Zero Down-Payment EMI Schemes Available</span>
          <span>✓ Factory Warranty Coverage</span>
        </div>
      </div>

      {/* Distinction Alert Banner */}
      <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-2xl text-xs text-amber-950 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Tag className="w-5 h-5 text-amber-700 shrink-0" />
          <span className="font-bold">
            NOTE: This section is exclusively for buying BRAND NEW machinery. For daily rentals, visit the Equipment Rental Marketplace.
          </span>
        </div>
      </div>

      {/* Dealer Showroom Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {dealerList.map(item => (
          <div key={item.id} className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-all p-6 space-y-5 flex flex-col justify-between">
            
            <div className="space-y-4">
              <div className="relative h-52 rounded-2xl overflow-hidden bg-stone-100">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-amber-500 text-stone-950 text-xs font-black px-3 py-1 rounded-full shadow-xs uppercase tracking-wider">
                  {t.newBadge}
                </span>
                <span className="absolute bottom-3 right-3 bg-stone-900/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-xs">
                  {item.brand}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest block">{item.brand}</span>
                <h3 className="text-lg font-bold text-stone-900 leading-snug">{item.name}</h3>
                <div className="mt-2 flex items-baseline space-x-1">
                  <span className="text-xs text-stone-500 font-semibold">Sale Price:</span>
                  <span className="text-2xl font-black text-[#143E24]">₹{item.priceLakhs} Lakhs</span>
                </div>
              </div>

              <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-xs text-stone-700 space-y-1">
                <span className="font-bold text-stone-900 block text-[11px] uppercase">Technical Highlights:</span>
                <p className="leading-relaxed">{item.specs}</p>
              </div>

              <div className="bg-purple-50/70 p-3.5 rounded-2xl border border-purple-200 text-xs space-y-1">
                <span className="font-bold text-purple-950 block">{item.dealerName}</span>
                <span className="text-stone-600 block">{item.location}</span>
                <span className="text-purple-900 font-mono font-bold flex items-center pt-1">
                  <Phone className="w-3 h-3 mr-1 text-purple-700" />
                  {item.dealerPhone}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 grid grid-cols-2 gap-2">
              <button
                onClick={() => startChatWithUser(item.dealerName, item.dealerPhone, 'Dealer')}
                className="border border-stone-300 text-stone-800 hover:bg-stone-100 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#143E24]" />
                <span>Chat</span>
              </button>

              <button
                onClick={() => alert(`Official dealer quote request sent to ${item.dealerName}! Their team will contact ${item.dealerPhone}.`)}
                className="bg-[#143E24] hover:bg-[#215A36] text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                Request Quote
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
