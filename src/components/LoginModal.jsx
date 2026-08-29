import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserCheck, ShieldCheck, Globe, Check, ArrowRight, ArrowLeft, Lock, Mail, Phone } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const LoginModal = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, userRole, switchRole, lang, changeLanguage, t } = useApp();
  
  // 3-step auth wizard
  const [step, setStep] = useState(1);
  const [selectedLang, setSelectedLang] = useState(lang);
  const [selectedRole, setSelectedRole] = useState(userRole);
  
  // Auth Form State
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isLoginModalOpen) return null;

  const roles = [
    {
      id: 'Farmer',
      title: t.farmer || 'Farmer',
      desc: 'Book agricultural equipment, hire farm labourers, track live machinery arrival, & manage activity history.',
      icon: '🌾'
    },
    {
      id: 'Labour',
      title: t.labour || 'Labourer',
      desc: 'Display agricultural skills, set expected daily rates, receive work offers, & use AI wage recommendations.',
      icon: '👨‍🌾'
    },
    {
      id: 'EquipmentHolder',
      title: t.equipmentHolder || 'Equipment Owner',
      desc: 'Register agricultural machinery, add RTO vehicle info, manage maintenance logs, & track rental earnings.',
      icon: '🚜'
    },
    {
      id: 'Dealer',
      title: t.dealer || 'Equipment Dealer',
      desc: 'List brand-new agricultural machinery, display specifications, receive farmer purchase quotes, & manage sales.',
      icon: '🏬'
    },
    {
      id: 'Admin',
      title: 'Platform Admin',
      desc: 'Review RTO vehicle registration queue, oversee platform statistics, & manage verification status.',
      icon: '🛡️'
    }
  ];

  const handleStep1Next = () => {
    changeLanguage(selectedLang);
    setStep(2);
  };

  const handleStep2Next = () => {
    setStep(3);
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isSupabaseConfigured) {
      try {
        if (authMode === 'signup') {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { full_name: fullName, phone, role: selectedRole }
            }
          });
          if (error) throw error;
        } else if (authMode === 'login') {
          const { error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;
        }
      } catch (err) {
        console.warn("Supabase Auth notice:", err.message);
      }
    }

    // Switch active role and close modal
    switchRole(selectedRole);
    setLoading(false);
    setIsLoginModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-200 p-6 space-y-6">
        
        {/* Wizard Progress Bar */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest block">
              Step {step} of 3 • Onboarding & Authentication
            </span>
            <h3 className="text-xl font-bold text-gray-900 font-serif">
              {step === 1 ? 'Select Preferred Language' : step === 2 ? 'Choose Your User Role' : `${authMode === 'signup' ? 'Sign Up' : 'Login'} as ${selectedRole}`}
            </h3>
          </div>
          <button
            onClick={() => setIsLoginModalOpen(false)}
            className="text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        {/* STEP 1: LANGUAGE SELECTION */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-xs text-gray-600">Choose your preferred language for the Krushiजोड platform:</p>
            <div className="space-y-3">
              {[
                { code: 'en', label: 'English', sub: 'Default language' },
                { code: 'mr', label: 'मराठी', sub: 'महाराष्ट्र राज्य बोली भाषा' },
                { code: 'hi', label: 'हिन्दी', sub: 'भारतीय राष्ट्र भाषा' }
              ].map(l => (
                <div
                  key={l.code}
                  onClick={() => setSelectedLang(l.code)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    selectedLang === l.code ? 'border-[#2D6A4F] bg-emerald-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div>
                    <h4 className="text-base font-bold text-gray-900">{l.label}</h4>
                    <p className="text-xs text-gray-500">{l.sub}</p>
                  </div>
                  {selectedLang === l.code && (
                    <span className="w-6 h-6 rounded-full bg-[#2D6A4F] text-white flex items-center justify-center text-xs">
                      ✓
                    </span>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={handleStep1Next}
              className="w-full bg-[#2D6A4F] text-white py-3 rounded-xl font-bold hover:bg-[#1B4D3E] shadow transition flex items-center justify-center gap-2 text-sm"
            >
              <span>Continue to Step 2</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: ROLE SELECTION */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-xs text-gray-600">Select how you want to participate in the agricultural ecosystem:</p>
            
            <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
              {roles.map(role => {
                const isSelected = selectedRole === role.id;
                return (
                  <div
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-start space-x-3 ${
                      isSelected ? 'border-[#2D6A4F] bg-emerald-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl p-2 rounded-xl bg-gray-100 shrink-0">
                      {role.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-gray-900">{role.title}</h4>
                        {isSelected && <span className="text-emerald-700 font-bold text-xs">✓ Selected</span>}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 leading-snug">{role.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-3 rounded-xl border border-gray-300 font-semibold text-xs text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleStep2Next}
                className="flex-1 bg-[#2D6A4F] text-white py-3 rounded-xl font-bold hover:bg-[#1B4D3E] shadow transition flex items-center justify-center gap-2 text-sm"
              >
                <span>Continue to Step 3 (Auth)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: AUTHENTICATION FORM */}
        {step === 3 && (
          <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs">
            <div className="flex rounded-xl bg-gray-100 p-1 font-bold">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-2 rounded-lg transition ${authMode === 'login' ? 'bg-[#2D6A4F] text-white shadow' : 'text-gray-600'}`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className={`flex-1 py-2 rounded-lg transition ${authMode === 'signup' ? 'bg-[#2D6A4F] text-white shadow' : 'text-gray-600'}`}
              >
                Create Account
              </button>
            </div>

            {authMode === 'signup' && (
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Ramrao Patil"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2D6A4F]"
                />
              </div>
            )}

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Mobile Phone / Email *</label>
              <input
                type="text"
                required
                placeholder="farmer@krushijod.in or 9822144556"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2D6A4F]"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Password *</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2D6A4F]"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-3 rounded-xl border border-gray-300 font-semibold text-xs text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#2D6A4F] text-white py-3 rounded-xl font-bold hover:bg-[#1B4D3E] shadow transition flex items-center justify-center gap-2 text-sm"
              >
                {loading ? 'Authenticating...' : `Confirm Login (${selectedRole})`}
                <UserCheck className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
