import React, { useState } from 'react';
import { X, ShieldCheck, Upload, FileText, CheckCircle2 } from 'lucide-react';

export const RTOVerificationModal = ({
  isOpen,
  onClose,
  onSubmitVerification
}) => {
  const [formData, setFormData] = useState({
    vehicleRegNo: '',
    rtoOffice: 'MH-15 Nashik',
    ownerName: '',
    docType: 'RTO RC Book',
    rcDocFile: null
  });

  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onSubmitVerification({
        ...formData,
        status: 'Submitted',
        submittedAt: new Date().toISOString()
      });
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-emerald-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 rounded-full"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">RTO Vehicle Verification</h3>
            <p className="text-xs text-gray-500">Submit tractor/machinery registration for official verification</p>
          </div>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto animate-bounce" />
            <h4 className="text-lg font-bold text-emerald-900">RTO Verification Submitted!</h4>
            <p className="text-sm text-gray-600">Our admin team will review your RC Book and verify status within 2 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">RTO Vehicle Registration Number *</label>
              <input
                type="text"
                required
                placeholder="e.g. MH-15-EG-4451"
                value={formData.vehicleRegNo}
                onChange={e => setFormData({ ...formData, vehicleRegNo: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2D6A4F] uppercase font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">RTO Office</label>
                <select
                  value={formData.rtoOffice}
                  onChange={e => setFormData({ ...formData, rtoOffice: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2D6A4F]"
                >
                  <option value="MH-15 Nashik">MH-15 (Nashik)</option>
                  <option value="MH-12 Pune">MH-12 (Pune)</option>
                  <option value="MH-17 Shrirampur">MH-17 (Shrirampur)</option>
                  <option value="MH-16 Ahmednagar">MH-16 (Ahmednagar)</option>
                  <option value="MH-14 Pimpri Chinchwad">MH-14 (Pimpri)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Registered Owner Name</label>
                <input
                  type="text"
                  required
                  placeholder="Owner name on RC"
                  value={formData.ownerName}
                  onChange={e => setFormData({ ...formData, ownerName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2D6A4F]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Upload RC Book Document *</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-[#2D6A4F] bg-gray-50 transition cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                <p className="text-xs text-gray-600 font-medium">Click to upload photo of RC Book / Tax Receipt</p>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  id="rc-doc-upload"
                  onChange={e => e.target.files?.[0] && setFormData({ ...formData, rcDocFile: e.target.files[0] })}
                />
                <label htmlFor="rc-doc-upload" className="text-xs text-[#2D6A4F] font-bold underline cursor-pointer mt-1 block">
                  Browse File
                </label>
                {formData.rcDocFile && (
                  <span className="text-xs text-emerald-700 font-bold mt-2 block">
                    ✓ Selected: {formData.rcDocFile.name}
                  </span>
                )}
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="w-full bg-[#2D6A4F] text-white py-3 rounded-xl font-bold hover:bg-[#1B4D3E] shadow transition"
              >
                Submit RTO Verification
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
