import React from 'react';
import { useApp } from '../context/AppContext';
import { PhoneCall, Shield, MapPin, Award } from 'lucide-react';

export const Footer = () => {
  const { t, setActiveTab } = useApp();

  return (
    <footer className="bg-[#143E24] text-white pt-16 pb-12 border-t-4 border-[#85A98F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-emerald-900/60">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-white text-[#143E24] flex items-center justify-center text-xl font-black">
                🌾
              </div>
              <span className="text-2xl font-black text-white tracking-tight font-serif">
                {t.brandName}
              </span>
            </div>
            <p className="text-emerald-100/80 text-sm leading-relaxed">
              {t.heroSub}
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-300 font-semibold">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Nashik • Pune • Kopargaon • Sangamner</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[#85A98F] text-xs font-bold uppercase tracking-wider mb-4">
              Platform Services
            </h4>
            <ul className="space-y-2.5 text-sm text-emerald-100/80">
              <li><button onClick={() => setActiveTab('dashboard')} className="hover:text-white transition-colors">Equipment Rentals</button></li>
              <li><button onClick={() => setActiveTab('labour')} className="hover:text-white transition-colors">Skilled Farm Labour</button></li>
              <li><button onClick={() => setActiveTab('comparison')} className="hover:text-white transition-colors">Equipment Comparison</button></li>
              <li><button onClick={() => setActiveTab('dealer')} className="hover:text-white transition-colors">New Machinery Sales</button></li>
              <li><button onClick={() => setActiveTab('location')} className="hover:text-white transition-colors">Live GPS Location Tracker</button></li>
            </ul>
          </div>

          {/* Trust & Safety */}
          <div>
            <h4 className="text-[#85A98F] text-xs font-bold uppercase tracking-wider mb-4">
              Trust & RTO Verification
            </h4>
            <ul className="space-y-2.5 text-sm text-emerald-100/80">
              <li className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Verified RTO Passings</span>
              </li>
              <li className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Razorpay Digital Guarantee</span>
              </li>
              <li className="flex items-center space-x-2">
                <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>24x7 Farmer Helpline Support</span>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-[#85A98F] text-xs font-bold uppercase tracking-wider mb-4">
              Farmer Assistance
            </h4>
            <div className="bg-[#215A36] p-4 rounded-xl space-y-2 border border-emerald-800">
              <span className="text-xs text-emerald-200 block">Kisan Call Helpline:</span>
              <a href="tel:18001801551" className="text-lg font-bold text-white block hover:underline">
                📞 1800-180-1551
              </a>
              <p className="text-xs text-emerald-200/80">
                Direct booking support for Marathi, Hindi, and English users.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar with mandatory credit */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-200/80 gap-4">
          <p>{t.footerCopyright}</p>
          
          {/* Explicit team credit requested by prompt */}
          <div className="bg-amber-400 text-stone-900 font-extrabold px-4 py-1.5 rounded-full text-xs uppercase tracking-widest shadow-sm">
            By team: SYNTRIX
          </div>
        </div>

      </div>
    </footer>
  );
};
