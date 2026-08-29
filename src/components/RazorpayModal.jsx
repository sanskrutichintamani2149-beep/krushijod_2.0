import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, CheckCircle2, CreditCard, QrCode, Lock, X, Download } from 'lucide-react';
import confetti from 'canvas-confetti';

export const RazorpayModal = () => {
  const { paymentState, closePaymentModal, t, addBooking, setActiveTab } = useApp();
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [txId, setTxId] = useState('');

  if (!paymentState.isOpen) return null;

  const basePrice = paymentState.amount;
  const serviceFee = Math.round(basePrice * 0.03);
  const gst = Math.round(basePrice * 0.05);
  const totalAmount = basePrice + serviceFee + gst;

  const handlePayNow = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsPaid(true);
      const generatedTx = `RZP-PAY-${Math.floor(100000 + Math.random() * 900000)}`;
      setTxId(generatedTx);

      // Trigger confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Fallback gracefully
      }

      // Record booking if details available
      if (paymentState.bookingDetails) {
        addBooking({
          itemName: paymentState.bookingDetails.name || paymentState.itemTitle,
          type: paymentState.bookingDetails.type || "Equipment",
          providerName: paymentState.bookingDetails.holderName || "Provider",
          providerPhone: paymentState.bookingDetails.holderPhone || "+91 98220 12345",
          startDate: "12 Aug 2026",
          endDate: "14 Aug 2026",
          totalAmount: totalAmount,
          rtoReg: paymentState.bookingDetails.rtoInfo?.regNumber || "MH 15 AB 4821",
          location: paymentState.bookingDetails.location || "Local Plot"
        });
      }

      if (paymentState.onSuccessCallback) {
        paymentState.onSuccessCallback();
      }
    }, 1800);
  };

  const handleDone = () => {
    closePaymentModal();
    setIsPaid(false);
    setActiveTab('bookings');
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in duration-200">
        
        {/* Razorpay Brand Header */}
        <div className="bg-[#0C2340] text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-lg">
              ₹
            </div>
            <div>
              <span className="text-xs text-blue-200 font-bold block uppercase tracking-wider">Krushiजोड Digital Checkout</span>
              <span className="text-base font-black text-white flex items-center">
                Razorpay Secure
                <ShieldCheck className="w-4 h-4 text-emerald-400 ml-1" />
              </span>
            </div>
          </div>
          <button onClick={closePaymentModal} className="text-stone-300 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isPaid ? (
          /* Payment Step 1: Breakdown & Method */
          <div className="p-6 space-y-5">
            
            {/* Booking Title Summary */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <span className="text-[11px] text-stone-500 font-semibold uppercase block">Selected Service</span>
              <h4 className="text-sm font-bold text-stone-900">{paymentState.itemTitle}</h4>
            </div>

            {/* Fare Breakdown */}
            <div className="space-y-2 text-xs border-b border-stone-200 pb-4">
              <div className="flex justify-between text-stone-600">
                <span>Base Rental Charge</span>
                <span className="font-semibold text-stone-900">₹{basePrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Platform Assurance Fee</span>
                <span className="font-semibold text-stone-900">₹{serviceFee.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>GST (5%)</span>
                <span className="font-semibold text-stone-900">₹{gst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-stone-900 pt-2 border-t border-stone-100">
                <span>{t.amountToPay}</span>
                <span className="text-[#143E24] text-lg">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-stone-700 block">{t.selectPaymentMethod}</span>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('upi')}
                  className={`p-3 rounded-xl border text-left flex items-center space-x-2 text-xs font-bold transition-all ${
                    selectedMethod === 'upi' ? 'border-[#143E24] bg-emerald-50 text-[#143E24]' : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-emerald-700" />
                  <span>UPI / GPay / PhonePe</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('card')}
                  className={`p-3 rounded-xl border text-left flex items-center space-x-2 text-xs font-bold transition-all ${
                    selectedMethod === 'card' ? 'border-[#143E24] bg-emerald-50 text-[#143E24]' : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-emerald-700" />
                  <span>Debit / Credit Card</span>
                </button>
              </div>
            </div>

            {/* Security Note */}
            <div className="flex items-center text-[10px] text-stone-500 space-x-1.5 bg-stone-100 p-2.5 rounded-xl">
              <Lock className="w-3.5 h-3.5 text-stone-600 shrink-0" />
              <span>256-Bit SSL Encrypted. Simulated prototype payment mode.</span>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePayNow}
              disabled={isProcessing}
              className="w-full bg-[#143E24] hover:bg-[#215A36] text-white py-3.5 rounded-2xl text-sm font-bold shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>{t.paySecurely} • ₹{totalAmount.toLocaleString('en-IN')}</span>
                </>
              )}
            </button>

          </div>
        ) : (
          /* Payment Step 2: Success Confirmation */
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-stone-900">{t.paymentSuccess}</h3>
              <p className="text-xs text-stone-500">Your agricultural booking is confirmed!</p>
            </div>

            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs space-y-2 text-left">
              <div className="flex justify-between text-stone-600">
                <span>Transaction Ref:</span>
                <span className="font-mono font-bold text-stone-900">{txId}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Amount Paid:</span>
                <span className="font-bold text-emerald-800">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Status:</span>
                <span className="font-bold text-emerald-600">Razorpay Verified</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleDone}
                className="w-full bg-[#143E24] hover:bg-[#215A36] text-white py-3 rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                View My Bookings & Track Location
              </button>

              <button
                onClick={() => alert("Invoice PDF receipt downloaded successfully (Simulation).")}
                className="w-full border border-stone-300 text-stone-700 hover:bg-stone-100 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Payment Receipt</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
