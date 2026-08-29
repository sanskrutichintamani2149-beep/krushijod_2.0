import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Navigation, MapPin, Truck, Phone, RefreshCw, Clock, ShieldCheck } from 'lucide-react';

export const LiveMapTracker = ({ equipmentName = "Mahindra 575 DI Tractor", regNo = "MH 15 AB 4821", holderName = "Vijay Pawar", holderPhone = "+91 98220 12345" }) => {
  const { t, startChatWithUser } = useApp();
  
  // Simulation states
  const [progress, setProgress] = useState(65); // 65% distance covered
  const [distanceKm, setDistanceKm] = useState(8.4);
  const [etaMins, setEtaMins] = useState(22);
  const [isLive, setIsLive] = useState(true);

  // Smooth progress animation over time
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 98) return 98;
        const next = prev + 1;
        setDistanceKm(Number(((100 - next) * 0.24).toFixed(1)));
        setEtaMins(Math.max(2, Math.round((100 - next) * 0.6)));
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-6">
      
      {/* Tracker Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center space-x-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <h3 className="text-xl font-black text-stone-900 font-serif">{t.liveTracking}</h3>
          </div>
          <p className="text-xs text-stone-500 mt-1">Real-time GPS telemetry from {equipmentName} ({regNo})</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setProgress(30)}
            className="flex items-center space-x-1 text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-lg transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Path</span>
          </button>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200">
            GPS Signal: Strong (4G)
          </span>
        </div>
      </div>

      {/* Simulated Interactive Map Display */}
      <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden bg-emerald-950 border border-emerald-900 shadow-inner flex items-center justify-center">
        
        {/* Map Grid Pattern background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(#85A98F 1.5px, transparent 1.5px)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Road Vector Line */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 400" preserveAspectRatio="none">
          <path
            d="M 100 320 C 300 280, 400 120, 600 180 S 800 100, 900 80"
            fill="none"
            stroke="#215A36"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M 100 320 C 300 280, 400 120, 600 180 S 800 100, 900 80"
            fill="none"
            stroke="#85A98F"
            strokeWidth="3"
            strokeDasharray="8 8"
            strokeLinecap="round"
          />
        </svg>

        {/* Start / Origin Marker (Equipment Owner Hub - Nashik) */}
        <div className="absolute left-[10%] bottom-[20%] text-center z-10">
          <div className="w-9 h-9 rounded-full bg-emerald-800 text-white flex items-center justify-center mx-auto border-2 border-emerald-400 shadow-lg">
            <Truck className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold text-emerald-200 bg-black/60 px-2 py-0.5 rounded mt-1 block">
            Owner Hub
          </span>
        </div>

        {/* Destination Marker (Farmer Farm - Kopargaon Plot #42) */}
        <div className="absolute right-[10%] top-[20%] text-center z-10">
          <div className="w-10 h-10 rounded-full bg-amber-500 text-stone-900 flex items-center justify-center mx-auto border-2 border-amber-300 shadow-lg animate-bounce">
            <MapPin className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold text-amber-200 bg-black/60 px-2 py-0.5 rounded mt-1 block">
            {t.farmerLoc}
          </span>
        </div>

        {/* Moving Live Marker (Equipment Position) */}
        <div 
          className="absolute z-20 transition-all duration-1000 ease-out text-center -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${10 + (progress * 0.8)}%`,
            top: `${80 - (progress * 0.6)}%`
          }}
        >
          <div className="bg-[#143E24] text-white p-2 rounded-xl border-2 border-emerald-400 shadow-2xl flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold">
              🚜
            </div>
            <div className="text-left pr-1">
              <span className="text-[10px] text-emerald-200 font-bold block leading-none">LIVE TRACTOR</span>
              <span className="text-xs font-black text-white leading-none">{regNo}</span>
            </div>
          </div>
          <span className="text-[9px] font-extrabold text-emerald-300 bg-emerald-950/90 px-2 py-0.5 rounded-full border border-emerald-500/50 mt-1 inline-block">
            {distanceKm} km away ({etaMins} min)
          </span>
        </div>

        {/* Floating Telemetry Stats Bar */}
        <div className="absolute bottom-4 left-4 right-4 bg-stone-900/90 backdrop-blur-md text-white p-4 rounded-2xl border border-stone-700 flex flex-wrap items-center justify-between gap-4 z-20">
          
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-800 text-emerald-200">
              <Navigation className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">{t.distAway}</span>
              <span className="text-lg font-black text-emerald-400">{distanceKm} km</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-900/60 text-amber-300">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">{t.estTime}</span>
              <span className="text-lg font-black text-amber-400">~{etaMins} mins</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-blue-900/60 text-blue-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block">Operator Contact</span>
              <span className="text-sm font-bold text-white block">{holderName}</span>
            </div>
          </div>

        </div>

      </div>

      {/* Driver / Holder Quick Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-stone-50 p-4 rounded-2xl border border-stone-200 gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-[#143E24] text-white flex items-center justify-center font-bold">
            VP
          </div>
          <div>
            <h4 className="text-sm font-bold text-stone-900">{holderName}</h4>
            <p className="text-xs text-stone-500">Phone: {holderPhone} • Verified Owner</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <a
            href={`tel:${holderPhone}`}
            className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{t.callBtn}</span>
          </a>

          <button
            onClick={() => startChatWithUser(holderName, holderPhone, 'Equipment Holder')}
            className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 border border-stone-300 hover:bg-stone-200 text-stone-800 px-4 py-2 rounded-xl text-xs font-bold transition-all"
          >
            <span>{t.chatWithOwner}</span>
          </button>
        </div>
      </div>

    </div>
  );
};
