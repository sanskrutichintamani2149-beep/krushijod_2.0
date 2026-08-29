import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChatSystem } from '../components/ChatSystem';
import { LiveMapTracker } from '../components/LiveMapTracker';
import { RTOVerificationModal } from '../components/RTOVerificationModal';
import { TextToSpeechButton } from '../components/TextToSpeechButton';
import {
  PlusCircle, Tractor, ShieldCheck, MapPin, Calendar, Check, X, Phone, Radio,
  Wrench, DollarSign, TrendingUp, History, Upload, FileText, CheckCircle2
} from 'lucide-react';

export const EquipmentHolderDashboard = () => {
  const { t, equipmentList, addEquipmentListing, startChatWithUser, userProfile, lang } = useApp();
  const [activeSubTab, setActiveSubTab] = useState('machinery');
  const [isRTOModalOpen, setIsRTOModalOpen] = useState(false);

  // Maintenance Log Drawer State
  const [selectedEquipMaintenance, setSelectedEquipMaintenance] = useState(null);
  const [maintenanceRecords, setMaintenanceRecords] = useState([
    {
      id: "m-1",
      equipmentId: "eq-1",
      serviceDate: "2026-08-01",
      maintenanceType: "Engine Oil & Filter Replacement",
      cost: 3500,
      serviceProvider: "Mahindra Authorized Service, Nashik",
      notes: "Full 500-hour major overhaul done.",
      nextServiceDue: "2026-11-01"
    },
    {
      id: "m-2",
      equipmentId: "eq-2",
      serviceDate: "2026-07-20",
      maintenanceType: "Rotavator Blade Replacement",
      cost: 4200,
      serviceProvider: "Kopargaon Farm Mechanics",
      notes: "Installed heavy-duty boron steel blades.",
      nextServiceDue: "2026-10-20"
    }
  ]);

  const [newLog, setNewLog] = useState({
    serviceDate: new Date().toISOString().split('T')[0],
    maintenanceType: 'Engine Oil Change',
    cost: 2500,
    serviceProvider: 'Local Tractor Workshop',
    notes: 'Routine service completed'
  });

  // Form state for adding new machinery listing
  const [newEquipForm, setNewEquipForm] = useState({
    name: '',
    type: 'Tractor',
    pricePerDay: 1500,
    location: 'Nashik, Maharashtra',
    holderName: userProfile.name,
    holderPhone: userProfile.phone,
    image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80',
    rtoInfo: {
      regNumber: 'MH 15 CD 5544',
      rtoOffice: 'RTO Nashik (MH-15)',
      validity: '10 Dec 2029',
      registeredOwner: userProfile.name,
      insuranceValid: 'Active'
    },
    specs: {
      horsepower: '50 HP',
      fuelType: 'Diesel',
      liftingCapacity: '1800 kg'
    },
    usage: 'Tillage, cultivation, and heavy farm haulage.',
    maintenance: 'Fresh engine service done recently.'
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newEquipForm.name) {
      alert("Please enter equipment name.");
      return;
    }
    addEquipmentListing(newEquipForm);
    alert("New equipment listing published successfully!");
    setActiveSubTab('machinery');
  };

  const handleAddMaintenanceLog = (e) => {
    e.preventDefault();
    if (!selectedEquipMaintenance) return;
    const logObj = {
      id: `m-${Date.now()}`,
      equipmentId: selectedEquipMaintenance.id,
      ...newLog,
      nextServiceDue: "2026-12-01"
    };
    setMaintenanceRecords([logObj, ...maintenanceRecords]);
    alert("Maintenance log added successfully!");
    setNewLog({
      serviceDate: new Date().toISOString().split('T')[0],
      maintenanceType: 'Engine Oil Change',
      cost: 2500,
      serviceProvider: 'Local Tractor Workshop',
      notes: 'Routine service completed'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-950 to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-300 uppercase tracking-widest block">Equipment Holder Dashboard • यंत्र मालक डॅशबोर्ड</span>
          <h1 className="text-2xl font-black font-serif mt-0.5">{userProfile.name}</h1>
          <p className="text-xs text-blue-100 flex items-center mt-1">
            <MapPin className="w-3.5 h-3.5 mr-1 text-blue-400" />
            {userProfile.location} • Verified Machinery Provider
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setIsRTOModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow"
          >
            <ShieldCheck className="w-4 h-4" />
            Verify RTO Registration
          </button>

          <button
            onClick={() => setActiveSubTab('add-new')}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shadow"
          >
            <PlusCircle className="w-4 h-4" />
            Add New Machinery
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center space-x-2 border-b border-gray-200 text-xs font-bold pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('machinery')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
            activeSubTab === 'machinery' ? 'bg-[#1B4D3E] text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border'
          }`}
        >
          My Listed Machinery ({equipmentList.length})
        </button>

        <button
          onClick={() => setActiveSubTab('analytics')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeSubTab === 'analytics' ? 'bg-[#1B4D3E] text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          Rental Earnings & Analytics
        </button>

        <button
          onClick={() => setActiveSubTab('add-new')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
            activeSubTab === 'add-new' ? 'bg-[#1B4D3E] text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border'
          }`}
        >
          + Add Equipment
        </button>

        <button
          onClick={() => setActiveSubTab('location')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
            activeSubTab === 'location' ? 'bg-[#1B4D3E] text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border'
          }`}
        >
          GPS Location Broadcast
        </button>

        <button
          onClick={() => setActiveSubTab('chat')}
          className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
            activeSubTab === 'chat' ? 'bg-[#1B4D3E] text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border'
          }`}
        >
          Farmer Messages
        </button>
      </div>

      {/* TAB 1: MACHINERY LIST */}
      {activeSubTab === 'machinery' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {equipmentList.map(eq => (
              <div key={eq.id} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="h-44 rounded-2xl overflow-hidden bg-gray-100 relative">
                    <img src={eq.image} alt={eq.name} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 bg-[#1B4D3E] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                      {eq.type}
                    </span>
                    <span className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                      {eq.availability}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-900">{eq.name}</h3>
                    <span className="text-xl font-black text-[#2D6A4F]">₹{eq.pricePerDay} / day</span>
                  </div>

                  {/* RTO Tag & Maintenance info */}
                  <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-xs flex justify-between items-center">
                    <div>
                      <span className="font-bold text-emerald-950 block">RTO: {eq.rtoInfo?.regNumber || "MH-15-EG-4451"}</span>
                      <span className="text-[10px] text-emerald-800 font-semibold">{eq.rtoInfo?.rtoOffice || "MH-15 Nashik"}</span>
                    </div>
                    <button
                      onClick={() => setSelectedEquipMaintenance(eq)}
                      className="text-xs bg-emerald-800 text-white px-2.5 py-1 rounded-lg font-bold hover:bg-emerald-900 flex items-center gap-1"
                    >
                      <Wrench className="w-3 h-3" /> Log Maintenance
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-bold">
                  <button
                    onClick={() => setActiveSubTab('location')}
                    className="text-[#2D6A4F] bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-xl"
                  >
                    Broadcast Live GPS
                  </button>

                  <button
                    onClick={() => alert(`Status updated for ${eq.name}`)}
                    className="border border-gray-300 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-xl"
                  >
                    Edit Rates / Status
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: RENTAL EARNINGS & ANALYTICS */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 font-medium uppercase">Total Rental Revenue</p>
              <p className="text-3xl font-extrabold text-[#2D6A4F] mt-1">₹84,500</p>
              <span className="text-[11px] text-emerald-600 font-bold">+18% growth this season</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 font-medium uppercase">Completed Rental Days</p>
              <p className="text-3xl font-extrabold text-gray-900 mt-1">42 Days</p>
              <span className="text-[11px] text-gray-500 font-medium">Across 12 farmers</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 font-medium uppercase">Maintenance Expenditure</p>
              <p className="text-3xl font-extrabold text-amber-700 mt-1">₹7,700</p>
              <span className="text-[11px] text-amber-600 font-bold">2 services logged</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ADD NEW EQUIPMENT FORM */}
      {activeSubTab === 'add-new' && (
        <form onSubmit={handleAddSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm max-w-2xl space-y-6">
          <h2 className="text-xl font-bold text-gray-900 font-serif">Add New Rental Machinery Listing</h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Equipment Full Title *</label>
              <input
                type="text"
                value={newEquipForm.name}
                onChange={(e) => setNewEquipForm({ ...newEquipForm, name: e.target.value })}
                placeholder="e.g. Sonalika DI 745 III Tractor (50 HP)"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 font-semibold"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Category</label>
                <select
                  value={newEquipForm.type}
                  onChange={(e) => setNewEquipForm({ ...newEquipForm, type: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 font-semibold"
                >
                  <option value="Tractor">Tractor</option>
                  <option value="Rotavator">Rotavator</option>
                  <option value="Harvester">Harvester</option>
                  <option value="Seed Drill">Seed Drill</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Daily Rent Rate (₹)</label>
                <input
                  type="number"
                  value={newEquipForm.pricePerDay}
                  onChange={(e) => setNewEquipForm({ ...newEquipForm, pricePerDay: Number(e.target.value) })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 font-semibold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-[#2D6A4F] text-white px-6 py-3.5 rounded-xl text-xs font-bold hover:bg-[#1B4D3E] shadow"
            >
              Publish Equipment Listing
            </button>
          </div>
        </form>
      )}

      {/* TAB 4: LOCATION BROADCAST */}
      {activeSubTab === 'location' && (
        <div className="space-y-6">
          <LiveMapTracker />
        </div>
      )}

      {/* TAB 5: CHAT */}
      {activeSubTab === 'chat' && (
        <ChatSystem />
      )}

      {/* RTO Verification Modal */}
      <RTOVerificationModal
        isOpen={isRTOModalOpen}
        onClose={() => setIsRTOModalOpen(false)}
        onSubmitVerification={(data) => {
          alert(`RTO verification for ${data.vehicleRegNo} submitted successfully!`);
        }}
      />

      {/* Equipment Maintenance Log Modal */}
      {selectedEquipMaintenance && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setSelectedEquipMaintenance(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-lg font-bold text-gray-900">Maintenance & Service Log</h3>
            <p className="text-xs text-gray-500">{selectedEquipMaintenance.name}</p>

            <form onSubmit={handleAddMaintenanceLog} className="mt-4 space-y-3 text-xs bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h4 className="font-bold text-gray-800">Add New Service Record</h4>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Service Date</label>
                  <input
                    type="date"
                    value={newLog.serviceDate}
                    onChange={e => setNewLog({ ...newLog, serviceDate: e.target.value })}
                    className="w-full p-2 border rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Service Cost (₹)</label>
                  <input
                    type="number"
                    value={newLog.cost}
                    onChange={e => setNewLog({ ...newLog, cost: Number(e.target.value) })}
                    className="w-full p-2 border rounded-lg bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Maintenance Type / Repairs</label>
                <input
                  type="text"
                  value={newLog.maintenanceType}
                  onChange={e => setNewLog({ ...newLog, maintenanceType: e.target.value })}
                  placeholder="Engine oil, Blade sharpening..."
                  className="w-full p-2 border rounded-lg bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#2D6A4F] text-white py-2 rounded-lg font-bold hover:bg-[#1B4D3E]"
              >
                Save Maintenance Record
              </button>
            </form>

            <div className="mt-5 space-y-3">
              <h4 className="text-xs font-bold uppercase text-gray-500">Historical Service Logs</h4>
              {maintenanceRecords.map(m => (
                <div key={m.id} className="p-3 bg-white rounded-xl border border-gray-200 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-gray-900">
                    <span>{m.maintenanceType}</span>
                    <span className="text-amber-800">₹{m.cost}</span>
                  </div>
                  <p className="text-gray-500 text-[11px]">{m.serviceDate} • Provider: {m.serviceProvider}</p>
                  <p className="text-gray-700">{m.notes}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
