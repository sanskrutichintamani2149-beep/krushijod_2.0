import React from 'react';
import { useApp } from '../context/AppContext';
import { EquipmentCard } from '../components/EquipmentCard';
import { LabourCard } from '../components/LabourCard';
import { LiveMapTracker } from '../components/LiveMapTracker';
import { ArrowRight, ShieldCheck, MapPin, PhoneCall, CheckCircle2, ChevronRight, Scale, Sparkles, Store } from 'lucide-react';

export const LandingPage = () => {
  const { t, setActiveTab, setSelectedEquipmentDetail, openPaymentModal, equipmentList, labourList, dealerList } = useApp();

  const previewEquipment = equipmentList.slice(0, 3);
  const previewLabour = labourList.slice(0, 3);

  return (
    <div className="space-y-20 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#143E24] via-[#1B4D3E] to-[#143E24] text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        
        {/* Subtle background overlay */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#85A98F 2px, transparent 2px)`,
            backgroundSize: '32px 32px'
          }}
        />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            <div className="inline-flex items-center space-x-2 bg-emerald-900/80 border border-emerald-500/40 text-emerald-200 text-xs font-bold px-3.5 py-1.5 rounded-full backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>India's Premier Agri-Tech Resource Network</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white font-serif">
              {t.heroTitle}
            </h1>

            <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed font-normal max-w-2xl">
              {t.heroSub} Eliminate seasonal labor shortages, compare equipment daily rates side-by-side, verify RTO registration details, and track machinery arrival live on GPS.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
              <button
                onClick={() => setActiveTab('dashboard')}
                className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-black px-7 py-4 rounded-2xl text-base shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
              >
                <span>{t.findEquipment}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => setActiveTab('labour')}
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-7 py-4 rounded-2xl text-base border border-white/30 backdrop-blur-xs transition-all flex items-center justify-center space-x-2"
              >
                <span>{t.findLabour}</span>
                <ChevronRight className="w-5 h-5 text-emerald-300" />
              </button>
            </div>

            {/* Micro Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-emerald-800/80 text-xs text-emerald-200 font-semibold">
              <div>
                <span className="text-xl font-extrabold text-white block">5,000+</span>
                <span>Farmers Joined</span>
              </div>
              <div>
                <span className="text-xl font-extrabold text-white block">1,200+</span>
                <span>Machines Listed</span>
              </div>
              <div>
                <span className="text-xl font-extrabold text-white block">3,500+</span>
                <span>Workers Verified</span>
              </div>
              <div>
                <span className="text-xl font-extrabold text-white block">100%</span>
                <span>RTO Checked</span>
              </div>
            </div>

          </div>

          {/* Right Imagery Banner */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-emerald-700/50 bg-stone-900 group">
              <img
                src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1000&q=80"
                alt="Indian Farm Tractor"
                className="w-full h-[420px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* Floating verified badge */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-stone-200 text-stone-900 shadow-xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#143E24] text-white flex items-center justify-center font-bold text-lg">
                    🚜
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-[#143E24]">Live RTO Verified</h4>
                    <p className="text-xs font-bold text-stone-800">MH 15 AB 4821 • Nashik</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                  Available Now
                </span>
              </div>

            </div>
          </div>

        </div>

      </section>

      {/* 2. EQUIPMENT MARKETPLACE PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#2D6A4F] uppercase tracking-wider block">Agricultural Machinery</span>
            <h2 className="text-3xl font-black text-stone-900 font-serif">{t.equipMarketTitle}</h2>
            <p className="text-xs text-stone-600 max-w-xl mt-1">{t.equipMarketSub}</p>
          </div>

          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center space-x-1.5 text-xs font-bold text-[#143E24] hover:text-[#215A36] bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-200 transition-all self-start sm:self-auto"
          >
            <span>View All 1,200+ Equipment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {previewEquipment.map(eq => (
            <EquipmentCard
              key={eq.id}
              equipment={eq}
              onSelectDetail={(item) => {
                setSelectedEquipmentDetail(item);
                setActiveTab('equipment-detail');
              }}
              onBook={(item) => {
                openPaymentModal(item.name, item.pricePerDay, item);
              }}
            />
          ))}
        </div>

      </section>

      {/* 3. LABOUR CATEGORIES & MARKETPLACE PREVIEW */}
      <section className="bg-[#F4F6F0] py-16 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#2D6A4F] uppercase tracking-wider block">Workforce Segregation</span>
            <h2 className="text-3xl font-black text-stone-900 font-serif">{t.labourTitle}</h2>
            <p className="text-xs text-stone-600">{t.labourSub}</p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: t.generalLabour, count: "1,400+ Workers", icon: "🌾", desc: "Weeding, irrigation & land clearing" },
              { title: t.seedingWorker, count: "850+ Workers", icon: "🌱", desc: "Nursery transplanting & seed sowing" },
              { title: t.wheatWorker, count: "920+ Workers", icon: "🌾", desc: "Manual crop cutting & bundle thrashing" },
              { title: t.equipmentHandler, count: "380+ Drivers", icon: "🚜", desc: "Tractor drivers & harvester operators" },
            ].map((cat, idx) => (
              <div 
                key={idx} 
                onClick={() => setActiveTab('labour')}
                className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:border-[#143E24] cursor-pointer transition-all hover:-translate-y-1"
              >
                <div className="text-3xl mb-2">{cat.icon}</div>
                <h3 className="text-sm font-bold text-stone-900">{cat.title}</h3>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded mt-1 inline-block">
                  {cat.count}
                </span>
                <p className="text-xs text-stone-500 mt-2">{cat.desc}</p>
              </div>
            ))}
          </div>

          {/* Labour Preview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {previewLabour.map(lab => (
              <LabourCard
                key={lab.id}
                labour={lab}
                onBook={(worker) => openPaymentModal(`Labour Booking: ${worker.name}`, worker.dailyRate, worker)}
              />
            ))}
          </div>

        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section id="how-it-works-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#2D6A4F] uppercase tracking-wider block">Simple Process</span>
          <h2 className="text-3xl font-black text-stone-900 font-serif">{t.howTitle}</h2>
          <p className="text-xs text-stone-600">{t.howSub}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { title: t.howStep1, desc: t.howStep1Desc, icon: MapPin },
            { title: t.howStep2, desc: t.howStep2Desc, icon: Scale },
            { title: t.howStep3, desc: t.howStep3Desc, icon: PhoneCall },
            { title: t.howStep4, desc: t.howStep4Desc, icon: ShieldCheck }
          ].map((step, idx) => {
            const IconComp = step.icon;
            return (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3 relative">
                <div className="w-12 h-12 rounded-2xl bg-[#143E24] text-white flex items-center justify-center shadow-md">
                  <IconComp className="w-6 h-6 text-emerald-300" />
                </div>
                <h3 className="text-base font-bold text-stone-900">{step.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. LIVE LOCATION TRACKING PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-10 space-y-8 border border-stone-800">
          <div className="max-w-xl space-y-2">
            <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest block">Live Telemetry Preview</span>
            <h2 className="text-3xl font-black text-white font-serif">{t.liveTracking}</h2>
            <p className="text-xs text-stone-300">
              Farmers can monitor the exact movement of booked tractors and harvesters from dispatch to plot arrival.
            </p>
          </div>

          <LiveMapTracker />
        </div>
      </section>

      {/* 6. NEW EQUIPMENT DEALER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#2D6A4F] uppercase tracking-wider block">Brand New Sales</span>
            <h2 className="text-3xl font-black text-stone-900 font-serif">{t.dealerTitle}</h2>
            <p className="text-xs text-stone-600 mt-1">{t.dealerSub}</p>
          </div>

          <button
            onClick={() => setActiveTab('dealer')}
            className="flex items-center space-x-1 text-xs font-bold text-[#143E24] bg-emerald-50 hover:bg-emerald-100 px-4 py-2.5 rounded-xl border border-emerald-200 transition-all"
          >
            <Store className="w-4 h-4 mr-1" />
            <span>Browse Dealer Showroom</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dealerList.map(item => (
            <div key={item.id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs p-5 space-y-4">
              <div className="relative h-44 rounded-xl overflow-hidden bg-stone-100">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-amber-500 text-stone-950 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                  {t.newBadge}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-stone-500 uppercase">{item.brand}</span>
                <h3 className="text-base font-bold text-stone-900 leading-snug">{item.name}</h3>
                <span className="text-xl font-black text-[#143E24] block mt-1">₹{item.priceLakhs} Lakhs</span>
              </div>

              <p className="text-xs text-stone-600 line-clamp-2 bg-stone-50 p-2.5 rounded-xl">
                {item.specs}
              </p>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-500 truncate max-w-[150px]">{item.dealerName}</span>
                <button
                  onClick={() => alert(`Contacting ${item.dealerName} at ${item.dealerPhone}`)}
                  className="bg-[#143E24] text-white font-bold px-3 py-1.5 rounded-lg text-xs hover:bg-[#215A36] transition-all"
                >
                  {t.contactDealer}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FINAL CTA & MANDATORY FOOTER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#143E24] to-[#2D6A4F] rounded-3xl p-8 sm:p-12 text-center text-white space-y-6 shadow-xl relative overflow-hidden">
          
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black font-serif">
              Ready to Connect Your Farm Today?
            </h2>
            <p className="text-emerald-100 text-sm">
              Join thousands of farmers across Maharashtra finding reliable labour & verified machinery at transparent rates.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-black px-8 py-3.5 rounded-xl text-sm shadow-md transition-all"
            >
              {t.findEquipment}
            </button>
            <button
              onClick={() => setActiveTab('labour')}
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-3.5 rounded-xl text-sm border border-white/30 transition-all"
            >
              {t.findLabour}
            </button>
          </div>

          {/* Mandatory Team Credit Banner at the end of the landing page */}
          <div className="pt-6 border-t border-emerald-700/60">
            <span className="inline-block bg-white/10 text-emerald-200 font-mono text-xs px-4 py-1.5 rounded-full border border-white/20 uppercase tracking-widest">
              By team: SYNTRIX
            </span>
          </div>

        </div>
      </section>

    </div>
  );
};
