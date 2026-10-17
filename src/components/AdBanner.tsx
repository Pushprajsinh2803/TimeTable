import React from 'react';

interface AdBannerProps {
  slotType: 'top-banner' | 'in-feed' | 'sticky-bottom';
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ slotType, className = '' }) => {
  if (slotType === 'top-banner') {
    return (
      <div className={`w-full max-w-4xl mx-auto my-3 px-2 ${className}`}>
        <div className="border border-dashed border-slate-700/60 rounded-xl bg-slate-900/40 p-2.5 flex flex-col items-center justify-center min-h-[90px] relative overflow-hidden group">
          <div className="absolute top-1 right-2 text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
            Advertisement
          </div>
          <div className="flex items-center gap-3 text-slate-400 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>AdSense Responsive Top Leaderboard (728x90 / 320x50)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Targeted student resources, study material & campus announcements
          </p>
        </div>
      </div>
    );
  }

  if (slotType === 'sticky-bottom') {
    return (
      <div className={`fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-md border-t border-slate-800 p-2 ${className}`}>
        <div className="max-w-2xl mx-auto flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-[9px] uppercase px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded font-bold">Ad</span>
            <span>Support this free tool by keeping ads enabled</span>
          </div>
          <span className="text-[11px] text-slate-500 hover:text-slate-300 cursor-pointer">AdSense Anchor</span>
        </div>
      </div>
    );
  }

  // in-feed ad
  return (
    <div className={`w-full my-4 border border-slate-800/80 rounded-2xl bg-gradient-to-r from-slate-900/60 via-slate-800/30 to-slate-900/60 p-4 text-center ${className}`}>
      <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold block mb-1">
        Sponsored
      </span>
      <p className="text-xs text-slate-300 font-medium">Looking for Semester Exam Prep & Notes?</p>
      <p className="text-[11px] text-slate-500 mt-1">Google AdSense Native In-Feed Placement</p>
    </div>
  );
};
