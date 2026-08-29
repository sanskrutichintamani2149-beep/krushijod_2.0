import React, { useMemo, useRef, useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, XCircle, BrainCircuit, Upload, FileText, Clock3, Loader2, SearchCheck, Sparkles } from 'lucide-react';
import Tesseract from 'tesseract.js';
import { verifyFactClaim } from '../services/factCheckerService';

const initialResult = null;

const statusConfig = {
  VERIFIED: {
    label: 'VERIFIED',
    tone: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    badge: 'bg-emerald-500',
    icon: CheckCircle2
  },
  UNVERIFIED: {
    label: 'UNVERIFIED',
    tone: 'bg-amber-100 text-amber-900 border-amber-300',
    badge: 'bg-amber-500',
    icon: AlertTriangle
  },
  FALSE: {
    label: 'FALSE',
    tone: 'bg-red-100 text-red-900 border-red-300',
    badge: 'bg-red-500',
    icon: XCircle
  },
  SUSPICIOUS: {
    label: 'SUSPICIOUS',
    tone: 'bg-orange-100 text-orange-900 border-orange-300',
    badge: 'bg-orange-500',
    icon: AlertTriangle
  }
};

export const AIFactChecker = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [result, setResult] = useState(initialResult);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setError('');

    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      try {
        setIsLoading(true);
        const { data } = await Tesseract.recognize(file, 'eng', { logger: (m) => m });
        setText((prev) => (prev ? `${prev}\n${data.text}` : data.text));
      } catch (imageError) {
        setError('Image text extraction failed. You can still paste text manually.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = async () => {
    const finalText = text.trim();
    if (!finalText) {
      setError('Please paste a message or upload an image with readable content.');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await verifyFactClaim({
        text: finalText,
        imageText: selectedFile ? finalText : '',
        sourceLabel: selectedFile ? selectedFile.name : 'User submitted content'
      });

      setResult(response);
    } catch (submitError) {
      setError(submitError.message || 'Unable to verify this claim right now.');
    } finally {
      setIsLoading(false);
    }
  };

  const statusMeta = useMemo(() => (result ? statusConfig[result.status] : null), [result]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed right-4 bottom-24 z-40 flex items-center gap-2 rounded-full bg-[#173E2F] text-white px-4 py-3 shadow-xl hover:bg-[#0f2c22] transition-all border border-white/20"
      >
        <BrainCircuit className="w-4 h-4" />
        <span className="text-xs font-bold uppercase tracking-wide">AI Fact Checker</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-5 py-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-700 font-bold">Verification lab</p>
                <h3 className="text-2xl font-black text-gray-900">AI Fact Checker</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-gray-300 px-3 py-1 text-xs font-bold text-gray-600 hover:bg-gray-100"
              >
                Close
              </button>
            </div>

            <div className="p-5 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-dashed border-emerald-300 bg-emerald-50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                      <FileText className="w-4 h-4" /> Paste content
                    </div>
                  </div>
                  <textarea
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    rows={8}
                    placeholder="Paste a WhatsApp message, claim, news snippet, or official statement here..."
                    className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>

                <div className="rounded-2xl border border-dashed border-violet-300 bg-violet-50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-violet-900 font-bold text-sm">
                      <Upload className="w-4 h-4" /> Upload screenshot
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full rounded-xl border border-violet-300 bg-white px-3 py-3 text-sm font-semibold text-violet-800 hover:bg-violet-100"
                  >
                    Choose screenshot / image
                  </button>

                  {previewUrl && (
                    <div className="mt-3 overflow-hidden rounded-xl border border-violet-200 bg-white">
                      <img src={previewUrl} alt="Uploaded fact-check preview" className="h-36 w-full object-cover" />
                    </div>
                  )}

                  {selectedFile && (
                    <p className="mt-2 text-xs text-violet-700 font-medium">Selected: {selectedFile.name}</p>
                  )}
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading || !text.trim()}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#173E2F] px-5 py-3 text-sm font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <SearchCheck className="w-4 h-4" />}
                  {isLoading ? 'Checking...' : 'Submit for verification'}
                </button>
              </div>

              {result && statusMeta && (
                <div className={`rounded-2xl border p-4 ${statusMeta.tone}`}>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${statusMeta.badge} flex items-center justify-center text-white`}>
                        <statusMeta.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] font-bold opacity-75">Assessment</p>
                        <p className="text-2xl font-black">{statusMeta.label}</p>
                      </div>
                    </div>

                    <div className="rounded-xl bg-white/60 px-3 py-2 text-right">
                      <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-60">Truth score</p>
                      <p className="text-xl font-black">{result.score}%</p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div className="rounded-xl bg-white/50 p-3">
                      <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-black/60">Confidence</p>
                      <p className="mt-1 font-bold text-lg">{result.confidence}%</p>
                    </div>
                    <div className="rounded-xl bg-white/50 p-3">
                      <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-black/60">Authority</p>
                      <p className="mt-1 font-bold text-lg">{result.governmentVerified ? 'Government Verified' : 'Cross-checked'}</p>
                    </div>
                    <div className="rounded-xl bg-white/50 p-3">
                      <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-black/60">Checked</p>
                      <div className="mt-1 flex items-center gap-2 font-bold text-lg">
                        <Clock3 className="w-4 h-4" />
                        {new Date(result.checkedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 rounded-xl bg-white/60 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] font-bold text-gray-700 mb-2">Why this result</p>
                    <p className="text-sm text-gray-800 leading-6">{result.explanation}</p>
                  </div>

                  <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="rounded-xl bg-white/60 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] font-bold text-gray-700 mb-2">Claim extracted</p>
                      <ul className="space-y-2 text-sm text-gray-800">
                        {result.extractedClaims.map((claim, index) => (
                          <li key={`${claim}-${index}`} className="flex gap-2">
                            <Sparkles className="w-4 h-4 mt-0.5 text-emerald-700" />
                            <span>{claim}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-xl bg-white/60 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] font-bold text-gray-700 mb-2">Evidence sources</p>
                      <ul className="space-y-2 text-sm text-gray-800">
                        {result.sources.map((source, index) => (
                          <li key={`${source.name}-${index}`} className="border-b border-gray-200 pb-2 last:border-0 last:pb-0">
                            <p className="font-bold text-gray-900">{source.name}</p>
                            <p className="text-xs text-gray-600">{source.type} • {source.authority}</p>
                            <a href={source.url} target="_blank" rel="noreferrer" className="text-xs text-emerald-700 underline break-all">{source.url}</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {result.suspiciousIndicators.length > 0 && (
                    <div className="mt-5 rounded-xl border border-orange-200 bg-orange-50 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] font-bold text-orange-800 mb-2">Suspicious indicators</p>
                      <ul className="list-disc pl-5 text-sm text-orange-900 space-y-1">
                        {result.suspiciousIndicators.map((signal, index) => (
                          <li key={`${signal}-${index}`}>{signal}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
