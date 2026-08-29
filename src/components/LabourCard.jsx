import React from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Phone, MessageSquare, Calendar, Award } from 'lucide-react';

export const LabourCard = ({ labour, onBook }) => {
  const { t, startChatWithUser } = useApp();

  const getCategoryBadgeColor = (cat) => {
    switch (cat) {
      case 'General Labour': return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Seeding Worker': return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'Wheat Worker': return 'bg-yellow-100 text-yellow-900 border-yellow-300';
      case 'Equipment Handler': return 'bg-indigo-100 text-indigo-900 border-indigo-300';
      default: return 'bg-stone-100 text-stone-900 border-stone-300';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
      
      <div className="space-y-4">
        
        {/* Profile Header */}
        <div className="flex items-start space-x-4">
          <img
            src={labour.image}
            alt={labour.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-[#85A98F] shrink-0"
          />
          <div>
            <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${getCategoryBadgeColor(labour.category)} mb-1`}>
              {labour.category}
            </span>
            <h3 className="text-lg font-bold text-stone-900 leading-snug">
              {labour.name}
            </h3>
            <div className="flex items-center text-xs text-stone-600 space-x-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#2D6A4F]" />
              <span>{labour.location}</span>
            </div>
          </div>
        </div>

        {/* Bio & Details */}
        <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed bg-stone-50 p-2.5 rounded-xl">
          "{labour.bio}"
        </p>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs border-y border-stone-100 py-3">
          <div>
            <span className="text-stone-500 block">Daily Rate:</span>
            <span className="text-base font-black text-[#143E24]">₹{labour.dailyRate}</span>
            <span className="text-[10px] text-stone-500"> / day</span>
          </div>

          <div>
            <span className="text-stone-500 block">Experience:</span>
            <span className="font-bold text-stone-800 flex items-center">
              <Award className="w-3.5 h-3.5 text-amber-600 mr-1" />
              {labour.experienceYears} Years
            </span>
          </div>
        </div>

        {/* Visible Mobile Number */}
        <div className="flex items-center justify-between text-xs font-medium text-stone-700 bg-emerald-50/70 border border-emerald-200 px-3 py-2 rounded-xl">
          <span className="flex items-center text-emerald-900 font-semibold">
            <Phone className="w-3.5 h-3.5 text-emerald-700 mr-1.5" />
            {labour.phone}
          </span>
          <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-100 px-2 py-0.5 rounded">
            Verified
          </span>
        </div>

      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2 pt-4">
        <button
          onClick={() => startChatWithUser(labour.name, labour.phone, 'Labourer')}
          className="flex items-center justify-center space-x-1 border border-stone-300 text-stone-800 hover:bg-stone-100 py-2.5 rounded-xl text-xs font-bold transition-all"
        >
          <MessageSquare className="w-3.5 h-3.5 text-[#143E24]" />
          <span>{t.chatWithOwner}</span>
        </button>

        <button
          onClick={() => onBook(labour)}
          className="flex items-center justify-center space-x-1 bg-[#143E24] text-white hover:bg-[#215A36] py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>{t.bookNow}</span>
        </button>
      </div>

    </div>
  );
};
