import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Info } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'privacy' | 'terms' | 'about';
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, defaultTab = 'privacy' }) => {
  const [tab, setTab] = useState<'privacy' | 'terms' | 'about'>(defaultTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTab('privacy')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                tab === 'privacy' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Privacy Policy
            </button>
            <button
              onClick={() => setTab('terms')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                tab === 'terms' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Terms of Service
            </button>
            <button
              onClick={() => setTab('about')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                tab === 'about' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              About & Contact
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto text-xs text-slate-300 space-y-4 leading-relaxed">
          {tab === 'privacy' && (
            <>
              <h2 className="text-base font-bold text-white">Privacy Policy</h2>
              <p>
                Last updated: October 2026. This application provides automated academic schedule analysis.
                We value your privacy and do not collect or sell personally identifiable information.
              </p>
              <h3 className="font-semibold text-white mt-2">1. Timetable Documents & Photos</h3>
              <p>
                When you upload a timetable photo or PDF, the file is analyzed strictly to extract schedule information (class times, room numbers, subjects). Extracted schedule data is stored locally in your browser's LocalStorage and IndexedDB.
              </p>
              <h3 className="font-semibold text-white mt-2">2. Cookies and Third-Party Advertising</h3>
              <p>
                This website may use cookies and third-party advertising partners, including Google AdSense. Google and its partners use cookies to serve personalized ads based on your prior visits to this website or other websites. You may opt out of personalized advertising by visiting Google's Ads Settings.
              </p>
              <h3 className="font-semibold text-white mt-2">3. Analytics & Security</h3>
              <p>
                Standard non-identifying server logs (IP address, browser user-agent) may be recorded for performance and DDoS protection via our CDN.
              </p>
            </>
          )}

          {tab === 'terms' && (
            <>
              <h2 className="text-base font-bold text-white">Terms of Service</h2>
              <p>
                By using TimeTable, you agree to these standard terms:
              </p>
              <h3 className="font-semibold text-white mt-2">1. Educational & Utility Purpose</h3>
              <p>
                This tool is an assistant to help students track their lecture timings. Always verify important exam dates and official class changes with your university's official notice board.
              </p>
              <h3 className="font-semibold text-white mt-2">2. Acceptable Use</h3>
              <p>
                Users agree not to upload inappropriate, offensive, or malicious files. Automated scraping or attacking backend endpoints is prohibited.
              </p>
            </>
          )}

          {tab === 'about' && (
            <>
              <h2 className="text-base font-bold text-white">About TimeTable</h2>
              <p>
                TimeTable is an AI-powered instant schedule companion. It transforms static circulars, phone pictures of notice boards, and PDF timetables into real-time interactive dashboards with live class countdowns and batch filters.
              </p>
              <h3 className="font-semibold text-white mt-2">Contact & Feedback</h3>
              <p>
                Have questions, suggestions, or university partnership inquiries? Contact us at:
              </p>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-indigo-400">
                support@timetableapp.com
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
