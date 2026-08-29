import React from 'react';
import { X, Check, AlertTriangle, ShieldCheck, Wrench, MapPin, Star, Truck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TextToSpeechButton } from './TextToSpeechButton';

export const EquipmentComparisonModal = () => {
  const { compareList, equipmentList, toggleCompare, openPaymentModal, t, lang } = useApp();

  if (compareList.length === 0) return null;

  const comparedItems = equipmentList.filter(item => compareList.includes(item.id));

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white border-t-2 border-[#2D6A4F] shadow-2xl p-4 md:p-6 rounded-t-2xl max-h-[85vh] overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-[#1B4D3E]">{t.comparisonTitle || "Side-by-Side Equipment Comparison"}</h3>
              <TextToSpeechButton
                textToSpeak={`${comparedItems.map(i => i.title).join(' compare with ')}`}
                lang={lang}
                label="Read Specs"
              />
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Compare renting rates, RTO validity, horsepower, maintenance history, and distance.
            </p>
          </div>
          <button
            onClick={() => comparedItems.forEach(i => toggleCompare(i.id))}
            className="p-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {comparedItems.length < 2 ? (
          <div className="py-8 text-center bg-amber-50 rounded-xl my-4 border border-amber-200">
            <p className="text-amber-800 font-medium">Select 1 more machine to see side-by-side comparison matrix.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {comparedItems.map((item, idx) => (
              <div key={item.id} className="bg-[#F8F9FA] rounded-2xl p-5 border border-gray-200 shadow-sm relative">
                <button
                  onClick={() => toggleCompare(item.id)}
                  className="absolute top-3 right-3 text-xs text-red-600 hover:underline font-semibold"
                >
                  Remove
                </button>
                <div className="flex gap-4 items-start">
                  <img
                    src={item.image || item.imageUrl || "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=400&q=80"}
                    alt={item.title}
                    className="w-24 h-24 object-cover rounded-xl border border-gray-300"
                  />
                  <div>
                    <span className="bg-[#2D6A4F]/10 text-[#2D6A4F] text-xs px-2.5 py-1 rounded-full font-bold">
                      Machine #{idx + 1}
                    </span>
                    <h4 className="text-lg font-bold text-gray-900 mt-1">{item.title}</h4>
                    <p className="text-xs text-gray-600">{item.brand} {item.model} ({item.year || 2023})</p>
                    <div className="flex items-center gap-1 text-amber-500 mt-1 text-sm font-bold">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span>{item.rating || 4.8} ({item.reviewsCount || 12} reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Specs Comparison Table */}
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between py-1.5 border-b border-gray-200">
                    <span className="text-gray-500">Rental Price:</span>
                    <span className="font-bold text-[#2D6A4F] text-base">₹{item.pricePerDay || item.dailyRentPrice} / day</span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-gray-200">
                    <span className="text-gray-500">Power / Capacity:</span>
                    <span className="font-semibold text-gray-800">{item.hp || item.horsepower || 45} HP</span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-gray-200">
                    <span className="text-gray-500">RTO Reg Status:</span>
                    <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-medium text-xs border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {item.rtoRegNumber || item.regNo || "MH-15-EG-4451"} (Verified)
                    </span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-gray-200">
                    <span className="text-gray-500">Maintenance Log:</span>
                    <span className="inline-flex items-center gap-1 text-gray-700 text-xs">
                      <Wrench className="w-3.5 h-3.5 text-amber-600" />
                      {item.lastServiceDate || "Serviced 10 days ago"}
                    </span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-gray-200">
                    <span className="text-gray-500">Distance & Location:</span>
                    <span className="inline-flex items-center gap-1 text-gray-700 text-xs font-medium">
                      <MapPin className="w-3.5 h-3.5 text-red-500" />
                      {item.location || item.locationName} ({item.distance || "4.5 km"})
                    </span>
                  </div>
                </div>

                <div className="mt-5">
                  <button
                    onClick={() => openPaymentModal(item.title, item.pricePerDay || item.dailyRentPrice || 2200)}
                    className="w-full bg-[#2D6A4F] text-white py-2.5 rounded-xl font-semibold hover:bg-[#1B4D3E] transition shadow"
                  >
                    Rent This Machine (Book Now)
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
