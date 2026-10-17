import React, { useState, useRef } from 'react';
import { UploadCloud, Camera, FileText, CheckCircle2, AlertCircle, Loader2, Sparkles, X, ClipboardList, Cpu, Settings2, Info, Lightbulb, ArrowRight } from 'lucide-react';
import { extractTimetableLocally, parseRawTimetableText } from '../utils/localOcrExtractor';
import { extractTimetableFromImage } from '../utils/geminiExtractor';
import type { TimetableData } from '../types';
import { DEMO_TIMETABLE } from '../data/demoTimetable';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTimetableLoaded: (data: TimetableData) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onTimetableLoaded }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Review step if OCR needs confirmation
  const [reviewData, setReviewData] = useState<{ timetable: TimetableData; rawText: string } | null>(null);

  // Paste text mode
  const [pastedText, setPastedText] = useState<string>('');

  // Guide toggle
  const [showPhotoTips, setShowPhotoTips] = useState(false);

  // Optional AI mode
  const [showAdvancedAi, setShowAdvancedAi] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState<string>(() => localStorage.getItem('gemini_api_key') || '');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setReviewData(null);
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleProcess = async () => {
    setError(null);

    // Mode 1: Paste Text
    if (activeTab === 'paste') {
      if (!pastedText.trim()) {
        setError('Please paste your timetable text or table lines first.');
        return;
      }
      try {
        const parsed = parseRawTimetableText(pastedText);
        onTimetableLoaded(parsed);
        onClose();
      } catch (err: any) {
        setError(err?.message || 'Failed to parse text timetable.');
      }
      return;
    }

    // Mode 2: File Upload (Photo or PDF)
    if (!selectedFile) {
      setError('Please select or capture a timetable photo first.');
      return;
    }

    try {
      setIsProcessing(true);

      // Cloud Gemini AI (if user entered optional key)
      if (geminiApiKey.trim()) {
        setProgressStatus('Using Gemini AI for high-precision parsing...');
        setProgressPercent(40);

        const reader = new FileReader();
        const base64Promise = new Promise<{ base64: string; mimeType: string }>((resolve, reject) => {
          reader.onload = () => {
            const res = reader.result as string;
            const match = res.match(/^data:(.*);base64,(.*)$/);
            if (match) resolve({ mimeType: match[1], base64: match[2] });
            else reject(new Error('Invalid file format'));
          };
          reader.onerror = reject;
          reader.readAsDataURL(selectedFile);
        });

        const { base64, mimeType } = await base64Promise;
        const parsedData = await extractTimetableFromImage(base64, mimeType, geminiApiKey);
        onTimetableLoaded(parsedData);
        onClose();
        return;
      }

      // Default: On-Device OCR with auto-contrast & canvas scaling
      const result = await extractTimetableLocally(selectedFile, (status, pct) => {
        setProgressStatus(status);
        setProgressPercent(pct);
      });

      if (!result.rawText.trim()) {
        throw new Error('No readable text found in this photo. Please ensure it is well-lit and not blurry.');
      }

      // If items were detected, show review or apply
      if (result.detectedCount > 0) {
        onTimetableLoaded(result.timetable);
        onClose();
      } else {
        // Text was found, but periods weren't recognized directly
        setReviewData({ timetable: result.timetable, rawText: result.rawText });
      }
    } catch (err: any) {
      console.error(err);
      setError(
        err?.message ||
        'Could not read text from this photo. Check the "How to take a clear photo" tips below or use the Paste Text tab.'
      );
    } finally {
      setIsProcessing(false);
      setProgressStatus('');
      setProgressPercent(0);
    }
  };

  const handleAcceptReview = () => {
    if (reviewData) {
      onTimetableLoaded(reviewData.timetable);
      onClose();
    }
  };

  const handleSendToPasteTab = () => {
    if (reviewData) {
      setPastedText(reviewData.rawText);
      setActiveTab('paste');
      setReviewData(null);
    }
  };

  const loadDemo = () => {
    onTimetableLoaded(DEMO_TIMETABLE);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-2xl p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Import Timetable</h2>
            <p className="text-xs text-slate-400">100% Free on-device scan &bull; No API key required</p>
          </div>
        </div>

        {/* Review Modal Screen if OCR found text */}
        {reviewData ? (
          <div className="space-y-4 py-2">
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/50">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm mb-1">
                <Info className="w-4 h-4 text-amber-400" />
                <span>Text Detected! Please Confirm</span>
              </div>
              <p className="text-xs text-slate-300">
                The scanner detected your timetable text, but table columns might have unusual time formatting.
              </p>
            </div>

            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 max-h-40 overflow-y-auto">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Scanned Words:</span>
              <pre className="text-[11px] font-mono text-slate-300 whitespace-pre-wrap">
                {reviewData.rawText.slice(0, 500)}...
              </pre>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                onClick={handleAcceptReview}
                className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Apply Extracted Timetable</span>
              </button>
              <button
                onClick={handleSendToPasteTab}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition"
              >
                <span>Edit / Adjust in Text Editor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Tabs: Photo Upload vs Paste Text */}
            <div className="flex rounded-2xl bg-slate-950 p-1 mb-4 border border-slate-800">
              <button
                onClick={() => setActiveTab('upload')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 ${
                  activeTab === 'upload'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload Photo / PDF</span>
              </button>
              <button
                onClick={() => setActiveTab('paste')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 ${
                  activeTab === 'paste'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                <span>Paste Text / WhatsApp</span>
              </button>
            </div>

            {activeTab === 'upload' ? (
              <>
                {/* Upload Drag & Drop Zone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition ${
                    selectedFile
                      ? 'border-indigo-500/60 bg-indigo-950/20'
                      : 'border-slate-700/80 hover:border-indigo-500/50 bg-slate-800/40'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {previewUrl ? (
                    <div className="flex flex-col items-center gap-3">
                      <img
                        src={previewUrl}
                        alt="Selected timetable"
                        className="max-h-48 rounded-xl object-contain border border-slate-700 shadow-md"
                      />
                      <span className="text-xs text-indigo-400 font-medium">Click to choose a different photo</span>
                    </div>
                  ) : selectedFile ? (
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="w-10 h-10 text-indigo-400" />
                      <span className="text-sm font-semibold text-white">{selectedFile.name}</span>
                      <span className="text-xs text-slate-400">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <UploadCloud className="w-10 h-10 text-slate-400" />
                      <p className="text-sm font-medium text-slate-200">
                        Tap or drag & drop timetable image / PDF
                      </p>
                      <p className="text-xs text-slate-500">Auto-contrast & auto-scale enhanced</p>
                    </div>
                  )}
                </div>

                {/* Camera Button */}
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      cameraInputRef.current?.click();
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/70 text-xs font-semibold text-slate-300 flex items-center justify-center gap-2 transition"
                  >
                    <Camera className="w-4 h-4 text-indigo-400" />
                    <span>Snap Photo with Camera</span>
                  </button>
                </div>
              </>
            ) : (
              /* Paste Text Mode */
              <div className="space-y-2">
                <textarea
                  rows={7}
                  placeholder="Paste schedule lines or WhatsApp text here, for example:&#10;Monday&#10;09:00 - 10:00 Deep Learning Room 402&#10;10:00 - 11:00 Computer Vision Audi-2&#10;11:15 - 13:15 AI Lab Session QC 1.1"
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
                <p className="text-[11px] text-slate-500">
                  Paste directly from spreadsheets, messages, or text notices.
                </p>
              </div>
            )}

            {/* Photo Clarity Tips Toggle */}
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setShowPhotoTips(!showPhotoTips)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400 hover:text-slate-200 transition"
              >
                <span className="flex items-center gap-1.5 font-medium">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  Tips: How to get 100% accurate photo scan
                </span>
                <span className="text-slate-500">{showPhotoTips ? '▲' : '▼'}</span>
              </button>

              {showPhotoTips && (
                <div className="mt-2 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-indigo-400">1.</span>
                    <span><strong>Crop tightly:</strong> Crop the photo so only the timetable grid is visible (remove table edges, hands, or desks).</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-indigo-400">2.</span>
                    <span><strong>Flat angle:</strong> Hold the camera straight directly above the paper, not tilted from the side.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-indigo-400">3.</span>
                    <span><strong>No flash glare:</strong> Avoid bright light reflection or shadows covering period text.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-indigo-400">4.</span>
                    <span><strong>Screenshot/PDF is king:</strong> If you have a digital PDF circular or screenshot from your college portal, uploading it yields 100% crisp results!</span>
                  </div>
                </div>
              )}
            </div>

            {/* Processing Progress Bar */}
            {isProcessing && (
              <div className="mt-4 p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30">
                <div className="flex items-center justify-between text-xs font-semibold text-indigo-300 mb-2">
                  <span className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 animate-spin text-indigo-400" />
                    {progressStatus || 'Processing...'}
                  </span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* Error Notification */}
            {error && (
              <div className="mt-4 p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl text-xs text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Optional Advanced AI Drawer (Collapsed by Default) */}
            <div className="mt-4 border-t border-slate-800/60 pt-3">
              <button
                type="button"
                onClick={() => setShowAdvancedAi(!showAdvancedAi)}
                className="flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-400 transition"
              >
                <Settings2 className="w-3.5 h-3.5" />
                <span>Advanced: Multimodal Cloud AI (Optional)</span>
              </button>

              {showAdvancedAi && (
                <div className="mt-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                  <label className="text-[11px] text-slate-400 block mb-1">
                    Optional Google Gemini Key (Leave blank to use free on-device scan)
                  </label>
                  <input
                    type="password"
                    placeholder="AIzaSy... (optional)"
                    value={geminiApiKey}
                    onChange={(e) => {
                      setGeminiApiKey(e.target.value);
                      localStorage.setItem('gemini_api_key', e.target.value.trim());
                    }}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleProcess}
                disabled={isProcessing || (activeTab === 'upload' && !selectedFile) || (activeTab === 'paste' && !pastedText.trim())}
                className={`w-full sm:flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition ${
                  isProcessing || (activeTab === 'upload' && !selectedFile) || (activeTab === 'paste' && !pastedText.trim())
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                }`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Reading Timetable...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Apply Timetable Now</span>
                  </>
                )}
              </button>

              <button
                onClick={loadDemo}
                disabled={isProcessing}
                type="button"
                className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition"
              >
                Try Demo
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
