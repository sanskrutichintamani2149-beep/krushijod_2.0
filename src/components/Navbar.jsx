import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Globe, User, ShieldCheck, Menu, X, ArrowRightLeft, Bell, Lock } from 'lucide-react';

export const Navbar = () => {
  const { lang, changeLanguage, t, userRole, validateAdminPassword, isAdminAccessGranted, setIsLoginModalOpen, activeTab, setActiveTab, userProfile } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const roleLabel = isAdminAccessGranted ? 'Admin' : userRole;

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const handleAdminAccessRequest = () => {
    if (isAdminAccessGranted) {
      setActiveTab('admin-dashboard');
      setIsMobileMenuOpen(false);
      return;
    }

    const enteredPassword = window.prompt('Enter admin password');
    if (!validateAdminPassword(enteredPassword)) {
      setIsMobileMenuOpen(false);
      return;
    }

    setActiveTab('admin-dashboard');
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNavClick('landing')}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#1B4D3E] to-[#2D6A4F] text-white flex items-center justify-center text-2xl font-extrabold shadow-md">
              🌾
            </div>
            <div>
              <span className="text-2xl font-black text-[#1B4D3E] tracking-tight font-serif">
                {t.brandName}
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-[#2D6A4F] -mt-1">
                {t.tagline}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => handleNavClick('landing')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'landing' ? 'bg-[#2D6A4F]/10 text-[#1B4D3E]' : 'text-gray-700 hover:text-[#1B4D3E] hover:bg-gray-50'
              }`}
            >
              {t.navHome}
            </button>

            <button
              onClick={() => handleNavClick(userRole === 'Farmer' ? 'dashboard' : 'landing')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'dashboard' || activeTab === 'equipment-list' ? 'bg-[#2D6A4F]/10 text-[#1B4D3E]' : 'text-gray-700 hover:text-[#1B4D3E] hover:bg-gray-50'
              }`}
            >
              {t.navEquipment}
            </button>

            <button
              onClick={() => handleNavClick('labour')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'labour' || activeTab === 'labour-list' ? 'bg-[#2D6A4F]/10 text-[#1B4D3E]' : 'text-gray-700 hover:text-[#1B4D3E] hover:bg-gray-50'
              }`}
            >
              {t.navLabour}
            </button>

            <button
              onClick={() => handleNavClick('dealer')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'dealer' || activeTab === 'dealer-marketplace' ? 'bg-[#2D6A4F]/10 text-[#1B4D3E]' : 'text-gray-700 hover:text-[#1B4D3E] hover:bg-gray-50'
              }`}
            >
              {t.navNewEquipment}
            </button>

            {/* Admin Panel Direct Link */}
            <button
              onClick={handleAdminAccessRequest}
              className={`px-3 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1 ${
                activeTab === 'admin-dashboard' && isAdminAccessGranted
                  ? 'bg-amber-400 text-emerald-950 shadow'
                  : 'bg-amber-100/80 text-amber-900 hover:bg-amber-200/80'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-900" />
              Admin
            </button>
          </nav>

          {/* Right Action Bar */}
          <div className="hidden md:flex items-center space-x-3">
            
            {/* Language Selector */}
            <div className="relative flex items-center bg-gray-100 border border-gray-200 rounded-xl p-1 text-xs font-semibold">
              <Globe className="w-3.5 h-3.5 text-[#2D6A4F] ml-1.5 mr-1" />
              <button
                onClick={() => changeLanguage('en')}
                className={`px-2 py-1 rounded-lg transition-all ${lang === 'en' ? 'bg-[#1B4D3E] text-white shadow' : 'text-gray-600 hover:text-gray-900'}`}
              >
                EN
              </button>
              <button
                onClick={() => changeLanguage('mr')}
                className={`px-2 py-1 rounded-lg transition-all ${lang === 'mr' ? 'bg-[#1B4D3E] text-white shadow' : 'text-gray-600 hover:text-gray-900'}`}
              >
                मराठी
              </button>
              <button
                onClick={() => changeLanguage('hi')}
                className={`px-2 py-1 rounded-lg transition-all ${lang === 'hi' ? 'bg-[#1B4D3E] text-white shadow' : 'text-gray-600 hover:text-gray-900'}`}
              >
                हिंदी
              </button>
            </div>

            {/* Notifications Button */}
            <button
              onClick={() => alert("You have 3 active notifications:\n1. Booking #BKG-8841 confirmed\n2. RTO verification approved\n3. New message from Suresh Shinde")}
              className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-ping" />
            </button>

            {/* Current Active Role Badge & Switcher */}
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center space-x-2 bg-[#1B4D3E] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#2D6A4F] transition-all shadow-md group"
            >
              <User className="w-4 h-4 text-emerald-300" />
              <div className="text-left">
                <span className="text-[10px] block text-emerald-200 uppercase font-semibold leading-tight">
                  {userProfile.name}
                </span>
                <span className="text-xs font-bold leading-tight flex items-center">
                  {roleLabel}
                  <ArrowRightLeft className="w-3 h-3 ml-1.5 opacity-80 group-hover:rotate-180 transition-transform" />
                </span>
              </div>
            </button>

          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-gray-100 text-gray-700 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-3 pb-6 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-[#2D6A4F]" />
              <span className="text-xs font-bold text-gray-600">Language / भाषा:</span>
            </div>
            <div className="flex space-x-1 text-xs">
              <button onClick={() => changeLanguage('en')} className={`px-2.5 py-1 rounded-lg ${lang === 'en' ? 'bg-[#1B4D3E] text-white' : 'bg-gray-100'}`}>EN</button>
              <button onClick={() => changeLanguage('mr')} className={`px-2.5 py-1 rounded-lg ${lang === 'mr' ? 'bg-[#1B4D3E] text-white' : 'bg-gray-100'}`}>मराठी</button>
              <button onClick={() => changeLanguage('hi')} className={`px-2.5 py-1 rounded-lg ${lang === 'hi' ? 'bg-[#1B4D3E] text-white' : 'bg-gray-100'}`}>हिंदी</button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button onClick={() => handleNavClick('landing')} className="text-left px-3 py-2 text-xs font-bold text-gray-800 bg-gray-50 rounded-xl">{t.navHome}</button>
            <button onClick={() => handleNavClick('dashboard')} className="text-left px-3 py-2 text-xs font-bold text-gray-800 bg-gray-50 rounded-xl">{t.navEquipment}</button>
            <button onClick={() => handleNavClick('labour')} className="text-left px-3 py-2 text-xs font-bold text-gray-800 bg-gray-50 rounded-xl">{t.navLabour}</button>
            <button onClick={() => handleNavClick('dealer')} className="text-left px-3 py-2 text-xs font-bold text-gray-800 bg-gray-50 rounded-xl">{t.navNewEquipment}</button>
            <button onClick={handleAdminAccessRequest} className="col-span-2 text-left px-3 py-2 text-xs font-bold text-emerald-950 bg-amber-200 rounded-xl">🛡️ Admin Panel</button>
          </div>

          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsLoginModalOpen(true);
            }}
            className="w-full mt-2 flex items-center justify-center space-x-2 bg-[#1B4D3E] text-white py-2.5 rounded-xl text-xs font-bold shadow"
          >
            <User className="w-4 h-4" />
            <span>{t.navLogin} ({roleLabel})</span>
          </button>
        </div>
      )}
    </header>
  );
};
