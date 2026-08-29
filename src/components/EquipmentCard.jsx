import React from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, ShieldCheck, CheckSquare, Square, Eye, CalendarCheck, PhoneCall } from 'lucide-react';

export const EquipmentCard = ({ equipment, onSelectDetail, onBook }) => {
  const { t, compareList, toggleCompare, startChatWithUser } = useApp();
  const isCompared = compareList.includes(equipment.id);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col justify-between">
      
      <div>
        {/* Card Media Header */}
        <div className="relative h-48 w-full overflow-hidden bg-stone-100">
          <img
            src={equipment.image}
            alt={equipment.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 bg-[#143E24]/90 text-white text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-xs shadow-xs">
            {equipment.type}
          </div>
          <div className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full shadow-xs ${
            equipment.availability === 'Available' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
          }`}>
            {equipment.availability}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-3">
          
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-bold text-stone-900 group-hover:text-[#143E24] transition-colors leading-snug">
              {equipment.name}
            </h3>
          </div>

          <div className="flex items-center text-xs text-stone-600 space-x-1">
            <MapPin className="w-3.5 h-3.5 text-[#2D6A4F] shrink-0" />
            <span>{equipment.location}</span>
          </div>

          {/* Pricing & RTO badge */}
          <div className="flex items-center justify-between pt-2 border-t border-stone-100">
            <div>
              <span className="text-xs text-stone-500 block">{t.rentPrice}</span>
              <span className="text-xl font-black text-[#143E24]">
                ₹{equipment.pricePerDay.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-stone-500 font-medium">{t.perDay}</span>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />
                RTO: {equipment.rtoInfo.regNumber}
              </span>
            </div>
          </div>

          <div className="text-xs text-stone-600 flex items-center justify-between bg-stone-50 p-2 rounded-lg">
            <span>Provider: <strong>{equipment.holderName}</strong></span>
            <button
              onClick={() => startChatWithUser(equipment.holderName, equipment.holderPhone, 'Equipment Holder')}
              className="text-[#143E24] hover:underline font-bold flex items-center"
            >
              <PhoneCall className="w-3 h-3 mr-1" />
              Chat
            </button>
          </div>

        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="px-5 pb-5 pt-2 border-t border-stone-100 space-y-2">
        
        {/* Checkbox for side-by-side comparison */}
        <label className="flex items-center space-x-2 text-xs font-semibold text-stone-700 cursor-pointer select-none">
          <button
            type="button"
            onClick={() => toggleCompare(equipment.id)}
            className="focus:outline-none text-[#143E24]"
          >
            {isCompared ? (
              <CheckSquare className="w-4 h-4 text-[#143E24]" />
            ) : (
              <Square className="w-4 h-4 text-stone-400" />
            )}
          </button>
          <span>{t.compareCheckbox}</span>
        </label>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => onSelectDetail(equipment)}
            className="flex items-center justify-center space-x-1 border border-stone-300 text-stone-800 hover:bg-stone-100 py-2 rounded-xl text-xs font-bold transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{t.viewDetails}</span>
          </button>

          <button
            onClick={() => onBook(equipment)}
            className="flex items-center justify-center space-x-1 bg-[#143E24] text-white hover:bg-[#215A36] py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>{t.bookNow}</span>
          </button>
        </div>

      </div>

    </div>
  );
};
