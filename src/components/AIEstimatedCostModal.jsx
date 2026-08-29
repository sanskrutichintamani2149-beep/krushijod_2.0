import React, { useState } from 'react';
import { X, Sparkles, Calculator, UserCheck, Tractor, ArrowRight } from 'lucide-react';
import { getAIFarmCostEstimate } from '../services/aiService';
import { TextToSpeechButton } from './TextToSpeechButton';
import { useApp } from '../context/AppContext';

export const AIEstimatedCostModal = ({ isOpen, onClose }) => {
  const { lang } = useApp();
  const [cropType, setCropType] = useState('Wheat (गहू)');
  const [farmSizeAcres, setFarmSizeAcres] = useState(4);
  const [taskType, setTaskType] = useState('Harvesting');
  const [location, setLocation] = useState('Nashik / Kopargaon');
  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleCalculate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await getAIFarmCostEstimate({
      cropType,
      farmSizeAcres,
      taskType,
      location
    });
    setEstimate(res);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl relative border border-emerald-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 rounded-full"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">AI Farm Cost & Resource Estimator</h3>
            <p className="text-xs text-gray-500">Instant AI calculation for labour count and machinery rental budget</p>
          </div>
        </div>

        <form onSubmit={handleCalculate} className="grid grid-cols-2 gap-3 mb-5 text-sm">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Crop Type</label>
            <select
              value={cropType}
              onChange={e => setCropType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2D6A4F]"
            >
              <option value="Wheat (गहू)">Wheat (गहू)</option>
              <option value="Sugarcane (ऊस)">Sugarcane (ऊस)</option>
              <option value="Rice (भात)">Rice (भात / धान)</option>
              <option value="Cotton (कापूस)">Cotton (कापूस)</option>
              <option value="Vegetables (भाजीपाला)">Vegetables (भाजीपाला)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Farm Size (Acres)</label>
            <input
              type="number"
              min="0.5"
              step="0.5"
              value={farmSizeAcres}
              onChange={e => setFarmSizeAcres(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2D6A4F]"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Farming Task</label>
            <select
              value={taskType}
              onChange={e => setTaskType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2D6A4F]"
            >
              <option value="Harvesting">Harvesting & Threshing</option>
              <option value="Land Preparation">Land Prep & Ploughing</option>
              <option value="Seed Sowing">Seed Sowing / Transplanting</option>
              <option value="Spraying">Pesticide Spraying</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Taluka / Location</label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2D6A4F]"
            />
          </div>

          <div className="col-span-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2D6A4F] text-white py-2.5 rounded-xl font-bold hover:bg-[#1B4D3E] shadow transition flex items-center justify-center gap-2"
            >
              {loading ? 'AI Calculating...' : 'Calculate Estimated Budget & Labour'}
              <Calculator className="w-4 h-4" />
            </button>
          </div>
        </form>

        {estimate && (
          <div className="bg-[#F8F9FA] rounded-2xl p-5 border border-emerald-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                AI Suggestion Result
              </span>
              <TextToSpeechButton
                textToSpeak={`Estimated total cost for ${farmSizeAcres} acres ${cropType} is rupees ${estimate.estimatedTotalCost.min} to ${estimate.estimatedTotalCost.max}`}
                lang={lang}
                label="Listen Estimate"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 text-gray-600 text-xs font-medium">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>Labour Requirement:</span>
                </div>
                <p className="text-lg font-bold text-gray-900 mt-1">
                  {estimate.estimatedLabourCount.min} – {estimate.estimatedLabourCount.max} Workers
                </p>
                <p className="text-xs text-emerald-700 font-semibold mt-1">
                  Est. Wage: ₹{estimate.estimatedLabourCostRange.min} - ₹{estimate.estimatedLabourCostRange.max}
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 text-gray-600 text-xs font-medium">
                  <Tractor className="w-4 h-4 text-emerald-600" />
                  <span>Machinery Option:</span>
                </div>
                <p className="text-sm font-bold text-gray-900 mt-1 leading-snug">
                  {estimate.recommendedMachineryOption}
                </p>
                <p className="text-xs text-emerald-700 font-semibold mt-1">
                  Est. Rent: ₹{estimate.estimatedEquipmentRentalCostRange.min} - ₹{estimate.estimatedEquipmentRentalCostRange.max}
                </p>
              </div>
            </div>

            <div className="bg-emerald-900 text-white p-4 rounded-xl text-center">
              <p className="text-xs text-emerald-200 uppercase font-semibold">Total Estimated Budget</p>
              <p className="text-2xl font-extrabold mt-0.5">
                ₹{estimate.estimatedTotalCost.min} – ₹{estimate.estimatedTotalCost.max}
              </p>
              <p className="text-[11px] text-emerald-200 mt-1">
                * Note: Clearly an AI estimate based on regional platform averages. Official rates may vary.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
