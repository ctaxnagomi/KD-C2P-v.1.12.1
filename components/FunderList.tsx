
import React from 'react';
import { Funder } from '../types';

interface FunderListProps {
  funders: Funder[];
}

export const FunderList: React.FC<FunderListProps> = ({ funders }) => {
  // Helper to generate a clean avatar URL. unavatar.io is great for social fallbacks.
  const getAvatarUrl = (name: string) => {
    const slug = encodeURIComponent(name.toLowerCase().trim());
    return `https://unavatar.io/${slug}?fallback=https://ui-avatars.com/api/?name=${slug}&background=18181b&color=fff`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Board of Backers</h3>
        <span className="text-xs text-zinc-600 mono">{funders.length} Contributors</span>
      </div>
      
      {funders.length === 0 ? (
        <div className="h-40 flex items-center justify-center border border-dashed border-white/10 rounded-2xl">
          <p className="text-zinc-500 text-sm">No sponsors yet. Be the first.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {funders.map((funder, idx) => (
            <div 
              key={idx} 
              className="flex justify-between items-center p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center overflow-hidden border border-white/10 group-hover:border-white/30 transition-all">
                  <img 
                    src={getAvatarUrl(funder.name)} 
                    alt={funder.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${funder.name}&background=18181b&color=fff`;
                    }}
                  />
                </div>
                <div>
                  <p className="font-medium text-white group-hover:text-zinc-100">{funder.name}</p>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-tighter mono">{funder.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono font-bold text-white text-lg">${funder.amount}</p>
                <p className="text-[10px] text-green-500 font-bold uppercase">Authorized</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
