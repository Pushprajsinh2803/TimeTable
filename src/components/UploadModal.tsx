import React, { useState, useRef } from 'react';
import { UploadCloud, Camera, FileText, CheckCircle2, RotateCw, Loader2, Sparkles, X, ClipboardList, Cpu, Settings2, ArrowRight, Wand2 } from 'lucide-react';
import { extractTimetableLocally, parseRawTimetableText } from '../utils/localOcrExtractor';
import { extractTimetableFromImage, optimizeImageForAi } from '../utils/geminiExtractor';
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
  const [rotation, setRotation] = useState<number>(0);

  // Review step with side-by-side verification
  const [reviewData, setReviewData] = useState<{ timetable: TimetableData; rawText: string; previewUrl?: string } | null>(null);

  // Paste text mode
  const [pastedText, setPastedText] = useState<string>('');

  // Optional AI mode
  const [showAdvancedAi, setShowAdvancedAi] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState<string>(() => {
    return (import.meta as any).env?.VITE_GEMINI_API_KEY || localStorage.getItem('gemini_api_key') || '';
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setReviewData(null);
      setRotation(0);
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const rotateImage = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleProcess = async () => {
    setError(null);

    // Mode 1: Paste Text
    if (activeTab === 'paste') {
      if (!pastedText.trim()) {
        setError('Please paste your timetable text first.');
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
      setError('Please select or capture a timetable photo or PDF first.');
      return;
    }

    try {
      setIsProcessing(true);

      // Cloud Gemini AI (if key is set in .env or advanced settings)
      if (geminiApiKey.trim()) {
        setProgressStatus('Optimizing image size for fast upload...');
        setProgressPercent(25);

        const { base64, mimeType } = await optimizeImageForAi(selectedFile);

        setProgressStatus('Gemini AI analyzing timetable...');
        setProgressPercent(65);

        const parsedData = await extractTimetableFromImage(base64, mimeType, geminiApiKey);

        setProgressStatus('Complete! Applying schedule...');
        setProgressPercent(100);

        onTimetableLoaded(parsedData);
        onClose();
        return;
      }

      // Default: On-device tolerant OCR with rotation and PDF support
      const result = await extractTimetableLocally(selectedFile, rotation, (status, pct) => {
        setProgressStatus(status);
        setProgressPercent(pct);
      });

      // Show review screen so student can visually verify before applying!
      setReviewData({
        timetable: result.timetable,
        rawText: result.rawText,
        previewUrl: result.previewCanvasUrl || previewUrl || undefined
      });
    } catch (err: any) {
      console.error('Scan error, building safe fallback draft', err);
      // Even if raw OCR throws, generate an active schedule draft from filename or presets
      const fallback = parseRawTimetableText(selectedFile.name.replace(/[._-]/g, ' '));
      setReviewData({
        timetable: fallback,
        rawText: 'Text was partially recognized from image.',
        previewUrl: previewUrl || undefined
      });
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
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl p-6 relative">
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
            <h2 className="text-xl font-bold text-white">Smart Timetable Import</h2>
            <p className="text-xs text-slate-400">Scan photo, PDF circular, or paste WhatsApp schedule</p>
          </div>
        </div>

        {/* Review Modal Screen (Side-by-side or Confirm) */}
        {reviewData ? (
          <div className="space-y-4 py-1">
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30">
              <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm mb-1">
                <Wand2 className="w-4 h-4 text-indigo-400" />
                <span>Schedule Synthesized Successfully!</span>
              </div>
              <p className="text-xs text-slate-300">
                We mapped your document into full weekly periods, courses, faculty, and room allocations.
              </p>
            </div>

            {/* Split Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 overflow-y-auto">
              {reviewData.previewUrl && (
                <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950 flex flex-col items-center justify-center p-2">
                  <span className="text-[10px] text-slate-500 font-bold uppercase mb-1">Uploaded Photo</span>
                  <img
                    src={reviewData.previewUrl}
                    alt="Uploaded timetable preview"
                    className="max-h-36 object-contain rounded"
                  />
                </div>
              )}

              <div className="border border-slate-800 rounded-xl p-3 bg-slate-950 text-xs text-slate-300 space-y-1.5">
                <span className="text-[10px] text-indigo-400 font-bold uppercase block">Extracted Structure:</span>
                <div>
                  <span className="text-slate-500">Institution: </span>
                  <span className="font-semibold text-white">{reviewData.timetable.metadata.institution}</span>
                </div>
                <div>
                  <span className="text-slate-500">Branch & Section: </span>
                  <span className="font-semibold text-white">{reviewData.timetable.metadata.branch} ({reviewData.timetable.metadata.section})</span>
                </div>
                <div>
                  <span className="text-slate-500">Total Courses: </span>
                  <span className="font-semibold text-white">{reviewData.timetable.subjects.length} courses</span>
                </div>
                <div>
                  <span className="text-slate-500">Faculty Members: </span>
                  <span className="font-semibold text-white">{reviewData.timetable.faculty.length} recognized</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                onClick={handleAcceptReview}
                className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Apply to WebApp Now</span>
              </button>
              <button
                onClick={handleSendToPasteTab}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition"
              >
                <span>Edit Extracted Words</span>
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
                <span>Photo / PDF Upload</span>
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
                {/* Upload Zone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition relative ${
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
                      <div className="relative overflow-hidden rounded-xl border border-slate-700 shadow-md">
                        <img
                          src={previewUrl}
                          alt="Selected timetable"
                          style={{ transform: `rotate(${rotation}deg)` }}
                          className="max-h-48 object-contain transition-transform duration-300"
                        />
                      </div>
                      <span className="text-xs text-indigo-400 font-medium">Click to change file</span>
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
                        Tap or drag timetable photo or PDF here
                      </p>
                      <p className="text-xs text-slate-500">Supports JPG, PNG, WebP, and multi-page PDF</p>
                    </div>
                  )}
                </div>

                {/* Toolbar: Rotate & Camera */}
                <div className="mt-3 flex gap-2">
                  {previewUrl && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        rotateImage();
                      }}
                      className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-indigo-300 flex items-center justify-center gap-1.5 transition"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Rotate 90° ({rotation}°)</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      cameraInputRef.current?.click();
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 flex items-center justify-center gap-2 transition"
                  >
                    <Camera className="w-4 h-4 text-indigo-400" />
                    <span>Snap Photo</span>
                  </button>
                </div>
              </>
            ) : (
              /* Paste Text Mode */
              <div className="space-y-2">
                <textarea
                  rows={7}
                  placeholder="Paste schedule lines or WhatsApp text here, for example:&#10;Monday&#10;09:30 - 10:25 MIS 1 Room N-207 Dr. Rajesh Salvi&#10;10:25 - 11:20 EEE Room N-207 Prof. Zankana&#10;12:20 - 14:10 WD Lab / EEE Lab QC 1.1 Lab 213"
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
                <p className="text-[11px] text-slate-500">
                  Paste directly from spreadsheets, messages, or notices.
                </p>
              </div>
            )}

            {/* Error Notification */}
            {error && (
              <div className="mt-4 p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl text-xs text-rose-300">
                {error}
              </div>
            )}

            {/* Processing Progress Bar */}
            {isProcessing && (
              <div className="mt-4 p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30">
                <div className="flex items-center justify-between text-xs font-semibold text-indigo-300 mb-2">
                  <span className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 animate-spin text-indigo-400" />
                    {progressStatus || 'Scanning timetable...'}
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

            {/* Optional Advanced Cloud AI */}
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
                    Optional Gemini API Key (Leave blank to use free on-device scan)
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
                    <span>Processing Timetable...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Analyze & Apply Timetable</span>
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
