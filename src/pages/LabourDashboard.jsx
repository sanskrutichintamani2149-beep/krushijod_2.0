import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChatSystem } from '../components/ChatSystem';
import { TextToSpeechButton } from '../components/TextToSpeechButton';
import { getAIWageRecommendation, getAIEarningsEstimate } from '../services/aiService';
import {
  User, Calendar, CheckCircle2, XCircle, Phone, MapPin, Award, ToggleLeft, ToggleRight,
  MessageSquare, Sparkles, DollarSign, TrendingUp, History, Star, ShieldCheck, HelpCircle
} from 'lucide-react';

export const LabourDashboard = () => {
  const { t, userProfile, labourList, updateLabourAvailability, setActiveTab, startChatWithUser, lang } = useApp();
  
  // Current logged-in worker profile or first fallback
  const myProfile = labourList.find(l => l.name === userProfile.name) || labourList[0];
  const [isAvailable, setIsAvailable] = useState(myProfile.availability === 'Available Now' || myProfile.availability === 'Available');
  const [activeSubTab, setActiveSubTab] = useState('requests');

  // AI Assistant States
  const [wageRequest, setWageRequest] = useState({
    workCategory: myProfile.category || 'Wheat Harvesting',
    location: 'Nashik / Kopargaon',
    experienceYears: 3,
    expectedDurationHours: 8
  });
  const [aiWageResult, setAiWageResult] = useState(null);
  const [wageLoading, setWageLoading] = useState(false);

  const [earningsDays, setEarningsDays] = useState(20);
  const [aiEarningsResult, setAiEarningsResult] = useState(null);

  // Labour Work History mock data
  const [workHistory] = useState([
    {
      id: "WH-101",
      farmerName: "Ramrao Patil",
      workType: "Wheat Harvesting",
      date: "2026-08-15",
      duration: "8 hours",
      wageEarned: 500,
      status: "Completed",
      rating: 4.8,
      review: "Very punctual and hard working labourer. Recommended!"
    },
    {
      id: "WH-102",
      farmerName: "Shivaji Deshmukh",
      workType: "Pesticide Spraying",
      date: "2026-08-10",
      duration: "6 hours",
      wageEarned: 450,
      status: "Completed",
      rating: 5.0,
      review: "Handled spray machine safely and efficiently."
    },
    {
      id: "WH-103",
      farmerName: "Vijay Pawar",
      workType: "Seed Transplanting",
      date: "2026-08-02",
      duration: "8 hours",
      wageEarned: 450,
      status: "Completed",
      rating: 4.6,
      review: "Good work ethics."
    }
  ]);

  const toggleAvailability = () => {
    const nextStatus = isAvailable ? 'Busy / Engaged' : 'Available Now';
    setIsAvailable(!isAvailable);
    updateLabourAvailability(myProfile.id, nextStatus);
  };

  const handleCalculateAIWage = async (e) => {
    e.preventDefault();
    setWageLoading(true);
    const res = await getAIWageRecommendation(wageRequest);
    setAiWageResult(res);
    setWageLoading(false);
  };

  const handleCalculateAIEarnings = async () => {
    const res = await getAIEarningsEstimate({
      workCategory: myProfile.category || 'General Labour',
      dailyRate: myProfile.dailyRate || 500,
      availableDaysPerMonth: earningsDays,
      skills: ['Harvesting', 'Spraying', 'Transplanting']
    });
    setAiEarningsResult(res);
  };

  const incomingRequests = [
    {
      id: "REQ-7701",
      farmerName: "Ramrao Patil",
      farmerPhone: "+91 98221 44556",
      workType: myProfile.category || "Wheat Harvesting",
      location: "Kopargaon Plot #42",
      dates: "12 Aug 2026 (1 Day)",
      offeredAmount: myProfile.dailyRate || 500,
      status: "Pending Approval"
    },
    {
      id: "REQ-7702",
      farmerName: "Shivaji Deshmukh",
      farmerPhone: "+91 94220 88991",
      workType: myProfile.category || "Spraying",
      location: "Sangamner Farm",
      dates: "15 Aug 2026 (2 Days)",
      offeredAmount: (myProfile.dailyRate || 500) * 2,
      status: "Accepted"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-900 to-amber-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <img src={myProfile.image} alt={myProfile.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400" />
          <div>
            <span className="text-xs font-bold text-amber-300 uppercase tracking-widest block">Labourer Dashboard • मजूर डॅशबोर्ड</span>
            <h1 className="text-2xl font-black font-serif mt-0.5">{myProfile.name}</h1>
            <p className="text-xs text-amber-100 flex items-center mt-1">
              <MapPin className="w-3.5 h-3.5 mr-1 text-amber-400" />
              {myProfile.location} • Rate: ₹{myProfile.dailyRate}/day
            </p>
          </div>
        </div>

        {/* Availability Toggle */}
        <div className="bg-amber-950/80 p-3 rounded-2xl border border-amber-700/60 flex items-center space-x-3">
          <span className="text-xs font-bold text-amber-200">Current Status:</span>
          <button
            onClick={toggleAvailability}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isAvailable ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            {isAvailable ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
            <span>{isAvailable ? 'AVAILABLE NOW' : 'BUSY'}</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center space-x-2 border-b border-gray-200 text-xs font-bold pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('requests')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
            activeSubTab === 'requests' ? 'bg-[#1B4D3E] text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border'
          }`}
        >
          Work Requests
        </button>
        <button
          onClick={() => setActiveSubTab('ai-wage')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeSubTab === 'ai-wage' ? 'bg-[#1B4D3E] text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          AI Wage & Earnings Assistant
        </button>
        <button
          onClick={() => setActiveSubTab('work-history')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeSubTab === 'work-history' ? 'bg-[#1B4D3E] text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          My Work History
        </button>
        <button
          onClick={() => setActiveSubTab('profile')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
            activeSubTab === 'profile' ? 'bg-[#1B4D3E] text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border'
          }`}
        >
          Profile & Rates
        </button>
        <button
          onClick={() => setActiveSubTab('chat')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
            activeSubTab === 'chat' ? 'bg-[#1B4D3E] text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border'
          }`}
        >
          Messages
        </button>
      </div>

      {/* TAB 1: WORK REQUESTS */}
      {activeSubTab === 'requests' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900 font-serif">Direct Job Offers from Farmers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {incomingRequests.map(req => (
              <div key={req.id} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 block">{req.id}</span>
                    <h3 className="text-base font-bold text-gray-900">{req.farmerName}</h3>
                    <span className="text-xs text-gray-600 font-semibold">{req.farmerPhone}</span>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    req.status === 'Accepted' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {req.status}
                  </span>
                </div>

                <div className="bg-gray-50 p-3 rounded-2xl text-xs space-y-1 text-gray-700">
                  <p>Work Required: <strong>{req.workType}</strong></p>
                  <p>Location: <strong>{req.location}</strong></p>
                  <p>Schedule: <strong>{req.dates}</strong></p>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xl font-black text-[#2D6A4F]">₹{req.offeredAmount}</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startChatWithUser(req.farmerName, req.farmerPhone, 'Farmer')}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-xl text-xs font-bold"
                    >
                      Chat
                    </button>
                    {req.status !== 'Accepted' && (
                      <button
                        onClick={() => alert("Work request accepted! Farmer notified.")}
                        className="bg-[#2D6A4F] hover:bg-[#1B4D3E] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow"
                      >
                        Accept Job
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: AI WAGE & EARNINGS ASSISTANT */}
      {activeSubTab === 'ai-wage' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* AI Wage Recommendation Card */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-100 text-amber-900 rounded-2xl">
                <Sparkles className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">AI Wage Recommendation Engine</h3>
                <p className="text-xs text-gray-500">Calculate fair daily wage rate for your skills & location</p>
              </div>
            </div>

            <form onSubmit={handleCalculateAIWage} className="space-y-3 text-sm">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Agricultural Work Category</label>
                <select
                  value={wageRequest.workCategory}
                  onChange={e => setWageRequest({ ...wageRequest, workCategory: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2D6A4F]"
                >
                  <option value="Wheat Harvesting">Wheat Harvesting & Threshing</option>
                  <option value="Pesticide Spraying">Pesticide Spraying Operator</option>
                  <option value="Seed Transplanting">Seed Sowing & Transplanting</option>
                  <option value="Manual Weeding">Manual Weeding</option>
                  <option value="Sugarcane Cutting">Sugarcane Cutting & Loading</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Field Experience (Years)</label>
                  <input
                    type="number"
                    min="1"
                    value={wageRequest.experienceYears}
                    onChange={e => setWageRequest({ ...wageRequest, experienceYears: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2D6A4F]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Shift Duration (Hours)</label>
                  <input
                    type="number"
                    value={wageRequest.expectedDurationHours}
                    onChange={e => setWageRequest({ ...wageRequest, expectedDurationHours: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2D6A4F]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={wageLoading}
                className="w-full bg-[#2D6A4F] text-white py-2.5 rounded-xl font-bold hover:bg-[#1B4D3E] shadow transition flex items-center justify-center gap-2"
              >
                {wageLoading ? 'Calculating AI Recommendation...' : 'Get AI Suggested Wage Rate'}
                <Sparkles className="w-4 h-4 text-amber-300" />
              </button>
            </form>

            {aiWageResult && (
              <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-amber-900 bg-amber-200 px-2.5 py-1 rounded-full uppercase">
                    AI Market Estimate
                  </span>
                  <TextToSpeechButton
                    textToSpeak={`Suggested daily wage range is rupees ${aiWageResult.recommendedDailyMin} to ${aiWageResult.recommendedDailyMax}`}
                    lang={lang}
                    label="Listen Rate"
                  />
                </div>

                <div className="text-center py-2">
                  <p className="text-xs text-amber-800 uppercase font-semibold">Suggested Average Wage</p>
                  <p className="text-3xl font-extrabold text-amber-950">
                    ₹{aiWageResult.suggestedAverage} <span className="text-sm font-normal text-amber-800">/ day</span>
                  </p>
                  <p className="text-xs text-amber-800 font-medium mt-1">
                    Recommended Range: ₹{aiWageResult.recommendedDailyMin} – ₹{aiWageResult.recommendedDailyMax} / day
                  </p>
                </div>

                <div className="text-xs space-y-1 bg-white p-3 rounded-xl border border-amber-200 text-gray-700">
                  <p className="font-bold text-gray-900 mb-1">Calculation Factors:</p>
                  {aiWageResult.explanationFactors.map((f, i) => (
                    <p key={i}>• {f}</p>
                  ))}
                </div>

                {/* Clear distinction from Official Minimum Wage */}
                <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 text-xs text-blue-950 flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-blue-900">Official Minimum Wage Reference:</p>
                    <p className="text-blue-800 mt-0.5">{aiWageResult.officialMinimumWageInfo?.rate}</p>
                    <p className="text-[10px] text-blue-600 mt-0.5">Source: {aiWageResult.officialMinimumWageInfo?.source}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* AI Labour Earnings Estimator Card */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-100 text-emerald-900 rounded-2xl">
                <TrendingUp className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">AI Earnings Estimator Assistant</h3>
                <p className="text-xs text-gray-500">Estimate potential monthly income & higher demand work</p>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Available Working Days Per Month</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={earningsDays}
                  onChange={e => setEarningsDays(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2D6A4F]"
                />
              </div>

              <button
                onClick={handleCalculateAIEarnings}
                className="w-full bg-[#1B4D3E] text-white py-2.5 rounded-xl font-bold hover:bg-[#2D6A4F] shadow transition flex items-center justify-center gap-2"
              >
                Calculate Estimated Income
                <DollarSign className="w-4 h-4 text-amber-300" />
              </button>
            </div>

            {aiEarningsResult && (
              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200 space-y-4">
                <div className="text-center py-2 bg-emerald-900 text-white rounded-xl">
                  <p className="text-xs text-emerald-200 uppercase font-semibold">Estimated Monthly Earnings</p>
                  <p className="text-3xl font-extrabold mt-0.5">
                    ₹{aiEarningsResult.estimatedMonthlyEarnings.toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-emerald-200 mt-1">
                    Based on {aiEarningsResult.workingDays} working days × ₹{aiEarningsResult.dailyRate}/day
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <p className="font-bold text-emerald-900">High-Demand Work Categories:</p>
                  {aiEarningsResult.highDemandCategorySuggestions.map((s, i) => (
                    <div key={i} className="bg-white p-2.5 rounded-lg border border-emerald-200 text-gray-800">
                      ✓ {s}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 3: WORK HISTORY */}
      {activeSubTab === 'work-history' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 font-serif flex items-center gap-2">
              <History className="w-6 h-6 text-[#2D6A4F]" />
              My Permanent Farm Work History
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Recorded history of completed jobs, wages earned, and farmer reviews.
            </p>
          </div>

          <div className="space-y-4">
            {workHistory.map(item => (
              <div key={item.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400">{item.id} • {item.date}</span>
                    <h3 className="text-base font-bold text-gray-900">{item.workType}</h3>
                    <p className="text-xs text-gray-600">Farmer: <strong>{item.farmerName}</strong> ({item.duration})</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-[#2D6A4F] block">₹{item.wageEarned}</span>
                    <span className="inline-flex items-center gap-1 text-amber-500 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" /> {item.rating}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-xl text-xs text-gray-700 border border-gray-200">
                  <p className="italic">"{item.review}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PROFILE */}
      {activeSubTab === 'profile' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm max-w-2xl space-y-6">
          <h2 className="text-lg font-bold text-gray-900 font-serif">Labourer Work Preferences</h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Work Specialty Category</label>
              <select defaultValue={myProfile.category} className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 font-semibold">
                <option value="General Labour">General Labour</option>
                <option value="Seeding Worker">Seeding Worker</option>
                <option value="Wheat Worker">Wheat Worker</option>
                <option value="Equipment Handler">Equipment Handler (Driver)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Daily Wage Rate (₹ / Day)</label>
              <input type="number" defaultValue={myProfile.dailyRate || 500} className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 font-semibold" />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Visible Contact Number</label>
              <input type="text" defaultValue={myProfile.phone} className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 font-semibold" />
            </div>

            <button
              onClick={() => alert("Labour profile updated successfully!")}
              className="bg-[#2D6A4F] text-white px-6 py-3 rounded-xl text-xs font-bold hover:bg-[#1B4D3E] shadow"
            >
              Save Profile Changes
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: CHAT */}
      {activeSubTab === 'chat' && (
        <ChatSystem />
      )}

    </div>
  );
};
