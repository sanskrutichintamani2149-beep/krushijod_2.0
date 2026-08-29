import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EquipmentCard } from '../components/EquipmentCard';
import { LabourCard } from '../components/LabourCard';
import { LiveMapTracker } from '../components/LiveMapTracker';
import { ChatSystem } from '../components/ChatSystem';
import { AIEstimatedCostModal } from '../components/AIEstimatedCostModal';
import { VoiceInputButton } from '../components/VoiceInputButton';
import { TextToSpeechButton } from '../components/TextToSpeechButton';
import {
  Tractor, Users, Scale, Calendar, MapPin, Search, Filter, ShieldCheck,
  PhoneCall, Play, FileText, CheckCircle2, ChevronRight, ArrowLeft, History,
  ShoppingBag, Sparkles, X, MessageSquare, DollarSign, Clock
} from 'lucide-react';

export const FarmerDashboard = () => {
  const {
    t, activeTab, setActiveTab, equipmentList, labourList, dealerList, compareList, toggleCompare,
    selectedEquipmentDetail, setSelectedEquipmentDetail, bookings, openPaymentModal,
    startChatWithUser, userProfile, lang
  } = useApp();

  // Internal search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [isAICostModalOpen, setIsAICostModalOpen] = useState(false);
  const [historyCategoryFilter, setHistoryCategoryFilter] = useState("All");

  // Dealer inquiry state
  const [selectedDealerProduct, setSelectedDealerProduct] = useState(null);
  const [inquiryText, setInquiryText] = useState("");

  // Activity History Database timeline state
  const [activityLogs, setActivityLogs] = useState([
    {
      id: "act-1",
      date: "2026-08-18",
      year: "2026",
      category: "Equipment",
      title: "Mahindra 575 DI Tractor Rented",
      description: "Booked for 2 days for ploughing at Kopargaon farm",
      amount: 4400,
      status: "Confirmed",
      provider: "Vijay Pawar"
    },
    {
      id: "act-2",
      date: "2026-08-15",
      year: "2026",
      category: "Labour",
      title: "Wheat Harvesting Labour Hired",
      description: "Hired 4 workers for 8 hours shift",
      amount: 2000,
      status: "Completed",
      provider: "Suresh Shinde Group"
    },
    {
      id: "act-3",
      date: "2026-08-10",
      year: "2026",
      category: "Purchases",
      title: "Seed Drill Machine Purchase Inquiry",
      description: "Inquired with Shree Krushi Dealer regarding 9-tyne automatic drill",
      amount: 65000,
      status: "Inquiry Sent",
      provider: "Shree Krushi Dealer"
    },
    {
      id: "act-4",
      date: "2026-08-05",
      year: "2026",
      category: "Payments",
      title: "Razorpay Digital Payment",
      description: "UPI Payment for Rotavator booking #BKG-8841",
      amount: 1800,
      status: "Paid via UPI",
      provider: "Razorpay Gateway"
    },
    {
      id: "act-5",
      date: "2026-07-28",
      year: "2026",
      category: "Labour",
      title: "Pesticide Spraying Service",
      description: "2 workers hired for 6 hours spraying shift",
      amount: 1200,
      status: "Completed",
      provider: "Ganesh Labourers"
    }
  ]);

  // Equipment filtering
  const filteredEquipment = equipmentList.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "All" || item.type === typeFilter;
    const matchesLocation = locationFilter === "All" || item.location.includes(locationFilter);
    return matchesSearch && matchesType && matchesLocation;
  });

  // History filtering
  const filteredHistory = activityLogs.filter(item => {
    return historyCategoryFilter === "All" || item.category === historyCategoryFilter;
  });

  const handleSendDealerInquiry = (e) => {
    e.preventDefault();
    if (!selectedDealerProduct) return;
    startChatWithUser(selectedDealerProduct.dealerName || "Dealer", "+91 98221 99001", "Dealer");
    setSelectedDealerProduct(null);
    setInquiryText("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1B4D3E] to-[#2D6A4F] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest block">Farmer Dashboard • शेतकरी डॅशबोर्ड</span>
          <h1 className="text-2xl sm:text-3xl font-black font-serif mt-1">Welcome, {userProfile.name}! 👋</h1>
          <p className="text-xs text-emerald-100 mt-1 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            {userProfile.location} • Verified Farmer Profile
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsAICostModalOpen(true)}
            className="bg-amber-400 hover:bg-amber-300 text-emerald-950 px-4 py-2.5 rounded-xl text-xs font-black transition-all shadow flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-emerald-950" />
            AI Budget Calculator
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className="bg-white/15 hover:bg-white/25 text-white border border-white/30 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <History className="w-4 h-4" />
            Activity History
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-gray-200 text-xs font-bold">
        {[
          { id: 'dashboard', label: t.dbHome, icon: Tractor },
          { id: 'equipment-list', label: t.dbEquipment, icon: Search },
          { id: 'labour-list', label: t.dbLabour, icon: Users },
          { id: 'dealer-marketplace', label: "Buy New Equipment (Dealer)", icon: ShoppingBag },
          { id: 'history', label: "Activity History", icon: History },
          { id: 'comparison', label: `${t.dbCompare} (${compareList.length})`, icon: Scale },
          { id: 'bookings', label: t.dbBookings, icon: Calendar },
          { id: 'location', label: t.dbLocation, icon: MapPin },
          { id: 'chat', label: t.dbChat, icon: PhoneCall },
        ].map(tab => {
          const IconC = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#1B4D3E] text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <IconC className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: DASHBOARD OVERVIEW HOME */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          
          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              onClick={() => setActiveTab('equipment-list')}
              className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:border-[#2D6A4F] cursor-pointer transition-all space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#1B4D3E] flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform">
                🚜
              </div>
              <h3 className="text-sm font-bold text-gray-900">{t.findEquipment}</h3>
              <p className="text-xs text-gray-500">Rent tractors, rotavators & harvesters near your farm.</p>
            </div>

            <div
              onClick={() => setActiveTab('labour-list')}
              className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:border-[#2D6A4F] cursor-pointer transition-all space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform">
                👨‍🌾
              </div>
              <h3 className="text-sm font-bold text-gray-900">{t.findLabour}</h3>
              <p className="text-xs text-gray-500">Hire skilled sowing, harvesting & farm labour.</p>
            </div>

            <div
              onClick={() => setActiveTab('dealer-marketplace')}
              className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:border-[#2D6A4F] cursor-pointer transition-all space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform">
                🏪
              </div>
              <h3 className="text-sm font-bold text-gray-900">Buy New Machinery</h3>
              <p className="text-xs text-gray-500">Direct sales from authorized brand dealers.</p>
            </div>

            <div
              onClick={() => setActiveTab('history')}
              className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:border-[#2D6A4F] cursor-pointer transition-all space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform">
                📜
              </div>
              <h3 className="text-sm font-bold text-gray-900">Agricultural History</h3>
              <p className="text-xs text-gray-500">Permanent database timeline of rentals & hiring.</p>
            </div>
          </div>

          {/* Featured Machinery Ready for Booking */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900 font-serif">Verified Machinery Ready for Booking</h3>
              <button
                onClick={() => setActiveTab('equipment-list')}
                className="text-xs font-bold text-[#2D6A4F] hover:underline"
              >
                View All Machinery →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {equipmentList.slice(0, 3).map(eq => (
                <EquipmentCard
                  key={eq.id}
                  equipment={eq}
                  onSelectDetail={(item) => {
                    setSelectedEquipmentDetail(item);
                    setActiveTab('equipment-detail');
                  }}
                  onBook={(item) => openPaymentModal(item.name, item.pricePerDay, item)}
                />
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: EQUIPMENT MARKETPLACE */}
      {activeTab === 'equipment-list' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-96 flex items-center gap-2">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search equipment, location, or brand..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2D6A4F]"
                />
              </div>
              <VoiceInputButton
                lang={lang}
                onResult={(query) => setSearchTerm(query)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold"
              >
                <option value="All">All Machinery Types</option>
                <option value="Tractor">Tractors</option>
                <option value="Rotavator">Rotavators</option>
                <option value="Harvester">Harvesters</option>
                <option value="Seed Drill">Seed Drills</option>
              </select>

              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold"
              >
                <option value="All">All Locations</option>
                <option value="Nashik">Nashik</option>
                <option value="Pune">Pune</option>
                <option value="Kopargaon">Kopargaon</option>
                <option value="Sangamner">Sangamner</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredEquipment.map(eq => (
              <EquipmentCard
                key={eq.id}
                equipment={eq}
                onSelectDetail={(item) => {
                  setSelectedEquipmentDetail(item);
                  setActiveTab('equipment-detail');
                }}
                onBook={(item) => openPaymentModal(item.name, item.pricePerDay, item)}
              />
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: LABOUR MARKETPLACE */}
      {activeTab === 'labour-list' && (
        <div className="space-y-6">
          <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 font-serif">{t.labourTitle}</h2>
              <p className="text-xs text-gray-600 mt-1">{t.labourSub}</p>
            </div>
            <TextToSpeechButton
              textToSpeak="Find skilled agricultural labourers for sowing, harvesting, weeding and farm work in your village."
              lang={lang}
              label="Listen Instructions"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {labourList.map(lab => (
              <LabourCard
                key={lab.id}
                labour={lab}
                onBook={(worker) => openPaymentModal(`Labour Hiring: ${worker.name}`, worker.dailyRate, worker)}
              />
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: DEALER MARKETPLACE (BUY NEW EQUIPMENT) */}
      {activeTab === 'dealer-marketplace' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-6 rounded-3xl shadow-lg">
            <h2 className="text-2xl font-bold font-serif">Buy New Agricultural Equipment</h2>
            <p className="text-xs text-purple-200 mt-1">Direct listings from authorized dealership brand showrooms in Maharashtra.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dealerList.map(dealer => (
              <div key={dealer.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                <img
                  src={dealer.image}
                  alt={dealer.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                      NEW FOR SALE
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 mt-2">{dealer.name}</h3>
                    <p className="text-xs text-gray-600">{dealer.dealerName} ({dealer.location})</p>
                    <p className="text-xl font-extrabold text-[#2D6A4F] mt-2">₹{dealer.price.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{dealer.description}</p>
                  </div>

                  <button
                    onClick={() => setSelectedDealerProduct(dealer)}
                    className="w-full bg-[#2D6A4F] text-white py-2.5 rounded-xl text-xs font-bold hover:bg-[#1B4D3E] shadow transition flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Send Dealer Inquiry
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: AGRICULTURAL ACTIVITY HISTORY & TIMELINE */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 font-serif flex items-center gap-2">
                <History className="w-6 h-6 text-[#2D6A4F]" />
                My Agricultural Activity History
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Permanent database log of your labour hiring, equipment rentals, dealer inquiries, and payment transactions.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2 text-xs">
              {['All', 'Labour', 'Equipment', 'Purchases', 'Payments'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setHistoryCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition ${
                    historyCategoryFilter === cat
                      ? 'bg-[#2D6A4F] text-white shadow'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-gray-900 font-serif">Year 2026 Timeline Log</h3>

            <div className="relative border-l-2 border-emerald-300 ml-4 space-y-8">
              {filteredHistory.map(item => (
                <div key={item.id} className="relative pl-6">
                  <div className="absolute -left-2.5 top-1.5 w-5 h-5 rounded-full bg-[#2D6A4F] border-4 border-white shadow" />
                  
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                          {item.date} • {item.category}
                        </span>
                        <h4 className="text-base font-bold text-gray-900">{item.title}</h4>
                      </div>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                        {item.status}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600">{item.description}</p>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-200 text-xs">
                      <span className="text-gray-500 font-medium">Provider: <strong>{item.provider}</strong></span>
                      {item.amount && (
                        <span className="text-base font-extrabold text-[#2D6A4F]">₹{item.amount.toLocaleString('en-IN')}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: COMPARISON */}
      {activeTab === 'comparison' && (
        <div className="space-y-6">
          <div className="bg-stone-50 p-6 rounded-3xl border border-stone-200">
            <h2 className="text-xl font-bold text-stone-900 font-serif">{t.comparisonTitle}</h2>
            <p className="text-xs text-stone-600 mt-1">{t.comparisonSub}</p>
          </div>
        </div>
      )}

      {/* TAB 7: BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-stone-900 font-serif">{t.dbBookings}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookings.map(b => (
              <div key={b.id} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-mono text-stone-400 font-bold">{b.id}</span>
                    <h3 className="text-base font-bold text-stone-900">{b.itemName}</h3>
                  </div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                    {b.status}
                  </span>
                </div>

                <div className="text-xs text-stone-600 space-y-1">
                  <p>Provider: <strong>{b.providerName}</strong> ({b.providerPhone})</p>
                  <p>Dates: {b.startDate} - {b.endDate}</p>
                  <p className="font-semibold text-emerald-950">{b.paymentStatus}</p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xl font-black text-[#143E24]">₹{b.totalAmount}</span>
                  <button
                    onClick={() => setActiveTab('location')}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl"
                  >
                    Track Live GPS Location
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: LOCATION TRACKING */}
      {activeTab === 'location' && (
        <div className="space-y-6">
          <LiveMapTracker />
        </div>
      )}

      {/* TAB 9: CHAT SYSTEM */}
      {activeTab === 'chat' && (
        <div className="space-y-6">
          <ChatSystem />
        </div>
      )}

      {/* AI Farm Cost Modal */}
      <AIEstimatedCostModal
        isOpen={isAICostModalOpen}
        onClose={() => setIsAICostModalOpen(false)}
      />

      {/* Dealer Inquiry Modal */}
      {selectedDealerProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedDealerProduct(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-gray-900">Inquire Equipment Purchase</h3>
            <p className="text-xs text-gray-500 mt-0.5">{selectedDealerProduct.name} ({selectedDealerProduct.dealerName})</p>
            
            <form onSubmit={handleSendDealerInquiry} className="mt-4 space-y-3 text-sm">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Your Message / Requirements</label>
                <textarea
                  required
                  rows={3}
                  value={inquiryText}
                  onChange={e => setInquiryText(e.target.value)}
                  placeholder="I am interested in buying this tractor. Please share quotation and warranty details..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2D6A4F] text-xs"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#2D6A4F] text-white py-2.5 rounded-xl font-bold hover:bg-[#1B4D3E]"
              >
                Send Inquiry to Dealer
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
