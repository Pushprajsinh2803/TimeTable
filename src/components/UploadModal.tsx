import React, { useState, useRef } from 'react';
import { UploadCloud, Camera, Key, FileText, CheckCircle2, AlertCircle, Loader2, Sparkles, X } from 'lucide-react';
import { extractTimetableFromImage } from '../utils/geminiExtractor';
import type { TimetableData } from '../types';
import { DEMO_TIMETABLE } from '../data/demoTimetable';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTimetableLoaded: (data: TimetableData) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onTimetableLoaded }) => {
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('gemini_api_key') || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleApiKeyChange = (val: string) => {
    setApiKey(val);
    localStorage.setItem('gemini_api_key', val.trim());
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const processFile = async () => {
    if (!selectedFile) {
      setError('Please select a photo or PDF first.');
      return;
    }

    if (!apiKey) {
      setError('Please enter your free Google Gemini API key below to parse the timetable.');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      // Convert file to base64
      const reader = new FileReader();
      const base64Promise = new Promise<{ base64: string; mimeType: string }>((resolve, reject) => {
        reader.onload = () => {
          const res = reader.result as string;
          const match = res.match(/^data:(.*);base64,(.*)$/);
          if (match) {
            resolve({ mimeType: match[1], base64: match[2] });
          } else {
            reject(new Error('Failed to read file format'));
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });

      const { base64, mimeType } = await base64Promise;
      const parsedData = await extractTimetableFromImage(base64, mimeType, apiKey);

      onTimetableLoaded(parsedData);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to parse timetable. Please ensure image is clear.');
    } finally {
      setIsProcessing(false);
    }
  };

  const loadDemo = () => {
    onTimetableLoaded(DEMO_TIMETABLE);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-2xl p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Upload Timetable</h2>
            <p className="text-xs text-slate-400">Upload a photo, screenshot, or PDF circular</p>
          </div>
        </div>

        {/* Upload Zone */}
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
                className="max-h-48 rounded-xl object-contain border border-slate-700"
              />
              <span className="text-xs text-indigo-400 font-medium">Click to choose a different file</span>
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
                Tap or drag & drop timetable file here
              </p>
              <p className="text-xs text-slate-500">Supports JPG, PNG, WebP, and PDF</p>
            </div>
          )}
        </div>

        {/* Quick Camera Capture Button */}
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
            <span>Take Photo with Camera</span>
          </button>
        </div>

        {/* API Key Input */}
        <div className="mt-5 bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              Google Gemini API Key (Free)
            </label>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-indigo-400 hover:underline"
            >
              Get Free Key &rarr;
            </a>
          </div>
          <input
            type="password"
            placeholder="AIzaSy..."
            value={apiKey}
            onChange={(e) => handleApiKeyChange(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
          />
          <p className="text-[10px] text-slate-500 mt-1.5">
            Takes 10 seconds to generate on Google AI Studio ($0 cost, 1,500 parses/day free). Stored safely only in your browser.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl text-xs text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={processFile}
            disabled={isProcessing || !selectedFile}
            className={`w-full sm:flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition ${
              isProcessing || !selectedFile
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AI Analyzing Timetable...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Apply & Activate Timetable</span>
              </>
            )}
          </button>

          <button
            onClick={loadDemo}
            disabled={isProcessing}
            type="button"
            className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition"
          >
            Try Demo (No Key Needed)
          </button>
        </div>
      </div>
    </div>
  );
};
