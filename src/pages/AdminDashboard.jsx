import React, { useState } from 'react';
import { Users, ShieldCheck, Tractor, ShoppingBag, DollarSign, Check, X, AlertCircle, Search, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminDashboard = () => {
  const {
    t,
    logoutAdmin,
    isDataBlackoutActive,
    recoveryStatus,
    pendingSyncItems,
    simulateDataBlackout,
    restoreDataStore
  } = useApp();
  const [activeAdminTab, setActiveAdminTab] = useState('overview');

  // Verification requests mock queue
  const [verifications, setVerifications] = useState([
    {
      id: "v-101",
      userName: "Vijay Pawar",
      userPhone: "+91 98220 12345",
      docType: "RTO RC Book",
      regNo: "MH-15-EG-4451",
      equipmentTitle: "Mahindra 575 DI Tractor (45 HP)",
      status: "Pending",
      date: "2026-08-18"
    },
    {
      id: "v-102",
      userName: "Suresh Shinde",
      userPhone: "+91 98812 34567",
      docType: "Aadhaar Verification",
      regNo: "N/A - Labourer ID",
      equipmentTitle: "Skilled Labourer Profile",
      status: "Approved",
      date: "2026-08-15"
    },
    {
      id: "v-103",
      userName: "Kopargaon Agro Services",
      userPhone: "+91 98221 99001",
      docType: "Dealer GST Certificate",
      regNo: "27AAACK1234A1Z5",
      equipmentTitle: "Authorized Swaraj Dealer",
      status: "Pending",
      date: "2026-08-19"
    }
  ]);

  const handleApprove = (id) => {
    setVerifications(prev => prev.map(v => v.id === id ? { ...v, status: 'Approved' } : v));
  };

  const handleReject = (id) => {
    setVerifications(prev => prev.map(v => v.id === id ? { ...v, status: 'Rejected' } : v));
  };

  return (
    <div className="min-h-screen bg-[#F4F7F4] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1B4D3E] to-[#2D6A4F] text-white p-6 rounded-2xl shadow-xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-emerald-950 font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                Admin Control Panel
              </span>
              <span className="text-emerald-200 text-xs font-mono">v2.4 Production</span>
            </div>
            <h1 className="text-3xl font-extrabold mt-2">Krushiजोड Platform Administration</h1>
            <p className="text-emerald-100 text-sm mt-1">Manage user verifications, RTO compliance, machinery listings, and platform statistics.</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setActiveAdminTab('overview')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                activeAdminTab === 'overview' ? 'bg-white text-[#1B4D3E] shadow' : 'bg-emerald-800/60 text-white hover:bg-emerald-800'
              }`}
            >
              Overview Stats
            </button>
            <button
              onClick={() => setActiveAdminTab('rto')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                activeAdminTab === 'rto' ? 'bg-white text-[#1B4D3E] shadow' : 'bg-emerald-800/60 text-white hover:bg-emerald-800'
              }`}
            >
              RTO Queue ({verifications.filter(v => v.status === 'Pending').length})
            </button>
            <button
              onClick={logoutAdmin}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-red-600 text-white hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-8">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 font-bold">Disaster Recovery / Data Blackout</p>
              <h3 className="text-lg font-bold text-gray-900 mt-1">Recovery Control</h3>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={simulateDataBlackout}
                className="px-4 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600"
              >
                Wipe & Blackout
              </button>
              <button
                onClick={restoreDataStore}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
              >
                Restore Backup
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-3">
              <p className="text-xs uppercase text-gray-500 font-bold mb-1">Recovery status</p>
              <p className="font-bold text-gray-900">{recoveryStatus}</p>
            </div>
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-3">
              <p className="text-xs uppercase text-gray-500 font-bold mb-1">Data Store</p>
              <p className="font-bold text-gray-900">{isDataBlackoutActive ? 'BLACKOUT' : 'NORMAL'}</p>
            </div>
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-3">
              <p className="text-xs uppercase text-gray-500 font-bold mb-1">Pending Sync</p>
              <p className="font-bold text-gray-900">{pendingSyncItems.length}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3.5 bg-emerald-100 text-emerald-800 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase">Total Farmers</p>
              <p className="text-2xl font-extrabold text-gray-900">5,420</p>
              <span className="text-[11px] text-emerald-600 font-bold">+12% this month</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3.5 bg-blue-100 text-blue-800 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase">Skilled Labourers</p>
              <p className="text-2xl font-extrabold text-gray-900">3,510</p>
              <span className="text-[11px] text-blue-600 font-bold">98% Active</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3.5 bg-amber-100 text-amber-800 rounded-xl">
              <Tractor className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase">Equipment Listings</p>
              <p className="text-2xl font-extrabold text-gray-900">1,240</p>
              <span className="text-[11px] text-amber-600 font-bold">RTO Verified</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3.5 bg-purple-100 text-purple-800 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase">Platform GMV</p>
              <p className="text-2xl font-extrabold text-gray-900">₹28,45,000</p>
              <span className="text-[11px] text-purple-600 font-bold">Processed via Razorpay</span>
            </div>
          </div>
        </div>

        {/* Tab View */}
        {activeAdminTab === 'rto' ? (
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-[#2D6A4F]" />
                RTO Document Verification Requests
              </h2>
              <span className="text-xs bg-amber-100 text-amber-900 px-3 py-1 rounded-full font-bold">
                {verifications.filter(v => v.status === 'Pending').length} Action Required
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 uppercase text-xs">
                    <th className="p-3.5 rounded-l-xl">User & Contact</th>
                    <th className="p-3.5">Document Type</th>
                    <th className="p-3.5">Registration / GST No.</th>
                    <th className="p-3.5">Target Listing</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right rounded-r-xl">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {verifications.map(v => (
                    <tr key={v.id} className="hover:bg-gray-50/80">
                      <td className="p-3.5 font-bold text-gray-900">
                        {v.userName}
                        <span className="block text-xs font-normal text-gray-500">{v.userPhone}</span>
                      </td>
                      <td className="p-3.5 text-gray-700 font-medium">{v.docType}</td>
                      <td className="p-3.5 font-mono text-emerald-800 font-bold">{v.regNo}</td>
                      <td className="p-3.5 text-gray-600 text-xs">{v.equipmentTitle}</td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          v.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : v.status === 'Rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {v.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        {v.status === 'Pending' ? (
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => handleApprove(v.id)}
                              className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 flex items-center gap-1 shadow-sm"
                            >
                              <Check className="w-3.5 h-3.5" /> Approve
                            </button>
                            <button
                              onClick={() => handleReject(v.id)}
                              className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 flex items-center gap-1 shadow-sm"
                            >
                              <X className="w-3.5 h-3.5" /> Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 font-medium">Verified</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Platform Health & Realtime Status</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="font-semibold text-emerald-900">Database Engine (Supabase PostgreSQL):</span>
                  <span className="bg-emerald-700 text-white text-xs px-2.5 py-0.5 rounded-full font-bold">Operational</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <span className="font-semibold text-blue-900">Razorpay Payment Gateway:</span>
                  <span className="bg-blue-700 text-white text-xs px-2.5 py-0.5 rounded-full font-bold">Active (Test Mode)</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-xl border border-purple-200">
                  <span className="font-semibold text-purple-900">AI Recommendation Engine:</span>
                  <span className="bg-purple-700 text-white text-xs px-2.5 py-0.5 rounded-full font-bold">Active</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Quick Platform Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => alert("Re-indexing location maps database...")}
                  className="w-full text-left p-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-sm font-semibold text-gray-800 flex items-center justify-between"
                >
                  <span>Refresh Geolocation & Distance Matrix</span>
                  <span className="text-xs text-[#2D6A4F] font-bold">Sync Maps →</span>
                </button>
                <button
                  onClick={() => setActiveAdminTab('rto')}
                  className="w-full text-left p-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-sm font-semibold text-gray-800 flex items-center justify-between"
                >
                  <span>Review Pending Vehicle RTO Registrations</span>
                  <span className="text-xs text-[#2D6A4F] font-bold">Review Queue →</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
